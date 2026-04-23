const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { sendMagicLink } = require('../mail');
const router = express.Router();

router.post('/magic-link', async (req, res) => {
  const { email, username, displayName, robloxId, avatarUrl, items } = req.body;
  if (!email || !username || !items?.length) {
    return res.status(400).json({ error: 'Не хватает данных' });
  }

  const total = items.reduce((s, i) => s + i.price, 0);

  const order = await db.orders.insert({
    email, username,
    displayName: displayName || username,
    robloxId: robloxId || null,
    avatarUrl: avatarUrl || null,
    items, total,
    status: 'pending',
    createdAt: new Date(),
    paidAt: null,
  });

  const token = uuidv4();
  await db.tokens.insert({
    token, orderId: order._id, email,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    used: false,
  });

  const magicLink = `${process.env.FRONTEND_URL}/auth?token=${token}`;

  // Отвечаем сразу, письмо шлём асинхронно
  res.json({ ok: true, orderId: order._id });

  sendMagicLink({ to: email, username, displayName: displayName || username, avatarUrl, magicLink, items, total })
    .catch(err => console.error('Mail error:', err.message));
});

router.get('/verify', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Token required' });

  const record = await db.tokens.findOne({ token, used: false });
  if (!record) return res.status(401).json({ error: 'Ссылка недействительна или уже использована' });
  if (new Date(record.expiresAt) < new Date()) {
    return res.status(401).json({ error: 'Ссылка истекла. Оформи заказ заново.' });
  }

  await db.tokens.update({ token }, { $set: { used: true } });
  res.json({ ok: true, orderId: record.orderId, email: record.email });
});

module.exports = router;
