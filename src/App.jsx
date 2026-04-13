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
  const [category, setCategory] = useState("Todos");
  const [view, setView] = useState("inicio"); // Estados: inicio, catalogo, contacto

  const products = [
    { id: 1, name: "Alimento Premium Perro", price: 85000, category: "Alimentos", pet: "Perro", featured: true, img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4" },
    { id: 2, name: "Snacks Naturales Gato", price: 20000, category: "Snacks", pet: "Gato", featured: true, img: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1" },
    { id: 3, name: "Collar de Cuero Perro", price: 25000, category: "Accesorios", pet: "Perro", featured: false, img: "https://images.unsplash.com/photo-1601758064224-16b7d9e9a4e4" },
    { id: 4, name: "Arena Sanitaria Gato", price: 45000, category: "Limpieza", pet: "Gato", featured: false, img: "https://images.unsplash.com/photo-1598137269279-2f6f7b1f6c7c" }
  ];

  const addToCart = (p) => {
    const exist = cart.find(i => i.id === p.id);
    if (exist) {
      setCart(cart.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...p, quantity: 1 }]);
    }
    setOpenCart(true);
  };

  const total = cart.reduce((a, i) => a + i.price * i.quantity, 0);

  // Componente de Tarjeta de Producto
  const ProductCard = ({ p }) => (
    <div style={{
      background: COLORS.white, borderRadius: "20px", overflow: "hidden", 
      boxShadow: "0 8px 20px rgba(0,0,0,0.04)", position: "relative"
    }}>
      {p.featured && (
        <span style={{ position: "absolute", top: "10px", left: "10px", background: COLORS.secondary, color: "white", padding: "4px 12px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", zIndex: 1 }}>
          DESTACADO
        </span>
      )}
      <img src={p.img} style={{ width: "100%", height: "200px", objectFit: "cover" }} alt={p.name} />
      <div style={{ padding: "15px" }}>
        <h4 style={{ margin: "0 0 10px 0", fontSize: "1rem" }}>{p.name}</h4>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: "bold", color: COLORS.primary }}>${p.price.toLocaleString()}</span>
          <button onClick={() => addToCart(p)} style={{ background: COLORS.primary, color: "white", border: "none", borderRadius: "8px", padding: "8px" }}>
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: COLORS.background, minHeight: "100vh" }}>
      
      {/* NAVBAR */}
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "15px 5%", background: "white", sticky: "top", zIndex: 100, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: COLORS.primary, cursor: "pointer" }} onClick={() => setView("inicio")}>SOIN</div>
        <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
          {["inicio", "catalogo", "contacto"].map(v => (
            <span key={v} onClick={() => setView(v)} style={{ cursor: "pointer", textTransform: "capitalize", fontWeight: view === v ? "bold" : "normal", color: view === v ? COLORS.primary : COLORS.text }}>
              {v}
            </span>
          ))}
          <button onClick={() => setOpenCart(true)} style={{ background: COLORS.primary, color: "white", border: "none", borderRadius: "10px", padding: "8px 15px", display: "flex", gap: "8px" }}>
            <ShoppingCart size={18}/> {cart.length}
          </button>
        </div>
      </nav>

      {/* VISTA: INICIO (HOME) */}
      {view === "inicio" && (
        <>
          <div style={{ height: "350px", position: "relative" }}>
             <img src="/Banner.jpg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
             <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 10%", color: "white" }}>
                <h1 style={{ fontSize: "2.5rem", margin: 0 }}>Amor en cada bocado</h1>
                <p>Descubre lo mejor para tu mejor amigo.</p>
                <button onClick={() => setView("catalogo")} style={{ width: "fit-content", padding: "12px 30px", background: COLORS.secondary, color: "white", border: "none", borderRadius: "30px", fontWeight: "bold", marginTop: "15px" }}>Ver Catálogo</button>
             </div>
          </div>

          <section style={{ padding: "50px 5%" }}>
            <h2 style={{ textAlign: "center", marginBottom: "30px", color: COLORS.primary }}>Productos Destacados</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "25px" }}>
              {products.filter(p => p.featured).map(p => <ProductCard key={p.id} p={p} />)}
            </div>
          </section>
        </>
      )}

      {/* VISTA: CATÁLOGO */}
      {view === "catalogo" && (
        <section style={{ padding: "40px 5%" }}>
          <h2 style={{ marginBottom: "20px" }}>Nuestro Catálogo</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "25px" }}>
            {products.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      {/* VISTA: CONTACTO */}
      {view === "contacto" && (
        <section style={{ padding: "60px 5%", maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ background: "white", padding: "40px", borderRadius: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <h2 style={{ color: COLORS.primary, marginBottom: "30px" }}>Contáctenos</h2>
            <div style={{ display: "grid", gap: "20px" }}>
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}><Phone color={COLORS.secondary}/> +57 300 123 4567</div>
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}><Mail color={COLORS.secondary}/> contacto@soin.com</div>
              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}><MapPin color={COLORS.secondary}/> Medellín, Colombia</div>
              <hr style={{ border: "0.5px solid #eee", margin: "20px 0" }} />
              <input type="text" placeholder="Tu nombre" style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ddd" }} />
              <textarea placeholder="¿En qué podemos ayudarte?" rows="4" style={{ padding: "12px", borderRadius: "10px", border: "1px solid #ddd" }}></textarea>
              <button style={{ background: COLORS.primary, color: "white", padding: "15px", border: "none", borderRadius: "10px", fontWeight: "bold" }}>Enviar Mensaje</button>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER PROFESIONAL */}
      <footer style={{ background: COLORS.primary, color: "white", padding: "60px 5% 20px 5%", marginTop: "50px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "40px" }}>
          <div>
            <h3 style={{ color: COLORS.secondary }}>SOIN</h3>
            <p style={{ opacity: 0.8, fontSize: "14px" }}>Cuidado, amor y bienestar para quienes siempre están contigo.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: "15px" }}>Legal</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", opacity: 0.8 }}>
              <span style={{ cursor: "pointer" }}>Términos y Condiciones</span>
              <span style={{ cursor: "pointer" }}>Política de Privacidad</span>
              <span style={{ cursor: "pointer" }}>Política de Devoluciones</span>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: "15px" }}>Atención</h4>
            <p style={{ fontSize: "14px", opacity: 0.8 }}>Lunes a Sábado: 8:00 AM - 7:00 PM</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", textAlign: "center", fontSize: "12px", opacity: 0.6 }}>
          © 2026 SOIN E-commerce. Todos los derechos reservados.
        </div>
      </footer>

      {/* BOTÓN FLOTANTE WHATSAPP */}
      <a 
        href="https://wa.me/573001234567" 
        target="_blank" 
        rel="noreferrer"
        style={{
          position: "fixed", bottom: "30px", right: "30px",
          background: COLORS.whatsapp, color: "white",
          width: "60px", height: "60px", borderRadius: "50%",
          display: "flex", justifyContent: "center", alignItems: "center",
          boxShadow: "0 10px 25px rgba(37, 211, 102, 0.3)",
          zIndex: 1000, transition: "0.3s"
        }}
      >
        <MessageCircle size={32} />
      </a>

      {/* CARRITO (ASIDE) - Mantenemos la lógica anterior pero optimizada */}
      {/* ... (el código del carrito se mantiene igual al anterior) ... */}
    </div>
  );
}
