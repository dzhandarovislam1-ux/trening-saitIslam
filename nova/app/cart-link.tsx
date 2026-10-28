"use client";

import { useEffect, useState } from "react";
import { readCart } from "./restaurant-store";

export default function CartLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () =>
      setCount(
        Object.values(readCart()).reduce(
          (total, quantity) => total + quantity,
          0,
        ),
      );

    updateCount();
    window.addEventListener("sushi-cart-updated", updateCount);
    window.addEventListener("storage", updateCount);
    return () => {
      window.removeEventListener("sushi-cart-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  return (
    <span
      className={`nav-cart ${count > 0 ? "has-items" : ""}`}
      aria-label={`Корзина: ${count} товаров`}
    >
      <span className="nav-cart-text">Заказ</span>
      <span className="nav-cart-badge">{count.toString().padStart(2, "0")}</span>
    </span>
  );
}
