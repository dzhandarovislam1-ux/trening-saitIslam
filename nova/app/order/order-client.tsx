"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { deliveryZones, initialMenu, restaurant, type Product } from "../../data/site";
import { changeCartItem, clearCart, readCart, readMenu, writeCart } from "../restaurant-store";

type PaymentMethod = "Cash" | "Card" | "InstaPay";

type SavedOrder = {
  id: string;
  date: string;
  items: { name: string; count: number; price: number }[];
  total: number;
  branch: string;
};

const ORDER_HISTORY_KEY = "sushi-tokyo-order-history";

export default function OrderClient() {
  const [items, setItems] = useState<Product[]>(initialMenu);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [branchIndex, setBranchIndex] = useState(0);
  const [fulfilment, setFulfilment] = useState<"Delivery" | "Pickup">("Delivery");
  const [selectedZone, setSelectedZone] = useState<string>(deliveryZones[0].name);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [cutleryCount, setCutleryCount] = useState<number>(2);
  const [chopstickTrainers, setChopstickTrainers] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [lastOrder, setLastOrder] = useState<SavedOrder | null>(null);

  useEffect(() => {
    const update = () => {
      setItems(readMenu());
      setCart(readCart());
    };
    update();

    // Read last order from history
    try {
      const historyStr = localStorage.getItem(ORDER_HISTORY_KEY);
      if (historyStr) {
        const history: SavedOrder[] = JSON.parse(historyStr);
        if (history.length > 0) setLastOrder(history[0]);
      }
    } catch {}

    window.addEventListener("sushi-menu-updated", update);
    window.addEventListener("sushi-cart-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("sushi-menu-updated", update);
      window.removeEventListener("sushi-cart-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const lines = items.filter(
    (item) => (cart[item.id] ?? 0) > 0 && item.available !== false,
  );

  const subtotal = lines.reduce(
    (sum, item) => sum + item.price * cart[item.id],
    0,
  );

  const activeZoneObj = deliveryZones.find((z) => z.name === selectedZone);
  const deliveryFee = fulfilment === "Delivery" ? (activeZoneObj?.fee ?? 35) : 0;
  const grandTotal = subtotal + deliveryFee;

  function handleReorder(saved: SavedOrder) {
    const nextCart: Record<string, number> = {};
    saved.items.forEach((savedItem) => {
      const found = items.find((i) => i.name === savedItem.name);
      if (found) nextCart[found.id] = savedItem.count;
    });
    writeCart(nextCart);
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lines.length === 0) return;

    const formData = new FormData(event.currentTarget);
    const branch = restaurant.branches[branchIndex];
    const customerName = formData.get("name")?.toString() || "";
    const customerPhone = formData.get("phone")?.toString() || "";
    const address = fulfilment === "Delivery" ? formData.get("address")?.toString() || "" : "";
    const note = formData.get("note")?.toString() || "";

    const orderLinesText = lines
      .map(
        (item) =>
          `${cart[item.id]} × ${item.name} (${item.portion}) — ${item.price * cart[item.id]} EGP`,
      )
      .join("\n");

    const orderSummary: SavedOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      }),
      items: lines.map((item) => ({
        name: item.name,
        count: cart[item.id],
        price: item.price * cart[item.id],
      })),
      total: grandTotal,
      branch: branch.name,
    };

    // Save order in history
    try {
      const historyStr = localStorage.getItem(ORDER_HISTORY_KEY);
      const history: SavedOrder[] = historyStr ? JSON.parse(historyStr) : [];
      localStorage.setItem(
        ORDER_HISTORY_KEY,
        JSON.stringify([orderSummary, ...history].slice(0, 5)),
      );
      setLastOrder(orderSummary);
    } catch {}

    const message = [
      `🍣 *НОВЫЙ ЗАКАЗ В SUSHI TOKYO* (${orderSummary.id})`,
      "━━━━━━━━━━━━━━━━━━━",
      orderLinesText,
      "━━━━━━━━━━━━━━━━━━━",
      `Блюда: ${subtotal} EGP`,
      fulfilment === "Delivery"
        ? `Доставка (${selectedZone}): ${deliveryFee} EGP`
        : "Самовывоз: 0 EGP",
      `*ИТОГО К ОПЛАТЕ: ${grandTotal} EGP*`,
      "",
      `📍 Филиал: ${branch.name}`,
      `📦 Тип: ${fulfilment === "Delivery" ? "Доставка до двери" : "Самовывоз из ресторана"}`,
      `💳 Оплата: ${paymentMethod === "Cash" ? "Наличными" : paymentMethod === "Card" ? "Картой курьеру" : "InstaPay"}`,
      `🥢 Приборы: на ${cutleryCount} персон${chopstickTrainers ? " (с учебными фиксаторами)" : ""}`,
      `👤 Имя: ${customerName}`,
      `📞 Телефон: ${customerPhone}`,
      address ? `🏠 Адрес: ${address}` : "",
      note ? `📝 Пожелания к заказу: ${note}` : "",
      "━━━━━━━━━━━━━━━━━━━",
      "Пожалуйста, подтвердите прием заказа и ориентировочное время!",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSubmitted(true);
  }

  return (
    <section className="section order-page">
      <div className="container">
        <header className="page-hero menu-intro">
          <div className="eyebrow">ОФОРМЛЕНИЕ ЗАКАЗА</div>
          <h1>Ваш заказ.</h1>
          <p>
            Проверьте выбранные блюда, укажите филиал и удобный способ получения. Заказ сразу поступает на кухню через WhatsApp.
          </p>
        </header>

        {submitted && (
          <div className="order-notice success-notice" role="status">
            <h3>✓ Ваш заказ сформирован и открыт в WhatsApp!</h3>
            <p>
              Отправьте сформированное сообщение менеджеру филиала для финального подтверждения и запуска приготовления.
            </p>
            <div className="order-notice-buttons">
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  clearCart();
                  setSubmitted(false);
                }}
              >
                Очистить корзину после отправки
              </button>
              <Link href="/menu" className="button">
                Вернуться в меню ↗
              </Link>
            </div>
          </div>
        )}

        {lines.length === 0 ? (
          <div className="empty-cart">
            <span aria-hidden="true">食</span>
            <h2>Ваша корзина пуста</h2>
            <p>Выберите любимые роллы, горячие сеты или лапшу из нашего меню.</p>
            <div className="empty-cart-buttons">
              <Link className="button" href="/menu">
                Открыть меню ↗
              </Link>
              {lastOrder && (
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => handleReorder(lastOrder)}
                >
                  Повторить прошлый заказ ({lastOrder.total} EGP) ↺
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="checkout-layout">
            {/* Cart Lines Column */}
            <div className="cart-lines">
              <div className="cart-lines-header">
                <h2>Позиции в заказе ({lines.length})</h2>
                <button
                  type="button"
                  className="cart-clear-all"
                  onClick={() => {
                    if (window.confirm("Очистить все позиции из корзины?")) {
                      clearCart();
                    }
                  }}
                >
                  Очистить всё
                </button>
              </div>

              {lines.map((item) => (
                <article className="cart-line" key={item.id}>
                  <div
                    className="cart-line-image"
                    style={{ backgroundImage: `url('${item.image}')` }}
                    role="img"
                    aria-label={item.name}
                  />
                  <div className="cart-line-details">
                    <span className="menu-card-category">{item.category}</span>
                    <h3>{item.name}</h3>
                    <p>{item.portion}</p>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => changeCartItem(item.id, -cart[item.id])}
                    >
                      Удалить
                    </button>
                  </div>
                  <div
                    className="quantity-stepper"
                    aria-label={`Количество ${item.name}`}
                  >
                    <button
                      type="button"
                      onClick={() => changeCartItem(item.id, -1)}
                      aria-label={`Уменьшить ${item.name}`}
                    >
                      −
                    </button>
                    <span>{cart[item.id]}</span>
                    <button
                      type="button"
                      onClick={() => changeCartItem(item.id, 1)}
                      aria-label={`Увеличить ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <span className="cart-line-price">
                    {item.price * cart[item.id]} EGP
                  </span>
                </article>
              ))}

              <div className="cart-continue-row">
                <Link className="text-link continue-shopping" href="/menu">
                  ← Добавить еще блюда из меню
                </Link>
              </div>
            </div>

            {/* Checkout Form Column */}
            <form className="checkout-form" onSubmit={submitOrder}>
              <div className="checkout-kicker">01 / ПАРАМЕТРЫ ЗАКАЗА</div>

              {/* Branch Selector */}
              <label>
                Филиал приготовления
                <select
                  value={branchIndex}
                  onChange={(event) =>
                    setBranchIndex(Number(event.target.value))
                  }
                >
                  {restaurant.branches.map((branch, index) => (
                    <option key={branch.name} value={index}>
                      {branch.name} ({branch.neighborhood})
                    </option>
                  ))}
                </select>
              </label>

              {/* Fulfilment Method */}
              <fieldset className="fulfilment-select">
                <legend>Способ получения</legend>
                <label className={fulfilment === "Delivery" ? "is-selected" : ""}>
                  <input
                    type="radio"
                    name="fulfilment"
                    value="Delivery"
                    checked={fulfilment === "Delivery"}
                    onChange={() => setFulfilment("Delivery")}
                  />
                  🚀 Доставка
                </label>
                <label className={fulfilment === "Pickup" ? "is-selected" : ""}>
                  <input
                    type="radio"
                    name="fulfilment"
                    value="Pickup"
                    checked={fulfilment === "Pickup"}
                    onChange={() => setFulfilment("Pickup")}
                  />
                  🛍️ Самовывоз
                </label>
              </fieldset>

              {/* Delivery Zone Selector */}
              {fulfilment === "Delivery" && (
                <label>
                  Район доставки в Каире
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                  >
                    {deliveryZones.map((z) => (
                      <option key={z.name} value={z.name}>
                        {z.name} — {z.fee} EGP ({z.time})
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {/* Payment Method */}
              <div className="payment-select-group">
                <span className="field-group-title">Способ оплаты</span>
                <div className="payment-radios">
                  <label className={paymentMethod === "Cash" ? "is-selected" : ""}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "Cash"}
                      onChange={() => setPaymentMethod("Cash")}
                    />
                    💵 Наличными
                  </label>
                  <label className={paymentMethod === "Card" ? "is-selected" : ""}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "Card"}
                      onChange={() => setPaymentMethod("Card")}
                    />
                    💳 Картой
                  </label>
                  <label className={paymentMethod === "InstaPay" ? "is-selected" : ""}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "InstaPay"}
                      onChange={() => setPaymentMethod("InstaPay")}
                    />
                    📱 InstaPay
                  </label>
                </div>
              </div>

              {/* Cutlery Count */}
              <div className="cutlery-row">
                <label>
                  Приборы (персоны)
                  <select
                    value={cutleryCount}
                    onChange={(e) => setCutleryCount(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "персона" : n < 5 ? "персоны" : "персон"} (палочки, соусники)
                      </option>
                    ))}
                  </select>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={chopstickTrainers}
                    onChange={(e) => setChopstickTrainers(e.target.checked)}
                  />
                  <span>Учебные фиксаторы для палочек</span>
                </label>
              </div>

              <div className="checkout-kicker">02 / КОНТАКТНЫЕ ДАННЫЕ</div>

              <label>
                Ваше имя
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="Например, Ахмед / Мария"
                  required
                />
              </label>

              <label>
                Номер телефона
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+20 1X XXXX XXXX"
                  required
                />
              </label>

              {fulfilment === "Delivery" && (
                <label>
                  Точный адрес доставки
                  <input
                    name="address"
                    autoComplete="street-address"
                    placeholder="Улица, дом, подъезд, этаж, квартира"
                    required
                  />
                </label>
              )}

              <label>
                Комментарий к заказу (пожелания, аллергены)
                <textarea
                  name="note"
                  placeholder="Дополнительный васаби, не класть лук, код домофона..."
                  rows={2}
                />
              </label>

              {/* Price Breakdown */}
              <div className="order-breakdown">
                <div className="breakdown-row">
                  <span>Сумма блюд:</span>
                  <span>{subtotal} EGP</span>
                </div>
                {fulfilment === "Delivery" && (
                  <div className="breakdown-row">
                    <span>
                      Доставка ({selectedZone}):
                      <small className="breakdown-time"> ~{activeZoneObj?.time}</small>
                    </span>
                    <span>{deliveryFee} EGP</span>
                  </div>
                )}
                <div className="order-total-row">
                  <span>
                    Итого к оплате
                    <small>Финальное подтверждение в WhatsApp</small>
                  </span>
                  <strong>{grandTotal} EGP</strong>
                </div>
              </div>

              <button className="checkout-button" type="submit">
                <span>Подтвердить в WhatsApp</span>
                <span>{grandTotal} EGP ↗</span>
              </button>

              <p className="checkout-note">
                Менеджер филиала {restaurant.branches[branchIndex].name} свяжется с вами в течение 2 минут в WhatsApp.
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
