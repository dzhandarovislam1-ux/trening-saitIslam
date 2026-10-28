import type { Metadata } from "next";
import MenuClient from "./menu-client";

export const metadata: Metadata = {
  title: "Меню ресторана",
  description:
    "Полное меню SUSHI TOKYO в Каире: сеты, классические и горячие роллы, темпура, вок, нигири. Быстрая доставка по Замалеку и Наср-Сити.",
};

export default function MenuPage() {
  return <MenuClient />;
}
