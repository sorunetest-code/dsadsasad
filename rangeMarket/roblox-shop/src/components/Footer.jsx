import { MessageCircle, Send, Mail, Shield, Clock, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-dot" />
              RBX Market
            </div>
            <p className="footer-desc">
              Надежный магазин геймпассов для Roblox. Быстрая ручная выдача, безопасная оплата, поддержка 24/7.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link" title="Telegram">
                <Send size={18} />
              </a>
              <a href="#" className="footer-social-link" title="Discord">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="footer-social-link" title="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Навигация</div>
            <div className="footer-links">
              <a href="#catalog" className="footer-link">Каталог</a>
              <a href="#how" className="footer-link">Как это работает</a>
              <a href="#reviews" className="footer-link">Отзывы</a>
              <a href="#faq" className="footer-link">FAQ</a>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Поддержка</div>
            <div className="footer-links">
              <a href="#" className="footer-link">Telegram</a>
              <a href="#" className="footer-link">Discord</a>
              <a href="#" className="footer-link">Написать нам</a>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Гарантии</div>
            <div className="footer-links">
              <span className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={14} /> Безопасная оплата
              </span>
              <span className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={14} /> Выдача до 15 минут
              </span>
              <span className="footer-link" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCard size={14} /> ЮКасса
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">© {new Date().getFullYear()} RBX Market. Все права защищены.</div>
          <div className="footer-note">Не является официальным продуктом Roblox Corporation</div>
        </div>
      </div>
    </footer>
  );
}
