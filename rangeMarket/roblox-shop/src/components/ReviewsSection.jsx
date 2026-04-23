import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useReveal } from '../hooks/useInView';
import { api } from '../api';

const REVIEWS = [
  { 
    username: 'bytepatcher', 
    game: 'Adopt Me!', 
    text: 'Заказал VIP Pass, менеджер выдал за 5 минут. Всё без лишних вопросов, рекомендую!', 
    time: '2ч назад',
    rating: 5
  },
  { 
    username: 'Roblox', 
    game: 'Blox Fruits', 
    text: 'Сначала сомневался, но всё пришло быстро. Поддержка отвечает моментально.', 
    time: '5ч назад',
    rating: 5
  },
  { 
    username: 'builderman', 
    game: 'Pet Sim X', 
    text: 'Уже третий раз покупаю. Ни разу не подвели. Цены адекватные.', 
    time: 'вчера',
    rating: 5
  },
  { 
    username: 'TheDevKing', 
    game: 'Arsenal', 
    text: 'Взял Skin Bundle — всё выдали, менеджер помог разобраться как применить.', 
    time: 'вчера',
    rating: 5
  },
  { 
    username: 'KreekCraft', 
    game: 'Brookhaven', 
    text: 'Быстро, удобно, дёшево. Рекомендую всем своим друзьям!', 
    time: '2д назад',
    rating: 5
  },
  { 
    username: 'Flamingo', 
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

function ReviewCard({ review, avatarUrl }) {
  const [imgError, setImgError] = useState(false);
  
  return (
    <div className="review-card-new">
      <div className="review-card-top">
        <div className="review-stars-row">
          {Array(review.rating).fill(0).map((_, j) => (
            <Star key={j} size={14} fill="#fbbf24" color="#fbbf24" />
          ))}
        </div>
        <span className="review-time-badge">{review.time}</span>
      </div>
      <p className="review-text-new">{review.text}</p>
      <div className="review-author">
        <div className="review-avatar-new">
          {avatarUrl && !imgError ? (
            <img 
              src={avatarUrl} 
              alt={blurUsername(review.username)}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="review-avatar-fallback" style={{ display: 'flex' }}>
              {review.username.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="review-author-info">
          <span className="review-author-name">{blurUsername(review.username)}</span>
          <span className="review-author-game">{review.game}</span>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const ref = useReveal();
  const [avatars, setAvatars] = useState({});

  useEffect(() => {
    async function fetchAvatars() {
      const usernames = REVIEWS.map(r => r.username);
      try {
        const res = await fetch(`${api.imageBase}/api/roblox/users-avatars`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usernames })
        });
        if (res.ok) {
          const data = await res.json();
          setAvatars(data);
        }
      } catch (e) {
        console.log('[v0] Failed to fetch avatars:', e);
      }
    }
    fetchAvatars();
  }, []);

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
            <ReviewCard key={i} review={r} avatarUrl={avatars[r.username]} />
          ))}
        </div>
      </div>
    </section>
  );
}
