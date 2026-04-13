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

  // 🛒 Agregar o sumar producto
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

  // ➕ aumentar cantidad
  const increaseQty = (id) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  // ➖ disminuir cantidad
  const decreaseQty = (id) => {
    setCart(cart
      .map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0)
    );
  };

  // ❌ eliminar producto
  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // 💰 totales
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const qtyBtn = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
  fontWeight: "bold"
};

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

              {/* Botón con efecto */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(p);
                }}
                style={{
                  width: "100%",
                  background: "#4f7c62",
                  color: "white",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  marginTop: "10px",
                  cursor: "pointer",
                  transition: "transform 0.1s"
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.95)"}
                onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🛒 Carrito */}
      {openCart && (
  <div style={{
    position: "fixed",
    top: 0,
    right: 0,
    width: "380px",
    height: "100%",
    background: "#fdfdfd",
    boxShadow: "-10px 0 30px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    zIndex: 1000
  }}>

    {/* Header */}
    <div style={{
      padding: "20px",
      borderBottom: "1px solid #eee",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h3 style={{ margin: 0, color: "#2f4f3e" }}>Tu carrito</h3>

      <X 
        onClick={() => setOpenCart(false)} 
        style={{ cursor: "pointer" }}
      />
    </div>

    {/* Lista */}
    <div style={{
      flex: 1,
      overflowY: "auto",
      padding: "20px"
    }}>
      {cart.length === 0 ? (
        <p style={{ color: "#777" }}>Tu carrito está vacío</p>
      ) : (
        cart.map(item => (
          <div key={item.id} style={{
            background: "white",
            padding: "15px",
            borderRadius: "15px",
            marginBottom: "15px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.04)"
          }}>

            <p style={{
              fontWeight: "600",
              marginBottom: "10px",
              color: "#2f4f3e"
            }}>
              {item.name}
            </p>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>

              {/* Cantidad */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>

                <button 
                  onClick={() => decreaseQty(item.id)}
                  style={qtyBtn}
                >
                  −
                </button>

                <span style={{ fontWeight: "500" }}>
                  {item.quantity}
                </span>

                <button 
                  onClick={() => increaseQty(item.id)}
                  style={qtyBtn}
                >
                  +
                </button>
              </div>

              {/* Precio */}
              <p style={{
                fontWeight: "600",
                color: "#333"
              }}>
                ${(item.price * item.quantity).toLocaleString()}
              </p>

              {/* Eliminar */}
              <button 
                onClick={() => removeItem(item.id)}
                style={{
                  background: "#ffe5e5",
                  border: "none",
                  borderRadius: "8px",
                  padding: "5px 8px",
                  cursor: "pointer"
                }}
              >
                ❌
              </button>

            </div>
          </div>
        ))
      )}
    </div>

    {/* Footer */}
    <div style={{
      padding: "20px",
      borderTop: "1px solid #eee"
    }}>
      <h3 style={{
        marginBottom: "10px",
        color: "#2f4f3e"
      }}>
        Total: ${total.toLocaleString()}
      </h3>

      <button style={{
        width: "100%",
        background: "#4f7c62",
        color: "white",
        padding: "14px",
        borderRadius: "12px",
        border: "none",
        fontWeight: "600",
        cursor: "pointer",
        transition: "0.2s"
      }}
      onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.97)"}
      onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
      >
        Finalizar compra
      </button>
    </div>

  </div>
)}
