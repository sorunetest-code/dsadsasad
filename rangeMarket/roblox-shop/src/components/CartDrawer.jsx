import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../CartContext';

export default function CartDrawer() {
  const { items, removeItem, total, cartOpen, setCartOpen } = useCart();
  const navigate = useNavigate();
  if (!cartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setCartOpen(false)} />
      <div className="cart-drawer">
        <div className="cart-head">
          <h3 className="cart-head-title">
            Корзина{items.length > 0 && <span className="muted" style={{ fontStyle: 'italic', marginLeft: 8 }}>({items.length})</span>}
          </h3>
          <button onClick={() => setCartOpen(false)} style={{ color: 'var(--white2)', display: 'flex' }}><X size={18} /></button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={32} strokeWidth={1} />
              <span>Корзина пуста</span>
            </div>
          ) : items.map(item => (
            <div key={`${item.gameId}-${item.passId}`} className="cart-item">
              {item.imageUrl
                ? <img src={item.imageUrl} alt="" className="cart-item-img" />
                : <div className="cart-item-emoji">{item.emoji}</div>
              }
              <div className="cart-item-info">
                <div className="cart-item-game">{item.gameName}</div>
                <div className="cart-item-name">{item.name}</div>
              </div>
              <div className="cart-item-price">{item.price} ₽</div>
              <button onClick={() => removeItem(item.gameId, item.passId)} style={{ color: 'var(--white3)', display: 'flex', padding: 4 }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span className="cart-total-label">Итого</span>
              <span className="cart-total-price">{total} ₽</span>
            </div>
            <button className="btn-checkout" onClick={() => { setCartOpen(false); navigate('/checkout'); }}>
              Оформить заказ <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
