import { ShoppingCart, X } from "lucide-react";
import { useState } from "react";

export default function App() {

  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);

  const products = [
    { id: 1, name: "Alimento Premium", price: 85000 },
    { id: 2, name: "Collar Natural", price: 25000 },
    { id: 3, name: "Kit Higiene", price: 45000 },
  ];

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ fontFamily: "Arial", background: "#f7f5f2", minHeight: "100vh" }}>
      
      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 40px" }}>
        <h1 style={{ color: "#2f4f3e" }}>SOIN</h1>

        <button 
          onClick={() => setOpenCart(true)}
          style={{
            background: "#4f7c62",
            color: "white",
            padding: "10px 15px",
            borderRadius: "10px",
            border: "none",
            display: "flex",
            gap: "5px",
            cursor: "pointer"
          }}
        >
          <ShoppingCart size={18}/> ({totalItems})
        </button>
      </div>

      {/* Hero */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "40px" }}>
        <div>
          <h2 style={{ fontSize: "40px", color: "#2f4f3e" }}>
            Todo lo que tu mascota necesita
          </h2>
          <p style={{ color: "#666" }}>
            Alimentos, accesorios, salud y mucho amor.
          </p>
        </div>

        <img src="/soin-banner.png" style={{ width: "400px", borderRadius: "20px" }} />
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
            <div 
              key={p.id}
              onClick={() => addToCart(p)}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "15px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                cursor: "pointer",
                transition: "transform 0.1s"
              }}
              onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.97)"}
              onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
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

              <button style={{
                width: "100%",
                background: "#4f7c62",
                color: "white",
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                marginTop: "10px"
              }}>
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Carrito */}
      {openCart && (
        <div style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "350px",
          height: "100%",
          background: "white",
          boxShadow: "-5px 0 15px rgba(0,0,0,0.1)",
          padding: "20px",
          display: "flex",
          flexDirection: "column"
        }}>
          
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Tu carrito</h3>
            <X onClick={() => setOpenCart(false)} style={{ cursor: "pointer" }}/>
          </div>

          {/* Scroll */}
          <div style={{ flex: 1, overflowY: "auto", marginTop: "10px" }}>
            {cart.length === 0 ? (
              <p>Tu carrito está vacío</p>
            ) : (
              cart.map(item => (
                <div key={item.id} style={{
                  borderBottom: "1px solid #eee",
                  padding: "10px 0"
                }}>
                  <p>{item.name}</p>
                  <p>Cantidad: {item.quantity}</p>
                  <p>${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div>
            <h4>Total: ${total.toLocaleString()}</h4>

            <button style={{
              width: "100%",
              marginTop: "10px",
              background: "#4f7c62",
              color: "white",
              padding: "12px",
              borderRadius: "10px",
              border: "none"
            }}>
              Finalizar compra
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
