"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { initialMenu, type Product } from "../data/site";
import ProductModal from "./product-modal";
import { changeCartItem, readCart, readMenu } from "./restaurant-store";

export default function HomeFavourites() {
  const [items, setItems] = useState<Product[]>(initialMenu);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    const updateMenu = () => setItems(readMenu());
    const updateCart = () => setCart(readCart());
    updateMenu();
    updateCart();
    window.addEventListener("sushi-menu-updated", updateMenu);
    window.addEventListener("sushi-cart-updated", updateCart);
    window.addEventListener("storage", () => {
      updateMenu();
      updateCart();
    });
    return () => {
      window.removeEventListener("sushi-menu-updated", updateMenu);
      window.removeEventListener("sushi-cart-updated", updateCart);
    };
  }, []);

  const featured = items.filter((i) => i.available !== false).slice(0, 4);

  return (
    <>
      <div className="menu-grid featured-grid">
        {featured.map((item, index) => (
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
              <span className="menu-card-number">0{index + 1}</span>
              <span className="menu-card-category">{item.category}</span>
              {item.isSpicy && (
                <span className="card-mini-tag spicy">🌶️ Острое</span>
              )}
            </div>
            <div className="menu-card-content">
              <div className="menu-card-title-row">
                <h3>{item.name}</h3>
                <span>{item.price} EGP</span>
              </div>
              <p>{item.description}</p>
              <div className="menu-card-bottom">
                <span className="portion">{item.portion}</span>
                <button
                  className="add-button"
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
                  {cart[item.id] ? `В корзине (${cart[item.id]}) +` : "В корзину +"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}

