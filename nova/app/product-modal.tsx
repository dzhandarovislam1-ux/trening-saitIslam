"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { type Product } from "../data/site";
import { changeCartItem, readCart } from "./restaurant-store";

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      const cart = readCart();
      setCartCount(cart[product.id] ?? 0);
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [product, onClose]);

  if (!product || !mounted) return null;

  function handleAddToCart() {
    if (!product) return;
    changeCartItem(product.id, quantity, true);
    onClose();
  }

  return createPortal(
    <div
      className="product-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      <div
        className="product-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="product-modal-close"
          onClick={onClose}
          aria-label="Закрыть окно блюда"
        >
          ×
        </button>

        <div
          className="product-modal-image"
          style={{ backgroundImage: `url('${product.image}')` }}
          role="img"
          aria-label={product.name}
        >
          <span className="product-modal-badge">{product.category}</span>
          {product.isSpicy && (
            <span className="product-modal-badge spicy">🌶️ Острое</span>
          )}
          {product.isVegetarian && (
            <span className="product-modal-badge veg">🥑 Вегетарианское</span>
          )}
        </div>

        <div className="product-modal-content">
          <div className="product-modal-header">
            <span className="product-modal-kicker">
              {product.japaneseName ?? "SUSHI TOKYO · ТРАДИЦИИ"}
            </span>
            <h2 id="modal-product-title">{product.name}</h2>
            <div className="product-modal-price-row">
              <span className="product-modal-price">
                {product.price} <small>EGP</small>
              </span>
              <span className="product-modal-portion">{product.portion}</span>
            </div>
          </div>

          <p className="product-modal-description">{product.description}</p>

          <div className="product-modal-details-grid">
            <div className="product-modal-detail">
              <span>Категория</span>
              <strong>{product.category}</strong>
            </div>
            <div className="product-modal-detail">
              <span>Калории</span>
              <strong>~{product.calories ?? 320} ккал</strong>
            </div>
            <div className="product-modal-detail full-width">
              <span>Аллергены и состав</span>
              <p>
                {product.allergens && product.allergens.length > 0
                  ? product.allergens.join(", ")
                  : "Рис, нори, сливочный сыр, морепродукты"}
              </p>
            </div>
          </div>

          <div className="product-modal-actions">
            <div className="product-modal-stepper" aria-label="Количество">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Уменьшить количество"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Увеличить количество"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="checkout-button product-modal-add"
              onClick={handleAddToCart}
            >
              <span>
                {cartCount > 0 ? "Добавить еще в заказ" : "Добавить в заказ"}
              </span>
              <span>{product.price * quantity} EGP +</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

