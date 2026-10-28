"use client";

import { useState } from "react";
import { reviews } from "../data/site";

export default function ReviewsSection() {
  const [activeBranch, setActiveBranch] = useState<string>("All");

  const filtered = activeBranch === "All"
    ? reviews
    : reviews.filter((r) => r.branch === activeBranch);

  return (
    <section className="section reviews-section" id="reviews">
      <div className="container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">ОТЗЫВЫ НАШИХ ГОСТЕЙ</div>
            <h2>Слова тех, кто полюбил Токио</h2>
          </div>
          <div className="reviews-rating-badge">
            <span className="reviews-stars" aria-label="5 звезд">★★★★★</span>
            <strong>4.9 / 5.0</strong>
            <small>в Google Maps & Instagram</small>
          </div>
        </div>

        <div className="reviews-filter" role="tablist" aria-label="Фильтр по филиалам">
          {[
            { id: "All", label: "Все отзывы" },
            { id: "Nasr City", label: "Наср-Сити" },
            { id: "Zamalek", label: "Замалек" },
          ].map((branch) => (
            <button
              key={branch.id}
              type="button"
              role="tab"
              aria-selected={activeBranch === branch.id}
              className={`category-chip ${activeBranch === branch.id ? "is-active" : ""}`}
              onClick={() => setActiveBranch(branch.id)}
            >
              {branch.label}
            </button>
          ))}
        </div>

        <div className="reviews-grid">
          {filtered.map((rev) => (
            <article key={rev.id} className="review-card">
              <div className="review-card-header">
                <div className="review-author-info">
                  <span className="review-avatar" aria-hidden="true">
                    {rev.author.charAt(0)}
                  </span>
                  <div>
                    <h3>{rev.author}</h3>
                    <span className="review-meta">
                      Филиал {rev.branch} · {rev.date}
                    </span>
                  </div>
                </div>
                <div className="review-stars-small" aria-label={`${rev.rating} звезд`}>
                  {"★".repeat(rev.rating)}
                </div>
              </div>

              <blockquote className="review-text">
                “{rev.text}”
              </blockquote>

              {rev.favoriteDish && (
                <div className="review-favorite">
                  <span className="review-fav-label">Любимое блюдо:</span>
                  <span className="review-fav-dish">{rev.favoriteDish}</span>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

