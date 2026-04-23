import { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`toast ${type === 'success' ? 'ok' : 'err'}`}>
      {type === 'success'
        ? <CheckCircle size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        : <XCircle size={15} style={{ color: 'var(--red)', flexShrink: 0 }} />
      }
      {message}
    </div>
  );
}
