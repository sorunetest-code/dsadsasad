import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { api } from '../api';

export default function ImageUpload({ value, onChange, label = 'Картинка', hint = 'PNG, JPG, WebP до 5MB' }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handle = async (file) => {
    if (!file) return;
    setError(''); setUploading(true);
    try { onChange(await api.uploadImage(file)); }
    catch (e) { setError(e.message); }
    finally { setUploading(false); }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, color: 'var(--white3)', fontFamily: 'var(--f-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>

      {value ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src={value} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--line)', display: 'block' }} />
          <button onClick={() => onChange('')} style={{ position: 'absolute', top: -8, right: -8, width: 20, height: 20, borderRadius: '50%', background: 'var(--red)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={10} color="#fff" />
          </button>
          <button onClick={() => inputRef.current?.click()} style={{ marginTop: 8, fontSize: 11, color: 'var(--white2)', fontFamily: 'var(--f-mono)', background: 'none', border: '1px solid var(--line)', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', display: 'block' }}>
            заменить
          </button>
        </div>
      ) : (
        <div
          className="upload-zone"
          onClick={() => inputRef.current?.click()}
          onDrop={e => { e.preventDefault(); handle(e.dataTransfer.files[0]); }}
          onDragOver={e => e.preventDefault()}
        >
          {uploading ? (
            <div style={{ fontSize: 12, color: 'var(--white3)', fontFamily: 'var(--f-mono)' }}>Загружаем...</div>
          ) : (
            <>
              <Upload size={20} style={{ color: 'var(--white3)', margin: '0 auto 8px' }} />
              <div className="upload-zone-text">Нажми или перетащи</div>
              <div className="upload-zone-hint">{hint}</div>
            </>
          )}
        </div>
      )}
      {error && <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 6, fontFamily: 'var(--f-mono)' }}>{error}</div>}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handle(e.target.files[0])} />
    </div>
  );
}
