import type { Metadata } from "next";
import AdminClient from "./admin-client";

export const metadata: Metadata = {
  title: "Панель администратора",
  description: "Управление меню, ценами, блюдами на стопе и заказами SUSHI TOKYO в Каире.",
};

export default function AdminPage() {
  return <AdminClient />;
}
