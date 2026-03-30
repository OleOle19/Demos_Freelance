import { useMemo, useState } from "react";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { useTrackVisit } from "../hooks/useTrackVisit";
import { formatCurrency, formatDate } from "../utils";

const menuItems = [
  { id: 1, name: "Pizza personal", price: 18, usage: { Queso: 1, Salsa: 1 } },
  { id: 2, name: "Hamburguesa clasica", price: 14, usage: { Pan: 1, Carne: 1 } },
  { id: 3, name: "Pollo broaster", price: 16, usage: { Pollo: 1, Aceite: 1 } },
  { id: 4, name: "Lomo saltado", price: 24, usage: { Carne: 1, Papa: 1 } }
];

const initialSupplies = [
  { name: "Queso", stock: 11, min: 8 },
  { name: "Salsa", stock: 16, min: 10 },
  { name: "Pan", stock: 14, min: 10 },
  { name: "Carne", stock: 10, min: 9 },
  { name: "Pollo", stock: 9, min: 6 },
  { name: "Aceite", stock: 8, min: 5 },
  { name: "Papa", stock: 12, min: 9 }
];

export function ComandasDemoPage() {
  useTrackVisit("demo_comandas");

  const [supplies, setSupplies] = useState(initialSupplies);
  const [orders, setOrders] = useState([]);
  const [draft, setDraft] = useState({
    mesa: 1,
    itemId: menuItems[0].id,
    quantity: 1
  });
  const [message, setMessage] = useState("");

  const activeTables = useMemo(() => {
    const map = new Map();
    for (const order of orders) {
      if (order.status !== "entregado") {
        map.set(order.mesa, true);
      }
    }
    return map;
  }, [orders]);

  const summary = useMemo(() => {
    const pendientes = orders.filter((order) => order.status === "pendiente").length;
    const listos = orders.filter((order) => order.status === "listo").length;
    const entregados = orders.filter(
      (order) => order.status === "entregado"
    ).length;
    const ventas = orders
      .filter((order) => order.status === "entregado")
      .reduce((total, order) => total + order.total, 0);
    return { pendientes, listos, entregados, ventas };
  }, [orders]);

  const lowSupplies = supplies.filter((item) => item.stock <= item.min).length;

  const consumeSupplies = (item, quantity) => {
    setSupplies((prev) =>
      prev.map((supply) => {
        const usage = item.usage[supply.name] || 0;
        if (!usage) {
          return supply;
        }
        return {
          ...supply,
          stock: Math.max(0, supply.stock - usage * quantity)
        };
      })
    );
  };

  const createOrder = (event) => {
    event.preventDefault();
    const menuItem = menuItems.find((item) => item.id === Number(draft.itemId));
    const quantity = Number(draft.quantity);

    if (!menuItem || quantity <= 0) {
      setMessage("Selecciona producto y cantidad valida.");
      return;
    }

    const newOrder = {
      id: Date.now() + Math.random(),
      mesa: Number(draft.mesa),
      itemName: menuItem.name,
      quantity,
      total: Number((menuItem.price * quantity).toFixed(2)),
      status: "pendiente",
      createdAt: new Date().toISOString()
    };

    consumeSupplies(menuItem, quantity);
    setOrders((prev) => [newOrder, ...prev]);
    setMessage(`Comanda registrada para Mesa ${draft.mesa}.`);
  };

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order
      )
    );
  };

  const restockSupply = (name) => {
    setSupplies((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, stock: item.stock + 5 } : item
      )
    );
  };

  return (
    <main className="page shell">
      <section className="card">
        <p className="eyebrow">DEMO COMANDAS RESTAURANTE</p>
        <h1>Gestion de pedidos, mesas e insumos en un solo panel</h1>
        <p>
          Simula la operacion del dia: registrar comandas, cambiar estados y
          detectar insumos criticos antes de perder ventas.
        </p>
        <div className="metrics-grid">
          <article className="metric-tile">
            <strong>{summary.pendientes}</strong>
            <span>Pedidos pendientes</span>
          </article>
          <article className="metric-tile">
            <strong>{summary.listos}</strong>
            <span>Pedidos listos</span>
          </article>
          <article className="metric-tile">
            <strong>{summary.entregados}</strong>
            <span>Pedidos entregados</span>
          </article>
          <article className="metric-tile">
            <strong>{formatCurrency(summary.ventas)}</strong>
            <span>Venta diaria</span>
          </article>
        </div>
      </section>

      <section className="grid-2">
        <article className="card">
          <h2>Registrar comanda</h2>
          <form className="form compact" onSubmit={createOrder}>
            <label>
              Mesa
              <select
                value={draft.mesa}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, mesa: Number(event.target.value) }))
                }
              >
                <option value={1}>Mesa 1</option>
                <option value={2}>Mesa 2</option>
                <option value={3}>Mesa 3</option>
                <option value={4}>Mesa 4</option>
              </select>
            </label>
            <label>
              Plato
              <select
                value={draft.itemId}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    itemId: Number(event.target.value)
                  }))
                }
              >
                {menuItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({formatCurrency(item.price)})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Cantidad
              <input
                type="number"
                min="1"
                value={draft.quantity}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    quantity: Number(event.target.value)
                  }))
                }
              />
            </label>
            <button type="submit" className="button button-primary">
              Agregar comanda
            </button>
          </form>
          {message ? <p className="success-text">{message}</p> : null}

          <h3>Estado de mesas</h3>
          <div className="chip-row">
            {[1, 2, 3, 4].map((mesa) => (
              <span
                key={mesa}
                className={activeTables.has(mesa) ? "pill warning" : "pill success"}
              >
                Mesa {mesa}: {activeTables.has(mesa) ? "Activa" : "Libre"}
              </span>
            ))}
          </div>
        </article>

        <article className="card">
          <h2>Comandas del turno</h2>
          <ul className="clean-list">
            {orders.length === 0 ? (
              <li>Aun no hay comandas registradas.</li>
            ) : (
              orders.slice(0, 8).map((order) => (
                <li key={order.id} className="list-block">
                  <div>
                    <strong>Mesa {order.mesa}</strong> - {order.quantity} x{" "}
                    {order.itemName}
                    <br />
                    <small>
                      {formatCurrency(order.total)} - {formatDate(order.createdAt)}
                    </small>
                  </div>
                  <div className="button-row">
                    <button
                      type="button"
                      className="button button-inline"
                      onClick={() => updateOrderStatus(order.id, "listo")}
                    >
                      Listo
                    </button>
                    <button
                      type="button"
                      className="button button-inline"
                      onClick={() => updateOrderStatus(order.id, "entregado")}
                    >
                      Entregado
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </article>
      </section>

      <section className="card">
        <h2>Insumos criticos</h2>
        <p>
          Alertas activas: <strong>{lowSupplies}</strong>
        </p>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Insumo</th>
                <th>Stock</th>
                <th>Minimo</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {supplies.map((item) => (
                <tr key={item.name}>
                  <td>{item.name}</td>
                  <td>
                    <span
                      className={
                        item.stock <= item.min ? "pill warning" : "pill success"
                      }
                    >
                      {item.stock}
                    </span>
                  </td>
                  <td>{item.min}</td>
                  <td>
                    <button
                      type="button"
                      className="button button-inline"
                      onClick={() => restockSupply(item.name)}
                    >
                      Reponer +5
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="hero-actions">
          <WhatsAppButton
            source="demo_comandas"
            label="Quiero esta demo para mi restaurante"
            message="Hola, quiero implementar la demo de comandas en mi restaurante."
          />
        </div>
      </section>
    </main>
  );
}
