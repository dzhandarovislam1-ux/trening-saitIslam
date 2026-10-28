import type { Metadata } from "next";
import { restaurant } from "../../data/site";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Контакты и поддержка",
  description:
    "Свяжитесь с SUSHI TOKYO в Каире. Телефоны филиалов Замалек и Наср-Сити, WhatsApp поддержка, форма связи и ответы на частые вопросы.",
};

const faqs = [
  {
    q: "Сколько времени занимает доставка?",
    a: "В среднем доставка занимает от 25 до 45 минут в зависимости от района и загруженности кухни. Блюда доставляются в термосумках, поэтому темпура остается горячей и хрустящей.",
  },
  {
    q: "Все ли ингредиенты халяль?",
    a: "Да, абсолютно все ингредиенты — рыба, курица, говядина и соусы — на 100% халяль и проходят строгий контроль свежести.",
  },
  {
    q: "Можно ли оформить предзаказ на определенное время?",
    a: "Конечно! При заказе через сайт или WhatsApp укажите желаемое время доставки или самовывоза, и мы приготовим блюда ровно к назначенному часу.",
  },
  {
    q: "Как оплатить заказ?",
    a: "Мы принимаем наличные курьеру, банковские карты при получении, а также перевод через приложение InstaPay Egypt.",
  },
];

export default function ContactsPage() {
  return (
    <section className="section contacts-page">
      <div className="container">
        <header className="page-hero">
          <div className="eyebrow">СВЯЗЬ С КОМАНДОЙ</div>
          <h1>Мы всегда рядом.</h1>
          <p>
            Оставайтесь на связи с нашими филиалами в Наср-Сити и Замалеке. Позвоните, напишите в WhatsApp или отправьте сообщение через форму.
          </p>
        </header>

        {/* 2 Branches Contact Cards */}
        <div className="location-grid">
          {restaurant.branches.map((branch, index) => (
            <article className="location-card contact-branch-card" key={branch.name}>
              <span className="location-index">0{index + 1} / {branch.name.toUpperCase()}</span>
              <h2>{branch.name}</h2>
              <address>{branch.address}</address>

              <div className="branch-contact-buttons">
                <a href={`tel:${branch.phone}`} className="button secondary">
                  📞 Позвонить: {branch.phone}
                </a>
                <a
                  href={`https://wa.me/${branch.whatsapp}`}
                  className="button"
                  target="_blank"
                  rel="noreferrer"
                >
                  Написать в WhatsApp 💬
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Contact Form & Socials Grid */}
        <div className="contacts-interactive-grid">
          <ContactForm />

          <div className="socials-and-info-card">
            <span className="checkout-kicker">СОЦИАЛЬНЫЕ СЕТИ</span>
            <h3>Подписывайтесь на нас</h3>
            <p>
              Акции, закулисье кухни, специальные предложения и новые роллы первыми появляются в нашем Instagram.
            </p>

            <div className="social-links-list">
              <a
                className="social-pill instagram"
                href={restaurant.instagram}
                target="_blank"
                rel="noreferrer"
              >
                📸 Instagram: <span>@sushitokyoeg</span> ↗
              </a>
              <a
                className="social-pill facebook"
                href={restaurant.facebook}
                target="_blank"
                rel="noreferrer"
              >
                👍 Facebook: <span>SUSHI TOKYO Cairo</span> ↗
              </a>
            </div>

            <div className="work-hours-box">
              <h4>Часы работы кухни:</h4>
              <p>Понедельник — Воскресенье: <strong>12:00 – 02:00</strong></p>
              <small>Принимаем заказы на доставку до 01:30 ночи</small>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">ЧАСТЫЕ ВОПРОСЫ</div>
              <h2>Все, что нужно знать перед заказом</h2>
            </div>
          </div>

          <div className="faq-grid">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-card">
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
