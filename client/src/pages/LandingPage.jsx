import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMetricsSummary } from "../api";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { BRAND_NAME, SALES_PACKAGES } from "../constants";
import { useTrackVisit } from "../hooks/useTrackVisit";

const socialProof = [
  "Experiencia en sector publico y privado.",
  "Demos funcionales en menos de 2 semanas.",
  "Implementacion enfocada en ventas, inventario y caja."
];

export function LandingPage() {
  useTrackVisit("landing");
  const [summary, setSummary] = useState({
    visitas: 0,
    click_whatsapp: 0,
    leads: 0
  });

  useEffect(() => {
    getMetricsSummary()
      .then((result) => setSummary(result.summary.totals))
      .catch(() => {
        // Silent fallback keeps landing available.
      });
  }, []);

  return (
    <main className="page shell">
      <section className="hero card">
        <p className="eyebrow">SOFTWARE PRACTICO PARA NEGOCIOS LOCALES</p>
        <h1>Ordena inventario, acelera pedidos y vende sin desorden.</h1>
        <p>
          {BRAND_NAME} crea sistemas simples para retail y restaurantes:
          inventario, caja, reportes y operacion diaria con soporte local.
        </p>
        <div className="hero-actions">
          <Link to="/demo/inventario" className="button button-primary">
            Solicitar demo
          </Link>
          <Link to="/agendar" className="button button-ghost">
            Quiero cotizacion
          </Link>
          <WhatsAppButton source="landing" />
        </div>
        <div className="metrics-grid">
          <article className="metric-tile">
            <strong>{summary.visitas}</strong>
            <span>Visitas registradas</span>
          </article>
          <article className="metric-tile">
            <strong>{summary.click_whatsapp}</strong>
            <span>Clics en WhatsApp</span>
          </article>
          <article className="metric-tile">
            <strong>{summary.leads}</strong>
            <span>Leads recibidos</span>
          </article>
        </div>
      </section>

      <section className="grid-2">
        <article className="card">
          <h2>Oferta comercial unificada</h2>
          <p>
            Sistema simple para vender mas y ordenar inventario/caja. Te
            mostramos una demo real antes de cotizar implementacion completa.
          </p>
          <ul className="clean-list">
            {socialProof.map((proof) => (
              <li key={proof}>{proof}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h2>Paquetes visibles para cierre rapido</h2>
          <div className="package-list">
            {SALES_PACKAGES.map((pkg) => (
              <article key={pkg.name} className="package-card">
                <h3>{pkg.name}</h3>
                <strong>{pkg.price}</strong>
                <p>{pkg.description}</p>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="grid-2">
        <article className="card accent-card">
          <h2>Demo 1 activa: Inventario Retail</h2>
          <p>
            Login demo, dashboard, productos, alertas de stock, venta rapida y
            cierre de caja diario.
          </p>
          <Link to="/demo/inventario" className="button button-primary">
            Ver demo inventario
          </Link>
        </article>
        <article className="card accent-card warm">
          <h2>Demo 2 activa: Comandas Restaurante</h2>
          <p>
            Mesas y comandas, estado de pedidos, consumo de insumos y resumen
            diario listo para mostrar a clientes.
          </p>
          <Link to="/demo/comandas" className="button button-primary">
            Ver demo comandas
          </Link>
        </article>
      </section>
    </main>
  );
}
