import { ShoppingCart, X } from "lucide-react";
import { useState } from "react";

export default function App() {

  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);

  const [category, setCategory] = useState("Todos");
  const [petType, setPetType] = useState("Todos");
  const [visible, setVisible] = useState(6);

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

  const filteredProducts = products
    .filter(p =>
      (category === "Todos" || p.category === category) &&
      (petType === "Todos" || p.pet === petType)
    )
    .slice(0, visible);

  // 🛒 lógica carrito
  const addToCart = (product) => {
    const existing = cart.find(i => i.id === product.id);

    if (existing) {
      setCart(cart.map(i =>
        i.id === product.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const increaseQty = id =>
    setCart(cart.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));

  const decreaseQty = id =>
    setCart(cart.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i)
      .filter(i => i.quantity > 0));

  const removeItem = id =>
    setCart(cart.filter(i => i.id !== id));

  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  const chipStyle = (active) => ({
    padding: "8px 14px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    background: active ? "#4f7c62" : "#eee",
    color: active ? "white" : "#333",
    fontWeight: "500"
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
          <a>Home</a>
          <a>Catálogo</a>
          <a>Contáctenos</a>

          <button onClick={() => setOpenCart(true)} style={{
            background: "#4f7c62",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "10px"
          }}>
            <ShoppingCart size={18}/> ({totalItems})
          </button>
        </div>
      </div>

      {/* HERO */}
      <div style={{ height: "320px", overflow: "hidden" }}>
        <img src="/soin-banner.png" style={{
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }} />
      </div>

      {/* FILTROS */}
      <div style={{ padding: "30px 40px" }}>

        <h3>Categorías</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          {["Todos","Alimentos","Snacks","Accesorios","Limpieza"].map(c => (
            <button key={c} onClick={() => setCategory(c)} style={chipStyle(category === c)}>
              {c}
            </button>
          ))}
        </div>

        <h3>Mascota</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          {["Todos","Perro","Gato"].map(p => (
            <button key={p} onClick={() => setPetType(p)} style={chipStyle(petType === p)}>
              {p}
            </button>
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
        {filteredProducts.map(p => (
          <div key={p.id}
            onClick={() => addToCart(p)}
            style={{
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              cursor: "pointer",
              transition: "0.2s",
              boxShadow: "0 10px 20px rgba(0,0,0,0.05)"
            }}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          >

            <img src={p.img} style={{
              width: "100%",
              height: "200px",
              objectFit: "cover"
            }} />

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
                  padding: "10px"
                }}
              >
                Agregar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINACIÓN */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <button onClick={() => setVisible(visible + 3)} style={{
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          background: "#ddd"
        }}>
          Ver más
        </button>
      </div>

      {/* 🛒 CARRITO */}
      {openCart && (
        <div style={{
          position: "fixed",
          right: 0,
          top: 0,
          width: "380px",
          height: "100%",
          background: "white",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
          padding: "20px",
          display: "flex",
          flexDirection: "column"
        }}>
          <X onClick={() => setOpenCart(false)} />

          <div style={{ flex: 1, overflowY: "auto" }}>
            {cart.map(item => (
              <div key={item.id} style={{ marginBottom: "15px" }}>
                <p>{item.name}</p>

                <button onClick={() => decreaseQty(item.id)}>-</button>
                {item.quantity}
                <button onClick={() => increaseQty(item.id)}>+</button>

                <p>${(item.price * item.quantity).toLocaleString()}</p>

                <button onClick={() => removeItem(item.id)}>❌</button>
              </div>
            ))}
          </div>

          <h3>Total: ${total.toLocaleString()}</h3>
        </div>
      )}

      {/* FOOTER */}
      <div style={{
        background: "#2f4f3e",
        color: "white",
        padding: "40px",
        textAlign: "center"
      }}>
        <p>© SOIN - Todos los derechos reservados</p>
        <p>Políticas de privacidad | Términos y condiciones</p>
      </div>

    </div>
  );
}
