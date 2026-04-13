import React, { useState, useMemo } from "react";
import { ShoppingCart, X, Plus, Minus, Search, MessageCircle } from "lucide-react";

const COLORS = {
  primary: "#4f7c62",
  secondary: "#d4a373",
  background: "#fdfaf5",
  white: "#ffffff",
  text: "#2d3436",
  lightGray: "#e9ecef",
  whatsapp: "#25D366"
};

export default function App() {
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [view, setView] = useState("inicio");
  const [filterPet, setFilterPet] = useState("Todos");
  const [filterCat, setFilterCat] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const products = [
    { id: 1, name: "Alimento Premium Perro", price: 85000, category: "Alimentos", pet: "Perro", featured: true, img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4" },
    { id: 2, name: "Snacks Naturales Gato", price: 20000, category: "Snacks", pet: "Gato", featured: true, img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1" },
    { id: 3, name: "Collar de Cuero Perro", price: 25000, category: "Accesorios", pet: "Perro", featured: true, img: "https://images.unsplash.com/photo-1601758064224-16b7d9e9a4e4" },
    { id: 4, name: "Arena Sanitaria Gato", price: 45000, category: "Limpieza", pet: "Gato", featured: true, img: "https://images.unsplash.com/photo-1598137269279-2f6f7b1f6c7c" },
    { id: 5, name: "Juguete Goma Perro", price: 15000, category: "Accesorios", pet: "Perro", featured: false, img: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97" },
    { id: 6, name: "Shampoo Mascotas", price: 32000, category: "Limpieza", pet: "Todos", featured: false, img: "https://images.unsplash.com/photo-1583947581924-860bda6a26df" }
  ];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPet = filterPet === "Todos" || p.pet === filterPet || p.pet === "Todos";
      const matchCat = filterCat === "Todos" || p.category === filterCat;
      return matchSearch && matchPet && matchCat;
    });
  }, [filterPet, filterCat, searchQuery]);

  const addToCart = (p) => {
    setCart(curr => {
      const exist = curr.find(i => i.id === p.id);
      if (exist) return curr.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...curr, { ...p, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(curr => curr.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.background, minHeight: "100vh" }}>
      <style>{`
        .active-effect:active { transform: scale(0.95); opacity: 0.8; }
        .product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 10px; }
        @media (min-width: 768px) { .product-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 25px; } }
        .filter-scroll { display: flex; overflow-x: auto; gap: 8px; padding: 10px 0; scrollbar-width: none; }
        .filter-scroll::-webkit-scrollbar { display: none; }
        .btn-filter { white-space: nowrap; padding: 8px 16px; border-radius: 20px; border: 1px solid ${COLORS.lightGray}; background: white; font-size: 13px; }
        .btn-filter.active { background: ${COLORS.primary}; color: white; border-color: ${COLORS.primary}; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 5%", background: "white", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
        <img src="/Logo.png" alt="SOIN" style={{ height: "35px", cursor: "pointer" }} onClick={() => setView("inicio")} className="active-effect" />
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <span onClick={() => setView("catalogo")} className="active-effect" style={{ fontSize: "14px", fontWeight: view === "catalogo" ? "bold" : "500" }}>Tienda</span>
          <button onClick={() => setOpenCart(true)} className="active-effect" style={{ background: COLORS.primary, color: "white", border: "none", borderRadius: "10px", padding: "8px 12px", position: "relative" }}>
            <ShoppingCart size={18} />
            {cart.length > 0 && <span style={{ position: "absolute", top: "-5px", right: "-5px", background: COLORS.secondary, color: "white", fontSize: "10px", width: "18px", height: "18px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid white" }}>{cart.length}</span>}
          </button>
        </div>
      </nav>

      {/* VISTA INICIO */}
      {view === "inicio" && (
        <>
          <img src="/soin-banner.png" style={{ width: "100%", height: "250px", objectFit: "cover" }} alt="Banner" />
          <div style={{ padding: "25px 15px", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.4rem", color: COLORS.primary, marginBottom: "20px" }}>Favoritos</h2>
            <div className="product-grid">
              {products.filter(p => p.featured).slice(0, 4).map(p => (
                <div key={p.id} className="active-effect" style={{ background: "white", borderRadius: "15px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }} onClick={() => setView("catalogo")}>
                  <img src={p.img} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
                  <div style={{ padding: "10px" }}>
                    <h4 style={{ fontSize: "12px", margin: "5px 0" }}>{p.name}</h4>
                    <span style={{ fontSize: "14px", fontWeight: "bold", color: COLORS.primary }}>${p.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setView("catalogo")} className="active-effect" style={{ marginTop: "25px", width: "100%", padding: "15px", background: COLORS.secondary, color: "white", border: "none", borderRadius: "15px", fontWeight: "bold" }}>Ver Todo el Catálogo</button>
          </div>
        </>
      )}

      {/* VISTA CATÁLOGO */}
      {view === "catalogo" && (
        <main style={{ padding: "15px" }}>
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#999" }} size={16} />
            <input 
              type="text" placeholder="¿Qué buscas hoy?" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "12px 12px 12px 40px", borderRadius: "12px", border: `1px solid ${COLORS.lightGray}`, outline: "none" }}
            />
          </div>

          <div className="filter-scroll">
            {["Todos", "Perro", "Gato"].map(p => (
              <button key={p} onClick={() => setFilterPet(p)} className={`btn-filter active-effect ${filterPet === p ? 'active' : ''}`}>{p}</button>
            ))}
          </div>
          <div className="filter-scroll">
            {["Todos", "Alimentos", "Snacks", "Accesorios", "Limpieza"].map(c => (
              <button key={c} onClick={() => setFilterCat(c)} className={`btn-filter active-effect ${filterCat === c ? 'active' : ''}`}>{c}</button>
            ))}
          </div>

          <div className="product-grid">
            {filteredProducts.slice(0, visibleCount).map(p => (
              <div key={p.id} style={{ background: "white", borderRadius: "15px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <img src={p.img} style={{ width: "100%", height: "130px", objectFit: "cover" }} />
                <div style={{ padding: "10px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <h4 style={{ fontSize: "12px", height: "30px", overflow: "hidden" }}>{p.name}</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "14px", fontWeight: "bold", color: COLORS.primary }}>${p.price.toLocaleString()}</span>
                    <button onClick={() => addToCart(p)} className="active-effect" style={{ background: COLORS.primary, color: "white", border: "none", borderRadius: "8px", padding: "6px" }}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* PANEL DEL CARRITO */}
      {openCart && (
        <>
          <div onClick={() => setOpenCart(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000 }} />
          <aside style={{ position: "fixed", top: 0, right: 0, width: "min(380px, 90%)", height: "100%", background: "white", zIndex: 1001, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px", borderBottom: `1px solid ${COLORS.lightGray}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Mi Carrito</h3>
              <X onClick={() => setOpenCart(false)} className="active-effect" />
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "15px" }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                  <img src={item.img} style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: "600" }}>{item.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Minus size={14} onClick={() => updateQuantity(item.id, -1)} />
                        <span>{item.quantity}</span>
                        <Plus size={14} onClick={() => updateQuantity(item.id, 1)} />
                      </div>
                      <span style={{ fontWeight: "bold" }}>${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
