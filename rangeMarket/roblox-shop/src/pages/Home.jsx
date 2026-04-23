import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Users, Gamepad2, Zap, Shield, Clock } from 'lucide-react';
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
      <section className="hero-new" ref={heroRef}>
        <div className="hero-glow" />
        <div className="hero-grid-bg" />
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={14} />
            <span>Быстрая выдача</span>
          </div>
          <h1 className="hero-title">
            Геймпассы для <span className="hero-gradient">Roblox</span>
            <br />по лучшим ценам
          </h1>
          <p className="hero-subtitle">
            Выбирай игру, добавляй в корзину и получай геймпасс за 15 минут.
            Безопасно, быстро и выгодно.
          </p>
          <div className="hero-actions">
            <button className="hero-btn-primary" onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              <Gamepad2 size={18} />
              <span>Выбрать игру</span>
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="hero-features">
            <div className="hero-feature">
              <Shield size={16} />
              <span>100% безопасно</span>
            </div>
            <div className="hero-feature">
              <Clock size={16} />
              <span>Выдача 15 мин</span>
            </div>
            <div className="hero-feature">
              <Zap size={16} />
              <span>Лучшие цены</span>
            </div>
          </div>
        </div>
      </section>

      <StatsBar />
      <GameTicker games={games} />

      <section className="catalog-section" ref={catalogRevRef} id="catalog">
        <div ref={catalogRef} style={{ marginTop: -96, paddingTop: 96 }} />
        <div className="catalog-wrap">
          <div className="catalog-header">
            <div className="catalog-header-left">
              <span className="catalog-tag">Каталог игр</span>
              <h2 className="catalog-title">Выбери свою игру</h2>
            </div>
            <p className="catalog-desc">Нажми на игру, чтобы увидеть доступные геймпассы</p>
          </div>

          {loading ? (
            <div className="catalog-loading-state">
              <div className="catalog-spinner" />
              <span>Загрузка каталога...</span>
            </div>
          ) : games.length === 0 ? (
            <div className="catalog-empty-state">
              <Gamepad2 size={48} />
              <h3>Скоро появятся игры</h3>
              <p>Мы добавляем новые игры каждую неделю</p>
            </div>
          ) : (
            <>
              <div className="games-grid">
                {games.map((g) => {
                  const online = g.universeId ? onlineData[g.universeId] : null;
                  const playersDisplay = formatPlayers(online);
                  const isActive = selectedGame === g._id;
                  const passCount = g.passes?.length || 0;
                  return (
                    <button
                      key={g._id}
                      className={`game-card ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedGame(isActive ? null : g._id)}
                    >
                      <div className="game-card-img">
                        {g.imageUrl ? (
                          <img src={g.imageUrl} alt={g.name} />
                        ) : (
                          <div className="game-card-emoji">{g.emoji || '🎮'}</div>
                        )}
                        {online && (
                          <div className="game-card-online">
                            <span className="online-dot" />
                            {playersDisplay}
                          </div>
                        )}
                      </div>
                      <div className="game-card-body">
                        <h3 className="game-card-name">{g.name}</h3>
                        <div className="game-card-meta">
                          <span className="game-card-passes">{passCount} геймпасс{passCount === 1 ? '' : passCount < 5 ? 'а' : 'ов'}</span>
                        </div>
                      </div>
                      {isActive && <div className="game-card-indicator" />}
                    </button>
                  );
                })}
              </div>

              {selectedGame && game && (
                <div className="passes-section">
                  <div className="passes-header">
                    <div className="passes-game-info">
                      {game.imageUrl ? (
                        <img src={game.imageUrl} alt={game.name} className="passes-game-icon" />
                      ) : (
                        <div className="passes-game-emoji">{game.emoji || '🎮'}</div>
                      )}
                      <div>
                        <h3 className="passes-game-name">{game.name}</h3>
                        <span className="passes-count">{game.passes?.length || 0} доступных геймпассов</span>
                      </div>
                    </div>
                    <button className="passes-close" onClick={() => setSelectedGame(null)}>
                      Закрыть
                    </button>
                  </div>

                  {!game.passes?.length ? (
                    <div className="passes-empty">
                      <p>Геймпассы для этой игры скоро добавят</p>
                    </div>
                  ) : (
                    <div className="passes-grid">
                      {game.passes.map((pass) => {
                        const inCart = hasItem(game._id, pass._id);
                        return (
                          <div key={pass._id} className={`pass-card ${inCart ? 'in-cart' : ''}`}>
                            <div className="pass-card-img">
                              {pass.imageUrl ? (
                                <img src={pass.imageUrl} alt={pass.name} />
                              ) : (
                                <span className="pass-card-emoji">{pass.emoji || '⭐'}</span>
                              )}
                            </div>
                            <div className="pass-card-content">
                              <h4 className="pass-card-name">{pass.name}</h4>
                              {pass.desc && <p className="pass-card-desc">{pass.desc}</p>}
                              <div className="pass-card-footer">
                                <span className="pass-card-price">{pass.price} ₽</span>
                                <button
                                  className={`pass-card-btn ${inCart ? 'added' : ''}`}
                                  onClick={() => handleAdd(game, pass)}
                                  disabled={inCart}
                                >
                                  {inCart ? 'В корзине' : 'Добавить'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <HowItWorks />
      <ReviewsSection />
      <FaqSection />

      <section className="cta-section" ref={ctaRef}>
        <div className="cta-container">
          <div className="cta-glow" />
          <div className="cta-content">
            <Gamepad2 size={40} className="cta-icon" />
            <h2 className="cta-title">Готов получить геймпасс?</h2>
            <p className="cta-text">Выбери игру из каталога и оформи заказ за пару минут</p>
            <button className="cta-btn" onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              <span>Перейти к каталогу</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
