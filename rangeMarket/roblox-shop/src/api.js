const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка сервера');
  return data;
}

export const api = {
  checkUser: (username) => request('GET', `/api/roblox/check-user?username=${encodeURIComponent(username)}`),
  sendMagicLink: (body) => request('POST', '/api/auth/magic-link', body),
  verifyToken: (token) => request('GET', `/api/auth/verify?token=${token}`),
  markPaid: (orderId) => request('POST', '/api/orders/mark-paid', { orderId }),
  payOrder: (orderId) => request('POST', '/api/orders/pay', { orderId }),
  getOrders: () => request('GET', '/api/orders'),
  getOrder: (id) => request('GET', `/api/orders/${id}`),
  setStatus: (id, s) => request('PATCH', `/api/orders/${id}/status`, { status: s }),
  getMessages: (orderId) => request('GET', `/api/messages/${orderId}`),
  sendMessage: (orderId, text, from) => request('POST', `/api/messages/${orderId}`, { text, from }),
  getGames: () => request('GET', '/api/catalog/games'),
  createGame: (body) => request('POST', '/api/catalog/games', body),
  updateGame: (id, body) => request('PUT', `/api/catalog/games/${id}`, body),
  deleteGame: (id) => request('DELETE', `/api/catalog/games/${id}`),
  createPass: (gid, body) => request('POST', `/api/catalog/games/${gid}/passes`, body),
  updatePass: (gid, pid, body) => request('PUT', `/api/catalog/games/${gid}/passes/${pid}`, body),
  deletePass: (gid, pid) => request('DELETE', `/api/catalog/games/${gid}/passes/${pid}`),
  fetchRobloxGame: (placeId) => request('GET', `/api/roblox/game-by-place/${placeId}`),
  fetchRobloxGamepass: (gamepassId) => request('GET', `/api/roblox/gamepass/${gamepassId}`),
  fetchGamesOnline: (universeIds) => request('GET', `/api/roblox/games-online?universeIds=${universeIds.join(',')}`),
  uploadImage: async (file) => {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${BASE}/api/catalog/upload`, { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'ошибка загрузки');
    return BASE + data.url;
  },
  imageBase: BASE,
};
