import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { api } from '../api';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = params.get('token');
    if (!token) { setStatus('error'); setError('Токен не найден'); return; }
    api.verifyToken(token)
      .then(data => { setStatus('ok'); setTimeout(() => navigate(`/pay/${data.orderId}`), 1000); })
      .catch(e => { setStatus('error'); setError(e.message); });
  }, []);

  return (
    <div className="checkout-page" style={{ textAlign: 'center', paddingTop: 160 }}>
      {status === 'loading' && (
        <>
          <Loader size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--white3)', margin: '0 auto 20px' }} />
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--white3)' }}>Проверяем ссылку...</div>
        </>
      )}
      {status === 'ok' && (
        <>
          <div style={{ fontFamily: 'var(--f-serif)', fontSize: 48, marginBottom: 12 }}>✓</div>
          <div style={{ fontFamily: 'var(--f-serif)', fontSize: 28, marginBottom: 8 }}>Email подтверждён</div>
          <div style={{ color: 'var(--white2)', fontSize: 14, fontFamily: 'var(--f-mono)' }}>Переходим к оплате...</div>
        </>
      )}
      {status === 'error' && (
        <>
          <div style={{ fontFamily: 'var(--f-serif)', fontSize: 48, marginBottom: 12 }}>✗</div>
          <div style={{ fontFamily: 'var(--f-serif)', fontSize: 28, marginBottom: 12 }}>Ссылка недействительна</div>
          <div style={{ color: 'var(--white2)', fontSize: 14, marginBottom: 28 }}>{error}</div>
          <button className="btn-ghost" onClick={() => navigate('/')}>← В магазин</button>
        </>
      )}
    </div>
  );
}
