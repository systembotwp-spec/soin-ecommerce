import { ShoppingCart } from "lucide-react";

export default function Navbar({ totalItems, openCart }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "20px",
      background: "#fff",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      <h2>SOIN</h2>

      <button onClick={openCart}>
        <ShoppingCart /> ({totalItems})
      </button>
    </div>
  );
}
