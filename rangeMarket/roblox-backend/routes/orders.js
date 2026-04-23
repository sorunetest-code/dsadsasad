const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { sendOrderConfirmation } = require('../mail');
const router = express.Router();

router.post('/pay', async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: 'orderId required' });

  const order = await db.orders.findOne({ _id: orderId });
  if (!order) return res.status(404).json({ error: 'Заказ не найден' });
  if (order.status !== 'pending') return res.status(400).json({ error: 'Заказ уже оплачен' });

  try {
    const idempotenceKey = uuidv4();
    const response = await axios.post(
      'https://api.yookassa.ru/v3/payments',
      {
        amount: { value: order.total.toFixed(2), currency: 'RUB' },
        confirmation: {
          type: 'redirect',
          return_url: `${process.env.FRONTEND_URL}/chat/${orderId}`,
        },
        capture: true,
        description: `Заказ — ${order.items.map(i => i.name).join(', ')}`,
        metadata: { orderId },
      },
      {
        auth: { username: process.env.YOOKASSA_SHOP_ID, password: process.env.YOOKASSA_SECRET_KEY },
        headers: { 'Idempotence-Key': idempotenceKey },
        timeout: 10000,
      }
    );

    const payment = response.data;
    await db.orders.update({ _id: orderId }, { $set: { paymentId: payment.id } });
    res.json({ paymentUrl: payment.confirmation.confirmation_url });
  } catch (err) {
    console.error('YooKassa error:', err.response?.data || err.message);
    res.status(502).json({ error: 'Ошибка создания платежа. Попробуй позже.' });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  let event;
  try { event = JSON.parse(req.body); } catch { return res.status(400).send('Bad JSON'); }

  if (event.event !== 'payment.succeeded') return res.sendStatus(200);

  const orderId = event.object?.metadata?.orderId;
  if (!orderId) return res.sendStatus(200);

  const order = await db.orders.findOne({ _id: orderId });
  if (!order || order.status !== 'pending') return res.sendStatus(200);

  await db.orders.update({ _id: orderId }, { $set: { status: 'new', paidAt: new Date() } });

  const chatLink = `${process.env.FRONTEND_URL}/chat/${orderId}`;
  sendOrderConfirmation({
    to: order.email,
    orderId,
    username: order.username,
    displayName: order.displayName,
    avatarUrl: order.avatarUrl,
    items: order.items,
    total: order.total,
    chatLink,
  }).catch(err => console.error('Confirmation mail error:', err.message));

  res.sendStatus(200);
});

router.get('/', async (req, res) => {
  const orders = await db.orders.find({ status: { $ne: 'pending' } }).sort({ createdAt: -1 });
  res.json(orders);
});

router.get('/:id', async (req, res) => {
  const order = await db.orders.findOne({ _id: req.params.id });
  if (!order) return res.status(404).json({ error: 'Не найден' });
  res.json(order);
});

router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['active', 'done'].includes(status)) return res.status(400).json({ error: 'Неверный статус' });
  await db.orders.update({ _id: req.params.id }, { $set: { status } });
  res.json({ ok: true });
});

module.exports = router;
