const express = require('express');
const axios = require('axios');
const router = express.Router();

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;
const ONLINE_CACHE_TTL = 60 * 1000;

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key, data, ttl = CACHE_TTL) {
  cache.set(key, { data, expires: Date.now() + ttl });
}

router.get('/check-user', async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'username required' });

  try {
    const usersRes = await axios.post(
      'https://users.roblox.com/v1/usernames/users',
      { usernames: [username], excludeBannedUsers: false },
      { timeout: 6000 }
    );
    const user = usersRes.data?.data?.[0];
    if (!user) return res.json({ valid: false });

    let avatarUrl = null;
    try {
      const avatarRes = await axios.get(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=false`,
        { timeout: 5000 }
      );
      avatarUrl = avatarRes.data?.data?.[0]?.imageUrl || null;
    } catch { }

    res.json({
      valid: true,
      id: user.id,
      displayName: user.displayName,
      username: user.name,
      avatarUrl,
    });
  } catch (err) {
    console.error('Roblox API error:', err.message);
    res.status(502).json({ error: 'Roblox API недоступен, попробуй позже' });
  }
});

router.get('/game/:universeId', async (req, res) => {
  const { universeId } = req.params;
  if (!universeId) return res.status(400).json({ error: 'universeId required' });

  const cacheKey = `game_${universeId}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const [gameRes, iconRes] = await Promise.all([
      axios.get(`https://games.roblox.com/v1/games?universeIds=${universeId}`, { timeout: 6000 }),
      axios.get(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`, { timeout: 6000 })
    ]);

    const game = gameRes.data?.data?.[0];
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const icon = iconRes.data?.data?.[0]?.imageUrl || null;

    const result = {
      universeId: game.id,
      placeId: game.rootPlaceId,
      name: game.name,
      description: game.description,
      playing: game.playing,
      visits: game.visits,
      maxPlayers: game.maxPlayers,
      created: game.created,
      updated: game.updated,
      imageUrl: icon,
    };

    setCache(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error('Roblox game API error:', err.message);
    res.status(502).json({ error: 'Roblox API недоступен' });
  }
});

router.get('/game-by-place/:placeId', async (req, res) => {
  const { placeId } = req.params;
  if (!placeId) return res.status(400).json({ error: 'placeId required' });

  const cacheKey = `place_${placeId}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const universeRes = await axios.get(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`, { timeout: 6000 });
    const universeId = universeRes.data?.universeId;
    if (!universeId) return res.status(404).json({ error: 'Place not found' });

    const [gameRes, iconRes] = await Promise.all([
      axios.get(`https://games.roblox.com/v1/games?universeIds=${universeId}`, { timeout: 6000 }),
      axios.get(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`, { timeout: 6000 })
    ]);

    const game = gameRes.data?.data?.[0];
    if (!game) return res.status(404).json({ error: 'Game not found' });

    const icon = iconRes.data?.data?.[0]?.imageUrl || null;

    const result = {
      universeId: game.id,
      placeId: game.rootPlaceId,
      name: game.name,
      description: game.description,
      playing: game.playing,
      visits: game.visits,
      maxPlayers: game.maxPlayers,
      created: game.created,
      updated: game.updated,
      imageUrl: icon,
    };

    setCache(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error('Roblox place API error:', err.message);
    res.status(502).json({ error: 'Roblox API недоступен' });
  }
});

router.get('/games-online', async (req, res) => {
  const { universeIds } = req.query;
  if (!universeIds) return res.status(400).json({ error: 'universeIds required' });

  const ids = universeIds.split(',').filter(Boolean);
  if (ids.length === 0) return res.json({});

  const result = {};
  const toFetch = [];

  for (const id of ids) {
    const cacheKey = `online_${id}`;
    const cached = getCached(cacheKey);
    if (cached !== null) {
      result[id] = cached;
    } else {
      toFetch.push(id);
    }
  }

  if (toFetch.length > 0) {
    try {
      const gameRes = await axios.get(`https://games.roblox.com/v1/games?universeIds=${toFetch.join(',')}`, { timeout: 6000 });
      const games = gameRes.data?.data || [];
      for (const g of games) {
        result[g.id] = g.playing;
        setCache(`online_${g.id}`, g.playing, ONLINE_CACHE_TTL);
      }
    } catch (err) {
      console.error('Roblox online API error:', err.message);
    }
  }

  res.json(result);
});

router.get('/gamepass/:gamepassId', async (req, res) => {
  const { gamepassId } = req.params;
  if (!gamepassId) return res.status(400).json({ error: 'gamepassId required' });

  const cacheKey = `gamepass_${gamepassId}`;
  const cached = getCached(cacheKey);
  if (cached) return res.json(cached);

  try {
    const [passRes, iconRes] = await Promise.all([
      axios.get(`https://apis.roblox.com/game-passes/v1/game-passes/${gamepassId}/product-info`, { timeout: 6000 }),
      axios.get(`https://thumbnails.roblox.com/v1/game-passes?gamePassIds=${gamepassId}&size=150x150&format=Png&isCircular=false`, { timeout: 6000 })
    ]);

    const pass = passRes.data;
    if (!pass || !pass.Name) return res.status(404).json({ error: 'Gamepass not found' });

    const icon = iconRes.data?.data?.[0]?.imageUrl || null;

    const result = {
      gamepassId: pass.TargetId || gamepassId,
      name: pass.Name,
      description: pass.Description || '',
      price: pass.PriceInRobux || 0,
      imageUrl: icon,
    };

    setCache(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error('Roblox gamepass API error:', err.message);
    res.status(502).json({ error: 'Roblox API недоступен' });
  }
});

module.exports = router;