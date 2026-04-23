import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Loader } from 'lucide-react';
import { api } from '../api';

export default function Pay() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getOrder(orderId).then(setOrder).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [orderId]);

  const pay = async () => {
    setPaying(true); setError('');
    try { const r = await api.payOrder(orderId); window.location.href = r.paymentUrl; }
    catch (e) { setError(e.message); setPaying(false); }
  };

  if (loading) return (
    <div className="checkout-page" style={{ textAlign: 'center' }}>
      <Loader size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--white3)', margin: '0 auto' }} />
    </div>
  );

  if (error && !order) return (
    <div className="checkout-page" style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--f-serif)', fontSize: 32, marginBottom: 12 }}>Ошибка</div>
      <div style={{ color: 'var(--white2)', marginBottom: 24 }}>{error}</div>
      <button className="btn-ghost" onClick={() => navigate('/')}>← В магазин</button>
    </div>
  );

  return (
    <div className="checkout-page">
      <button className="checkout-back" onClick={() => navigate('/')}><ArrowLeft size={14} /> в магазин</button>
      <h1 className="checkout-h">Оплата</h1>
      <p className="checkout-sub">Заказ #{orderId?.slice(-6)} · {order?.username}</p>

      <div className="order-mini" style={{ marginBottom: 32 }}>
        {order?.items?.map((item, i) => (
          <div key={i} className="order-mini-row">
            {item.imageUrl ? <img src={item.imageUrl} alt="" className="order-mini-img" /> : <div className="order-mini-emoji">{item.emoji}</div>}
            <div style={{ flex: 1 }}>
              <div className="order-mini-game">{item.gameName}</div>
              <div className="order-mini-name">{item.name}</div>
            </div>
            <div className="order-mini-price">{item.price} ₽</div>
          </div>
        ))}
        <div className="order-mini-total"><span>Итого</span><span>{order?.total} ₽</span></div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--f-serif)', fontSize: 56, marginBottom: 8 }}>{order?.total} ₽</div>
        <div style={{ fontSize: 12, color: 'var(--white3)', fontFamily: 'var(--f-mono)' }}>Защищено ЮКасса · Карта / СБП / Apple Pay</div>
      </div>

      {error && <div style={{ fontSize: 13, color: 'var(--red)', marginBottom: 16, fontFamily: 'var(--f-mono)' }}>{error}</div>}

      <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', borderRadius: 4 }} onClick={pay} disabled={paying}>
        {paying ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Создаём платёж...</> : <>Оплатить {order?.total} ₽ <ArrowRight size={15} /></>}
      </button>
    </div>
  );
}
