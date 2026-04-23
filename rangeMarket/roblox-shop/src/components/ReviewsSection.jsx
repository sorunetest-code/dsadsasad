import { useReveal } from '../hooks/useInView';

const REVIEWS = [
  { name: 'ProGamer99', game: 'Adopt Me!', text: 'Заказал VIP Pass, менеджер выдал за 5 минут. Всё без лишних вопросов.', time: '2ч назад' },
  { name: 'xXDarkBladeXx', game: 'Blox Fruits', text: 'Сначала сомневался, но всё пришло быстро. Поддержка отвечает моментально.', time: '5ч назад' },
  { name: 'StarPlayer2k', game: 'Pet Sim X', text: 'Уже третий раз покупаю. Ни разу не подвели. Цены адекватные.', time: 'вчера' },
  { name: 'Ninja_RBX', game: 'Arsenal', text: 'Взял Skin Bundle — всё выдали, менеджер помог разобраться как применить.', time: 'вчера' },
  { name: 'CoolDude777', game: 'Brookhaven', text: 'Быстро, удобно, дёшево. Рекомендую всем своим друзьям!', time: '2д назад' },
  { name: 'MegaFarmer', game: 'Blox Fruits', text: 'Оплатил через СБП — мгновенно. Менеджер уже ждал в чате.', time: '3д назад' },
];

export default function ReviewsSection() {
  const ref = useReveal();
  return (
    <section className="section" ref={ref} id="reviews">
      <div className="wrap">
        <div className="section-header reveal">
          <span className="section-tag">Отзывы</span>
          <h2 className="section-title">Нам доверяют</h2>
        </div>
        <div className="reviews-grid">
          {REVIEWS.map((r, i) => (
            <div key={i} className={`review-card reveal reveal-delay-${(i % 3) + 1}`}>
              <div className="review-stars">
                {Array(5).fill(0).map((_, j) => <span key={j} className="review-star">★</span>)}
              </div>
              <p className="review-text">«{r.text}»</p>
              <div className="review-footer">
                <div className="review-avatar">{r.name.slice(0, 2).toUpperCase()}</div>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-game">{r.game}</div>
                </div>
                <span className="review-time">{r.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
