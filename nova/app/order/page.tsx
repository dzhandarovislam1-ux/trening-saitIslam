import type { Metadata } from "next";
import OrderClient from "./order-client";

export const metadata: Metadata = {
  title: "Оформление заказа",
  description: "Проверьте ваш заказ и отправьте его в SUSHI TOKYO через WhatsApp с доставкой по Каиру.",
};

export default function OrderPage() {
  return <OrderClient />;
}
