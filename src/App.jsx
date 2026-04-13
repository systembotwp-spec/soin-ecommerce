import React, { useState, useMemo } from "react";
import { 
  ShoppingCart, X, Plus, Minus, Search, 
  MessageCircle, Trash2, CreditCard, ShieldCheck, Truck 
} from "lucide-react";

const COLORS = {
  primary: "#4f7c62",
  secondary: "#d4a373",
  background: "#fdfaf5",
  white: "#ffffff",
  text: "#2d3436",
  lightGray: "#e9ecef",
  whatsapp: "#25D366",
  danger: "#e74c3c"
};

export default function App() {
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [view, setView] = useState("inicio");
  const [filterPet, setFilterPet] = useState("Todos");
  const [filterCat, setFilterCat] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

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

  const removeItem = (id) => setCart(curr => curr.filter(i => i.id !== id));
  const subtotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);
  const shipping = subtotal > 100000 ? 0 : 12000;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.background, minHeight: "100vh", color: COLORS.text }}>
      <style>{`
        .active-effect:active { transform: scale(0.95); opacity: 0.8; transition: 0.1s; }
        .product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; padding: 15px; }
        @media (min-width: 768px) { .product-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; } }
        .filter-scroll { display: flex; overflow-x: auto; gap: 8px; padding: 10px 5%; scrollbar-width: none; }
        .filter-scroll::-webkit-scrollbar { display: none; }
        .btn-filter { white-space: nowrap; padding: 8px 18px; border-radius: 25px; border: 1px solid ${COLORS.lightGray}; background: white; font-size: 13px; font-weight: 500; cursor: pointer; }
        .btn-filter.active { background: ${COLORS.primary}; color: white; border-color: ${COLORS.primary}; }
        .card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: 0.3s; }
        .card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 5%", background: "white", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
        <img 
          src="/Logo.png" 
          alt="SOIN Logo" 
          style={{ height: "42px", cursor: "pointer" }} 
          onClick={() => setView("inicio")} 
          className="active-effect"
        />
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <span onClick={() => setView("catalogo")} className="active-effect" style={{ cursor: "pointer", fontSize: "14px", fontWeight: view === "catalogo" ? "700" : "500", color: COLORS.primary }}>TIENDA</span>
          <button onClick={() => setOpenCart(true)} className="active-effect" style={{ background: COLORS.primary, color: "white", border: "none", borderRadius: "12px", padding: "10px 14px", position: "relative", cursor: "pointer" }}>
            <ShoppingCart size={20} />
            {cart.length > 0 && <span style={{ position: "absolute", top: "-6px", right: "-6px", background: COLORS.secondary, color: "white", fontSize: "11px", fontWeight: "bold", padding: "2px 6px", borderRadius: "10px", border: "2px solid white" }}>{cart.length}</span>}
          </button>
        </div>
      </nav>

      {/* VISTA INICIO */}
      {view === "inicio" && (
        <>
          <div style={{ width: "100%", height: "280px", overflow: "hidden" }}>
            <img src="/soin-banner.png" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Banner Principal" />
          </div>
          
          <div style={{ padding: "40px 15px", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: "700", marginBottom: "30px", color: COLORS.primary }}>Selección Especial</h2>
            <div className="product-grid">
              {products.filter(p => p.featured).map(p => (
                <div key={p.id} className="card active-effect" onClick={() => setView("catalogo")}>
                  <img src={p.img} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                  <div style={{ padding: "15px", textAlign: "left" }}>
                    <h4 style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>{p.name}</h4>
                    <span style={{ fontWeight: "800", color: COLORS.primary }}>${p.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setView("catalogo")} className="active-effect" style={{ marginTop: "35px", width: "80%", maxWidth: "300px", padding: "16px", background: COLORS.secondary, border: "none", borderRadius: "30px", color: "white", fontWeight: "800", letterSpacing: "1px" }}>VER TODO EL CATÁLOGO</button>
          </div>
        </>
      )}

      {/* VISTA CATÁLOGO */}
      {view === "catalogo" && (
        <main style={{ paddingBottom: "40px" }}>
          <div style={{ padding: "20px 5% 10px" }}>
            <div style={{ position: "relative" }}>
              <Search style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#999" }} size={18} />
              <input 
                type="text" placeholder="¿Qué estás buscando?" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", padding: "14px 14px 14px 45px", borderRadius: "30px", border: "none", boxShadow: "0 2px 15px rgba(0,0,0,0.06)", outline: "none", fontSize: "15px" }}
              />
            </div>
          </div>

          <div className="filter-scroll">
            {["Todos", "Perro", "Gato"].map(p => (
              <button key={p} onClick={() => setFilterPet(p)} className={`btn-filter active-effect ${filterPet === p ? 'active' : ''}`}>{p}</button>
            ))}
          </div>
          <div className="filter-scroll" style={{ paddingTop: 0 }}>
            {["Todos", "Alimentos", "Snacks", "Accesorios", "Limpieza"].map(c => (
              <button key={c} onClick={() => setFilterCat(c)} className={`btn-filter active-effect ${filterCat === c ? 'active' : ''}`}>{c}</button>
            ))}
          </div>

          <div className="product-grid">
            {filteredProducts.map(p => (
              <div key={p.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
                <img src={p.img} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                <div style={{ padding: "12px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "10px", color: COLORS.secondary, fontWeight: "700", textTransform: "uppercase" }}>{p.category}</span>
                    <h4 style={{ fontSize: "14px", margin: "4px 0 10px", height: "35px", overflow: "hidden", lineHeight: "1.2" }}>{p.name}</h4>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "800", fontSize: "16px", color: COLORS.primary }}>${p.price.toLocaleString()}</span>
                    <button onClick={() => addToCart(p)} className="active-effect" style={{ background: COLORS.primary, color: "white", border: "none", borderRadius: "10px", padding: "8px" }}>
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* FOOTER VERDE PROFESIONAL */}
      <footer style={{ background: COLORS.primary, padding: "50px 5% 30px", color: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "40px" }}>
            <img src="/Logo.png" alt="Logo White" style={{ height: "45px", marginBottom: "20px", filter: "brightness(0) invert(1)" }} />
            <p style={{ fontSize: "14px", opacity: 0.9, lineHeight: "1.6", maxWidth: "400px" }}>Cuidamos lo que más quieres. Productos de alta calidad seleccionados especialmente para el bienestar de tus compañeros.</p>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "40px" }}>
            <div>
              <h5 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "15px", color: COLORS.secondary }}>LEGALES</h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", opacity: 0.8 }}>
                <span>Términos y Condiciones</span>
                <span>Política de Calidad</span>
                <span>Tratamiento de Datos</span>
              </div>
            </div>
            <div>
              <h5 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "15px", color: COLORS.secondary }}>AYUDA</h5>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", opacity: 0.8 }}>
                <span>Preguntas Frecuentes</span>
                <span>Envíos y Entregas</span>
                <span>Cambios y Garantías</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "30px" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px", opacity: 0.7 }}>
              <CreditCard size={22} /> <ShieldCheck size={22} /> <Truck size={22} />
            </div>
            <p style={{ fontSize: "11px", opacity: 0.6 }}>© 2026 SOIN Medellín - Expertos en Mascotas. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* CARRITO */}
      {openCart && (
        <>
          <div onClick={() => setOpenCart(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, backdropFilter: "blur(4px)" }} />
          <aside style={{ position: "fixed", top: 0, right: 0, width: "min(400px, 92%)", height: "100%", background: "white", zIndex: 1001, display: "flex", flexDirection: "column", boxShadow: "-10px 0 40px rgba(0,0,0,0.1)" }}>
            <div style={{ padding: "25px 20px", borderBottom: `1px solid ${COLORS.lightGray}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <ShoppingCart size={22} color={COLORS.primary} />
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700" }}>Tu Pedido</h3>
              </div>
              <X onClick={() => setOpenCart(false)} className="active-effect" style={{ cursor: "pointer" }} />
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "60px", opacity: 0.3 }}>
                  <ShoppingCart size={60} style={{ margin: "0 auto 20px" }} />
                  <p style={{ fontSize: "1.1rem" }}>No hay nada por aquí...</p>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "15px" }}>
                    <button onClick={() => {if(window.confirm("¿Vaciar el carrito?")) setCart([])}} style={{ background: "none", border: "none", color: COLORS.danger, fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                      <Trash2 size={14} /> LIMPIAR TODO
                    </button>
                  </div>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: "flex", gap: "15px", marginBottom: "25px", background: "#fcfcfc", padding: "10px", borderRadius: "15px" }}>
                      <img src={item.img} style={{ width: "70px", height: "70px", borderRadius: "10px", objectFit: "cover" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <h4 style={{ fontSize: "13px", fontWeight: "600", margin: 0 }}>{item.name}</h4>
                          <button onClick={() => removeItem(item.id)} style={{ border: "none", background: "none", padding: "2px", color: "#ccc" }}><X size={16} /></button>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "15px", background: "white", padding: "5px 12px", borderRadius: "20px", border: `1px solid ${COLORS.lightGray}` }}>
                            <Minus size={14} className="active-effect" onClick={() => updateQuantity(item.id, -1)} />
                            <span style={{ fontSize: "14px", fontWeight: "700" }}>{item.quantity}</span>
                            <Plus size={14} className="active-effect" onClick={() => updateQuantity(item.id, 1)} />
                          </div>
                          <span style={{ fontWeight: "800", color: COLORS.primary }}>${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: "25px 20px", background: "#fdfdfd", borderTop: `1px solid ${COLORS.lightGray}` }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "25px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", opacity: 0.7 }}>
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", opacity: 0.7 }}>
                    <span>Envío</span>
                    <span>{shipping === 0 ? "Gratis" : `$${shipping.toLocaleString()}`}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "800", color: COLORS.primary, marginTop: "10px" }}>
                    <span>Total a pagar</span>
                    <span>${(subtotal + shipping).toLocaleString()}</span>
                  </div>
                </div>
                <button className="active-effect" style={{ width: "100%", background: COLORS.primary, color: "white", border: "none", borderRadius: "16px", padding: "18px", fontWeight: "800", fontSize: "16px", boxShadow: "0 10px 20px rgba(79, 124, 98, 0.2)" }}>
                  FINALIZAR COMPRA
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      {/* WHATSAPP */}
      <a 
        href="https://wa.me/573158429286" 
        target="_blank" 
        rel="noreferrer" 
        className="active-effect"
        style={{ position: "fixed", bottom: "30px", right: "20px", background: COLORS.whatsapp, color: "white", width: "60px", height: "60px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 6px 20px rgba(37, 211, 102, 0.4)", zIndex: 999 }}
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
}
