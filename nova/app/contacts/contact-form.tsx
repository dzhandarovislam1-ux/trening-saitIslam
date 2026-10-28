"use client";

import { useState, type FormEvent } from "react";
import { restaurant } from "../../data/site";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const message = formData.get("message")?.toString() || "";

    const waText = [
      "Здравствуйте! Сообщение с сайта SUSHI TOKYO:",
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      `Вопрос: ${message}`,
    ].join("\n");

    window.open(
      `https://wa.me/${restaurant.branches[0].whatsapp}?text=${encodeURIComponent(waText)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  }

  return (
    <div className="contact-form-wrapper">
      <div className="contact-form-heading">
        <span className="checkout-kicker">ОБРАТНАЯ СВЯЗЬ</span>
        <h2>Напишите нам</h2>
        <p>Есть пожелание по качеству или хотите забронировать столик? Мы всегда на связи.</p>
      </div>

      {sent ? (
        <div className="order-notice success-notice">
          <h3>✓ Ваше сообщение сформировано в WhatsApp!</h3>
          <p>Менеджер службы заботы о гостях ответит в течение нескольких минут.</p>
          <button
            type="button"
            className="button secondary"
            onClick={() => setSent(false)}
          >
            Отправить еще одно сообщение
          </button>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Ваше имя
            <input name="name" placeholder="Как к вам обращаться" required />
          </label>
          <label>
            Номер телефона
            <input name="phone" type="tel" placeholder="+20 1X XXXX XXXX" required />
          </label>
          <label>
            Ваше сообщение или вопрос
            <textarea
              name="message"
              rows={4}
              placeholder="Вопрос по доставке, бронь столика, отзыв..."
              required
            />
          </label>
          <button type="submit" className="checkout-button">
            <span>Отправить в службу поддержки</span>
            <span>WhatsApp ↗</span>
          </button>
        </form>
      )}
    </div>
  );
}

