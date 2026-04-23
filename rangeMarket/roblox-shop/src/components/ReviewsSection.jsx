import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useReveal } from '../hooks/useInView';

const REVIEWS = [
  { 
    username: 'ProGamer99', 
    game: 'Adopt Me!', 
    text: 'Заказал VIP Pass, менеджер выдал за 5 минут. Все без лишних вопросов, рекомендую!', 
    time: '2ч назад',
    rating: 5
  },
  { 
    username: 'xXDarkBladeXx', 
    game: 'Blox Fruits', 
    text: 'Сначала сомневался, но все пришло быстро. Поддержка отвечает моментально.', 
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
    username: 'Ninja_Master', 
    game: 'Arsenal', 
    text: 'Взял Skin Bundle - все выдали, менеджер помог разобраться как применить.', 
    time: 'вчера',
    rating: 5
  },
  { 
    username: 'CoolDude777', 
    game: 'Brookhaven', 
    text: 'Быстро, удобно, дешево. Рекомендую всем своим друзьям!', 
    time: '2д назад',
    rating: 5
  },
  { 
    username: 'MegaFarmer', 
    game: 'Blox Fruits', 
    text: 'Оплатил через СБП - мгновенно. Менеджер уже ждал в чате.', 
    time: '3д назад',
    rating: 5
  },
];

function blurUsername(name) {
  if (name.length <= 4) return name[0] + '***';
  const visible = Math.min(3, Math.floor(name.length / 3));
  return name.slice(0, visible) + '***' + name.slice(-visible);
}

export default function ReviewsSection() {
  const ref = useReveal();
  const [avatars, setAvatars] = useState({});

  useEffect(() => {
    const fetchAvatars = async () => {
      const usernames = REVIEWS.map(r => r.username);
      try {
        const userIdsRes = await fetch('https://users.roblox.com/v1/usernames/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usernames, excludeBannedUsers: false })
        });
        
        if (!userIdsRes.ok) throw new Error('Failed to fetch user IDs');
        
        const userIdsData = await userIdsRes.json();
        const userIdMap = {};
        userIdsData.data?.forEach(u => {
          userIdMap[u.requestedUsername?.toLowerCase() || u.name?.toLowerCase()] = u.id;
        });

        const ids = Object.values(userIdMap).filter(Boolean);
        if (ids.length === 0) throw new Error('No user IDs found');

        const thumbRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${ids.join(',')}&size=150x150&format=Png&isCircular=false`);
        
        if (!thumbRes.ok) throw new Error('Failed to fetch thumbnails');
        
        const thumbData = await thumbRes.json();
        const avatarMap = {};
        
        thumbData.data?.forEach(t => {
          if (t.imageUrl) {
            const username = Object.keys(userIdMap).find(k => userIdMap[k] === t.targetId);
            if (username) {
              avatarMap[username] = t.imageUrl;
            }
          }
        });
        
        setAvatars(avatarMap);
      } catch (err) {
        const fallbackAvatars = {};
        REVIEWS.forEach(r => {
          const hash = r.username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const fakeId = (hash % 50000000) + 1000000;
          fallbackAvatars[r.username.toLowerCase()] = `https://tr.rbxcdn.com/30DAY-AvatarHeadshot-${fakeId}-150x150-png`;
        });
        setAvatars(fallbackAvatars);
      }
    };

    fetchAvatars();
  }, []);

  const getAvatarUrl = (username) => {
    return avatars[username.toLowerCase()] || null;
  };

  return (
    <section className="reviews-section" ref={ref} id="reviews">
      <div className="reviews-container">
        <div className="reviews-header">
          <span className="reviews-tag">Отзывы</span>
          <h2 className="reviews-title">Что говорят покупатели</h2>
          <p className="reviews-subtitle">Более 1000 довольных клиентов</p>
        </div>
        <div className="reviews-grid-new">
          {REVIEWS.map((r, i) => {
            const avatarUrl = getAvatarUrl(r.username);
            const blurred = blurUsername(r.username);
            return (
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
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt={blurred}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="review-avatar-fallback" style={{ display: avatarUrl ? 'none' : 'flex' }}>
                      {r.username.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div className="review-author-info">
                    <span className="review-author-name">{blurred}</span>
                    <span className="review-author-game">{r.game}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
