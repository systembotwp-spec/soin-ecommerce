import { useState, useMemo, useEffect } from "react";
import {
  ShoppingCart, X, Plus, Minus,
  Search, MessageCircle, Trash2, ChevronRight
} from "lucide-react";

/* UTIL */
const formatCOP = (v) => `$${v.toLocaleString("es-CO")}`;

/* DATA */
const PRODUCTS = [
  {
    id: 1,
    name: "Alimento Premium Adulto",
    price: 85000,
    img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500"
  },
  {
    id: 2,
    name: "Snacks Felinos",
    price: 20000,
    img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500"
  }
];

export default function App() {

  /* STATE */
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [openCart, setOpenCart] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  /* EFFECT */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* CART */
  const add = (p) => {
    setCart(c => {
      const ex = c.find(i => i.id === p.id);
      return ex
        ? c.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
        : [...c, { ...p, qty: 1 }];
    });

    setToast("Producto agregado 🐾");
    setTimeout(() => setToast(""), 2000);
  };

  const updateQty = (id, d) => {
    setCart(c =>
      c.map(i =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i
      )
    );
  };

  const remove = (id) =>
    setCart(c => c.filter(i => i.id !== id));

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  /* FILTER */
  const filtered = useMemo(() =>
    PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    ),
  [search]);

  /* CHECKOUT */
  const checkout = () => {
    const msg = encodeURIComponent(
      cart.map(i => `${i.name} x${i.qty}`).join("\n")
    );
    window.open(`https://wa.me/?text=${msg}`);
  };

  return (
    <div style={{ fontFamily: "Arial", background: "#f7f5f2" }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#2D4A35",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "20px",
          zIndex: 999
        }}>
          {toast}
        </div>
      )}

      {/* NAV */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        background: "#fff"
      }}>
        <h2>SOIN</h2>

        <button onClick={() => setOpenCart(true)}>
          <ShoppingCart /> ({totalItems})
        </button>
      </div>

      {/* HERO */}
      <div style={{ position: "relative", height: "320px" }}>
        <img
          src="/soin-banner.png"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />

        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "20px",
          background: "linear-gradient(90deg, rgba(0,0,0,0.5), transparent)"
        }}>
          <div style={{ maxWidth: "260px", color: "#fff" }}>
            <h1>Todo lo que tu mascota necesita</h1>

            <button style={{ marginTop: 10 }}>
              Comprar ahora <ChevronRight size={14}/>
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ padding: 20 }}>
        <input
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 10, width: "100%" }}
        />
      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <p style={{ textAlign: "center" }}>
          Ups, no encontramos productos 🐾
        </p>
      )}

      {/* PRODUCTS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 20,
        padding: 20
      }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: "#fff", padding: 10 }}>
            <img src={p.img} width="100%" loading="lazy" />
            <h3>{p.name}</h3>
            <p>{formatCOP(p.price)}</p>

            <button onClick={() => add(p)}>
              Agregar
            </button>
          </div>
        ))}
      </div>

      {/* CART */}
      {openCart && (
        <div style={{
          position: "fixed",
          right: 0,
          top: 0,
          width: 320,
          height: "100%",
          background: "#fff",
          padding: 20
        }}>
          <button onClick={() => setOpenCart(false)}>
            <X />
          </button>

          {cart.map(i => (
            <div key={i.id}>
              <p>{i.name}</p>

              <button onClick={() => updateQty(i.id, -1)}>
                <Minus/>
              </button>

              {i.qty}

              <button onClick={() => updateQty(i.id, 1)}>
                <Plus/>
              </button>

              <button onClick={() => remove(i.id)}>
                <Trash2/>
              </button>

              <p>{formatCOP(i.price * i.qty)}</p>
            </div>
          ))}

          <h3>Total: {formatCOP(total)}</h3>

          <button onClick={checkout}>
            Finalizar por WhatsApp
          </button>
        </div>
      )}

    </div>
  );
}
