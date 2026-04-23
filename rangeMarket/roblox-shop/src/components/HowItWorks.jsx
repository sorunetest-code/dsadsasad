import { ShoppingBag, Mail, CreditCard, MessageSquare } from 'lucide-react';
import { useReveal } from '../hooks/useInView';

const STEPS = [
  { icon: ShoppingBag, n: '01', title: 'Выбери', desc: 'Добавь геймпассы из нужных игр в корзину' },
  { icon: Mail, n: '02', title: 'Подтверди', desc: 'Введи никнейм Roblox и email — пришлем ссылку' },
  { icon: CreditCard, n: '03', title: 'Оплати', desc: 'Карта, СБП или Apple Pay через ЮКассу' },
  { icon: MessageSquare, n: '04', title: 'Получи', desc: 'Менеджер выдаст геймпасс и напишет в чате' },
];

export default function HowItWorks() {
  const ref = useReveal();
  return (
    <section className="section" ref={ref} id="how">
      <div className="wrap">
        <div className="section-header reveal">
          <span className="section-tag">Процесс</span>
          <h2 className="section-title">Как это работает</h2>
        </div>
        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div key={i} className={`step-card reveal reveal-delay-${i + 1}`}>
              <div className="step-num mono">/ {s.n}</div>
              <div className="step-icon">
                <s.icon size={24} strokeWidth={1.5} />
              </div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
