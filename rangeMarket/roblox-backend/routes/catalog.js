const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(png|jpeg|webp|gif)$/.test(file.mimetype);
    cb(null, ok);
  },
});

router.use('/images', express.static(UPLOADS_DIR));

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не загружен или неверный формат' });
  const url = `/api/catalog/images/${req.file.filename}`;
  res.json({ url });
});

router.get('/games', async (req, res) => {
  const games = await db.games.find({}).sort({ order: 1, createdAt: 1 });
  res.json(games);
});

router.post('/games', async (req, res) => {
  const { name, emoji, imageUrl, bg, players, universeId, placeId } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'name required' });
  const game = await db.games.insert({
    name: name.trim(),
    emoji: emoji || '',
    imageUrl: imageUrl || null,
    bg: bg || '#18181f',
    players: players || '',
    universeId: universeId || null,
    placeId: placeId || null,
    passes: [],
    createdAt: new Date(),
  });
  res.json(game);
});

router.put('/games/:id', async (req, res) => {
  const { name, emoji, imageUrl, bg, players, universeId, placeId } = req.body;
  const upd = {};
  if (name !== undefined) upd.name = name;
  if (emoji !== undefined) upd.emoji = emoji;
  if (imageUrl !== undefined) upd.imageUrl = imageUrl;
  if (bg !== undefined) upd.bg = bg;
  if (players !== undefined) upd.players = players;
  if (universeId !== undefined) upd.universeId = universeId;
  if (placeId !== undefined) upd.placeId = placeId;
  await db.games.update({ _id: req.params.id }, { $set: upd });
  const game = await db.games.findOne({ _id: req.params.id });
  res.json(game);
});

router.delete('/games/:id', async (req, res) => {
  await db.games.remove({ _id: req.params.id });
  res.json({ ok: true });
});

router.post('/games/:id/passes', async (req, res) => {
  const { name, emoji, imageUrl, price, desc, gamepassId, robuxPrice } = req.body;
  if (!name?.trim() || !price) return res.status(400).json({ error: 'name and price required' });
  const pass = {
    _id: uuidv4(),
    name: name.trim(),
    emoji: emoji || '',
    imageUrl: imageUrl || null,
    price: Number(price),
    desc: desc || '',
    gamepassId: gamepassId || null,
    robuxPrice: robuxPrice || null,
    createdAt: new Date(),
  };
  await db.games.update({ _id: req.params.id }, { $push: { passes: pass } });
  const game = await db.games.findOne({ _id: req.params.id });
  res.json(game);
});

router.put('/games/:gameId/passes/:passId', async (req, res) => {
  const { name, emoji, imageUrl, price, desc, gamepassId, robuxPrice } = req.body;
  const game = await db.games.findOne({ _id: req.params.gameId });
  if (!game) return res.status(404).json({ error: 'game not found' });
  const passes = game.passes.map(p =>
    p._id === req.params.passId
      ? {
        ...p,
        ...(name !== undefined && { name }),
        ...(emoji !== undefined && { emoji }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(price !== undefined && { price: Number(price) }),
        ...(desc !== undefined && { desc }),
        ...(gamepassId !== undefined && { gamepassId }),
        ...(robuxPrice !== undefined && { robuxPrice }),
      }
      : p
  );
  await db.games.update({ _id: req.params.gameId }, { $set: { passes } });
  const updated = await db.games.findOne({ _id: req.params.gameId });
  res.json(updated);
});

router.delete('/games/:gameId/passes/:passId', async (req, res) => {
  const game = await db.games.findOne({ _id: req.params.gameId });
  if (!game) return res.status(404).json({ error: 'game not found' });
  const passes = game.passes.filter(p => p._id !== req.params.passId);
  await db.games.update({ _id: req.params.gameId }, { $set: { passes } });
  res.json({ ok: true });
});

module.exports = router;
