import React, { useState, useEffect } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle, Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";

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
  const [view, setView] = useState("catalogo");
  const [animateCart, setAnimateCart] = useState(false);

  // Lógica de Carrito Mejorada
  const addToCart = (p) => {
    setCart(curr => {
      const exist = curr.find(i => i.id === p.id);
      if (exist) {
        return curr.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...curr, { ...p, quantity: 1 }];
    });
    
    // Notificación visual en el botón del carrito en lugar de abrirlo
    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 500);
  };

  const updateQuantity = (id, delta) => {
    setCart(curr => curr.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  };

  const total = cart.reduce((a, i) => a + i.price * i.quantity, 0);
  const totalItems = cart.reduce((a, i) => a + i.quantity, 0);

  const products = [
    { id: 1, name: "Alimento Premium Perro", price: 85000, category: "Alimentos", pet: "Perro", featured: true, img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4" },
    { id: 2, name: "Snacks Naturales Gato", price: 20000, category: "Snacks", pet: "Gato", featured: true, img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1" },
    { id: 3, name: "Collar de Cuero Perro", price: 25000, category: "Accesorios", pet: "Perro", featured: false, img: "https://images.unsplash.com/photo-1601758064224-16b7d9e9a4e4" },
    { id: 4, name: "Arena Sanitaria Gato", price: 45000, category: "Limpieza", pet: "Gato", featured: false, img: "https://images.unsplash.com/photo-1598137269279-2f6f7b1f6c7c" }
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.background, minHeight: "100vh" }}>
      
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); background: ${COLORS.secondary}; }
          100% { transform: scale(1); }
        }
        .animate-cart { animation: pulse 0.5s ease-in-out; }
        .btn-hover:active { transform: scale(0.95); opacity: 0.9; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 12px 25px rgba(0,0,0,0.08) !important; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 5%", background: "white", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <img 
          src="/Logo.png" 
          alt="SOIN" 
          style={{ height: "45px", cursor: "pointer" }} 
          onClick={() => setView("catalogo")} 
        />
        
        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          {["catalogo", "contacto"].map(v => (
            <span key={v} onClick={() => setView(v)} style={{ cursor: "pointer", textTransform: "capitalize", fontWeight: view === v ? "700" : "500", color: view === v ? COLORS.primary : COLORS.text, fontSize: "15px" }}>
              {v}
            </span>
          ))}
          
          <button 
            onClick={() => setOpenCart(true)} 
            className={`btn-hover ${animateCart ? 'animate-cart' : ''}`}
            style={{ border: "none", background: COLORS.primary, color: "white", borderRadius: "12px", padding: "10px 20px", display: "flex", gap: "10px", alignItems: "center", cursor: "pointer", transition: "0.3s" }}
          >
            <ShoppingCart size={20}/> 
            <span style={{ fontWeight: "bold", borderLeft: "1px solid rgba(255,255,255,0.3)", paddingLeft: "10px" }}>{totalItems}</span>
          </button>
        </div>
      </nav>

      {/* HERO BANNER - Corregido */}
      {view === "catalogo" && (
        <div style={{ width: "100%", background: "white" }}>
          <img src="/soin-banner.png" style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }} alt="Mascotas Felices" />
          <div style={{ padding: "40px 5%", textAlign: "center" }}>
            <h1 style={{ color: COLORS.primary, fontSize: "2.2rem", marginBottom: "10px" }}>Bienestar para tu mejor amigo</h1>
            <p style={{ color: "#666", fontSize: "1.1rem" }}>Calidad premium en alimentación y accesorios.</p>
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ padding: "20px 5% 60px 5%" }}>
        {view === "catalogo" ? (
          <>
            <h2 style={{ color: COLORS.primary, marginBottom: "30px", fontWeight: "800" }}>Nuestro Catálogo</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "30px" }}>
              {products.map(p => (
                <div key={p.id} className="product-card" style={{ background: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 6px 15px rgba(0,0,0,0.03)", transition: "0.3s" }}>
                  <img src={p.img} style={{ width: "100%", height: "220px", objectFit: "cover" }} alt={p.name} />
                  <div style={{ padding: "20px" }}>
                    <div style={{ fontSize: "12px", color: COLORS.secondary, fontWeight: "bold", marginBottom: "5px" }}>{p.pet.toUpperCase()}</div>
                    <h3 style={{ margin: "0 0 15px 0", fontSize: "1.1rem", height: "45px", overflow: "hidden" }}>{p.name}</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "1.3rem", fontWeight: "800", color: COLORS.primary }}>${p.price.toLocaleString()}</span>
                      <button 
                        onClick={() => addToCart(p)} 
                        className="btn-hover"
                        style={{ background: COLORS.primary, color: "white", border: "none", borderRadius: "12px", padding: "10px", cursor: "pointer" }}
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ maxWidth: "600px", margin: "40px auto", background: "white", padding: "40px", borderRadius: "30px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
            <h2 style={{ color: COLORS.primary, marginBottom: "25px" }}>¿Cómo podemos ayudarte?</h2>
            <div style={{ display: "grid", gap: "15px" }}>
              <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
                <div style={{ flex: 1 }}><label style={{ fontSize: "14px", fontWeight: "600" }}>Nombre</label><input type="text" style={{ width: "100%", padding: "12px", borderRadius: "10px", border: `1px solid ${COLORS.lightGray}`, marginTop: "5px" }} /></div>
                <div style={{ flex: 1 }}><label style={{ fontSize: "14px", fontWeight: "600" }}>Correo</label><input type="email" style={{ width: "100%", padding: "12px", borderRadius: "10px", border: `1px solid ${COLORS.lightGray}`, marginTop: "5px" }} /></div>
              </div>
              <label style={{ fontSize: "14px", fontWeight: "600" }}>Mensaje</label>
              <textarea rows="4" style={{ width: "100%", padding: "12px", borderRadius: "10px", border: `1px solid ${COLORS.lightGray}` }}></textarea>
              <button className="btn-hover" style={{ background: COLORS.primary, color: "white", border: "none", padding: "15px", borderRadius: "15px", fontWeight: "bold", fontSize: "1rem", cursor: "pointer", marginTop: "10px" }}>Enviar Mensaje</button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER CON POLÍTICAS */}
      <footer style={{ background: COLORS.primary, color: "white", padding: "60px 5% 30px 5%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "40px", marginBottom: "40px" }}>
          <div>
            <img src="/Logo.png" alt="Soin" style={{ height: "40px", filter: "brightness(0) invert(1)", marginBottom: "20px" }} />
            <p style={{ opacity: 0.7, fontSize: "14px", lineHeight: "1.6" }}>Cuidado, amor y bienestar para los miembros más especiales de tu familia.</p>
          </div>
          <div>
            <h4 style={{ color: COLORS.secondary, marginBottom: "20px" }}>Información Legal</h4>
            <ul style={{ listStyle: "none", padding: 0, fontSize: "14px", opacity: 0.8, lineHeight: "2" }}>
              <li style={{ cursor: "pointer" }}>Términos y Condiciones</li>
              <li style={{ cursor: "pointer" }}>Políticas de Privacidad</li>
              <li style={{ cursor: "pointer" }}>Políticas de Devolución</li>
              <li style={{ cursor: "pointer" }}>Derecho de Retracto</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: COLORS.secondary, marginBottom: "20px" }}>Contacto Directo</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", opacity: 0.8 }}>
              <span style={{ display: "flex", gap: "10px" }}><Phone size={16}/> +57 300 123 4567</span>
              <span style={{ display: "flex", gap: "10px" }}><Mail size={16}/> ventas@soin.com</span>
              <span style={{ display: "flex", gap: "10px" }}><MapPin size={16}/> Medellín, Colombia</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", textAlign: "center", fontSize: "12px", opacity: 0.5 }}>
          © 2026 SOIN MASCOTAS. Todos los derechos reservados.
        </div>
      </footer>

      {/* CARRITO (ASIDE) */}
      {openCart && (
        <>
          <div onClick={() => setOpenCart(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, backdropFilter: "blur(4px)" }} />
          <aside style={{ position: "fixed", top: 0, right: 0, width: "min(400px, 95%)", height: "100%", background: "white", zIndex: 300, display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "25px", borderBottom: `1px solid ${COLORS.lightGray}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Tu Compra</h3>
              <X onClick={() => setOpenCart(false)} style={{ cursor: "pointer" }} />
            </div>
            
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "100px" }}>
                   <ShoppingCart size={48} color="#ccc" style={{ marginBottom: "15px" }} />
                   <p style={{ color: "#999" }}>Tu carrito está esperando por productos.</p>
                </div>
              ) : cart.map(item => (
                <div key={item.id} style={{ display: "flex", gap: "15px", marginBottom: "20px", borderBottom: `1px solid ${COLORS.lightGray}`, paddingBottom: "15px" }}>
                  <img src={item.img} style={{ width: "70px", height: "70px", borderRadius: "12px", objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>{item.name}</h4>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", background: COLORS.lightGray, borderRadius: "20px", padding: "5px 12px" }}>
                        <Minus size={14} style={{ cursor: "pointer" }} onClick={() => updateQuantity(item.id, -1)} />
                        <span style={{ fontWeight: "bold" }}>{item.quantity}</span>
                        <Plus size={14} style={{ cursor: "pointer" }} onClick={() => updateQuantity(item.id, 1)} />
                      </div>
                      <span style={{ fontWeight: "bold", color: COLORS.primary }}>${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: "30px", background: COLORS.background }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "1.2rem", fontWeight: "bold" }}>
                  <span>Total:</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <button className="btn-hover" style={{ width: "100%", background: COLORS.primary, color: "white", border: "none", padding: "18px", borderRadius: "15px", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" }}>
                  Finalizar Pedido
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      {/* WHATSAPP FLOAT */}
      <a href="https://wa.me/573001234567" target="_blank" rel="noreferrer" className="btn-hover" style={{ position: "fixed", bottom: "30px", right: "30px", background: COLORS.whatsapp, color: "white", width: "60px", height: "60px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 10px 25px rgba(37, 211, 102, 0.4)", zIndex: 1000 }}>
        <MessageCircle size={32} />
      </a>
    </div>
  );
}
