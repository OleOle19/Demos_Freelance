import { Link, Route, Routes } from "react-router-dom";
import { SiteHeader } from "./components/SiteHeader.jsx";
import { AgendarPage } from "./pages/AgendarPage.jsx";
import { ComandasDemoPage } from "./pages/ComandasDemoPage.jsx";
import { InventarioDemoPage } from "./pages/InventarioDemoPage.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";

function NotFoundPage() {
  return (
    <main className="page shell">
      <section className="card">
        <h1>Pagina no encontrada</h1>
        <p>
          Regresa al <Link to="/">inicio</Link> para ver las demos publicadas.
        </p>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <div className="app">
      <SiteHeader />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo/inventario" element={<InventarioDemoPage />} />
        <Route path="/demo/comandas" element={<ComandasDemoPage />} />
        <Route path="/agendar" element={<AgendarPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
