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

  // ➕ aumentar
  const increaseQty = (id) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  // ➖ disminuir
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

  // ❌ eliminar
  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // 🎨 estilos reutilizables
  const qtyBtn = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
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

        <button
          onClick={() => setOpenCart(true)}
          style={{
            background: "#4f7c62",
            color: "white",
            padding: "12px 16px",
            borderRadius: "12px",
            border: "none",
            display: "flex",
            gap: "5px",
            cursor: "pointer"
          }}
        >
          <ShoppingCart size={18}/> ({totalItems})
        </button>
      </div>

{/* HERO PREMIUM */}
<div style={{
  position: "relative",
  width: "100%",
  height: "420px",
  borderRadius: "0 0 40px 40px",
  overflow: "hidden",
  marginBottom: "40px"
}}>

  {/* Imagen fondo */}
  <img
    src="/soin-banner.png"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }}
  />

  {/* Overlay oscuro suave */}
  <div style={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.25)"
  }} />

  {/* Contenido */}
  <div style={{
    position: "absolute",
    top: "50%",
    left: "60px",
    transform: "translateY(-50%)",
    color: "white",
    maxWidth: "500px"
  }}>
    
    <h1 style={{
      fontSize: "48px",
      fontWeight: "700",
      marginBottom: "10px"
    }}>
      Todo lo que tu mascota necesita
    </h1>

    <p style={{
      fontSize: "18px",
      opacity: 0.9,
      marginBottom: "20px"
    }}>
      Alimentos, accesorios, salud y mucho amor en un solo lugar.
    </p>

    <button style={{
      background: "#4f7c62",
      color: "white",
      padding: "14px 24px",
      borderRadius: "12px",
      border: "none",
      fontWeight: "600",
      cursor: "pointer"
    }}>
      Comprar ahora
    </button>

  </div>
</div>

{/* BENEFICIOS */}
<div style={{
  display: "flex",
  justifyContent: "space-around",
  padding: "20px 40px",
  marginBottom: "30px"
}}>
  
  {[
    "Productos naturales",
    "Cuidado con amor",
    "Respaldo veterinario",
    "Envíos rápidos"
  ].map((text, i) => (
    <div key={i} style={{
      textAlign: "center"
    }}>
      <p style={{
        fontWeight: "600",
        color: "#2f4f3e"
      }}>
        {text}
      </p>
    </div>
  ))}

</div>      
      {/* 🛒 Carrito Premium */}
      {openCart && (
        <div style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "380px",
          height: "100%",
          background: "#fff",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          zIndex: 1000
        }}>

          {/* Header */}
          <div style={{
            padding: "20px",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between"
          }}>
            <h3 style={{ color: "#2f4f3e" }}>Tu carrito</h3>
            <X onClick={() => setOpenCart(false)} style={{ cursor: "pointer" }} />
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
                  background: "#fafafa",
                  padding: "15px",
                  borderRadius: "15px",
                  marginBottom: "15px"
                }}>
                  <p style={{ fontWeight: "600", marginBottom: "10px" }}>
                    {item.name}
                  </p>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    {/* Cantidad */}
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <button onClick={() => decreaseQty(item.id)} style={qtyBtn}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id)} style={qtyBtn}>+</button>
                    </div>

                    {/* Precio */}
                    <p style={{ fontWeight: "600" }}>
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>

                    {/* Eliminar */}
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: "#ffe5e5",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        padding: "5px 8px"
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
            <h3 style={{ color: "#2f4f3e" }}>
              Total: ${total.toLocaleString()}
            </h3>

            <button style={{
              width: "100%",
              marginTop: "10px",
              background: "#4f7c62",
              color: "white",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              fontWeight: "600",
              cursor: "pointer"
            }}>
              Finalizar compra
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
