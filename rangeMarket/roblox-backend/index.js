require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use('/api/orders/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.use('/api/roblox',   require('./routes/roblox'));
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/catalog',  require('./routes/catalog'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅  Бэкенд:  http://localhost:${PORT}`);
  console.log(`⚠️  Заполни .env файл!`);
});
