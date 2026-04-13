import React, { useState, useMemo } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle, Search, SlidersHorizontal } from "lucide-react";

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
  const [animateCart, setAnimateCart] = useState(false);

  // ESTADOS DE FILTRO Y BÚSQUEDA
  const [filterPet, setFilterPet] = useState("Todos");
  const [filterCat, setFilterCat] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);

  const products = [
    { id: 1, name: "Alimento Premium Perro", price: 85000, category: "Alimentos", pet: "Perro", featured: true, img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4" },
    { id: 2, name: "Snacks Naturales Gato", price: 20000, category: "Snacks", pet: "Gato", featured: true, img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1" },
    { id: 3, name: "Collar de Cuero Perro", price: 25000, category: "Accesorios", pet: "Perro", featured: true, img: "https://images.unsplash.com/photo-1601758064224-16b7d9e9a4e4" },
    { id: 4, name: "Arena Sanitaria Gato", price: 45000, category: "Limpieza", pet: "Gato", featured: true, img: "https://images.unsplash.com/photo-1598137269279-2f6f7b1f6c7c" },
    { id: 5, name: "Juguete Mordedor Goma", price: 15000, category: "Accesorios", pet: "Perro", featured: false, img: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97" },
    { id: 6, name: "Shampoo Hipoalergénico", price: 32000, category: "Limpieza", pet: "Perro", featured: false, img: "https://images.unsplash.com/photo-1583947581924-860bda6a26df" },
    { id: 7, name: "Cama Ortopédica Zen", price: 120000, category: "Accesorios", pet: "Gato", featured: false, img: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6" },
    { id: 8, name: "Fuente de Agua Inox", price: 95000, category: "Accesorios", pet: "Gato", featured: false, img: "https://images.unsplash.com/photo-1553736026-ff14d1f8d7f9" },
    { id: 9, name: "Cepillo Dental Kit", price: 12000, category: "Limpieza", pet: "Todos", featured: false, img: "https://images.unsplash.com/photo-1541480601022-23057d167483" }
  ];

  // LÓGICA DE FILTRADO MAESTRA (Incluye Búsqueda por texto)
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
    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 500);
  };

  const updateQuantity = (id, delta) => {
    setCart(curr => curr.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  };

  const total = cart.reduce((a, i) => a + i.price * i.quantity, 0);

  const ProductCard = ({ p }) => (
    <div className="product-card" style={{ background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.03)", transition: "0.3s" }}>
      <img src={p.img} style={{ width: "100%", height: "200px", objectFit: "cover" }} alt={p.name} />
      <div style={{ padding: "15px" }}>
        <div style={{ fontSize: "11px", color: COLORS.secondary, fontWeight: "800", marginBottom: "5px" }}>{p.category.toUpperCase()}</div>
        <h4 style={{ margin: "0 0 10px 0", fontSize: "0.95rem", height: "40px" }}>{p.name}</h4>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: "800", color: COLORS.primary }}>${p.price.toLocaleString()}</span>
          <button onClick={() => addToCart(p)} className="btn-hover" style={{ background: COLORS.primary, color: "white", border: "none", borderRadius: "10px", padding: "8px", cursor: "pointer" }}>
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.background, minHeight: "100vh" }}>
      
      <style>{`
        .btn-hover:active { transform: scale(0.92); }
        .filter-chip { border: 1px solid ${COLORS.lightGray}; background: white; padding: 8px 16px; border-radius: 20px; cursor: pointer; transition: 0.2s; font-size: 13px; }
        .filter-chip.active { background: ${COLORS.primary}; color: white; border-color: ${COLORS.primary}; }
        .search-input:focus { border-color: ${COLORS.secondary} !important; box-shadow: 0 0 0 3px rgba(212, 163, 115, 0.1); }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 5%", background: "white", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <img src="/Logo.png" alt="SOIN" style={{ height: "40px", cursor: "pointer" }} onClick={() => setView("inicio")} />
        <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
          <span onClick={() => setView("catalogo")} style={{ cursor: "pointer", fontWeight: view === "catalogo" ? "700" : "500" }}>Catálogo</span>
          <span onClick={() => setView("contacto")} style={{ cursor: "pointer", fontWeight: view === "contacto" ? "700" : "500" }}>Contacto</span>
          <button onClick={() => setOpenCart(true)} className={`btn-hover ${animateCart ? 'animate-cart' : ''}`} style={{ background: COLORS.primary, color: "white", border: "none", borderRadius: "10px", padding: "8px 18px", cursor: "pointer" }}>
            <ShoppingCart size={18} /> ({cart.length})
          </button>
        </div>
      </nav>

      {/* VISTA: INICIO */}
      {view === "inicio" && (
        <>
          <img src="/soin-banner.png" style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }} />
          <div style={{ padding: "60px 5%", textAlign: "center" }}>
            <h2 style={{ color: COLORS.primary, marginBottom: "40px" }}>Productos Destacados</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px", maxWidth: "1200px", margin: "0 auto" }}>
              {products.filter(p => p.featured).slice(0, 4).map(p => <ProductCard key={p.id} p={p} />)}
            </div>
            <button onClick={() => setView("catalogo")} className="btn-hover" style={{ marginTop: "40px", padding: "15px 40px", background: COLORS.secondary, color: "white", border: "none", borderRadius: "30px", fontWeight: "bold" }}>Ver Todo el Catálogo</button>
          </div>
        </>
      )}

      {/* VISTA: CATÁLOGO */}
      {view === "catalogo" && (
        <section style={{ padding: "30px 5%" }}>
          <h2 style={{ color: COLORS.primary, marginBottom: "25px" }}>Encuentra lo mejor</h2>
          
          {/* BARRA DE BÚSQUEDA Y FILTROS */}
          <div style={{ background: "white", padding: "25px", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.02)", marginBottom: "30px" }}>
            
            {/* BUSCADOR */}
            <div style={{ position: "relative", marginBottom: "25px" }}>
              <Search style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#999" }} size={20} />
              <input 
                type="text" 
                placeholder="Busca por nombre (ej: Alimento, Collar...)" 
                className="search-input"
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); setVisibleCount(3);}}
                style={{ width: "100%", padding: "15px 15px 15px 45px", borderRadius: "15px", border: `1px solid ${COLORS.lightGray}`, outline: "none", fontSize: "16px", transition: "0.3s" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#999", width: "80px" }}>MASCOTA:</span>
                {["Todos", "Perro", "Gato"].map(p => (
                  <button key={p} onClick={() => {setFilterPet(p); setVisibleCount(3);}} className={`filter-chip ${filterPet === p ? 'active' : ''}`}>{p}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#999", width: "80px" }}>TIPO:</span>
                {["Todos", "Alimentos", "Snacks", "Accesorios", "Limpieza"].map(c => (
                  <button key={c} onClick={() => {setFilterCat(c); setVisibleCount(3);}} className={`filter-chip ${filterCat === c ? 'active' : ''}`}>{c}</button>
                ))}
              </div>
            </div>
          </div>

          {/* RESULTADOS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "25px" }}>
            {filteredProducts.slice(0, visibleCount).map(p => <ProductCard key={p.id} p={p} />)}
          </div>

          {/* BOTÓN VER MÁS */}
          {visibleCount < filteredProducts.length && (
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <button onClick={() => setVisibleCount(prev => Math.min(prev + 3, 9))} style={{ padding: "12px 35px", background: "white", border: `2px solid ${COLORS.primary}`, color: COLORS.primary, borderRadius: "25px", fontWeight: "bold", cursor: "pointer" }}>Mostrar más productos</button>
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <Search size={48} color="#ccc" style={{ marginBottom: "15px" }} />
              <p style={{ color: "#666", fontSize: "1.1rem" }}>No encontramos resultados para "<strong>{searchQuery}</strong>"</p>
              <button onClick={() => {setSearchQuery(""); setFilterPet("Todos"); setFilterCat("Todos");}} style={{ marginTop: "15px", background: "none", border: "none", color: COLORS.secondary, fontWeight: "bold", textDecoration: "underline", cursor: "pointer" }}>Limpiar todos los filtros</button>
            </div>
          )}
        </section>
      )}

      {/* VISTA: CONTACTO (Simulado) */}
      {view === "contacto" && (
        <section style={{ padding: "60px 5%", textAlign: "center" }}>
          <h2>¿Tienes dudas?</h2>
          <p>Escríbenos directamente a nuestro WhatsApp para una atención personalizada.</p>
          <a href="https://wa.me/573001234567" style={{ display: "inline-block", marginTop: "20px", padding: "15px 40px", background: COLORS.whatsapp, color: "white", borderRadius: "30px", textDecoration: "none", fontWeight: "bold" }}>Hablar con un asesor</a>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ background: COLORS.primary, color: "white", padding: "50px 5% 20px 5%", marginTop: "50px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px" }}>
          <div>
            <h3 style={{ color: COLORS.secondary }}>SOIN</h3>
            <p style={{ opacity: 0.7, fontSize: "14px" }}>Calidad y amor para tus mascotas.</p>
          </div>
          <div style={{ fontSize: "14px", opacity: 0.7 }}>
            <h4 style={{ color: "white", opacity: 1 }}>Legal</h4>
            <p>Privacidad de datos</p>
            <p>Políticas de envío</p>
          </div>
        </div>
      </footer>

      {/* CARRITO ASIDE (Mismo diseño reparado) */}
      {openCart && (
        <>
          <div onClick={() => setOpenCart(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200 }} />
          <aside style={{ position: "fixed", top: 0, right: 0, width: "min(400px, 90%)", height: "100%", background: "white", zIndex: 300, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px", borderBottom: `1px solid ${COLORS.lightGray}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Pedido</h3>
              <X onClick={() => setOpenCart(false)} style={{ cursor: "pointer" }} />
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", gap: "12px", marginBottom: "15px" }}>
                  <img src={item.img} style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: "600" }}>{item.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
                      <div style={{ display: "flex", gap: "10px" }}>
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
            <div style={{ padding: "20px", background: COLORS.background }}>
              <button style={{ width: "100%", background: COLORS.primary, color: "white", border: "none", padding: "15px", borderRadius: "10px", fontWeight: "bold" }}>Finalizar Pago</button>
            </div>
          </aside>
        </>
      )}

      {/* WHATSAPP FLOAT */}
      <a href="https://wa.me/573001234567" style={{ position: "fixed", bottom: "30px", right: "30px", background: COLORS.whatsapp, color: "white", width: "60px", height: "60px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 10px 20px rgba(0,0,0,0.2)", zIndex: 1000 }}>
        <MessageCircle size={30} />
      </a>
    </div>
  );
}
