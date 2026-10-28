"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { initialMenu, type Product } from "../../data/site";
import ProductModal from "../product-modal";
import {
  changeCartItem,
  openCartDrawer,
  readCart,
  readMenu,
} from "../restaurant-store";

type DietaryFilter = "all" | "spicy" | "popular" | "veg";
type SortOption = "default" | "price-asc" | "price-desc" | "name";

export default function MenuClient() {
  const [items, setItems] = useState<Product[]>(initialMenu);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [category, setCategory] = useState<string>("Все");
  const [query, setQuery] = useState("");
  const [dietary, setDietary] = useState<DietaryFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const refreshMenu = () => setItems(readMenu());
    const refreshCart = () => setCart(readCart());

    refreshMenu();
    refreshCart();
    window.addEventListener("sushi-menu-updated", refreshMenu);
    window.addEventListener("sushi-cart-updated", refreshCart);
    window.addEventListener("storage", refreshMenu);
    return () => {
      window.removeEventListener("sushi-menu-updated", refreshMenu);
      window.removeEventListener("sushi-cart-updated", refreshCart);
      window.removeEventListener("storage", refreshMenu);
    };
  }, []);

  const totalCartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);

  const filterCategories = useMemo(() => {
    return ["Все", ...new Set(items.map((item) => item.category))];
  }, [items]);

  const visibleItems = useMemo(() => {
    const filtered = items.filter((item) => {
      if (item.available === false) return false;

      // Category filter
      if (category !== "Все" && item.category !== category) return false;

      // Dietary filter
      if (dietary === "spicy" && !item.isSpicy) return false;
      if (dietary === "popular" && !item.isPopular) return false;
      if (dietary === "veg" && !item.isVegetarian) return false;

      // Search query
      if (query.trim()) {
        const text = `${item.name} ${item.description} ${item.category}`.toLowerCase();
        if (!text.includes(query.trim().toLowerCase())) return false;
      }

      return true;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [items, category, dietary, query, sortBy]);

  function getCategoryCount(cat: string) {
    if (cat === "Все") return items.filter((i) => i.available !== false).length;
    return items.filter((i) => i.available !== false && i.category === cat).length;
  }

  return (
    <section className="menu-page section">
      <div className="container">
        <header className="page-hero menu-intro">
          <div className="eyebrow">SUSHI TOKYO · СВЕЖИЙ ВЫБОР</div>
          <h1>Наше меню.</h1>
          <p>
            Настоящее японское мастерство: от классических роллов с атлантическим лососем до авторских египетских сетов и хрустящей темпуры.
          </p>
          <button
            type="button"
            className="menu-cart-jump-btn"
            onClick={openCartDrawer}
          >
            Корзина{" "}
            <span>{totalCartCount.toString().padStart(2, "0")}</span> ↗
          </button>
        </header>

        {/* Dietary & Quick Badges */}
        <div className="menu-dietary-bar" role="toolbar" aria-label="Быстрые фильтры">
          <button
            type="button"
            className={`dietary-chip ${dietary === "all" ? "is-active" : ""}`}
            onClick={() => setDietary("all")}
          >
            Все позиции
          </button>
          <button
            type="button"
            className={`dietary-chip ${dietary === "popular" ? "is-active" : ""}`}
            onClick={() => setDietary("popular")}
          >
            ⭐ Бестселлеры
          </button>
          <button
            type="button"
            className={`dietary-chip ${dietary === "spicy" ? "is-active" : ""}`}
            onClick={() => setDietary("spicy")}
          >
            🌶️ Острые
          </button>
          <button
            type="button"
            className={`dietary-chip ${dietary === "veg" ? "is-active" : ""}`}
            onClick={() => setDietary("veg")}
          >
            🥑 Вегетарианские
          </button>
        </div>

        {/* Categories & Search Tool Bar */}
        <div className="menu-tools">
          <div className="category-filter" aria-label="Фильтр по категориям">
            {filterCategories.map((item) => {
              const count = getCategoryCount(item);
              return (
                <button
                  className={`category-chip ${category === item ? "is-active" : ""}`}
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                >
                  {item} <small className="cat-count">({count})</small>
                </button>
              );
            })}
          </div>

          <div className="menu-tools-right">
            <label className="menu-search">
              <span className="sr-only">Поиск по меню</span>
              <input
                type="search"
                placeholder="Поиск блюда, ингредиента..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query ? (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setQuery("")}
                  aria-label="Очистить поиск"
                >
                  ×
                </button>
              ) : (
                <span aria-hidden="true">⌕</span>
              )}
            </label>

            <select
              className="menu-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Сортировка блюд"
            >
              <option value="default">Сортировка: По умолчанию</option>
              <option value="price-asc">Сначала недорогие</option>
              <option value="price-desc">Сначала премиальные</option>
              <option value="name">По названию (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Results Count & Current Filter Indicators */}
        <div className="menu-result-bar">
          <span className="menu-result-count">
            Найдено {visibleItems.length} блюд · ЦЕНЫ В EGP
          </span>
          {(query || category !== "Все" || dietary !== "all") && (
            <button
              type="button"
              className="menu-reset-all"
              onClick={() => {
                setQuery("");
                setCategory("Все");
                setDietary("all");
              }}
            >
              Сбросить фильтры ↺
            </button>
          )}
        </div>

        {/* Menu Cards Grid */}
        <div className="menu-grid">
          {visibleItems.map((item, index) => {
            const inCartCount = cart[item.id] ?? 0;
            return (
              <article
                className="menu-card"
                key={item.id}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.closest(".add-button, button, a")) return;
                  setSelectedProduct(item);
                }}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="menu-card-image"
                  style={{ backgroundImage: `url('${item.image}')` }}
                >
                  <span className="menu-card-number">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <div className="menu-card-tags">
                    <span className="menu-card-category">{item.category}</span>
                    {item.isSpicy && (
                      <span className="card-mini-tag spicy">🌶️ Острое</span>
                    )}
                    {item.isPopular && (
                      <span className="card-mini-tag pop">⭐ Хит</span>
                    )}
                  </div>
                </div>

                <div className="menu-card-content">
                  <div className="menu-card-title-row">
                    <h2>{item.name}</h2>
                    <span>
                      {item.price} <small>EGP</small>
                    </span>
                  </div>
                  <p>{item.description}</p>
                  <div className="menu-card-bottom">
                    <span className="portion">{item.portion}</span>
                    <button
                      className={`add-button ${inCartCount > 0 ? "has-added" : ""}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        changeCartItem(item.id, 1, true);
                      }}
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {inCartCount > 0
                        ? `В корзине (${inCartCount}) +`
                        : "В заказ +"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {visibleItems.length === 0 && (
          <div className="empty-results">
            <span aria-hidden="true">食</span>
            <h3>Блюда не найдены</h3>
            <p>По вашему запросу ничего не нашлось. Попробуйте изменить фильтр или категорию.</p>
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                setQuery("");
                setCategory("All");
                setDietary("all");
              }}
            >
              Показать все блюда
            </button>
          </div>
        )}

        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    </section>
  );
}
