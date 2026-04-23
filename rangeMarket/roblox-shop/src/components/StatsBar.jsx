import { useEffect, useRef } from 'react';
import { useInView } from '../hooks/useInView';
import { Package, Clock, Gamepad2, ThumbsUp } from 'lucide-react';

function CountUp({ to, suffix = '' }) {
  const [ref, inView] = useInView();
  const el = useRef(null);
  useEffect(() => {
    if (!inView) return;
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      if (el.current) el.current.textContent = Math.round(ease * to) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView]);
  return <span ref={ref}><span ref={el}>0{suffix}</span></span>;
}

export default function StatsBar() {
  const stats = [
    { icon: Package, n: 500, s: '+', label: 'Выполненных заказов' },
    { icon: Clock, n: 15, s: ' мин', label: 'Среднее время выдачи' },
    { icon: Gamepad2, n: 6, s: '+', label: 'Игр в каталоге' },
    { icon: ThumbsUp, n: 99, s: '%', label: 'Довольных покупателей' },
  ];

  return (
    <div className="stats-section">
      <div className="stats-container">
        {stats.map((st, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon-wrap">
              <st.icon size={22} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <div className="stat-num"><CountUp to={st.n} suffix={st.s} /></div>
              <div className="stat-label">{st.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
