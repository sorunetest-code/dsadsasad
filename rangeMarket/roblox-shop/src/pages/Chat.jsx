import { useState, useRef, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

function fmt(d) { return new Date(d).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }); }

const S_LABEL = { new: 'Принят · ждём менеджера', active: 'В работе · выдача', done: 'Выдан ✓' };
const S_COLOR = { new: 'var(--white2)', active: 'var(--accent)', done: 'var(--accent)' };

export default function Chat() {
  const { orderId } = useParams();
  const [params] = useSearchParams();
  const id = orderId || params.get('orderId');
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [err, setErr] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!id) { setErr('ID заказа не найден'); return; }
    api.getOrder(id).then(setOrder).catch(() => setErr('Заказ не найден'));
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [id]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const load = () => { if (id) api.getMessages(id).then(setMsgs).catch(() => {}); };

  const send = async () => {
    if (!input.trim()) return;
    const text = input.trim(); setInput('');
    try { const m = await api.sendMessage(id, text, 'client'); setMsgs(p => [...p, m]); } catch {}
  };

  if (err) return (
    <div className="chat-page" style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--f-serif)', fontSize: 36, marginBottom: 12 }}>{err}</div>
      <button className="btn-ghost" onClick={() => navigate('/')}>← В магазин</button>
    </div>
  );

  return (
    <div className="chat-page">
      <button className="checkout-back" onClick={() => navigate('/')}><ArrowLeft size={14} /> в магазин</button>

      {/* Order card */}
      <div className="chat-order-card">
        <div className="chat-order-top">
          <div className="chat-order-status-dot" style={{ background: order ? S_COLOR[order.status] : 'var(--white3)' }} />
          <div style={{ flex: 1 }}>
            <div className="chat-order-title">Заказ #{id ? id.slice(-6) : '...'}</div>
            <div className="chat-order-sub">{order ? S_LABEL[order.status] : 'Загружаем...'}</div>
          </div>
          {order?.status === 'done' && (
            <span style={{ fontSize: 11, fontFamily: 'var(--f-mono)', color: 'var(--accent)', border: '1px solid rgba(200,255,0,0.3)', padding: '3px 10px', borderRadius: 999 }}>ГОТОВО</span>
          )}
        </div>

        {order && (
          <div className="chat-order-details">
            {order.avatarUrl && (
              <img src={order.avatarUrl} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--line)', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--white3)', fontFamily: 'var(--f-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Аккаунт</div>
              <div style={{ fontWeight: 600 }}>{order.displayName || order.username}</div>
              {order.displayName && order.displayName !== order.username && (
                <div style={{ fontSize: 12, color: 'var(--white3)', fontFamily: 'var(--f-mono)' }}>@{order.username}</div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--white3)', fontFamily: 'var(--f-mono)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Куплено</div>
              {order.items?.map((it, i) => (
                <div key={i} style={{ fontSize: 13, fontWeight: 500 }}>{it.emoji} {it.name}</div>
              ))}
              <div style={{ fontFamily: 'var(--f-serif)', fontSize: 18, marginTop: 4 }}>{order.total} ₽</div>
            </div>
          </div>
        )}
      </div>

      {/* Chat */}
      <div className="chat-box">
        <div className="chat-messages">
          {msgs.length === 0 && (
            <div style={{ color: 'var(--white3)', fontSize: 13, fontFamily: 'var(--f-mono)', textAlign: 'center', padding: '20px 0' }}>
              Менеджер скоро напишет...
            </div>
          )}
          {msgs.map(m => (
            <div key={m._id} className={`msg-wrap ${m.from}`}>
              <div className="msg-bubble">{m.text}</div>
              <div className="msg-time">{fmt(m.createdAt)}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="chat-input-row">
          <input className="chat-input" placeholder="Написать менеджеру..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
          <button className="chat-send" onClick={send}><Send size={16} /></button>
        </div>
      </div>
    </div>
  );
}
