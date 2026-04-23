const express = require('express');
const db = require('../db');
const router = express.Router();

// GET /api/messages/:orderId
router.get('/:orderId', async (req, res) => {
  const msgs = await db.messages.find({ orderId: req.params.orderId }).sort({ createdAt: 1 });
  res.json(msgs);
});

// POST /api/messages/:orderId
router.post('/:orderId', async (req, res) => {
  const { text, from } = req.body; // from: 'client' | 'manager'
  if (!text?.trim() || !from) return res.status(400).json({ error: 'text and from required' });

  const msg = await db.messages.insert({
    orderId: req.params.orderId,
    text: text.trim(),
    from,
    createdAt: new Date(),
  });
  res.json(msg);
});

module.exports = router;
