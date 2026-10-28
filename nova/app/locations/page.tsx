import type { Metadata } from "next";
import Link from "next/link";
import { restaurant } from "../../data/site";

export const metadata: Metadata = {
  title: "Филиалы в Каире",
  description:
    "Филиалы SUSHI TOKYO в Замалеке и Наср-Сити. Адреса, часы работы с 12:00 до 02:00, телефоны и зоны доставки.",
};

export default function LocationsPage() {
  return (
    <section className="section locations-page">
      <div className="container">
        <header className="page-hero">
          <div className="eyebrow">ДВЕ ЛОКАЦИИ В КАИРЕ</div>
          <h1>Наши адреса.</h1>
          <p>
            Уютные залы, открытая суши-станция и быстрая доставка. Загляните к нам на ланч, вечерний ужин или закажите любимый сет с собой.
          </p>
        </header>

        <div className="location-grid detailed">
          {restaurant.branches.map((branch, index) => (
            <article className="location-card full-card" key={branch.name}>
              <div className="location-card-top">
                <span className="location-index">
                  0{index + 1} / КАИР · {branch.name.toUpperCase()}
                </span>
                <span className="branch-status-tag">🟢 Открыто сейчас</span>
              </div>

              <h2>{branch.name}</h2>
              <p className="branch-neighborhood">{branch.neighborhood}</p>

              <address className="branch-full-address">
                📍 {branch.address}
              </address>

              <div className="branch-info-rows">
                <div className="branch-info-row">
                  <span>Режим работы:</span>
                  <strong>🕒 {branch.hours}</strong>
                </div>
                <div className="branch-info-row">
                  <span>Телефон:</span>
                  <a href={`tel:${branch.phone}`} className="phone-highlight">
                    📞 {branch.phone}
                  </a>
                </div>
                <div className="branch-info-row">
                  <span>Зоны быстрой доставки:</span>
                  <p className="delivery-pills">
                    {branch.deliveryZones.map((zone) => (
                      <span key={zone} className="zone-pill">
                        {zone}
                      </span>
                    ))}
                  </p>
                </div>
              </div>

              <div className="branch-card-actions">
                <a
                  className="button"
                  href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(`Здравствуйте! Хочу заказать столик или сделать заказ в филиале ${branch.name}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Написать в WhatsApp 💬
                </a>
                <a
                  className="button secondary"
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Маршрут в Google Maps ↗
                </a>
                <Link
                  className="button secondary"
                  href="/menu"
                >
                  Заказать доставку ↗
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Catering & Events Info Box */}
        <div className="catering-box">
          <div>
            <span className="eyebrow">МЕРОПРИЯТИЯ И КОРПОРАТИВЫ</span>
            <h3>Празднуете событие большой компанией?</h3>
            <p>
              Мы собираем грандиозные сеты от 44 до 100+ штук для дней рождений, офисных встреч и семейных ужинов со скидкой 10% на предварительный заказ.
            </p>
          </div>
          <a
            className="button"
            href={`https://wa.me/${restaurant.branches[0].whatsapp}?text=${encodeURIComponent("Здравствуйте! Хочу сделать предзаказ сета на компанию/мероприятие.")}`}
            target="_blank"
            rel="noreferrer"
          >
            Связаться с менеджером ↗
          </a>
        </div>
      </div>
    </section>
  );
}
