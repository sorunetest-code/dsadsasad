import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader, X } from 'lucide-react';
import { useCart } from '../CartContext';
import { api } from '../api';

const STEPS = ['данные', 'почта', 'оплата'];

export default function Checkout() {
  const { items, total, removeItem } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [uStatus, setUStatus] = useState(null);
  const [rUser, setRUser] = useState(null);
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) return (
    <div className="checkout-page" style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--f-serif)', fontSize: 40, marginBottom: 16 }}>Корзина пуста</div>
      <button className="btn-ghost" onClick={() => navigate('/')}>← В магазин</button>
    </div>
  );

  const checkUser = async (name) => {
    if (name.length < 3) { setUStatus('invalid'); return; }
    setUStatus('checking'); setRUser(null);
    try {
      const d = await api.checkUser(name);
      if (d.valid) { setUStatus('valid'); setRUser(d); }
      else setUStatus('invalid');
    } catch { setUStatus('invalid'); }
  };

  const sendLink = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.sendMagicLink({
        email, username: rUser?.username || username,
        displayName: rUser?.displayName, robloxId: rUser?.id, avatarUrl: rUser?.avatarUrl,
        items: items.map(i => ({ gameId: i.gameId, gameName: i.gameName, passId: i.passId, name: i.name, price: i.price, emoji: i.emoji, imageUrl: i.imageUrl })),
      });
      setOrderId(res.orderId); setStep(1);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const pay = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.payOrder(orderId);
      window.location.href = res.paymentUrl;
    } catch (e) { setError(e.message); setLoading(false); }
  };

  return (
    <div className="checkout-page">
      <button className="checkout-back" onClick={() => step > 0 ? setStep(s => s - 1) : navigate('/')}>
        <ArrowLeft size={14} /> {step > 0 ? 'назад' : 'в магазин'}
      </button>

      <h1 className="checkout-h">Оформление</h1>
      <p className="checkout-sub">{total} ₽ · {items.length} позиц{items.length === 1 ? 'ия' : 'ии'}</p>

      {/* Step line */}
      <div className="steps-line">
        {STEPS.map((s, i) => (
          <div key={s} className={`step-pill ${i === step ? 'active' : i < step ? 'done' : ''}`}>{s}</div>
        ))}
      </div>

      {/* Order mini */}
      <div className="order-mini">
        {items.map((item, idx) => (
          <div key={`${item.gameId}-${item.passId}`} className="order-mini-row">
            {item.imageUrl
              ? <img src={item.imageUrl} alt="" className="order-mini-img" />
              : <div className="order-mini-emoji">{item.emoji}</div>
            }
            <div style={{ flex: 1 }}>
              <div className="order-mini-game">{item.gameName}</div>
              <div className="order-mini-name">{item.name}</div>
            </div>
            <div className="order-mini-price">{item.price} ₽</div>
            {step === 0 && (
              <button onClick={() => removeItem(item.gameId, item.passId)} style={{ color: 'var(--white3)', display: 'flex' }}>
                <X size={14} />
              </button>
            )}
          </div>
        ))}
        <div className="order-mini-total">
          <span>Итого</span><span>{total} ₽</span>
        </div>
      </div>

      {error && <div style={{ fontSize: 13, color: 'var(--red)', marginBottom: 20, fontFamily: 'var(--f-mono)' }}>{error}</div>}

      {/* ── Step 0 ── */}
      {step === 0 && (
        <div>
          <div className="field">
            <label className="field-label">Никнейм в Roblox</label>
            <input
              className={`field-input ${uStatus === 'valid' ? 'valid' : uStatus === 'invalid' ? 'error' : ''}`}
              placeholder="ProPlayer123"
              value={username}
              onChange={e => { setUsername(e.target.value); setUStatus(null); setRUser(null); }}
              onBlur={() => username && checkUser(username)}
            />
            {uStatus === 'checking' && <div className="field-hint">Проверяем...</div>}
            {uStatus === 'invalid' && <div className="field-hint err">Аккаунт не найден</div>}
            {!uStatus && <div className="field-hint">Точь-в-точь как в игре</div>}
            {uStatus === 'valid' && rUser && (
              <div className="roblox-found">
                {rUser.avatarUrl
                  ? <img src={rUser.avatarUrl} alt="" className="roblox-found-avatar" />
                  : <div style={{ width: 52, height: 52, borderRadius: 10, background: 'var(--black4)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--line)' }}>👤</div>
                }
                <div>
                  <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--f-mono)', marginBottom: 4 }}>НАЙДЕН</div>
                  <div className="roblox-found-name">{rUser.displayName}</div>
                  {rUser.displayName !== rUser.username && <div className="roblox-found-un">@{rUser.username}</div>}
                </div>
              </div>
            )}
          </div>

          <div className="field">
            <label className="field-label">Email</label>
            <input
              className="field-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <div className="field-hint">Пришлём ссылку подтверждения</div>
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 8, borderRadius: 4 }}
            disabled={uStatus !== 'valid' || !email.includes('@') || loading}
            onClick={sendLink}
          >
            {loading ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Отправляем...</> : <>Получить ссылку <ArrowRight size={15} /></>}
          </button>
        </div>
      )}

      {/* ── Step 1 ── */}
      {step === 1 && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontFamily: 'var(--f-serif)', fontSize: 52, marginBottom: 24 }}>✉</div>
          <h2 style={{ fontFamily: 'var(--f-serif)', fontSize: 32, fontWeight: 400, marginBottom: 12 }}>Проверь почту</h2>
          <p style={{ color: 'var(--white2)', fontSize: 15, marginBottom: 8 }}>Отправили ссылку на</p>
          <p style={{ fontWeight: 600, marginBottom: 40, fontFamily: 'var(--f-mono)', fontSize: 14 }}>{email}</p>
          <div style={{ background: 'var(--black3)', padding: 24, borderRadius: 8, textAlign: 'left', marginBottom: 28 }}>
            {['Открой письмо от RBX Market', 'Нажми «Открыть заказ»', 'Ссылка перенаправит на оплату'].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 2 ? 12 : 0, fontSize: 14, color: 'var(--white2)' }}>
                <span style={{ color: 'var(--accent)', fontFamily: 'var(--f-mono)', flexShrink: 0 }}>0{i + 1}</span>
                {t}
              </div>
            ))}
          </div>
          <button className="btn-ghost" onClick={sendLink} style={{ fontSize: 13 }}>
            {loading ? 'Отправляем...' : 'Отправить повторно'}
          </button>
        </div>
      )}

      {/* ── Step 2 ── */}
      {step === 2 && (
        <div>
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontFamily: 'var(--f-serif)', fontSize: 64, marginBottom: 8 }}>{total} ₽</div>
            <p style={{ color: 'var(--white2)', fontSize: 13, fontFamily: 'var(--f-mono)' }}>Защищено ЮКасса · Карта / СБП / Apple Pay</p>
          </div>
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', borderRadius: 4 }}
            onClick={pay}
            disabled={loading}
          >
            {loading ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Создаём платёж...</> : <>Оплатить {total} ₽ <ArrowRight size={15} /></>}
          </button>
        </div>
      )}
    </div>
  );
}
