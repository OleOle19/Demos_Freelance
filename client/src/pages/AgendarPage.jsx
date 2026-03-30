import { useState } from "react";
import { postLead } from "../api";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { useTrackVisit } from "../hooks/useTrackVisit";

const initialForm = {
  nombre: "",
  negocio: "",
  rubro: "retail",
  ciudad: "",
  telefono: "",
  mensaje: "",
  origen: "landing"
};

export function AgendarPage() {
  useTrackVisit("agendar");
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setSubmitting(true);

    try {
      await postLead(form);
      setStatus({
        type: "ok",
        message:
          "Lead registrado correctamente. Te contactaremos para la demo guiada."
      });
      setForm(initialForm);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "No se pudo registrar tu solicitud."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page shell">
      <section className="card">
        <p className="eyebrow">AGENDA TU DEMO</p>
        <h1>Cuantanos de tu negocio y te mostramos la solucion ideal</h1>
        <p>
          Recibes una demo guiada con propuesta comercial y precio desde S/XXX
          segun tipo de local.
        </p>
      </section>

      <section className="grid-2">
        <article className="card">
          <h2>Formulario rapido</h2>
          <form className="form" onSubmit={onSubmit}>
            <label>
              Nombre completo
              <input
                required
                value={form.nombre}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, nombre: event.target.value }))
                }
              />
            </label>
            <label>
              Negocio
              <input
                required
                value={form.negocio}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, negocio: event.target.value }))
                }
              />
            </label>
            <label>
              Rubro
              <select
                value={form.rubro}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, rubro: event.target.value }))
                }
              >
                <option value="retail">Retail / Bodega</option>
                <option value="restaurante">Restaurante</option>
                <option value="otro">Otro</option>
              </select>
            </label>
            <label>
              Ciudad
              <input
                required
                value={form.ciudad}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, ciudad: event.target.value }))
                }
              />
            </label>
            <label>
              Telefono
              <input
                required
                value={form.telefono}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, telefono: event.target.value }))
                }
              />
            </label>
            <label>
              Mensaje
              <textarea
                rows={4}
                value={form.mensaje}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, mensaje: event.target.value }))
                }
              />
            </label>
            <label>
              Origen de contacto
              <select
                value={form.origen}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, origen: event.target.value }))
                }
              >
                <option value="landing">Landing</option>
                <option value="demo_inventario">Demo inventario</option>
                <option value="demo_comandas">Demo comandas</option>
              </select>
            </label>
            <button className="button button-primary" disabled={submitting}>
              {submitting ? "Enviando..." : "Enviar solicitud"}
            </button>
          </form>
          {status.type === "ok" ? (
            <p className="success-text">{status.message}</p>
          ) : null}
          {status.type === "error" ? (
            <p className="error-text">{status.message}</p>
          ) : null}
        </article>

        <article className="card">
          <h2>Tambien por WhatsApp</h2>
          <p>
            Si prefieres respuesta inmediata, escribe por WhatsApp y te enviamos
            fecha para demo guiada.
          </p>
          <div className="hero-actions">
            <WhatsAppButton
              source="agendar"
              label="Escribir por WhatsApp"
              message="Hola, quiero agendar una demo guiada para mi negocio."
            />
          </div>

          <h3>Que recibirias en la primera llamada</h3>
          <ul className="clean-list">
            <li>Diagnostico express de tu operacion actual.</li>
            <li>Demo basada en tu rubro (retail o restaurante).</li>
            <li>Cotizacion base y siguientes pasos.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
