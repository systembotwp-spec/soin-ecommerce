import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function App() {

  const [cart, setCart] = useState([]);

  const products = [
    { id: 1, name: "Alimento Premium", price: 85000 },
    { id: 2, name: "Collar Natural", price: 25000 },
    { id: 3, name: "Kit Higiene", price: 45000 },
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

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
          <ShoppingCart size={18}/> ({cart.length})
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
        </div>

        <img 
          src="/soin-banner.png" 
          style={{ width: "400px", borderRadius: "20px" }}
        />
      </div>

      {/* Productos */}
      <div style={{ padding: "40px" }}>
        <h3 style={{ color: "#2f4f3e", fontSize: "28px" }}>
          Productos destacados
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginTop: "20px"
        }}>
          {products.map(p => (
            <div key={p.id} style={{
              background: "white",
              padding: "20px",
              borderRadius: "15px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
            }}>
              <div style={{
                height: "150px",
                background: "#eee",
                borderRadius: "10px",
                marginBottom: "10px"
              }}></div>

              <h4>{p.name}</h4>
              <p style={{ color: "#777" }}>
                ${p.price.toLocaleString()}
              </p>

              <button 
                onClick={() => addToCart(p)}
                style={{
                  width: "100%",
                  background: "#4f7c62",
                  color: "white",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  marginTop: "10px"
                }}
              >
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
