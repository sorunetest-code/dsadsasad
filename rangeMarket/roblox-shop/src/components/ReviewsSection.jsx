import { Star } from 'lucide-react';
import { useReveal } from '../hooks/useInView';

const REVIEWS = [
  { 
    username: 'ProGamer99', 
    oderedGame: 'Adopt Me!', 
    text: 'Заказал VIP Pass, менеджер выдал за 5 минут. Всё без лишних вопросов, рекомендую!', 
    time: '2ч назад',
    rating: 5
  },
  { 
    username: 'xXDarkBladeXx', 
    game: 'Blox Fruits', 
    text: 'Сначала сомневался, но всё пришло быстро. Поддержка отвечает моментально.', 
    time: '5ч назад',
    rating: 5
  },
  { 
    username: 'StarPlayer2k', 
    game: 'Pet Sim X', 
    text: 'Уже третий раз покупаю. Ни разу не подвели. Цены адекватные.', 
    time: 'вчера',
    rating: 5
  },
  { 
    username: 'Ninja_RBX', 
    game: 'Arsenal', 
    text: 'Взял Skin Bundle — всё выдали, менеджер помог разобраться как применить.', 
    time: 'вчера',
    rating: 5
  },
  { 
    username: 'CoolDude777', 
    game: 'Brookhaven', 
    text: 'Быстро, удобно, дёшево. Рекомендую всем своим друзьям!', 
    time: '2д назад',
    rating: 5
  },
  { 
    username: 'MegaFarmer', 
    game: 'Blox Fruits', 
    text: 'Оплатил через СБП — мгновенно. Менеджер уже ждал в чате.', 
    time: '3д назад',
    rating: 5
  },
];

function blurUsername(name) {
  if (name.length <= 4) return name[0] + '***';
  const visible = Math.min(3, Math.floor(name.length / 3));
  return name.slice(0, visible) + '***' + name.slice(-visible);
}

function getRobloxAvatarUrl(username) {
  const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const avatarId = (hash % 1000000) + 1000000;
  return `https://www.roblox.com/headshot-thumbnail/image?userId=${avatarId}&width=150&height=150&format=png`;
}

export default function ReviewsSection() {
  const ref = useReveal();
  return (
    <section className="reviews-section" ref={ref} id="reviews">
      <div className="reviews-container">
        <div className="reviews-header">
          <span className="reviews-tag">Отзывы</span>
          <h2 className="reviews-title">Что говорят покупатели</h2>
          <p className="reviews-subtitle">Более 1000 довольных клиентов</p>
        </div>
        <div className="reviews-grid-new">
          {REVIEWS.map((r, i) => (
            <div key={i} className="review-card-new">
              <div className="review-card-top">
                <div className="review-stars-row">
                  {Array(r.rating).fill(0).map((_, j) => (
                    <Star key={j} size={14} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <span className="review-time-badge">{r.time}</span>
              </div>
              <p className="review-text-new">{r.text}</p>
              <div className="review-author">
                <div className="review-avatar-new">
                  <img 
                    src={getRobloxAvatarUrl(r.username)} 
                    alt={blurUsername(r.username)}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="review-avatar-fallback">
                    {r.username.slice(0, 2).toUpperCase()}
                  </div>
                </div>
                <div className="review-author-info">
                  <span className="review-author-name">{blurUsername(r.username)}</span>
                  <span className="review-author-game">{r.game || r.oderedGame}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
