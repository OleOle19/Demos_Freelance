import { trackEvent } from "../api";
import { DEFAULT_WHATSAPP_MESSAGE } from "../constants";
import { buildWhatsAppUrl } from "../utils";

export function WhatsAppButton({
  source,
  className = "button button-primary",
  label = "Escribir por WhatsApp",
  message = DEFAULT_WHATSAPP_MESSAGE
}) {
  const url = buildWhatsAppUrl(message);

  const onClick = () => {
    trackEvent("click_whatsapp", source).catch(() => {
      // Non-critical tracking.
    });
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={onClick}
    >
      {label}
    </a>
  );
}
