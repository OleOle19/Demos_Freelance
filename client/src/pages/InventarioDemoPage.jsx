import { useMemo, useState } from "react";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { useTrackVisit } from "../hooks/useTrackVisit";
import { formatCurrency, formatDate } from "../utils";

const initialProducts = [
  { id: 1, name: "Arroz 5kg", price: 24, stock: 14, minStock: 8 },
  { id: 2, name: "Aceite 1L", price: 11.5, stock: 9, minStock: 6 },
  { id: 3, name: "Gaseosa 2.5L", price: 9.9, stock: 18, minStock: 10 },
  { id: 4, name: "Atun lata", price: 6.2, stock: 7, minStock: 8 }
];

export function InventarioDemoPage() {
  useTrackVisit("demo_inventario");

  const [credentials, setCredentials] = useState({
    usuario: "demo",
    clave: "123456"
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [sales, setSales] = useState([]);
  const [movements, setMovements] = useState([]);
  const [saleDraft, setSaleDraft] = useState({
    productId: initialProducts[0].id,
    quantity: 1
  });
  const [error, setError] = useState("");

  const revenue = useMemo(
    () => sales.reduce((total, sale) => total + sale.total, 0),
    [sales]
  );
  const lowStockCount = useMemo(
    () => products.filter((item) => item.stock <= item.minStock).length,
    [products]
  );
  const closeAmount = 250 + revenue;

  const onLogin = (event) => {
    event.preventDefault();
    if (!credentials.usuario.trim() || !credentials.clave.trim()) {
      setError("Ingresa usuario y clave para activar la demo.");
      return;
    }
    setError("");
    setIsLoggedIn(true);
  };

  const addMovement = (entry) => {
    setMovements((prev) => [
      {
        id: Date.now() + Math.random(),
        ...entry,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const createSale = (event) => {
    event.preventDefault();
    const product = products.find((item) => item.id === Number(saleDraft.productId));
    const quantity = Number(saleDraft.quantity);

    if (!product || quantity <= 0) {
      setError("Selecciona producto y cantidad valida.");
      return;
    }

    if (product.stock < quantity) {
      setError("Stock insuficiente para completar la venta.");
      return;
    }

    setError("");
    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id ? { ...item, stock: item.stock - quantity } : item
      )
    );

    const total = Number((quantity * product.price).toFixed(2));
    const sale = {
      id: Date.now(),
      productName: product.name,
      quantity,
      total,
      createdAt: new Date().toISOString()
    };
    setSales((prev) => [sale, ...prev]);
    addMovement({
      type: "Venta",
      detail: `${quantity} x ${product.name}`,
      amount: total
    });
  };

  const restockProduct = (productId, units) => {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      return;
    }
    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, stock: item.stock + units } : item
      )
    );
    addMovement({
      type: "Ingreso",
      detail: `Reposicion de ${units} unidades: ${product.name}`,
      amount: 0
    });
  };

  if (!isLoggedIn) {
    return (
      <main className="page shell">
        <section className="card auth-card">
          <p className="eyebrow">DEMO INVENTARIO RETAIL</p>
          <h1>Iniciar demo del negocio</h1>
          <p>
            Esta pantalla simula el ingreso del encargado. Usa cualquier usuario
            y clave para activar el dashboard comercial.
          </p>
          <form className="form" onSubmit={onLogin}>
            <label>
              Usuario demo
              <input
                value={credentials.usuario}
                onChange={(event) =>
                  setCredentials((prev) => ({
                    ...prev,
                    usuario: event.target.value
                  }))
                }
              />
            </label>
            <label>
              Clave demo
              <input
                type="password"
                value={credentials.clave}
                onChange={(event) =>
                  setCredentials((prev) => ({
                    ...prev,
                    clave: event.target.value
                  }))
                }
              />
            </label>
            {error ? <p className="error-text">{error}</p> : null}
            <button type="submit" className="button button-primary">
              Entrar a la demo
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="page shell">
      <section className="card">
        <p className="eyebrow">DEMO INVENTARIO RETAIL</p>
        <h1>Control diario de inventario, ventas y caja</h1>
        <p>
          Flujo de venta real: selecciona un producto, registra la venta y mira
          el impacto inmediato en stock y cierre de caja.
        </p>
        <div className="metrics-grid">
          <article className="metric-tile">
            <strong>{products.length}</strong>
            <span>Productos activos</span>
          </article>
          <article className="metric-tile">
            <strong>{lowStockCount}</strong>
            <span>Alertas de stock</span>
          </article>
          <article className="metric-tile">
            <strong>{sales.length}</strong>
            <span>Ventas registradas</span>
          </article>
          <article className="metric-tile">
            <strong>{formatCurrency(revenue)}</strong>
            <span>Ingreso del dia</span>
          </article>
        </div>
      </section>

      <section className="grid-2">
        <article className="card">
          <h2>Registrar venta rapida</h2>
          <form className="form compact" onSubmit={createSale}>
            <label>
              Producto
              <select
                value={saleDraft.productId}
                onChange={(event) =>
                  setSaleDraft((prev) => ({
                    ...prev,
                    productId: Number(event.target.value)
                  }))
                }
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({formatCurrency(product.price)})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Cantidad
              <input
                type="number"
                min="1"
                value={saleDraft.quantity}
                onChange={(event) =>
                  setSaleDraft((prev) => ({
                    ...prev,
                    quantity: Number(event.target.value)
                  }))
                }
              />
            </label>
            {error ? <p className="error-text">{error}</p> : null}
            <button type="submit" className="button button-primary">
              Registrar venta
            </button>
          </form>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>
                      <span
                        className={
                          product.stock <= product.minStock
                            ? "pill warning"
                            : "pill success"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="button button-inline"
                        onClick={() => restockProduct(product.id, 5)}
                      >
                        Reponer +5
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card">
          <h2>Caja y movimientos</h2>
          <div className="summary-block">
            <p>
              <strong>Apertura:</strong> {formatCurrency(250)}
            </p>
            <p>
              <strong>Ingreso por ventas:</strong> {formatCurrency(revenue)}
            </p>
            <p>
              <strong>Cierre estimado:</strong> {formatCurrency(closeAmount)}
            </p>
          </div>

          <h3>Movimientos recientes</h3>
          <ul className="clean-list">
            {movements.length === 0 ? (
              <li>Aun no hay movimientos registrados.</li>
            ) : (
              movements.slice(0, 6).map((movement) => (
                <li key={movement.id}>
                  <strong>{movement.type}</strong> - {movement.detail} (
                  {formatDate(movement.timestamp)})
                </li>
              ))
            )}
          </ul>

          <h3>Ultimas ventas</h3>
          <ul className="clean-list">
            {sales.length === 0 ? (
              <li>Registra la primera venta para mostrar este bloque.</li>
            ) : (
              sales.slice(0, 5).map((sale) => (
                <li key={sale.id}>
                  {sale.quantity} x {sale.productName}:{" "}
                  <strong>{formatCurrency(sale.total)}</strong>
                </li>
              ))
            )}
          </ul>

          <WhatsAppButton
            source="demo_inventario"
            label="Quiero esta demo en mi negocio"
            message="Hola, quiero implementar la demo de inventario en mi local."
          />
        </article>
      </section>
    </main>
  );
}
