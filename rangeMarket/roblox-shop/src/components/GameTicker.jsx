import { useMemo, useEffect, useRef, useState } from 'react';

export default function GameTicker({ games }) {
  const trackRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const items = useMemo(() => {
    if (!games.length) return [];
    const minItems = 20;
    const repeatCount = Math.ceil(minItems / games.length);
    let repeated = [];
    for (let i = 0; i < repeatCount * 2; i++) {
      repeated = repeated.concat(games);
    }
    return repeated;
  }, [games]);

  useEffect(() => {
    if (items.length > 0) {
      setIsReady(true);
    }
  }, [items]);

  if (!games.length) return null;

  return (
    <div className="ticker-wrap">
      <div className="ticker-track" ref={trackRef} style={{ opacity: isReady ? 1 : 0 }}>
        {items.map((g, i) => (
          <div key={`${g._id}-${i}`} className="ticker-item">
            {g.imageUrl ? (
              <img src={g.imageUrl} alt={g.name} />
            ) : (
              <span>{g.emoji || '🎮'}</span>
            )}
            {g.name}
          </div>
        ))}
      </div>
    </div>
  );
}
