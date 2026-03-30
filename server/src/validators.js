const ALLOWED_RUBROS = new Set(["retail", "restaurante", "otro"]);
const ALLOWED_EVENTS = new Set([
  "visit",
  "click_whatsapp",
  "lead_submit",
  "cta_click",
  "demo_action"
]);

function sanitizeText(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

export function validateLeadInput(payload) {
  const nombre = sanitizeText(payload?.nombre, 80);
  const negocio = sanitizeText(payload?.negocio, 120);
  const rubro = sanitizeText(payload?.rubro, 30).toLowerCase();
  const ciudad = sanitizeText(payload?.ciudad, 80);
  const telefono = sanitizeText(payload?.telefono, 30);
  const mensaje = sanitizeText(payload?.mensaje, 350);
  const origen = sanitizeText(payload?.origen, 40).toLowerCase();
  const createdAt = sanitizeText(payload?.createdAt, 50);

  if (!nombre || !negocio || !ciudad || !telefono || !origen) {
    return {
      ok: false,
      error:
        "Campos requeridos faltantes: nombre, negocio, ciudad, telefono, origen"
    };
  }

  if (!ALLOWED_RUBROS.has(rubro)) {
    return {
      ok: false,
      error: "Rubro invalido. Usa retail, restaurante u otro."
    };
  }

  return {
    ok: true,
    lead: {
      nombre,
      negocio,
      rubro,
      ciudad,
      telefono,
      mensaje,
      origen,
      createdAt: createdAt || new Date().toISOString()
    }
  };
}

export function validateEventInput(payload) {
  const event = sanitizeText(payload?.event, 40).toLowerCase();
  const source = sanitizeText(payload?.source, 40).toLowerCase();
  const timestamp = sanitizeText(payload?.timestamp, 50);

  if (!event || !source) {
    return {
      ok: false,
      error: "Campos requeridos faltantes: event, source"
    };
  }

  if (!ALLOWED_EVENTS.has(event)) {
    return {
      ok: false,
      error: `Evento invalido: ${event}`
    };
  }

  return {
    ok: true,
    event: {
      event,
      source,
      timestamp: timestamp || new Date().toISOString()
    }
  };
}
