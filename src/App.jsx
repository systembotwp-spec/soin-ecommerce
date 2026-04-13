import { ShoppingCart } from "lucide-react";

export default function App() {
  return (
    <div style={{ fontFamily: "Arial", background: "#f7f5f2", minHeight: "100vh" }}>
      
      {/* Navbar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px"
      }}>
        <h1 style={{ color: "#2f4f3e" }}>SOIN</h1>
        <button style={{
          background: "#4f7c62",
          color: "white",
          padding: "10px 15px",
          borderRadius: "10px",
          border: "none",
          display: "flex",
          gap: "5px"
        }}>
          <ShoppingCart size={18}/> Carrito
        </button>
      </div>

      {/* Hero */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "40px"
      }}>
        <div>
          <h2 style={{ fontSize: "40px", color: "#2f4f3e" }}>
            Todo lo que tu mascota necesita
          </h2>
          <p style={{ color: "#666" }}>
            Alimentos, accesorios, salud y mucho amor.
          </p>
          <button style={{
            background: "#4f7c62",
            color: "white",
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            marginTop: "20px"
          }}>
            Comprar ahora
          </button>
        </div>

        <img 
          src="/soin-banner.png" 
          style={{ width: "400px", borderRadius: "20px" }}
        />
      </div>

    </div>
  );
}
