import React, { useState } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle, Phone, Mail, MapPin } from "lucide-react";

const COLORS = {
  primary: "#4f7c62",
  secondary: "#d4a373",
  background: "#fdfaf5",
  white: "#ffffff",
  text: "#2d3436",
  lightGray: "#f1f2f6",
  whatsapp: "#25D366"
};

export default function App() {
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [view, setView] = useState("inicio");

  const products = [
    { id: 1, name: "Alimento Premium Perro", price: 85000, category: "Alimentos", pet: "Perro", featured: true, img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4" },
    { id: 2, name: "Snacks Naturales Gato", price: 20000, category: "Snacks", pet: "Gato", featured: true, img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1" },
    { id: 3, name: "Collar de Cuero Perro", price: 25000, category: "Accesorios", pet: "Perro", featured: false, img: "https://images.unsplash.com/photo-1601758064224-16b7d9e9a4e4" },
    { id: 4, name: "Arena Sanitaria Gato", price: 45000, category: "Limpieza", pet: "Gato", featured: false, img: "https://images.unsplash.com/photo-1598137269279-2f6f7b1f6c7c" }
  ];

  // Lógica de Carrito Reparada
  const addToCart = (p) => {
    setCart(curr => {
      const exist = curr.find(i => i.id === p.id);
      if (exist) {
        return curr.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...curr, { ...p, quantity: 1 }];
    });
    setOpenCart(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(curr => curr.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  };

  const remove = id => setCart(curr => curr.filter(i => i.id !== id));
  const total = cart.reduce((a, i) => a + i.price * i.quantity, 0);

  // Estilo de botón con efecto "Press"
  const interactiveBtn = {
    cursor: "pointer",
    transition: "all 0.1s active",
    border: "none",
    outline: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const ProductCard = ({ p }) => (
    <div style={{ background: COLORS.white, borderRadius: "20px", overflow: "hidden", boxShadow: "0 8px 20px rgba(0,0,0,0.04)", position: "relative" }}>
      {p.featured && <span style={{ position: "absolute", top: "10px", left: "10px", background: COLORS.secondary, color: "white", padding: "4px 12px", borderRadius: "10px", fontSize: "10px", fontWeight: "bold", zIndex: 1 }}>DESTACADO</span>}
      <img src={p.img} style={{ width: "100%", height: "200px", objectFit: "cover" }} alt={p.name} />
      <div style={{ padding: "15px" }}>
        <h4 style={{ margin: "0 0 10px 0", fontSize: "0.95rem" }}>{p.name}</h4>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: "bold", color: COLORS.primary }}>${p.price.toLocaleString()}</span>
          <button 
            onClick={() => addToCart(p)} 
            className="btn-click-effect"
            style={{ ...interactiveBtn, background: COLORS.primary, color: "white", borderRadius: "8px", padding: "10px" }}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.background, minHeight: "100vh" }}>
      
      {/* CSS para el efecto de clic (puedes moverlo a tu archivo .css) */}
      <style>{`
        .btn-click-effect:active { transform: scale(0.92); opacity: 0.8; }
        .nav-link:hover { color: ${COLORS.secondary} !important; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 5%", background: "white", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: COLORS.primary, cursor: "pointer" }} onClick={() => setView("inicio")}>SOIN</div>
        <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
          {["inicio", "catalogo", "contacto"].map(v => (
            <span key={v} className="nav-link" onClick={() => setView(v)} style={{ cursor: "pointer", textTransform: "capitalize", fontWeight: view === v ? "bold" : "500", color: view === v ? COLORS.primary : COLORS.text, transition: "0.2s" }}>
              {v}
            </span>
          ))}
          <button 
            onClick={() => setOpenCart(true)} 
            className="btn-click-effect"
            style={{ ...interactiveBtn, background: COLORS.primary, color: "white", borderRadius: "10px", padding: "8px 18px", gap: "8px" }}
          >
            <ShoppingCart size={18}/> 
            <span style={{ fontWeight: "bold" }}>{cart.length}</span>
          </button>
        </div>
      </nav>

      {/* SECCIÓN HERO - Sin títulos sobrepuestos */}
      {view === "inicio" && (
        <>
          <div style={{ width: "100%", overflow: "hidden" }}>
             <img src="/Banner.jpg" style={{ width: "100%", maxHeight: "450px", objectFit: "cover", display: "block" }} alt="Banner Principal Soin" />
          </div>

          <div style={{ background: COLORS.white, padding: "40px 5%", textAlign: "center", borderBottom: `1px solid ${COLORS.lightGray}` }}>
             <h1 style={{ color: COLORS.primary, margin: "0 0 10px 0", fontSize: "2rem" }}>Todo lo que tu mascota necesita</h1>
             <p style={{ color: "#666", maxWidth: "600px", margin: "0 auto 20px auto" }}>Cuidado, amor y bienestar para quienes siempre están contigo.</p>
             <button onClick={() => setView("catalogo")} className="btn-click-effect" style={{ ...interactiveBtn, margin: "0 auto", padding: "12px 35px", background: COLORS.secondary, color: "white", borderRadius: "30px", fontWeight: "bold" }}>Ir a la Tienda</button>
          </div>

          <section style={{ padding: "50px 5%" }}>
            <h2 style={{ textAlign: "center", marginBottom: "30px", color: COLORS.primary, fontWeight: "700" }}>Productos Destacados</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "25px" }}>
              {products.filter(p => p.featured).map(p => <ProductCard key={p.id} p={p} />)}
            </div>
          </section>
        </>
      )}

      {/* VISTAS RESTANTES */}
      {view === "catalogo" && (
        <section style={{ padding: "40px 5%" }}>
          <h2 style={{ marginBottom: "30px", color: COLORS.primary }}>Catálogo Completo</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "25px" }}>
            {products.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      {view === "contacto" && (
        <section style={{ padding: "60px 5%", maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ background: "white", padding: "40px", borderRadius: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <h2 style={{ color: COLORS.primary, marginBottom: "30px" }}>Contáctenos</h2>
            <div style={{ display: "grid", gap: "20px" }}>
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}><Phone size={20} color={COLORS.secondary}/> +57 300 123 4567</div>
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}><Mail size={20} color={COLORS.secondary}/> contacto@soin.com</div>
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}><MapPin size={20} color={COLORS.secondary}/> Medellín, Colombia</div>
              <input type="text" placeholder="Tu nombre" style={{ padding: "12px", borderRadius: "10px", border: `1px solid ${COLORS.lightGray}`, outline: "none" }} />
              <textarea placeholder="Mensaje" rows="4" style={{ padding: "12px", borderRadius: "10px", border: `1px solid ${COLORS.lightGray}`, outline: "none" }}></textarea>
              <button className="btn-click-effect" style={{ ...interactiveBtn, background: COLORS.primary, color: "white", padding: "15px", borderRadius: "10px", fontWeight: "bold" }}>Enviar Mensaje</button>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ background: COLORS.primary, color: "white", padding: "50px 5% 20px 5%", marginTop: "50px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "40px" }}>
          <div>
            <h3 style={{ color: COLORS.secondary, margin: "0 0 15px 0" }}>SOIN</h3>
            <p style={{ opacity: 0.8, fontSize: "14px", lineHeight: "1.6" }}>Bienestar para tu mascota en un solo lugar.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: "15px" }}>Políticas</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", opacity: 0.8 }}>
              <span style={{ cursor: "pointer" }}>Términos de servicio</span>
              <span style={{ cursor: "pointer" }}>Privacidad de datos</span>
              <span style={{ cursor: "pointer" }}>Envíos y devoluciones</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", textAlign: "center", fontSize: "12px", opacity: 0.6 }}>
          © 2026 SOIN. Todos los derechos reservados.
        </div>
      </footer>

      {/* CARRITO REPARADO */}
      {openCart && (
        <>
          <div onClick={() => setOpenCart(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, backdropFilter: "blur(2px)" }} />
          <aside style={{ position: "fixed", top: 0, right: 0, width: "min(380px, 90%)", height: "100%", background: "white", zIndex: 300, display: "flex", flexDirection: "column", boxShadow: "-5px 0 25px rgba(0,0,0,0.1)" }}>
            <div style={{ padding: "20px", borderBottom: `1px solid ${COLORS.lightGray}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Tu Carrito</h3>
              <X onClick={() => setOpenCart(false)} style={{ cursor: "pointer" }} />
            </div>
            
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              {cart.length === 0 ? (
                <p style={{ textAlign: "center", color: "#999", marginTop: "40px" }}>No hay productos aún.</p>
              ) : cart.map(item => (
                <div key={item.id} style={{ display: "flex", gap: "12px", marginBottom: "15px", paddingBottom: "15px", borderBottom: `1px solid ${COLORS.lightGray}` }}>
                  <img src={item.img} style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>{item.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", background: COLORS.lightGray, borderRadius: "15px", padding: "2px 10px" }}>
                        <Minus size={14} style={{ cursor: "pointer" }} onClick={() => updateQuantity(item.id, -1)} />
                        <span style={{ fontSize: "13px", fontWeight: "bold" }}>{item.quantity}</span>
                        <Plus size={14} style={{ cursor: "pointer" }} onClick={() => updateQuantity(item.id, 1)} />
                      </div>
                      <span style={{ fontWeight: "bold", fontSize: "14px" }}>${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "20px", background: COLORS.background }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", fontWeight: "bold" }}>
                <span>Subtotal:</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <button className="btn-click-effect" style={{ ...interactiveBtn, width: "100%", background: COLORS.primary, color: "white", padding: "15px", borderRadius: "12px", fontWeight: "bold" }}>Finalizar Pedido</button>
            </div>
          </aside>
        </>
      )}

      {/* WHATSAPP */}
      <a href="https://wa.me/573001234567" target="_blank" rel="noreferrer" className="btn-click-effect" style={{ position: "fixed", bottom: "30px", right: "30px", background: COLORS.whatsapp, color: "white", width: "55px", height: "55px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 8px 20px rgba(37, 211, 102, 0.3)", zIndex: 1000 }}>
        <MessageCircle size={28} />
      </a>

    </div>
  );
}
