"use client";

import { useEffect, useState } from "react";
import { initialMenu, type Product } from "../data/site";
import { openCartDrawer, readCart, readMenu } from "./restaurant-store";

export default function FloatingCart() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [menu, setMenu] = useState<Product[]>(initialMenu);

  useEffect(() => {
    const update = () => {
      setCart(readCart());
      setMenu(readMenu());
    };
    update();
    window.addEventListener("sushi-cart-updated", update);
    window.addEventListener("sushi-menu-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("sushi-cart-updated", update);
      window.removeEventListener("sushi-menu-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const totalCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  if (totalCount === 0) return null;

  const totalAmount = menu.reduce(
    (sum, item) => sum + item.price * (cart[item.id] ?? 0),
    0,
  );

  return (
    <aside className="floating-cart-bar" aria-label="Быстрый доступ к корзине">
      <button
        type="button"
        className="floating-cart-pill"
        onClick={openCartDrawer}
      >
        <span className="floating-cart-badge">{totalCount}</span>
        <span className="floating-cart-title">Ваш заказ</span>
        <span className="floating-cart-total">{totalAmount} EGP ↗</span>
      </button>
    </aside>
  );
}

