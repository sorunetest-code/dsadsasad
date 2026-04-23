import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../CartContext';

export default function Navbar() {
  const { count, setCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-logo">
        <span className="nav-logo-dot" />
        RBX Market
      </Link>
      <div className="nav-links">
        <button className="nav-link" onClick={() => scrollToSection('catalog')}>Каталог</button>
        <button className="nav-link" onClick={() => scrollToSection('how')}>Как это работает</button>
        <button className="nav-link" onClick={() => scrollToSection('reviews')}>Отзывы</button>
        <button className="nav-link" onClick={() => scrollToSection('faq')}>FAQ</button>
      </div>
      <div className="nav-right">
        <button className="nav-cart" onClick={() => setCartOpen(true)}>
          <ShoppingBag size={15} />
          Корзина
          {count > 0 && <span className="nav-cart-count">{count}</span>}
        </button>
        {count > 0 && (
          <button className="nav-checkout-btn" onClick={() => navigate('/checkout')}>
            <Sparkles size={14} />
            Оформить <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </button>
        )}
      </div>
    </nav>
  );
}
