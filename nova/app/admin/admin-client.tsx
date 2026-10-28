"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { categories, initialMenu, restaurant, type Product } from "../../data/site";
import { readMenu, resetMenuToDefault, writeMenu } from "../restaurant-store";

type Draft = {
  name: string;
  japaneseName: string;
  category: string;
  price: string;
  portion: string;
  description: string;
  image: string;
  isSpicy: boolean;
  isPopular: boolean;
  isVegetarian: boolean;
};

const emptyDraft: Draft = {
  name: "",
  japaneseName: "",
  category: "Классические роллы",
  price: "",
  portion: "8 шт. · 260г",
  description: "",
  image: "",
  isSpicy: false,
  isPopular: false,
  isVegetarian: false,
};

type SavedOrder = {
  id: string;
  date: string;
  items: { name: string; count: number; price: number }[];
  total: number;
  branch: string;
};

const ADMIN_PIN = "2026";
const ORDER_HISTORY_KEY = "sushi-tokyo-order-history";

export default function AdminClient() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<"menu" | "orders">("menu");
  const [items, setItems] = useState<Product[]>(initialMenu);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [adminSearch, setAdminSearch] = useState("");
  const [adminCategory, setAdminCategory] = useState("Все");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "stopped">("all");
  const [orders, setOrders] = useState<SavedOrder[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem("sushi-admin-auth") === "true") {
      setIsAuthenticated(true);
    }

    const refreshMenu = () => setItems(readMenu());
    refreshMenu();

    // Load orders history
    try {
      const ordersStr = localStorage.getItem(ORDER_HISTORY_KEY);
      if (ordersStr) setOrders(JSON.parse(ordersStr));
    } catch {}

    window.addEventListener("sushi-menu-updated", refreshMenu);
    window.addEventListener("storage", refreshMenu);
    return () => {
      window.removeEventListener("sushi-menu-updated", refreshMenu);
      window.removeEventListener("storage", refreshMenu);
    };
  }, []);

  function handleLogin(e: FormEvent) {
    e.preventDefault();
    if (pinInput.trim() === ADMIN_PIN || pinInput.trim() === "admin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("sushi-admin-auth", "true");
      setPinError(false);
    } else {
      setPinError(true);
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    sessionStorage.removeItem("sushi-admin-auth");
  }

  const activeCount = items.filter((item) => item.available !== false).length;
  const stoppedCount = items.length - activeCount;
  const productCategories = [...new Set(items.map((item) => item.category))];
  const avgPrice = Math.round(
    items.reduce((sum, item) => sum + item.price, 0) / (items.length || 1),
  );

  function resetForm() {
    setDraft(emptyDraft);
    setEditingId(null);
  }

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const original = editingId
      ? items.find((item) => item.id === editingId)
      : null;

    const product: Product = {
      id: editingId ?? `custom-${Date.now()}`,
      name: draft.name.trim(),
      japaneseName: draft.japaneseName.trim() || undefined,
      category: draft.category.trim(),
      price: Number(draft.price),
      portion: draft.portion.trim(),
      description: draft.description.trim(),
      image:
        draft.image.trim() ||
        original?.image ||
        initialMenu.find((item) => item.category === draft.category)?.image ||
        initialMenu[0].image,
      available: original?.available ?? true,
      isSpicy: draft.isSpicy,
      isPopular: draft.isPopular,
      isVegetarian: draft.isVegetarian,
    };

    const next = editingId
      ? items.map((item) => (item.id === editingId ? product : item))
      : [product, ...items];

    writeMenu(next);
    setItems(next);
    setNotice(editingId ? "✓ Блюдо успешно отредактировано!" : "✓ Новое блюдо добавлено в меню!");
    resetForm();

    setTimeout(() => setNotice(""), 4000);
  }

  function editProduct(item: Product) {
    setEditingId(item.id);
    setDraft({
      name: item.name,
      japaneseName: item.japaneseName || "",
      category: item.category,
      price: item.price.toString(),
      portion: item.portion,
      description: item.description,
      image: item.image,
      isSpicy: item.isSpicy ?? false,
      isPopular: item.isPopular ?? false,
      isVegetarian: item.isVegetarian ?? false,
    });
    setNotice("");
    window.scrollTo({ top: 180, behavior: "smooth" });
  }

  function changeAvailability(item: Product) {
    const next = items.map((product) =>
      product.id === item.id
        ? { ...product, available: product.available === false }
        : product,
    );
    writeMenu(next);
    setItems(next);
    setNotice(
      item.available === false
        ? `✓ Блюдо «${item.name}» снова в наличии и доступно для заказа.`
        : `✓ Блюдо «${item.name}» поставлено на стоп (скрыто из меню).`,
    );
    setTimeout(() => setNotice(""), 3500);
  }

  function deleteProduct(item: Product) {
    if (!window.confirm(`Вы действительно хотите удалить блюдо «${item.name}»?`)) return;
    const next = items.filter((product) => product.id !== item.id);
    writeMenu(next);
    setItems(next);
    setNotice(`✓ Блюдо «${item.name}» удалено из меню.`);
    if (editingId === item.id) resetForm();
    setTimeout(() => setNotice(""), 3500);
  }

  function handleResetAll() {
    if (
      window.confirm(
        "Восстановить меню по умолчанию на русском языке? Все добавленные и отредактированные блюда будут сброшены.",
      )
    ) {
      resetMenuToDefault();
      setItems(initialMenu);
      setNotice("✓ Меню полностью сброшено до исходного заводского состояния (на русском языке).");
      resetForm();
      setTimeout(() => setNotice(""), 4000);
    }
  }

  function clearOrdersHistory() {
    if (window.confirm("Очистить сохраненную историю заказов?")) {
      localStorage.removeItem(ORDER_HISTORY_KEY);
      setOrders([]);
      setNotice("✓ История заказов успешно очищена.");
      setTimeout(() => setNotice(""), 3000);
    }
  }

  const filteredItems = items.filter((item) => {
    // Status filter
    if (statusFilter === "active" && item.available === false) return false;
    if (statusFilter === "stopped" && item.available !== false) return false;

    // Category filter
    if (adminCategory !== "Все" && item.category !== adminCategory) return false;

    // Search query
    if (adminSearch.trim()) {
      const q = adminSearch.trim().toLowerCase();
      const combined = `${item.name} ${item.description} ${item.category} ${item.japaneseName ?? ""}`.toLowerCase();
      if (!combined.includes(q)) return false;
    }

    return true;
  });

  if (!isAuthenticated) {
    return (
      <section className="section">
        <div className="container">
          <div className="admin-login-box">
            <span className="brand-mark large" aria-hidden="true">東</span>
            <span className="eyebrow">ПАНЕЛЬ УПРАВЛЕНИЯ · SUSHI TOKYO</span>
            <h2>Вход в панель администратора</h2>
            <p>Управление ценами, меню, позициями на стопе и заказами гостей.</p>

            <form onSubmit={handleLogin} className="admin-login-form">
              <label>
                PIN-код администратора
                <input
                  type="password"
                  placeholder="Введите PIN-код"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  autoFocus
                  required
                />
              </label>

              {pinError && (
                <p className="admin-pin-error">
                  Неверный PIN-код. (Стандартный код: 2026)
                </p>
              )}

              <button type="submit" className="button" style={{ width: "100%" }}>
                Войти в панель управления ↗
              </button>

              <button
                type="button"
                className="button secondary demo-pin-btn"
                onClick={() => {
                  setPinInput("2026");
                  setIsAuthenticated(true);
                  sessionStorage.setItem("sushi-admin-auth", "true");
                }}
              >
                Быстрый вход для тестирования (PIN: 2026)
              </button>

              <Link href="/" className="text-link" style={{ justifyContent: "center", marginTop: "8px" }}>
                ← Вернуться на главную страницу
              </Link>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section admin-page">
      <div className="container">
        <header className="page-hero admin-intro">
          <div className="admin-header-row">
            <div>
              <span className="eyebrow">ПАНЕЛЬ УПРАВЛЕНИЯ КУХНЕЙ</span>
              <h1>Администратор меню</h1>
              <p>Управляйте позициями в меню, редактируйте цены и контролируйте стоп-лист ресторана.</p>
            </div>
            <div className="admin-header-actions">
              <Link href="/menu" className="button secondary" target="_blank">
                Открыть меню на сайте ↗
              </Link>
              <button
                type="button"
                className="button secondary"
                onClick={handleResetAll}
                title="Сбросить все блюда к исходным"
              >
                Восстановить меню ↺
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={handleLogout}
              >
                Выйти 🚪
              </button>
            </div>
          </div>
        </header>

        {/* Admin Navigation Tabs */}
        <div className="admin-tabs" style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
          <button
            type="button"
            className={`button ${activeTab === "menu" ? "" : "secondary"}`}
            onClick={() => setActiveTab("menu")}
          >
            📋 Каталог блюд ({items.length})
          </button>
          <button
            type="button"
            className={`button ${activeTab === "orders" ? "" : "secondary"}`}
            onClick={() => setActiveTab("orders")}
          >
            📦 Заказы гостей ({orders.length})
          </button>
        </div>

        {/* Live Admin Statistics */}
        <div className="admin-stats">
          <div>
            <span>БЛЮД В НАЛИЧИИ</span>
            <strong>{activeCount}</strong>
          </div>
          <div>
            <span>НА СТОПЕ (СКРЫТЫ)</span>
            <strong style={{ color: stoppedCount > 0 ? "#dc2626" : "#64748b" }}>
              {stoppedCount}
            </strong>
          </div>
          <div>
            <span>КАТЕГОРИЙ В МЕНЮ</span>
            <strong>{productCategories.length}</strong>
          </div>
          <div>
            <span>СРЕДНИЙ ЧЕК БЛЮДА</span>
            <strong>{avgPrice} EGP</strong>
          </div>
        </div>

        {notice && (
          <div className="order-notice" role="status">
            {notice}
          </div>
        )}

        {/* TAB 1: MENU MANAGEMENT */}
        {activeTab === "menu" && (
          <div className="admin-layout">
            {/* Add / Edit Form */}
            <form className="admin-form" onSubmit={saveProduct}>
              <div className="admin-form-heading">
                <span className="checkout-kicker">
                  {editingId ? "01 / РЕДАКТИРОВАНИЕ" : "01 / НОВАЯ ПОЗИЦИЯ"}
                </span>
                <h2>{editingId ? "Редактировать блюдо" : "Добавить новое блюдо"}</h2>
              </div>

              <label>
                Название блюда (на русском)
                <input
                  value={draft.name}
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                  placeholder="Например, Сет «Сакура Премиум»"
                  required
                />
              </label>

              <label>
                Японское название (необязательно)
                <input
                  value={draft.japaneseName}
                  onChange={(event) =>
                    setDraft({ ...draft, japaneseName: event.target.value })
                  }
                  placeholder="Например, 桜プレミアム"
                />
              </label>

              <label>
                Категория меню
                <input
                  list="menu-categories-list"
                  value={draft.category}
                  onChange={(event) =>
                    setDraft({ ...draft, category: event.target.value })
                  }
                  placeholder="Выберите или введите категорию"
                  required
                />
                <datalist id="menu-categories-list">
                  {categories.filter((c) => c !== "Все").map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </label>

              <div className="admin-field-pair">
                <label>
                  Цена (EGP)
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={draft.price}
                    onChange={(event) =>
                      setDraft({ ...draft, price: event.target.value })
                    }
                    placeholder="220"
                    required
                  />
                </label>
                <label>
                  Порция и вес
                  <input
                    value={draft.portion}
                    onChange={(event) =>
                      setDraft({ ...draft, portion: event.target.value })
                    }
                    placeholder="8 шт. · 260г"
                    required
                  />
                </label>
              </div>

              <label>
                Состав и описание (на русском)
                <textarea
                  value={draft.description}
                  onChange={(event) =>
                    setDraft({ ...draft, description: event.target.value })
                  }
                  rows={3}
                  placeholder="Свежий лосось, сыр Филадельфия, хрустящий огурец, икра тобико..."
                  required
                />
              </label>

              <label>
                URL фотографии блюда
                <input
                  type="url"
                  value={draft.image}
                  onChange={(event) =>
                    setDraft({ ...draft, image: event.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                />
              </label>

              {/* Photo Preview in form */}
              {draft.image && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <img
                    src={draft.image}
                    alt="Предпросмотр"
                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                  />
                  <small style={{ color: "var(--text-muted)" }}>Предпросмотр фото блюда</small>
                </div>
              )}

              {/* Tags Checkboxes */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "4px 0" }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={draft.isSpicy}
                    onChange={(e) => setDraft({ ...draft, isSpicy: e.target.checked })}
                  />
                  <span>🌶️ Отметить как острое блюдо (Spicy)</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={draft.isPopular}
                    onChange={(e) => setDraft({ ...draft, isPopular: e.target.checked })}
                  />
                  <span>⭐ Отметить как хит продаж (Best Seller)</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={draft.isVegetarian}
                    onChange={(e) => setDraft({ ...draft, isVegetarian: e.target.checked })}
                  />
                  <span>🥑 Вегетарианское блюдо</span>
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button className="button" type="submit" style={{ flex: 1 }}>
                  {editingId ? "Сохранить изменения ↗" : "Добавить в меню ↗"}
                </button>
                {editingId && (
                  <button
                    className="button secondary"
                    type="button"
                    onClick={resetForm}
                  >
                    Отмена
                  </button>
                )}
              </div>

              <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>
                💡 Все изменения сохраняются мгновенно и сразу видны на сайте и в меню.
              </p>
            </form>

            {/* Catalog Overview List */}
            <div className="admin-products">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div>
                  <span className="checkout-kicker">02 / СПИСОК БЛЮД</span>
                  <h2>Каталог ({filteredItems.length})</h2>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="admin-search-bar">
                <input
                  type="search"
                  placeholder="Поиск по названию или ингредиентам..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="admin-search-input"
                />
                <select
                  value={adminCategory}
                  onChange={(e) => setAdminCategory(e.target.value)}
                  className="admin-cat-select"
                >
                  <option value="Все">Все категории</option>
                  {productCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Tabs */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <button
                  type="button"
                  className={`category-chip ${statusFilter === "all" ? "is-active" : ""}`}
                  onClick={() => setStatusFilter("all")}
                >
                  Все ({items.length})
                </button>
                <button
                  type="button"
                  className={`category-chip ${statusFilter === "active" ? "is-active" : ""}`}
                  onClick={() => setStatusFilter("active")}
                >
                  В наличии ({activeCount})
                </button>
                <button
                  type="button"
                  className={`category-chip ${statusFilter === "stopped" ? "is-active" : ""}`}
                  onClick={() => setStatusFilter("stopped")}
                >
                  На стопе ({stoppedCount})
                </button>
              </div>

              {/* Product List */}
              <div className="admin-product-list">
                {filteredItems.map((item) => (
                  <article
                    className={`admin-product ${item.available === false ? "is-hidden" : ""}`}
                    key={item.id}
                    style={{
                      opacity: item.available === false ? 0.6 : 1,
                      background: editingId === item.id ? "var(--red-soft)" : "transparent",
                      padding: "12px",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      className="admin-product-image"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                    <div className="admin-product-copy">
                      <span className="admin-item-tag">
                        {item.category} · <strong>{item.price} EGP</strong>
                        {item.isSpicy && " · 🌶️ Острое"}
                        {item.isPopular && " · ⭐ Хит"}
                        {item.available === false && (
                          <span className="admin-stopped-badge"> [НА СТОПЕ]</span>
                        )}
                      </span>
                      <h3>{item.name}</h3>
                      <p>
                        {item.portion} — {item.description}
                      </p>
                    </div>
                    <div className="admin-product-actions">
                      <button
                        type="button"
                        onClick={() => editProduct(item)}
                        title="Редактировать блюдо"
                      >
                        ✏️ Изменить
                      </button>
                      <button
                        type="button"
                        onClick={() => changeAvailability(item)}
                        title={item.available === false ? "Вернуть в меню" : "Поставить на стоп"}
                      >
                        {item.available === false ? "🟢 В меню" : "🛑 На стоп"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(item)}
                        style={{ color: "var(--red)" }}
                        title="Удалить блюдо"
                      >
                        🗑️
                      </button>
                    </div>
                  </article>
                ))}

                {filteredItems.length === 0 && (
                  <p style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                    По вашему запросу блюда не найдены.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS HISTORY VIEWER */}
        {activeTab === "orders" && (
          <div className="admin-products" style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <span className="checkout-kicker">ИСТОРИЯ ЗАКАЗОВ КЛИЕНТОВ</span>
                <h2>Поступившие заказы ({orders.length})</h2>
              </div>
              {orders.length > 0 && (
                <button
                  type="button"
                  className="button secondary"
                  onClick={clearOrdersHistory}
                >
                  Очистить журнал заказов
                </button>
              )}
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <span style={{ fontSize: "48px" }}>📦</span>
                <h3 style={{ margin: "10px 0" }}>Новых заказов пока нет</h3>
                <p style={{ color: "var(--text-muted)" }}>
                  Когда гости оформляют заказ на сайте и переходят в WhatsApp, заказ автоматически сохраняется здесь.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "14px",
                      padding: "20px",
                      background: "var(--bg)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <div>
                        <strong style={{ fontSize: "16px" }}>{ord.id}</strong>
                        <span style={{ marginLeft: "12px", color: "var(--text-muted)", fontSize: "13px" }}>
                          📅 {ord.date} · 📍 Филиал: {ord.branch}
                        </span>
                      </div>
                      <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--red)" }}>
                        {ord.total} EGP
                      </span>
                    </div>

                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                        СОСТАВ ЗАКАЗА:
                      </span>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                        {ord.items.map((it, idx) => (
                          <li key={idx} style={{ fontSize: "13px", display: "flex", justifyContent: "space-between" }}>
                            <span>{it.count} × {it.name}</span>
                            <strong>{it.price} EGP</strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
