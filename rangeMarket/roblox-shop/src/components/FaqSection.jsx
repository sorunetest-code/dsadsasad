import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useReveal } from '../hooks/useInView';

const FAQ = [
  { 
    q: 'Как происходит выдача геймпасса?', 
    a: 'После оплаты менеджер получает уведомление и связывается с тобой в чате. Обычно выдача занимает 5–15 минут. Менеджер попросит зайти в игру и выдаст вручную.' 
  },
  { 
    q: 'Безопасно ли это? Не забанят ли аккаунт?', 
    a: 'Полностью безопасно. Мы не просим пароль от аккаунта — только никнейм. Геймпассы выдаются через официальные механизмы Roblox.' 
  },
  { 
    q: 'Какие способы оплаты принимаете?', 
    a: 'Банковские карты, СБП, Apple Pay, Google Pay. Все платежи через ЮКассу — официальную платёжную систему с защитой покупателей.' 
  },
  { 
    q: 'Что если меня нет онлайн в Roblox?', 
    a: 'Напиши нам в чате когда будешь онлайн. Заказ сохранится, менеджер дождётся.' 
  },
  { 
    q: 'Можно ли вернуть деньги?', 
    a: 'Если геймпасс не был выдан по нашей вине — вернём полностью. Напиши в чат поддержки.' 
  },
  { 
    q: 'Как скоро придёт ссылка на почту?', 
    a: 'В течение 30 секунд. Если не пришло — проверь Спам. Ссылка действует 30 минут.' 
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const ref = useReveal();

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" ref={ref} id="faq">
      <div className="faq-container">
        <div className="faq-header">
          <span className="faq-tag">FAQ</span>
          <h2 className="faq-title">Частые вопросы</h2>
          <p className="faq-subtitle">Ответы на популярные вопросы о нашем сервисе</p>
        </div>
        <div className="faq-list-new">
          {FAQ.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className={`faq-item-new ${isOpen ? 'open' : ''}`}>
                <button 
                  className="faq-question" 
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-question-text">{item.q}</span>
                  <ChevronDown 
                    size={20} 
                    className={`faq-chevron ${isOpen ? 'rotated' : ''}`} 
                  />
                </button>
                <div className={`faq-answer ${isOpen ? 'expanded' : ''}`}>
                  <div className="faq-answer-content">
                    {item.a}
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
