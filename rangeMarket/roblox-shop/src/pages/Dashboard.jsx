import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, CheckCircle, Clock, Plus, Pencil, Trash2, X, ChevronDown, ChevronRight, Download, Loader2, Users, RefreshCw } from 'lucide-react';
import { api } from '../api';

function fmt(d) { return new Date(d).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }); }
function formatPlayers(n) {
  if (!n) return '—';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

const SL = { new: 'Новый', active: 'В работе', done: 'Готово' };
const SC = { new: 's-new', active: 's-active', done: 's-done' };
const TABS = ['Заказы', 'Каталог'];
const FILTERS = ['Все', 'Новый', 'В работе', 'Готово'];

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <span className="modal-title">{title}</span>
          <button onClick={onClose} style={{ color: 'var(--white2)', display: 'flex' }}><X size={16} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontSize: 10, color: 'var(--white3)', fontFamily: 'var(--f-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  );
}

function Input({ ...props }) {
  return (
    <input
      style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--line2)', padding: '10px 0', fontSize: 15, color: 'var(--white)', outline: 'none', fontFamily: 'var(--f-sans)' }}
      {...props}
    />
  );
}

function Textarea({ ...props }) {
  return (
    <textarea
      style={{ width: '100%', background: 'var(--black3)', border: '1px solid var(--line)', borderRadius: 6, padding: '10px 12px', fontSize: 14, color: 'var(--white)', outline: 'none', fontFamily: 'var(--f-sans)', resize: 'vertical', minHeight: 80 }}
      {...props}
    />
  );
}

function ItemThumb({ imageUrl, emoji, size = 40 }) {
  if (imageUrl) return <img src={imageUrl} alt="" style={{ width: size, height: size, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--line)', flexShrink: 0 }} />;
  return <div style={{ width: size, height: size, borderRadius: 6, background: 'var(--black4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5, flexShrink: 0, border: '1px solid var(--line)' }}>{emoji || '🎮'}</div>;
}

function GameForm({ initial = {}, onSave, onClose }) {
  const [placeId, setPlaceId] = useState(initial.placeId || '');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imported, setImported] = useState(initial.name ? {
    name: initial.name,
    imageUrl: initial.imageUrl,
    universeId: initial.universeId,
    placeId: initial.placeId,
    playing: null
  } : null);
  const [error, setError] = useState('');

  const handleImport = async () => {
    if (!placeId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.fetchRobloxGame(placeId.trim());
      setImported({
        name: data.name,
        imageUrl: data.imageUrl,
        universeId: data.universeId,
        placeId: data.placeId,
        playing: data.playing
      });
    } catch (e) {
      setError(e.message || 'Не удалось загрузить');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!imported) return;
    setSaving(true);
    try {
      await onSave({
        name: imported.name,
        imageUrl: imported.imageUrl,
        universeId: imported.universeId,
        placeId: imported.placeId,
        players: formatPlayers(imported.playing),
        emoji: '',
        bg: '#18181f'
      });
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Field label="Place ID игры">
        <div style={{ display: 'flex', gap: 10 }}>
          <Input
            value={placeId}
            onChange={e => setPlaceId(e.target.value)}
            placeholder="Например: 2753915549"
            onKeyDown={e => e.key === 'Enter' && handleImport()}
          />
          <button
            className="btn-sm accent"
            onClick={handleImport}
            disabled={loading || !placeId.trim()}
            style={{ flexShrink: 0, padding: '8px 16px' }}
          >
            {loading ? <Loader2 size={14} className="spin" /> : <Download size={14} />}
            {loading ? 'Загрузка...' : 'Импорт'}
          </button>
        </div>
      </Field>

      {error && <div style={{ color: '#ff4444', fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {imported && (
        <div style={{ background: 'var(--black3)', borderRadius: 8, padding: 16, marginBottom: 20, border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {imported.imageUrl && <img src={imported.imageUrl} alt="" style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{imported.name}</div>
              <div style={{ fontSize: 12, color: 'var(--white3)', fontFamily: 'var(--f-mono)', display: 'flex', gap: 12 }}>
                <span>Universe: {imported.universeId}</span>
                <span>Place: {imported.placeId}</span>
              </div>
              {imported.playing !== null && (
                <div style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--f-mono)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Users size={12} /> {formatPlayers(imported.playing)} играют
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="btn-sm" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Отмена</button>
        <button
          className="btn-sm accent"
          disabled={saving || !imported}
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={handleSave}
        >
          {saving ? 'Сохраняем...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}

function PassForm({ initial = {}, onSave, onClose }) {
  const [gamepassId, setGamepassId] = useState(initial.gamepassId || '');
  const [price, setPrice] = useState(initial.price || '');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imported, setImported] = useState(initial.name ? {
    name: initial.name,
    imageUrl: initial.imageUrl,
    description: initial.desc,
    robuxPrice: initial.robuxPrice
  } : null);
  const [error, setError] = useState('');

  const handleImport = async () => {
    if (!gamepassId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.fetchRobloxGamepass(gamepassId.trim());
      setImported({
        name: data.name,
        imageUrl: data.imageUrl,
        description: data.description,
        robuxPrice: data.price
      });
    } catch (e) {
      setError(e.message || 'Не удалось загрузить');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!imported || !price) return;
    setSaving(true);
    try {
      await onSave({
        name: imported.name,
        imageUrl: imported.imageUrl,
        desc: imported.description || '',
        price: Number(price),
        gamepassId: gamepassId.trim(),
        robuxPrice: imported.robuxPrice,
        emoji: ''
      });
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Field label="Gamepass ID">
        <div style={{ display: 'flex', gap: 10 }}>
          <Input
            value={gamepassId}
            onChange={e => setGamepassId(e.target.value)}
            placeholder="Например: 12345678"
            onKeyDown={e => e.key === 'Enter' && handleImport()}
          />
          <button
            className="btn-sm accent"
            onClick={handleImport}
            disabled={loading || !gamepassId.trim()}
            style={{ flexShrink: 0, padding: '8px 16px' }}
          >
            {loading ? <Loader2 size={14} className="spin" /> : <Download size={14} />}
            {loading ? 'Загрузка...' : 'Импорт'}
          </button>
        </div>
      </Field>

      {error && <div style={{ color: '#ff4444', fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {imported && (
        <div style={{ background: 'var(--black3)', borderRadius: 8, padding: 16, marginBottom: 20, border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            {imported.imageUrl && <img src={imported.imageUrl} alt="" style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover' }} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{imported.name}</div>
              {imported.description && <div style={{ fontSize: 12, color: 'var(--white2)', marginBottom: 4 }}>{imported.description.slice(0, 100)}{imported.description.length > 100 ? '...' : ''}</div>}
              {imported.robuxPrice > 0 && (
                <div style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--f-mono)' }}>
                  {imported.robuxPrice} R$
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Field label="Цена (₽)">
        <Input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="299"
        />
      </Field>

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button className="btn-sm" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Отмена</button>
        <button
          className="btn-sm accent"
          disabled={saving || !imported || !price}
          style={{ flex: 1, justifyContent: 'center' }}
          onClick={handleSave}
        >
          {saving ? 'Сохраняем...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}

function CatalogTab() {
  const [games, setGames] = useState([]);
  const [onlineData, setOnlineData] = useState({});
  const [exp, setExp] = useState({});
  const [modal, setModal] = useState(null);

  const load = useCallback(() => api.getGames().then(setGames).catch(() => { }), []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const universeIds = games.filter(g => g.universeId).map(g => g.universeId);
    if (universeIds.length === 0) return;
    api.fetchGamesOnline(universeIds).then(setOnlineData).catch(() => { });
    const t = setInterval(() => {
      api.fetchGamesOnline(universeIds).then(setOnlineData).catch(() => { });
    }, 60000);
    return () => clearInterval(t);
  }, [games]);

  const [refreshing, setRefreshing] = useState({});

  const saveGame = async (form) => { modal.gameId ? await api.updateGame(modal.gameId, form) : await api.createGame(form); await load(); };
  const delGame = async (id) => { if (!confirm('Удалить игру?')) return; await api.deleteGame(id); await load(); };
  const savePass = async (form) => { modal.passId ? await api.updatePass(modal.gameId, modal.passId, form) : await api.createPass(modal.gameId, form); await load(); };
  const delPass = async (gId, pId) => { if (!confirm('Удалить геймпасс?')) return; await api.deletePass(gId, pId); await load(); };

  const reimportGame = async (game) => {
    if (!game.placeId) {
      setModal({ type: 'game', gameId: game._id, initial: game });
      return;
    }
    setRefreshing(r => ({ ...r, [game._id]: true }));
    try {
      const data = await api.fetchRobloxGame(game.placeId);
      await api.updateGame(game._id, {
        name: data.name,
        imageUrl: data.imageUrl,
        universeId: data.universeId,
        placeId: data.placeId,
        players: formatPlayers(data.playing)
      });
      await load();
    } catch (e) {
      alert('Ошибка: ' + (e.message || 'не удалось обновить'));
    } finally {
      setRefreshing(r => ({ ...r, [game._id]: false }));
    }
  };

  return (
    <div className="cat-wrap">
      <div className="cat-head">
        <span className="cat-title">Каталог</span>
        <button className="btn-sm accent" onClick={() => setModal({ type: 'game' })}><Plus size={13} /> Игра</button>
      </div>

      {games.length === 0 && <div style={{ color: 'var(--white3)', fontFamily: 'var(--f-mono)', fontSize: 12, padding: '20px 0' }}>Игр нет — добавь первую</div>}

      {games.map(game => {
        const online = game.universeId ? onlineData[game.universeId] : null;
        return (
          <div key={game._id} className="cat-game">
            <div className="cat-game-head" onClick={() => setExp(e => ({ ...e, [game._id]: !e[game._id] }))}>
              <ItemThumb imageUrl={game.imageUrl} emoji={game.emoji} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {game.name}
                  {!game.imageUrl && <span style={{ fontSize: 9, padding: '2px 6px', background: 'rgba(255,100,100,0.15)', color: '#ff6666', borderRadius: 4, fontFamily: 'var(--f-mono)' }}>нет фото</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--white3)', fontFamily: 'var(--f-mono)', marginTop: 2, display: 'flex', gap: 8 }}>
                  <span>{game.passes?.length || 0} пасса</span>
                  {online !== null && online !== undefined && (
                    <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Users size={10} /> {formatPlayers(online)}
                    </span>
                  )}
                  {!game.placeId && <span style={{ color: '#ff6666' }}>нет Place ID</span>}
                </div>
              </div>
              <button className="btn-sm" style={{ padding: '5px 8px' }} onClick={e => { e.stopPropagation(); reimportGame(game); }} title="Обновить данные с Roblox">
                {refreshing[game._id] ? <Loader2 size={13} className="spin" /> : <RefreshCw size={13} />}
              </button>
              <button className="btn-sm" style={{ padding: '5px 8px' }} onClick={e => { e.stopPropagation(); setModal({ type: 'game', gameId: game._id, initial: game }); }}><Pencil size={13} /></button>
              <button className="btn-sm danger" style={{ padding: '5px 8px' }} onClick={e => { e.stopPropagation(); delGame(game._id); }}><Trash2 size={13} /></button>
              {exp[game._id] ? <ChevronDown size={15} style={{ color: 'var(--white3)' }} /> : <ChevronRight size={15} style={{ color: 'var(--white3)' }} />}
            </div>

            {exp[game._id] && (
              <>
                {(game.passes || []).map(pass => (
                  <div key={pass._id} className="cat-pass-row">
                    <ItemThumb imageUrl={pass.imageUrl} emoji={pass.emoji} size={32} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{pass.name}</div>
                      {pass.robuxPrice && <div style={{ fontSize: 10, color: 'var(--white3)', fontFamily: 'var(--f-mono)' }}>{pass.robuxPrice} R$</div>}
                    </div>
                    <div style={{ fontFamily: 'var(--f-serif)', fontSize: 16, marginRight: 8 }}>{pass.price} ₽</div>
                    <button className="btn-sm" style={{ padding: '4px 7px' }} onClick={() => setModal({ type: 'pass', gameId: game._id, passId: pass._id, initial: pass })}><Pencil size={12} /></button>
                    <button className="btn-sm danger" style={{ padding: '4px 7px' }} onClick={() => delPass(game._id, pass._id)}><Trash2 size={12} /></button>
                  </div>
                ))}
                <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line)', background: 'var(--black)' }}>
                  <button className="btn-sm" onClick={() => setModal({ type: 'pass', gameId: game._id })}><Plus size={12} /> Добавить геймпасс</button>
                </div>
              </>
            )}
          </div>
        );
      })}

      {modal?.type === 'game' && (
        <Modal title={modal.gameId ? 'Редактировать игру' : 'Новая игра'} onClose={() => setModal(null)}>
          <GameForm initial={modal.initial} onSave={saveGame} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === 'pass' && (
        <Modal title={modal.passId ? 'Редактировать геймпасс' : 'Новый геймпасс'} onClose={() => setModal(null)}>
          <PassForm initial={modal.initial} onSave={savePass} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [sel, setSel] = useState(null);
  const [filter, setFilter] = useState('Все');
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const loadOrders = useCallback(() => api.getOrders().then(o => { setOrders(o); if (!sel && o.length) setSel(o[0]); }).catch(() => { }), []);
  const loadMsgs = useCallback(() => { if (sel?._id) api.getMessages(sel._id).then(setMsgs).catch(() => { }); }, [sel?._id]);

  useEffect(() => { loadOrders(); const t = setInterval(loadOrders, 8000); return () => clearInterval(t); }, [loadOrders]);
  useEffect(() => { loadMsgs(); const t = setInterval(loadMsgs, 4000); return () => clearInterval(t); }, [loadMsgs]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const current = sel ? orders.find(o => o._id === sel._id) || sel : null;
  const filtered = orders.filter(o => filter === 'Все' || SL[o.status] === filter);

  const sendMsg = async () => {
    if (!input.trim() || !current) return;
    const text = input.trim(); setInput('');
    try { const m = await api.sendMessage(current._id, text, 'manager'); setMsgs(p => [...p, m]); } catch { }
  };

  const setStatus = async (id, status) => {
    await api.setStatus(id, status);
    setOrders(p => p.map(o => o._id === id ? { ...o, status } : o));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: 'calc(100vh - 52px)' }}>
      <div style={{ borderRight: '1px solid var(--line)', overflowY: 'auto', background: 'var(--black2)', display: 'flex', flexDirection: 'column' }}>
        <div className="dash-sidebar-head">
          <h2>Заказы <span style={{ fontSize: 13, fontFamily: 'var(--f-mono)', color: 'var(--white3)' }}>({orders.length})</span></h2>
          <div className="filter-row">
            {FILTERS.map(f => <button key={f} className={`filter-chip ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>{f}</button>)}
          </div>
        </div>
        {filtered.length === 0 && <div style={{ padding: '32px 20px', color: 'var(--white3)', fontFamily: 'var(--f-mono)', fontSize: 12 }}>Заказов нет</div>}
        {filtered.map(o => (
          <div key={o._id} className={`dash-order ${sel?._id === o._id ? 'sel' : ''}`} onClick={() => setSel(o)}>
            <div className="dash-order-top">
              <span className="dash-order-id">#{o._id?.slice(-6)}</span>
              <span className={`status-chip ${SC[o.status]}`}>{SL[o.status]}</span>
            </div>
            <div className="dash-order-user">{o.username}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span className="dash-order-items">{o.items?.map(i => i.name).join(', ')}</span>
              <span style={{ fontFamily: 'var(--f-serif)', fontSize: 15, flexShrink: 0, marginLeft: 8 }}>{o.total} ₽</span>
            </div>
          </div>
        ))}
      </div>

      {current ? (
        <div className="dash-main">
          <div className="dash-detail">
            <div className="dash-detail-head">
              <div>
                <div className="dash-detail-id">#{current._id?.slice(-6)} · {current.createdAt ? new Date(current.createdAt).toLocaleString('ru') : ''}</div>
                <div className="dash-detail-title">{current.username}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {current.status === 'new' && <button className="btn-sm accent" onClick={() => setStatus(current._id, 'active')}><Clock size={13} /> В работу</button>}
                {current.status === 'active' && <button className="btn-sm" style={{ borderColor: 'rgba(200,255,0,0.3)', color: 'var(--accent)' }} onClick={() => setStatus(current._id, 'done')}><CheckCircle size={13} /> Закрыть</button>}
                {current.status === 'done' && <span style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--f-mono)', display: 'flex', alignItems: 'center', gap: 5 }}><CheckCircle size={13} /> Завершён</span>}
              </div>
            </div>

            <div className="dash-grid2">
              <div className="dash-card">
                <div className="dash-card-label">Аккаунт Roblox</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                  {current.avatarUrl && <img src={current.avatarUrl} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--line)', flexShrink: 0 }} />}
                  <div>
                    <div className="dash-card-val">{current.displayName || current.username}</div>
                    {current.displayName && current.displayName !== current.username && (
                      <div style={{ fontSize: 11, color: 'var(--white3)', fontFamily: 'var(--f-mono)', marginTop: 2 }}>@{current.username}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="dash-card">
                <div className="dash-card-label">Email</div>
                <div className="dash-card-val" style={{ fontSize: 13, marginTop: 6, wordBreak: 'break-all' }}>{current.email}</div>
              </div>
            </div>

            <div className="dash-items-list">
              {current.items?.map((item, i) => (
                <div key={i} className="dash-item-row">
                  <ItemThumb imageUrl={item.imageUrl} emoji={item.emoji} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: 'var(--white3)', fontFamily: 'var(--f-mono)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.gameName}</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{item.name}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--f-serif)', fontSize: 18 }}>{item.price} ₽</div>
                </div>
              ))}
              <div style={{ padding: '12px 16px', background: 'var(--black3)', display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                <span>Итого</span>
                <span style={{ fontFamily: 'var(--f-serif)', fontSize: 20 }}>{current.total} ₽</span>
              </div>
            </div>

            <div style={{ fontSize: 11, color: 'var(--white3)', fontFamily: 'var(--f-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Чат с покупателем</div>
            <div className="dash-chat">
              <div className="dash-chat-msgs">
                {msgs.length === 0 && <div style={{ color: 'var(--white3)', fontSize: 12, fontFamily: 'var(--f-mono)', textAlign: 'center', padding: '20px 0' }}>Сообщений нет</div>}
                {msgs.map((m, i) => (
                  <div key={m._id || i} className={`msg-wrap ${m.from}`}>
                    <div className="msg-bubble">{m.text}</div>
                    <div className="msg-time">{fmt(m.createdAt)}</div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="dash-chat-input">
                <input className="dash-chat-field" placeholder="Написать покупателю..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} />
                <button className="dash-send" onClick={sendMsg}><Send size={15} /></button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--white3)', fontFamily: 'var(--f-mono)', fontSize: 12 }}>
          Выбери заказ слева
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState(0);

  return (
    <div className="dash" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="dash-topbar" style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--line)', height: 56, background: 'var(--black2)', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 18, fontWeight: 700, padding: '0 24px', borderRight: '1px solid var(--line)', height: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: 2 }}></span>
          RBX Market
        </div>
        {TABS.map((t, i) => (
          <button key={t} className={`dash-tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {tab === 0 ? <OrdersTab /> : (
          <div style={{ overflowY: 'auto', flex: 1 }}><CatalogTab /></div>
        )}
      </div>
    </div>
  );
}
