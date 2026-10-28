import Link from "next/link";
import { restaurant } from "../data/site";
import HomeFavourites from "./home-favourites";
import ReviewsSection from "./reviews-section";

export default function HomePage() {
  return (
    <>
      {/* Modern High-Impact Hero Banner */}
      <section className="tokyo-hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="hero-badge-kicker">
              🍣 СВЕЖИЕ СУШИ И РОЛЛЫ В КАИРЕ
            </span>

            <h1 className="hero-heading">
              Настоящий вкус Токио <span>с доставкой</span> к вашей двери
            </h1>

            <p className="hero-copy">
              Отборный атлантический лосось, нежнейший сливочный сыр и хрустящая темпура. Готовим под заказ за 20 минут в Замалеке и Наср-Сити.
            </p>

            <div className="hero-actions">
              <Link className="button" href="/menu">
                Смотреть меню ↗
              </Link>
              <Link className="button secondary" href="/story">
                О нашей кухне
              </Link>
            </div>

            <div className="hero-trust-strip">
              <div className="hero-trust-item">
                <span>⭐</span>
                <span><strong>4.9</strong> рейтинг в Google</span>
              </div>
              <div className="hero-trust-item">
                <span>⏱️</span>
                <span><strong>30–45 мин</strong> доставка</span>
              </div>
              <div className="hero-trust-item">
                <span>🌿</span>
                <span><strong>100%</strong> Халяль</span>
              </div>
            </div>
          </div>

          <div className="hero-showcase">
            <div
              className="hero-image-card"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=85')",
              }}
              role="img"
              aria-label="Фирменный суши сет от SUSHI TOKYO"
            >
              <div className="hero-card-floating-badge">
                <div>
                  <strong>Сет 34 Pieces · Хит недели</strong>
                  <span>Black Shogun, California, Philadelphia</span>
                </div>
                <span className="hero-card-price-tag">795 EGP</span>
              </div>
            </div>

            {/* Floating Slate Aesthetic Badge (Matches user photo) */}
            <div className="hero-floating-slate-card">
              <div
                className="hero-slate-thumb"
                style={{ backgroundImage: "url('/images/slate-bg.jpg')" }}
                role="img"
                aria-label="Традиционная подача на черном сланце"
              />
              <div className="hero-slate-details">
                <span className="hero-slate-tag">🌸 АУТЕНТИЧНАЯ ПОДАЧА</span>
                <strong>Черный сланцевый камень</strong>
                <small>Традиционная японская сервировка и сакура</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Favourites Section */}
      <section className="section signature" id="signature">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">БЕСТСЕЛЛЕРЫ КУХНИ</span>
              <h2>Популярные блюда</h2>
              <p>Выбор наших постоянных гостей: свежие роллы, горячая темпура и сытные сеты.</p>
            </div>
            <Link className="text-link" href="/menu">
              Все 50+ блюд меню ↗
            </Link>
          </div>

          <HomeFavourites />
        </div>
      </section>

      {/* Quality Standards / Why Us */}
      <section className="section principles-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">СТАНДАРТЫ КАЧЕСТВА</span>
              <h2>Почему выбирают SUSHI TOKYO</h2>
              <p>Мы не идем на компромиссы со свежестью и технологией приготовления.</p>
            </div>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon" aria-hidden="true">🐟</span>
              <h3>Свежий атлантический лосось</h3>
              <p>Ежедневные поставки свежей рыбы. Никакой заморозки — только шелковистая текстура и чистый вкус.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon" aria-hidden="true">🍚</span>
              <h3>Японский рис премиум-сорта</h3>
              <p>Варим рис по традиционному рецепту с заправкой из рисового уксуса и мирина для идеальной плотности.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon" aria-hidden="true">🔥</span>
              <h3>Горячая хрустящая темпура</h3>
              <p>Обжариваем в чистом масле только после получения заказа. Доставляем обжигающе горячим в термобоксах.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon" aria-hidden="true">⚡</span>
              <h3>Быстрая доставка по Каиру</h3>
              <p>Два филиала в Замалеке и Наср-Сити позволяют доставлять любимые блюда до двери всего за 30–45 минут.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Banner */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="container">
          <div className="story-band">
            <div className="story-image" role="img" aria-label="Ночной Токио" />
            <div className="story-copy">
              <span className="eyebrow" style={{ color: "#fb7185" }}>
                ИЗ ТОКИО В КАИР
              </span>
              <h2>Город в каждом кусочке</h2>
              <p>
                Мы создали SUSHI TOKYO, чтобы объединить строгую эстетику японских мастеров с теплым гостеприимством Каира. Попробуйте сеты, созданные с душой и любовью к деталям.
              </p>
              <div className="story-copy-links">
                <Link className="button" href="/story">
                  Читать нашу историю ↗
                </Link>
                <Link className="text-link" href="/locations" style={{ color: "#ffffff" }}>
                  Наши филиалы ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Reviews Section */}
      <ReviewsSection />

      {/* Cairo Locations Section */}
      <section className="section locations-section" id="locations">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">НАШИ РЕСТОРАНЫ</span>
              <h2>Два филиала в Каире</h2>
              <p>Приходите в гости, заказывайте самовывоз или оформляйте доставку на дом.</p>
            </div>
            <Link className="text-link" href="/menu">
              Заказать доставку ↗
            </Link>
          </div>

          <div className="location-list">
            {restaurant.branches.map((branch, index) => (
              <article className="location-row" key={branch.name}>
                <span className="location-index">0{index + 1}</span>
                <div>
                  <h3>{branch.name}</h3>
                  <span className="branch-subhead">{branch.neighborhood}</span>
                </div>
                <address>📍 {branch.address}</address>
                <div className="branch-contact-col">
                  <a href={`tel:${branch.phone}`} className="branch-phone-link">
                    📞 {branch.phone}
                  </a>
                  <span className="branch-hours-text">🕒 {branch.hours}</span>
                </div>
                <div className="branch-actions-col">
                  <a
                    className="location-map-link"
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Карта ↗
                  </a>
                  <a
                    className="branch-wa-link"
                    href={`https://wa.me/${branch.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp 💬
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
