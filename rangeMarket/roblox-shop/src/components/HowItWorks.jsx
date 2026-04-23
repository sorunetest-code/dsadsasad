import { ShoppingCart, UserCheck, CreditCard, Sparkles } from 'lucide-react';
import { useReveal } from '../hooks/useInView';

const STEPS = [
  { 
    icon: ShoppingCart, 
    num: '01', 
    title: 'Выбери геймпасс', 
    desc: 'Найди нужную игру в каталоге и добавь геймпассы в корзину',
    color: '#00ff88'
  },
  { 
    icon: UserCheck, 
    num: '02', 
    title: 'Введи данные', 
    desc: 'Укажи свой никнейм в Roblox и email для связи',
    color: '#3b82f6'
  },
  { 
    icon: CreditCard, 
    num: '03', 
    title: 'Оплати заказ', 
    desc: 'Банковская карта, СБП или Apple Pay через ЮКассу',
    color: '#f59e0b'
  },
  { 
    icon: Sparkles, 
    num: '04', 
    title: 'Получи геймпасс', 
    desc: 'Менеджер свяжется с тобой и выдаст геймпасс за 15 минут',
    color: '#ec4899'
  },
];

export default function HowItWorks() {
  const ref = useReveal();
  return (
    <section className="how-section" ref={ref} id="how">
      <div className="how-container">
        <div className="how-header">
          <span className="how-tag">Как это работает</span>
          <h2 className="how-title">4 простых шага</h2>
          <p className="how-subtitle">От выбора до получения геймпасса — всего 15 минут</p>
        </div>
        <div className="how-grid">
          {STEPS.map((step, i) => (
            <div key={i} className="how-card">
              <div className="how-card-num" style={{ color: step.color }}>{step.num}</div>
              <div className="how-card-icon" style={{ backgroundColor: `${step.color}15`, borderColor: `${step.color}30` }}>
                <step.icon size={24} style={{ color: step.color }} />
              </div>
              <h3 className="how-card-title">{step.title}</h3>
              <p className="how-card-desc">{step.desc}</p>
              {i < STEPS.length - 1 && <div className="how-card-arrow" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
