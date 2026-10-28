"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { initialMenu, restaurant, type Product } from "../data/site";
import {
  changeCartItem,
  clearCart,
  closeCartDrawer,
  readCart,
  readMenu,
} from "./restaurant-store";

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<Product[]>(initialMenu);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateMenuAndCart = () => {
      setItems(readMenu());
      setCart(readCart());
    };

    const handleDrawerEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ open?: boolean; toggle?: boolean }>;
      if (customEvent.detail?.toggle) {
        setIsOpen((prev) => !prev);
      } else if (typeof customEvent.detail?.open === "boolean") {
        setIsOpen(customEvent.detail.open);
      }
    };

    updateMenuAndCart();

    window.addEventListener("sushi-cart-drawer", handleDrawerEvent);
    window.addEventListener("sushi-cart-updated", updateMenuAndCart);
    window.addEventListener("sushi-menu-updated", updateMenuAndCart);
    window.addEventListener("storage", updateMenuAndCart);

    return () => {
      window.removeEventListener("sushi-cart-drawer", handleDrawerEvent);
      window.removeEventListener("sushi-cart-updated", updateMenuAndCart);
      window.removeEventListener("sushi-menu-updated", updateMenuAndCart);
      window.removeEventListener("storage", updateMenuAndCart);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const activeLines = items.filter(
    (item) => (cart[item.id] ?? 0) > 0 && item.available !== false,
  );
  const totalCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const subtotal = activeLines.reduce(
    (sum, item) => sum + item.price * (cart[item.id] ?? 0),
    0,
  );

  function quickWhatsAppOrder() {
    if (activeLines.length === 0) return;
    const branch = restaurant.branches[0];
    const orderLines = activeLines
      .map((item) => `${cart[item.id]} × ${item.name} — ${item.price * cart[item.id]} EGP`)
      .join("\n");
    const message = [
      "Здравствуйте, SUSHI TOKYO! Хочу оформить быстрый заказ:",
      "",
      orderLines,
      "",
      `Сумма: ${subtotal} EGP`,
      `Филиал: ${branch.name}`,
    ].join("\n");

    window.open(
      `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="cart-drawer-overlay" onClick={closeCartDrawer} role="dialog" aria-modal="true" aria-label="Корзина заказа">
      <div
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="cart-drawer-header">
          <div>
            <span className="cart-drawer-kicker">SUSHI TOKYO · BAG</span>
            <h2>Ваш заказ ({totalCount})</h2>
          </div>
          <button
            type="button"
            className="cart-drawer-close"
            onClick={closeCartDrawer}
            aria-label="Закрыть корзину"
          >
            ×
          </button>
        </header>

        <div className="cart-drawer-body">
          {activeLines.length === 0 ? (
            <div className="cart-drawer-empty">
              <span className="cart-drawer-empty-mark" aria-hidden="true">東</span>
              <h3>Корзина пока пуста</h3>
              <p>Добавьте фирменные сеты, авторские роллы или темпуру из нашего меню.</p>
              <Link
                href="/menu"
                className="button"
                onClick={closeCartDrawer}
              >
                Открыть меню ↗
              </Link>
            </div>
          ) : (
            <div className="cart-drawer-items">
              {activeLines.map((item) => (
                <article key={item.id} className="cart-drawer-item">
                  <div
                    className="cart-drawer-item-img"
                    style={{ backgroundImage: `url('${item.image}')` }}
                    role="img"
                    aria-label={item.name}
                  />
                  <div className="cart-drawer-item-info">
                    <span className="cart-drawer-item-cat">{item.category}</span>
                    <h4>{item.name}</h4>
                    <span className="cart-drawer-item-portion">{item.portion}</span>
                    <div className="cart-drawer-item-bottom">
                      <div className="quantity-stepper">
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
                      <span className="cart-drawer-item-price">
                        {item.price * cart[item.id]} EGP
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {activeLines.length > 0 && (
          <footer className="cart-drawer-footer">
            <div className="cart-drawer-summary">
              <div className="cart-drawer-subtotal">
                <span>Итого блюд:</span>
                <strong>{subtotal} EGP</strong>
              </div>
              <small className="cart-drawer-note">
                Доставка рассчитывается от района (30-55 EGP)
              </small>
            </div>

            <div className="cart-drawer-actions">
              <Link
                href="/order"
                className="checkout-button cart-drawer-checkout"
                onClick={closeCartDrawer}
              >
                <span>Перейти к оформлению</span>
                <span>{subtotal} EGP ↗</span>
              </Link>

              <button
                type="button"
                className="button secondary cart-drawer-wa"
                onClick={quickWhatsAppOrder}
              >
                Быстрый заказ в WhatsApp 💬
              </button>

              <button
                type="button"
                className="cart-drawer-clear-btn"
                onClick={() => {
                  if (window.confirm("Очистить все товары из корзины?")) {
                    clearCart();
                  }
                }}
              >
                Очистить корзину
              </button>
            </div>
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}

