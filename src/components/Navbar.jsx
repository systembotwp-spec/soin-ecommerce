import { ShoppingCart } from "lucide-react";

export default function Navbar({ view, goTo, totalItems, setDrawerOpen }) {
  return (
    <nav className="nav">
      <img
        className="nav-logo tap"
        src="/Logo.png"
        onClick={() => goTo("inicio")}
      />

      <div className="nav-links">
        <button
          className={`nav-link tap ${view === "inicio" ? "active" : ""}`}
          onClick={() => goTo("inicio")}
        >
          Inicio
        </button>

        <button
          className={`nav-link tap ${view === "catalogo" ? "active" : ""}`}
          onClick={() => goTo("catalogo")}
        >
          Tienda
        </button>

        <button className="cart-trigger tap" onClick={() => setDrawerOpen(true)}>
          <ShoppingCart size={16} />
          Carrito
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      </div>
    </nav>
  );
}
