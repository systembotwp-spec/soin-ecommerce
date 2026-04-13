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
  const [visibleCount, setVisibleCount] = useState(6); // Empezamos con 6 para llenar 3 filas en móvil

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

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.background, minHeight: "100vh" }}>
      
      {/* CSS RESPONSIVO PARA MÓVIL */}
      <style>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr); /* 2 productos en móvil */
          gap: 12px;
          padding: 10px;
        }
        @media (min-width: 768px) {
          .product-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 25px; padding: 0; }
        }
        .filter-scroll {
          display: flex;
          overflow-x: auto;
          gap: 8px;
          padding: 10px 0;
          scrollbar-width: none; /* Ocultar scroll en Firefox */
        }
        .filter-scroll::-webkit-scrollbar { display: none; } /* Ocultar scroll en Chrome/Safari */
        
        .btn-filter {
          white-space: nowrap;
          padding: 8px 16px;
          border-radius: 20px;
          border: 1px solid ${COLORS.lightGray};
          background: white;
          font-size: 13px;
          cursor: pointer;
        }
        .btn-filter.active { background: ${COLORS.primary}; color: white; border-color: ${COLORS.primary}; }
        
        .product-card-mobile {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
        }
        .product-info { padding: 10px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
        .product-title { font-size: 13px; margin: 5px 0; line-height: 1.2; color: ${COLORS.text}; height: 32px; overflow: hidden; }
        .product-price { font-size: 15px; fontWeight: 800; color: ${COLORS.primary}; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 5%", background: "white", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
        <img src="/Logo.png" alt="SOIN" style={{ height: "35px" }} onClick={() => setView("inicio")} />
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <span onClick={() => setView("catalogo")} style={{ fontSize: "14px", fontWeight: view === "catalogo" ? "bold" : "500" }}>Tienda</span>
          <button onClick={() => setOpenCart(true)} style={{ background: COLORS.primary, color: "white", border: "none", borderRadius: "10px", padding: "8px 12px", position: "relative" }}>
            <ShoppingCart size={18} />
            {cart.length > 0 && <span style={{ position: "absolute", top: "-5px", right: "-5px", background: COLORS.secondary, color: "white", fontSize: "10px", width: "18px", height: "18px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", border: "2px solid white" }}>{cart.length}</span>}
          </button>
        </div>
      </nav>

      {/* VISTA CATÁLOGO MÓVIL */}
      {view === "catalogo" && (
        <main style={{ padding: "15px" }}>
          {/* BUSCADOR COMPACTO */}
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#999" }} size={16} />
            <input 
              type="text" 
              placeholder="¿Qué buscas hoy?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", padding: "12px 12px 12px 40px", borderRadius: "12px", border: `1px solid ${COLORS.lightGray}`, outline: "none", fontSize: "14px" }}
            />
          </div>

          {/* FILTROS CARRUSEL */}
          <div className="filter-scroll">
            {["Todos", "Perro", "Gato"].map(p => (
              <button key={p} onClick={() => setFilterPet(p)} className={`btn-filter ${filterPet === p ? 'active' : ''}`}>{p}</button>
            ))}
          </div>
          <div className="filter-scroll" style={{ marginTop: "-5px" }}>
            {["Todos", "Alimentos", "Snacks", "Accesorios", "Limpieza"].map(c => (
              <button key={c} onClick={() => setFilterCat(c)} className={`btn-filter ${filterCat === c ? 'active' : ''}`}>{c}</button>
            ))}
          </div>

          {/* GRID DE PRODUCTOS */}
          <div className="product-grid" style={{ marginTop: "10px" }}>
            {filteredProducts.slice(0, visibleCount).map(p => (
              <div key={p.id} className="product-card-mobile">
                <img src={p.img} style={{ width: "100%", height: "140px", objectFit: "cover" }} alt={p.name} />
                <div className="product-info">
                  <span style={{ fontSize: "10px", color: COLORS.secondary, fontWeight: "bold" }}>{p.category}</span>
                  <h4 className="product-title">{p.name}</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
                    <span className="product-price">${p.price.toLocaleString()}</span>
                    <button onClick={() => addToCart(p)} style={{ background: COLORS.primary, color: "white", border: "none", borderRadius: "8px", padding: "6px" }}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* VER MÁS */}
          {visibleCount < filteredProducts.length && (
            <button onClick={() => setVisibleCount(v => v + 4)} style={{ width: "100%", marginTop: "20px", padding: "12px", background: "white", border: `1px solid ${COLORS.primary}`, color: COLORS.primary, borderRadius: "12px", fontWeight: "bold" }}>
              Ver más productos
            </button>
          )}
        </main>
      )}

      {/* VISTA INICIO SIMPLIFICADA */}
      {view === "inicio" && (
        <>
          <img src="/soin-banner.png" style={{ width: "100%", height: "250px", objectFit: "cover" }} />
          <div style={{ padding: "25px 15px", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.5rem", color: COLORS.primary }}>Favoritos de la semana</h2>
            <div className="product-grid">
              {products.filter(p => p.featured).slice(0, 4).map(p => (
                <div key={p.id} className="product-card-mobile" onClick={() => setView("catalogo")}>
                  <img src={p.img} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
                  <div className="product-info">
                    <h4 className="product-title" style={{ fontSize: "12px" }}>{p.name}</h4>
                    <span className="product-price" style={{ fontSize: "14px" }}>${p.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setView("catalogo")} style={{ marginTop: "25px", width: "100%", padding: "15px", background: COLORS.secondary, color: "white", border: "none", borderRadius: "15px", fontWeight: "bold" }}>Explorar Catálogo</button>
          </div>
        </>
      )}

      {/* FOOTER MÓVIL */}
      <footer style={{ background: COLORS.primary, color: "white", padding: "30px 15px", marginTop: "40px", textAlign: "center" }}>
        <img src="/Logo.png" style={{ height: "30px", filter: "brightness(0) invert(1)", marginBottom: "15px" }} />
        <p style={{ fontSize: "12px", opacity: 0.7 }}>© 2026 SOIN - Medellín, Colombia</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "15px", fontSize: "12px", textDecoration: "underline" }}>
          <span>Políticas</span>
          <span>Privacidad</span>
        </div>
      </footer>

      {/* BOTÓN WHATSAPP MÁS PEQUEÑO PARA MÓVIL */}
      <a href="https://wa.me/573001234567" style={{ position: "fixed", bottom: "20px", right: "20px", background: COLORS.whatsapp, color: "white", width: "50px", height: "50px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 5px 15px rgba(0,0,0,0.2)", zIndex: 1000 }}>
        <MessageCircle size={24} />
      </a>
      
      {/* (Lógica de Carrito Aside se mantiene igual, se adapta automáticamente por el ancho "min(400px, 90%)") */}
    </div>
  );
}
