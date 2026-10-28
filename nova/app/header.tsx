"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CartLink from "./cart-link";
import { restaurant } from "../data/site";
import { openCartDrawer } from "./restaurant-store";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  const navItems = [
    { label: "Меню", href: "/menu" },
    { label: "Наша история", href: "/story" },
    { label: "Филиалы", href: "/locations" },
    { label: "Контакты", href: "/contacts" },
  ];

  return (
    <header className="site-header">
      <div className="container nav">
        <Link className="brand" href="/" aria-label="SUSHI TOKYO — главная страница">
          <span className="brand-mark" aria-hidden="true">東</span>
          <span>SUSHI TOKYO</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links desktop-nav" aria-label="Основная навигация">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? "is-active" : ""}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Mobile Trigger */}
        <div className="nav-actions">
          <button
            type="button"
            className="nav-cart-trigger"
            onClick={openCartDrawer}
            aria-label="Открыть корзину"
          >
            <CartLink />
          </button>

          <Link className="nav-cta" href="/menu">
            Заказать <span aria-hidden="true">↗</span>
          </Link>

          <button
            type="button"
            className={`hamburger-button ${mobileMenuOpen ? "is-open" : ""}`}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Portaled to Document Body */}
      {mounted &&
        mobileMenuOpen &&
        createPortal(
          <div
            className="mobile-menu-overlay"
            onClick={() => setMobileMenuOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Мобильное меню"
          >
            <div
              className="mobile-menu-drawer"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-menu-header">
                <div className="brand">
                  <span className="brand-mark" aria-hidden="true">
                    東
                  </span>
                  <span>SUSHI TOKYO</span>
                </div>
                <button
                  type="button"
                  className="cart-drawer-close"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Закрыть меню"
                >
                  ×
                </button>
              </div>

              <nav className="mobile-menu-links">
                <Link
                  href="/"
                  className={pathname === "/" ? "is-active" : ""}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Главная
                </Link>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={isActive ? "is-active" : ""}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  href="/order"
                  className={pathname === "/order" ? "is-active" : ""}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Оформление заказа
                </Link>
                <Link
                  href="/admin"
                  className={pathname === "/admin" ? "is-active" : ""}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Панель администратора
                </Link>
              </nav>

              <div className="mobile-menu-footer">
                <div className="mobile-menu-branches">
                  <span>НАШИ ФИЛИАЛЫ В КАИРЕ:</span>
                  {restaurant.branches.map((b) => (
                    <a
                      key={b.name}
                      href={`tel:${b.phone}`}
                      className="mobile-menu-tel"
                    >
                      📞 {b.name}: {b.phone}
                    </a>
                  ))}
                </div>
                <div className="mobile-menu-hours">
                  🕒 {restaurant.workingHours}
                </div>
                <button
                  type="button"
                  className="checkout-button mobile-menu-cart-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCartDrawer();
                  }}
                >
                  Посмотреть корзину ↗
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}

