const API_BASE = import.meta.env.VITE_API_BASE || "";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = data?.error || "No se pudo completar la solicitud.";
    throw new Error(error);
  }
  return data;
}

async function sendRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });
  return parseResponse(response);
}

export async function postLead(leadInput) {
  return sendRequest("/api/leads", {
    method: "POST",
    body: JSON.stringify({
      ...leadInput,
      createdAt: new Date().toISOString()
    })
  });
}

export async function trackEvent(event, source) {
  return sendRequest("/api/events", {
    method: "POST",
    body: JSON.stringify({
      event,
      source,
      timestamp: new Date().toISOString()
    })
  });
}

export async function getMetricsSummary() {
  return sendRequest("/api/metrics/summary");
}
