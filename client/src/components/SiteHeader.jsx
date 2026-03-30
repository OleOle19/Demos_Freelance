import { Link, NavLink } from "react-router-dom";
import { BRAND_NAME } from "../constants";

const navItems = [
  { to: "/", label: "Inicio" },
  { to: "/demo/inventario", label: "Demo Inventario" },
  { to: "/demo/comandas", label: "Demo Comandas" },
  { to: "/agendar", label: "Agendar" }
];

export function SiteHeader() {
  const brandMark = BRAND_NAME
    .split(" ")
    .map((word) => word[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="site-header">
      <div className="shell header-content">
        <Link to="/" className="brand">
          <span className="brand-mark">{brandMark || "OD"}</span>
          <div>
            <strong>{BRAND_NAME}</strong>
            <small>Software local para negocios</small>
          </div>
        </Link>
        <nav className="top-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
