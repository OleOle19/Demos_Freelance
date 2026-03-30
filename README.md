# OleDev Demos Freelance (React + Node + SQLite)

Implementacion base del plan comercial y tecnico para captar leads y cerrar clientes con demos web:
- Landing comercial con CTA a WhatsApp.
- Demo Inventario (`/demo/inventario`).
- Demo Comandas (`/demo/comandas`).
- Formulario de agendamiento (`/agendar`).
- API de leads y metricas (`POST /api/leads`, `POST /api/events`, `GET /api/metrics/summary`).
- Marca actual: `OleDev`
- Dominio objetivo: `ole-ole.dev`

## Estructura
- `client/`: app React + rutas publicas.
- `server/`: API Express + SQLite.
- `docs/`: guion comercial, cadencia de prospeccion y plantilla CRM.
- Incluye `deploy_dominio.md` para publicacion en dominio propio.

## Requisitos
- Node.js 20+
- npm 10+

## Setup local
1. Instalar dependencias:
   - `npm --prefix server install`
   - `npm --prefix client install`
2. Levantar backend:
   - `npm --prefix server run dev`
3. Levantar frontend:
   - `npm --prefix client run dev`
4. Abrir:
   - Frontend: `http://localhost:5173`
   - API: `http://localhost:4000/api/health`

## Variables de entorno (server)
Archivo de ejemplo: `server/.env.example`
- `PORT=4000`
- `DATABASE_PATH=./data/demo.sqlite`

## Contrato de API

### `POST /api/leads`
Payload:
```json
{
  "nombre": "Carlos Soto",
  "negocio": "Bodega Central",
  "rubro": "retail",
  "ciudad": "Tarapoto",
  "telefono": "999111222",
  "mensaje": "Quiero orden de inventario",
  "origen": "demo_inventario",
  "createdAt": "2026-03-30T10:00:00.000Z"
}
```

### `POST /api/events`
Payload:
```json
{
  "event": "visit",
  "source": "landing",
  "timestamp": "2026-03-30T10:00:00.000Z"
}
```

### `GET /api/metrics/summary`
Respuesta:
```json
{
  "ok": true,
  "summary": {
    "totals": {
      "visitas": 0,
      "click_whatsapp": 0,
      "leads": 0
    },
    "bySource": []
  }
}
```

## Checklist comercial (abril-mayo 2026)
- Contactar 5 negocios por dia habil.
- Realizar seguimiento a las 48 horas.
- Agendar demo guiada de 15 minutos.
- Mantener CRM semanal con estado y objeciones.
