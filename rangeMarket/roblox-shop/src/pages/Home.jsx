import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, ChevronLeft, Users } from 'lucide-react';
import { useCart } from '../CartContext';
import { api } from '../api';
import Toast from '../components/Toast';
import GameTicker from '../components/GameTicker';
import StatsBar from '../components/StatsBar';
import HowItWorks from '../components/HowItWorks';
import ReviewsSection from '../components/ReviewsSection';
import FaqSection from '../components/FaqSection';
import Footer from '../components/Footer';
import { useReveal } from '../hooks/useInView';

function formatPlayers(n) {
  if (!n && n !== 0) return null;
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

export default function Home() {
  const [games, setGames] = useState([]);
  const [onlineData, setOnlineData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [toast, setToast] = useState(null);
  const catalogRef = useRef(null);
  const heroRef = useReveal();
  const catalogRevRef = useReveal([games, selectedGame]);
  const ctaRef = useReveal();
  const { addItem, hasItem } = useCart();

  useEffect(() => {
    api.getGames()
      .then(setGames)
      .catch(() => setToast({ message: 'Не удалось загрузить каталог', type: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const universeIds = games.filter(g => g.universeId).map(g => g.universeId);
    if (universeIds.length === 0) return;
    api.fetchGamesOnline(universeIds).then(setOnlineData).catch(() => { });
    const t = setInterval(() => {
      api.fetchGamesOnline(universeIds).then(setOnlineData).catch(() => { });
    }, 60000);
    return () => clearInterval(t);
  }, [games]);

  const handleAdd = (game, pass) => {
    if (hasItem(game._id, pass._id)) return;
    addItem({ id: game._id, name: game.name }, { id: pass._id, name: pass.name, price: pass.price, emoji: pass.emoji, imageUrl: pass.imageUrl });
    setToast({ message: `${pass.name} добавлен`, type: 'success' });
  };

  const game = selectedGame ? games.find(g => g._id === selectedGame) : null;

  return (
    <div>
      <section className="hero" ref={heroRef}>
        <div className="hero-bg-grid" />
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          RBX Market
        </div>
        <h1 className="hero-h1">
          Геймпассы <em>дешевле</em><br />
          чем где-либо
        </h1>
        <div className="hero-bottom">
          <p className="hero-desc">
            Выбери игру, добавь в корзину и оплати. Выдача за 15 минут.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              <span>Перейти к каталогу</span> <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <StatsBar />
      <GameTicker games={games} />

      <section className="catalog-section" ref={catalogRevRef} id="catalog">
        <div ref={catalogRef} style={{ marginTop: -96, paddingTop: 96 }} />
        <div className="catalog-container">
          <div className="catalog-sidebar">
            <div className="catalog-sidebar-header">
              <span className="section-tag">Каталог</span>
            </div>
            {loading ? (
              <div className="catalog-loading">Загрузка...</div>
            ) : games.length === 0 ? (
              <div className="catalog-loading">Скоро появятся игры</div>
            ) : (
              <div className="catalog-games-list">
                {games.map((g) => {
                  const online = g.universeId ? onlineData[g.universeId] : null;
                  const playersDisplay = formatPlayers(online);
                  const isActive = selectedGame === g._id;
                  return (
                    <button
                      key={g._id}
                      className={`catalog-game-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedGame(g._id)}
                    >
                      <div className="catalog-game-icon">
                        {g.imageUrl ? (
                          <img src={g.imageUrl} alt={g.name} />
                        ) : (
                          <span>{g.emoji || '🎮'}</span>
                        )}
                      </div>
                      <div className="catalog-game-info">
                        <div className="catalog-game-name">{g.name}</div>
                        <div className="catalog-game-meta">
                          {playersDisplay && <span><Users size={10} /> {playersDisplay}</span>}
                          <span>{g.passes?.length || 0} пасса</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="catalog-main">
            {!selectedGame ? (
              <div className="catalog-empty">
                <div className="catalog-empty-icon">🎮</div>
                <div className="catalog-empty-title">Выбери игру</div>
                <div className="catalog-empty-desc">Выбери игру слева, чтобы увидеть доступные геймпассы</div>
              </div>
            ) : !game?.passes?.length ? (
              <div className="catalog-empty">
                <div className="catalog-empty-icon">📦</div>
                <div className="catalog-empty-title">Скоро</div>
                <div className="catalog-empty-desc">Геймпассы для этой игры скоро добавят</div>
              </div>
            ) : (
              <>
                <div className="catalog-main-header">
                  <h3 className="catalog-main-title">{game.name}</h3>
                  <span className="catalog-main-count">{game.passes.length} товаров</span>
                </div>
                <div className="catalog-passes">
                  {game.passes.map((pass) => {
                    const inCart = hasItem(game._id, pass._id);
                    return (
                      <div key={pass._id} className={`catalog-pass ${inCart ? 'in-cart' : ''}`}>
                        <div className="catalog-pass-img">
                          {pass.imageUrl ? (
                            <img src={pass.imageUrl} alt={pass.name} />
                          ) : (
                            <span>{pass.emoji || '⭐'}</span>
                          )}
                        </div>
                        <div className="catalog-pass-body">
                          <div className="catalog-pass-name">{pass.name}</div>
                          {pass.desc && <div className="catalog-pass-desc">{pass.desc}</div>}
                        </div>
                        <div className="catalog-pass-footer">
                          <div className="catalog-pass-price">{pass.price} ₽</div>
                          <button
                            className={`catalog-pass-btn ${inCart ? 'added' : ''}`}
                            onClick={() => handleAdd(game, pass)}
                            disabled={inCart}
                          >
                            {inCart ? '✓' : '+'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <HowItWorks />
      <ReviewsSection />
      <FaqSection />

      <section className="section" ref={ctaRef}>
        <div className="wrap">
          <div className="cta-block reveal">
            <h2 className="cta-h">Готов начать?</h2>
            <p className="cta-desc">Выбери игру и получи геймпасс за 15 минут</p>
            <button className="btn-primary" onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              <span>Выбрать игру</span> <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
