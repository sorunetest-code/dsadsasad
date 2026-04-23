import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useReveal } from '../hooks/useInView';

const FAQ = [
  { q: 'Как происходит выдача геймпасса?', a: 'После оплаты менеджер получает уведомление и связывается с тобой в чате. Обычно выдача занимает 5–15 минут. Менеджер попросит зайти в игру и выдаст вручную.' },
  { q: 'Безопасно ли это? Не забанят ли аккаунт?', a: 'Полностью безопасно. Мы не просим пароль от аккаунта — только никнейм. Геймпассы выдаются через официальные механизмы Roblox.' },
  { q: 'Какие способы оплаты принимаете?', a: 'Банковские карты, СБП, Apple Pay, Google Pay. Все платежи через ЮКассу — официальную платёжную систему с защитой покупателей.' },
  { q: 'Что если меня нет онлайн в Roblox?', a: 'Напиши нам в чате когда будешь онлайн. Заказ сохранится, менеджер дождётся.' },
  { q: 'Можно ли вернуть деньги?', a: 'Если геймпасс не был выдан по нашей вине — вернём полностью. Напиши в чат поддержки.' },
  { q: 'Как скоро придёт ссылка на почту?', a: 'В течение 30 секунд. Если не пришло — проверь Спам. Ссылка действует 30 минут.' },
];

export default function FaqSection() {
  const [open, setOpen] = useState(null);
  const ref = useReveal();

  return (
    <section className="section" ref={ref} id="faq">
      <div className="wrap" style={{ maxWidth: 720, margin: '0 auto', padding: '0 32px' }}>
        <div className="section-header reveal">
          <span className="section-tag">FAQ</span>
          <h2 className="section-title">Вопросы</h2>
        </div>
        <div className="faq-list">
          {FAQ.map((f, i) => (
            <div key={i} className={`faq-item reveal reveal-delay-${Math.min(i + 1, 5)}`}>
              <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
                <span className="faq-q-text">{f.q}</span>
                <Plus size={18} className={`faq-icon ${open === i ? 'open' : ''}`} />
              </button>
              <div className={`faq-a ${open === i ? 'open' : ''}`}>{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
