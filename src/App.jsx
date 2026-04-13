import { ShoppingCart, X } from "lucide-react";
import { useState } from "react";

export default function App() {

  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [category, setCategory] = useState("Todos");
  const [petType, setPetType] = useState("Todos");

  const products = [
    {
      id: 1,
      name: "Alimento Premium Perro",
      price: 85000,
      category: "Alimentos",
      pet: "Perro",
      img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4"
    },
    {
      id: 2,
      name: "Snacks Gato",
      price: 20000,
      category: "Snacks",
      pet: "Gato",
      img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1"
    },
    {
      id: 3,
      name: "Collar Perro",
      price: 25000,
      category: "Accesorios",
      pet: "Perro",
      img: "https://images.unsplash.com/photo-1601758064224-16b7d9e9a4e4"
    },
    {
      id: 4,
      name: "Arena Gato",
      price: 45000,
      category: "Limpieza",
      pet: "Gato",
      img: "https://images.unsplash.com/photo-1598137269279-2f6f7b1f6c7c"
    }
  ];

  const filtered = products.filter(p =>
    (category === "Todos" || p.category === category) &&
    (petType === "Todos" || p.pet === petType)
  );

  // 🛒 lógica carrito
  const addToCart = (p) => {
    const exist = cart.find(i => i.id === p.id);
    if (exist) {
      setCart(cart.map(i =>
        i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { ...p, quantity: 1 }]);
    }
  };

  const increase = id =>
    setCart(cart.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));

  const decrease = id =>
    setCart(cart.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i)
      .filter(i => i.quantity > 0));

  const remove = id =>
    setCart(cart.filter(i => i.id !== id));

  const total = cart.reduce((a, i) => a + i.price * i.quantity, 0);
  const totalItems = cart.reduce((a, i) => a + i.quantity, 0);

  const chip = (active) => ({
    padding: "8px 14px",
    borderRadius: "20px",
    border: "none",
    background: active ? "#4f7c62" : "#eee",
    color: active ? "white" : "#333",
    cursor: "pointer"
  });

  return (
    <div style={{ fontFamily: "Arial", background: "#f7f5f2" }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px",
        background: "white",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <h2>SOIN</h2>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <span>Home</span>
          <span>Catálogo</span>
          <span>Contáctenos</span>

          <button onClick={() => setOpenCart(true)} style={{
            background: "#4f7c62",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "10px 14px",
            cursor: "pointer"
          }}>
            <ShoppingCart size={18}/> ({totalItems})
          </button>
        </div>
      </div>

      {/* HERO */}
      <div style={{ height: "320px" }}>
        <img src="/soin-banner.png" style={{
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }} />
      </div>

      {/* FILTROS */}
      <div style={{ padding: "30px 40px" }}>
        <h4>Categorías</h4>
        <div style={{ display: "flex", gap: "10px" }}>
          {["Todos","Alimentos","Snacks","Accesorios","Limpieza"].map(c => (
            <button key={c} onClick={() => setCategory(c)} style={chip(category === c)}>{c}</button>
          ))}
        </div>

        <h4 style={{ marginTop: "20px" }}>Mascota</h4>
        <div style={{ display: "flex", gap: "10px" }}>
          {["Todos","Perro","Gato"].map(p => (
            <button key={p} onClick={() => setPetType(p)} style={chip(petType === p)}>{p}</button>
          ))}
        </div>
      </div>

      {/* PRODUCTOS */}
      <div style={{
        padding: "40px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "25px"
      }}>
        {filtered.map(p => (
          <div key={p.id}
            onClick={() => addToCart(p)}
            style={{
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: "0 10px 20px rgba(0,0,0,0.05)"
            }}
          >
            <img src={p.img} style={{ width: "100%", height: "200px", objectFit: "cover" }} />

            <div style={{ padding: "15px" }}>
              <h4>{p.name}</h4>
              <p>${p.price.toLocaleString()}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(p);
                }}
                style={{
                  width: "100%",
                  background: "#4f7c62",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px",
                  cursor: "pointer"
                }}
              >
                Agregar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* OVERLAY */}
      {openCart && (
        <div
          onClick={() => setOpenCart(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            zIndex: 200
          }}
        />
      )}

      {/* 🛒 CARRITO PREMIUM */}
      <div style={{
        position: "fixed",
        top: 0,
        right: openCart ? 0 : "-400px",
        width: "400px",
        height: "100%",
        background: "#fff",
        boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
        zIndex: 300,
        transition: "0.3s",
        display: "flex",
        flexDirection: "column"
      }}>

        {/* Header */}
        <div style={{
          padding: "20px",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <h3>Tu carrito</h3>
          <X onClick={() => setOpenCart(false)} style={{ cursor: "pointer" }} />
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {cart.map(item => (
            <div key={item.id} style={{
              marginBottom: "20px",
              borderBottom: "1px solid #eee",
              paddingBottom: "10px"
            }}>
              <strong>{item.name}</strong>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "8px"
              }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button onClick={() => decrease(item.id)}>−</button>
                  {item.quantity}
                  <button onClick={() => increase(item.id)}>+</button>
                </div>

                <span>${(item.price * item.quantity).toLocaleString()}</span>

                <button onClick={() => remove(item.id)}>❌</button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "20px", borderTop: "1px solid #eee" }}>
          <h3>Total: ${total.toLocaleString()}</h3>

          <button style={{
            width: "100%",
            marginTop: "10px",
            padding: "12px",
            background: "#4f7c62",
            color: "white",
            borderRadius: "10px",
            border: "none"
          }}>
            Finalizar compra
          </button>
        </div>
      </div>

    </div>
  );
}
