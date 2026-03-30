import { WHATSAPP_PHONE } from "./constants";

export function buildWhatsAppUrl(message) {
  const safeMessage = message?.trim() || "";
  const encodedMessage = encodeURIComponent(safeMessage);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodedMessage}`;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatDate(value) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}
