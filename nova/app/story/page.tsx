import type { Metadata } from "next";
import Link from "next/link";
import { restaurant, storyData } from "../../data/site";
import ReviewsSection from "../reviews-section";

export const metadata: Metadata = {
  title: "Наша история и философия",
  description:
    "Узнайте историю SUSHI TOKYO в Каире: аутентичные японские рецепты, свежайшая рыба и филиалы в Наср-Сити и Замалеке.",
};

export default function StoryPage() {
  return (
    <>
      <section className="section story-page-hero">
        <div className="container">
          <div className="page-hero">
            <div className="eyebrow">{storyData.kicker}</div>
            <h1>{storyData.title}</h1>
            <p>{storyData.subtitle}</p>
          </div>

          <div className="story-stats-strip">
            {storyData.stats.map((st) => (
              <div key={st.label} className="story-stat-card">
                <strong>{st.value}</strong>
                <span>{st.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section story-chapters-section">
        <div className="container">
          <div className="story-chapters-grid">
            {storyData.chapters.map((ch) => (
              <article key={ch.num} className="story-chapter-card">
                <span className="story-chapter-num">{ch.num} / СТАНДАРТ</span>
                <h2>{ch.title}</h2>
                <p>{ch.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section story-quote-band">
        <div className="container">
          <div className="story-quote-box">
            <span className="brand-mark large" aria-hidden="true">東</span>
            <blockquote>
              «Мы не просто готовим роллы — мы передаем почтение к японской гастрономической традиции, где каждая деталь имеет значение: от температуры риса до остроты поварского ножа.»
            </blockquote>
            <cite>— Шеф-повар SUSHI TOKYO</cite>
          </div>
        </div>
      </section>

      <ReviewsSection />

      <section className="section story-cta-section">
        <div className="container">
          <div className="story-cta-box">
            <div>
              <span className="eyebrow">ПОПРОБУЙТЕ НАСТОЯЩЕЕ</span>
              <h2>Готовы ощутить вкус Токио?</h2>
              <p>Закажите любимые роллы с быстрой доставкой по Каиру или забронируйте столик.</p>
            </div>
            <div className="story-cta-buttons">
              <Link href="/menu" className="button">
                Открыть меню ↗
              </Link>
              <Link href="/locations" className="button secondary">
                Наши филиалы ({restaurant.branches.length}) ↗
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

