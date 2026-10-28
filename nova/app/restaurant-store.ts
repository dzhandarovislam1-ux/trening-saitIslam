import { initialMenu, type Product } from "../data/site";

const MENU_KEY = "sushi-tokyo-menu-v2";
const CART_KEY = "sushi-tokyo-cart-v1";

export type Cart = Record<string, number>;

export function readMenu(): Product[] {
  try {
    const saved = localStorage.getItem(MENU_KEY);
    return saved ? (JSON.parse(saved) as Product[]) : initialMenu;
  } catch {
    return initialMenu;
  }
}

export function writeMenu(menu: Product[]) {
  localStorage.setItem(MENU_KEY, JSON.stringify(menu));
  window.dispatchEvent(new Event("sushi-menu-updated"));
}

export function readCart(): Cart {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? (JSON.parse(saved) as Cart) : {};
  } catch {
    return {};
  }
}

export function writeCart(cart: Cart) {
  const cleanCart = Object.fromEntries(
    Object.entries(cart).filter(([, quantity]) => quantity > 0),
  );
  localStorage.setItem(CART_KEY, JSON.stringify(cleanCart));
  window.dispatchEvent(new Event("sushi-cart-updated"));
}

export function changeCartItem(id: string, change: number, openDrawer = false) {
  const cart = readCart();
  const nextCount = (cart[id] ?? 0) + change;
  writeCart({ ...cart, [id]: nextCount });
  if (openDrawer && nextCount > 0) {
    openCartDrawer();
  }
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("sushi-cart-updated"));
}

export function resetMenuToDefault() {
  localStorage.removeItem(MENU_KEY);
  window.dispatchEvent(new Event("sushi-menu-updated"));
}

export function openCartDrawer() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("sushi-cart-drawer", { detail: { open: true } }));
  }
}

export function closeCartDrawer() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("sushi-cart-drawer", { detail: { open: false } }));
  }
}

export function toggleCartDrawer() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("sushi-cart-drawer", { detail: { toggle: true } }));
  }
}
