import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Header from "./header";
import CartDrawer from "./cart-drawer";
import FloatingCart from "./floating-cart";
import ScrollReveal from "./scroll-reveal";
import { restaurant } from "../data/site";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0d13",
};

export const metadata: Metadata = {
  title: {
    default: "SUSHI TOKYO — Японский ресторан и доставка в Каире",
    template: "%s | SUSHI TOKYO",
  },
  description:
    "Свежие суши, авторские роллы, хрустящая темпура и горячая лапша в Каире. Филиалы в Наср-Сити и Замалеке. Быстрая доставка и заказ через WhatsApp.",
  keywords: [
    "sushi tokyo",
    "sushi cairo",
    "суши каир",
    "доставка суши каир",
    "zamalek sushi",
    "nasr city sushi",
    "роллы каир",
    "японская кухня каир",
  ],
  authors: [{ name: "SUSHI TOKYO" }],
  openGraph: {
    title: "SUSHI TOKYO — Tokyo, served with care in Cairo",
    description:
      "Премиальные японские роллы и сеты со свежайшей рыбой в Каире. Заказывайте в Замалеке и Наср-Сити.",
    url: "https://sushitokyo.eg",
    siteName: "SUSHI TOKYO",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: restaurant.name,
              image:
                "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=820&q=85",
              servesCuisine: "Japanese",
              priceRange: "$$",
              openingHours: "Mo-Su 12:00-02:00",
              telephone: restaurant.branches[0].phone,
              address: {
                "@type": "PostalAddress",
                streetAddress: restaurant.branches[0].address,
                addressLocality: "Cairo",
                addressCountry: "EG",
              },
            }),
          }}
        />
      </head>
      <body>
        <div className="slate-backdrop" aria-hidden="true" />
        <div className="slate-grain-overlay" aria-hidden="true" />
        <ScrollReveal />
        <div className="site-shell">
          <Header />

          <main id="main-content">{children}</main>

          <footer className="site-footer">
            <div className="container footer-inner">
              <div className="footer-brand-col">
                <div className="footer-brand">
                  <span className="brand-mark" aria-hidden="true">東</span>
                  <span>{currentYear} · SUSHI TOKYO (寿司東京)</span>
                </div>
                <p className="footer-tagline">
                  {restaurant.tagline} · Каир, Наср-Сити & Замалек
                </p>
                <div className="footer-branch-phones">
                  <a href={`tel:${restaurant.branches[0].phone}`}>
                    📞 Nasr City: {restaurant.branches[0].phone}
                  </a>
                  <a href={`tel:${restaurant.branches[1].phone}`}>
                    📞 Zamalek: {restaurant.branches[1].phone}
                  </a>
                </div>
              </div>

              <div className="footer-nav-col">
                <span className="footer-heading">НАВИГАЦИЯ</span>
                <div className="footer-links">
                  <Link href="/menu">Меню</Link>
                  <Link href="/story">Наша история</Link>
                  <Link href="/locations">Филиалы</Link>
                  <Link href="/contacts">Контакты</Link>
                  <Link href="/order">Оформить заказ</Link>
                  <Link href="/admin">Управление меню</Link>
                </div>
              </div>

              <div className="footer-social-col">
                <span className="footer-heading">СОЦСЕТИ</span>
                <div className="footer-links">
                  <a href={restaurant.instagram} target="_blank" rel="noreferrer">
                    Instagram ↗
                  </a>
                  <a href={restaurant.facebook} target="_blank" rel="noreferrer">
                    Facebook ↗
                  </a>
                  <a
                    href={`https://wa.me/${restaurant.branches[0].whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp 💬
                  </a>
                </div>
              </div>
            </div>
          </footer>

          {/* Interactive Global Cart Drawer & Floating Mobile Cart */}
          <CartDrawer />
          <FloatingCart />
        </div>
      </body>
    </html>
  );
}
