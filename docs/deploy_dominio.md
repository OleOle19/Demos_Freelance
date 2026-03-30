# Guia rapida de dominio y despliegue

## 1) Dominio (10-15 min)
- Compra y activa `ole-ole.dev` en DonDominio.
- Configura DNS en Cloudflare (plan free):
  - `A` record: `api.ole-ole.dev` para backend.
  - `CNAME` record: `ole-ole.dev` y/o `www.ole-ole.dev` para frontend.

## 2) Backend barato
- Opcion recomendada: Render/Railway/Fly.
- Variables minimas:
  - `PORT`
  - `DATABASE_PATH=./data/demo.sqlite`
- Comando start: `npm --prefix server run start`

## 3) Frontend estatico
- Build: `npm --prefix client run build`
- Subir carpeta `client/dist` a Netlify/Vercel/Cloudflare Pages.

## 4) Integracion
- En frontend, setear `VITE_API_BASE=https://api.ole-ole.dev`.
- Probar:
  - `/api/health`
  - formulario `/agendar`
  - clicks WhatsApp y metricas.
