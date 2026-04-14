import { useState, useMemo, useEffect } from "react";
import {
  ShoppingCart, X, Plus, Minus, Search,
  MessageCircle, Trash2, Truck, ChevronRight,
  Leaf, Heart, Shield, Zap
} from "lucide-react";

/* ─── DESIGN TOKENS ───────────────────────────────────── */
const C = {
  greenDark:   "#2D4A35",
  greenMid:    "#4A7A5A",
  greenLight:  "#7AAB84",
  greenPale:   "#C8DECA",
  greenMist:   "#EAF2EB",
  cream:       "#F5F0E8",
  warmWhite:   "#FAFAF6",
  gold:        "#C9A84C",
  goldLight:   "#E2C97E",
  text:        "#2E2E24",
  textMuted:   "#7A7A6A",
  whatsapp:    "#25D366",
  border:      "rgba(74,122,90,0.18)",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,400&family=Nunito:wght@300;400;500;600;700&display=swap');`;

/* ─── DATA ────────────────────────────────────────────── */
const PRODUCTS = [
  { id:1, name:"Alimento Premium Adulto", price:85000, category:"Alimentos", pet:"Perro", badge:"Más vendido", img:"https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500&auto=format&fit=crop" },
  { id:2, name:"Snacks Naturales Felinos", price:20000, category:"Snacks", pet:"Gato", badge:"Natural", img:"https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&auto=format&fit=crop" },
  { id:3, name:"Collar Artesanal Cuero", price:25000, category:"Accesorios", pet:"Perro", badge:null, img:"https://images.unsplash.com/photo-1601758064224-16b7d9e9a4e4?w=500&auto=format&fit=crop" },
  { id:4, name:"Arena Sanitaria Premium", price:45000, category:"Limpieza", pet:"Gato", badge:null, img:"https://images.unsplash.com/photo-1598137269279-2f6f7b1f6c7c?w=500&auto=format&fit=crop" },
  { id:5, name:"Juguete Kong Resistente", price:15000, category:"Accesorios", pet:"Perro", badge:"Nuevo", img:"https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop" },
  { id:6, name:"Shampoo Hipoalergénico", price:32000, category:"Limpieza", pet:"Todos", badge:null, img:"https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=500&auto=format&fit=crop" },
];

const SHIPPING = {
  "Zona Sur": 15000,
  "Zona Norte": 25000,
  "Resto del País": null,
};

const TRUST = [
  { icon: Leaf, title:"Productos Naturales", sub:"Alta calidad" },
  { icon: Heart, title:"Cuidado con Amor", sub:"Cada etapa" },
  { icon: Shield, title:"Respaldo Veterinario", sub:"Certificado" },
  { icon: Zap, title:"Envíos Rápidos", sub:"24-48h" },
];

/* ─── UTILS ───────────────────────────────────────────── */
const formatPrice = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0,
  }).format(amount);
};

const buildWAUrl = (cart, subtotal, zone, shipCost, grandTotal) => {
  const phone = "573158429286";
  const itemsText = cart.map(i => `• ${i.name} (x${i.qty}) - ${formatPrice(i.price * i.qty)}`).join("\n");
  const message = `¡Hola SOIN! 🐾\nPedido:\n\n${itemsText}\n\nSubtotal: ${formatPrice(subtotal)}\nZona: ${zone}\nTotal: ${formatPrice(grandTotal)}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

/* ─── COMPONENTES ATÓMICOS ────────────────────────────── */
const Navbar = ({ currentView, goTo, totalItems, openCart }) => (
  <nav className="nav">
    <img className="nav-logo tap" src="/Logo.png" alt="SOIN" onClick={() => goTo("inicio")} />
    <div className="nav-links">
      <button className={`nav-link tap ${currentView === "inicio" ? "active" : ""}`} onClick={() => goTo("inicio")}>Inicio</button>
      <button className={`nav-link tap ${currentView === "catalogo" ? "active" : ""}`} onClick={() => goTo("catalogo")}>Tienda</button>
      <button className="cart-trigger tap" onClick={openCart}>
        <ShoppingCart size={16} /> Carrito {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </button>
    </div>
  </nav>
);

const ProductCard = ({ product, onAdd }) => (
  <div className="pcard">
    <div className="pcard-img-wrap">
      <img className="pcard-img" src={product.img} alt={product.name} loading="lazy" />
      {product.badge && <span className={`pcard-badge ${product.badge === "Más vendido" ? "gold-b" : ""}`}>{product.badge}</span>}
    </div>
    <div className="pcard-body">
      <div>
        <span className="pcard-cat">{product.category}</span>
        <h3 className="pcard-name">{product.name}</h3>
      </div>
      <div className="pcard-footer">
        <span className="pcard-price">{formatPrice(product.price)}</span>
        <button className="add-btn tap" onClick={() => onAdd(product)}><Plus size={18} /></button>
      </div>
    </div>
  </div>
);

/* ─── MAIN APP ────────────────────────────────────────── */
export default function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("soin_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState("inicio");
  const [filterPet, setFilterPet] = useState("Todos");
  const [filterCat, setFilterCat] = useState("Todos");
  const [search, setSearch] = useState("");
  const [shippingZone, setShippingZone] = useState("");

  useEffect(() => {
    localStorage.setItem("soin_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (p) => setCart(c => {
    const ex = c.find(i => i.id === p.id);
    return ex ? c.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...p, qty: 1 }];
  });

  const updateQty = (id, d) => setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + d) } : i).filter(i => i.qty > 0));
  const removeItem = (id) => setCart(c => c.filter(i => i.id !== id));

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipCost = shippingZone ? (SHIPPING[shippingZone] ?? 0) : 0;
  const grandTotal = subtotal + shipCost;

  const filtered = useMemo(() => PRODUCTS.filter(p => {
    const matchS = p.name.toLowerCase().includes(search.toLowerCase());
    const matchP = filterPet === "Todos" || p.pet === filterPet || p.pet === "Todos";
    const matchC = filterCat === "Todos" || p.category === filterCat;
    return matchS && matchP && matchC;
  }), [search, filterPet, filterCat]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!shippingZone) return alert("Por favor selecciona una zona de envío");
    window.open(buildWAUrl(cart, subtotal, shippingZone, shipCost, grandTotal), "_blank");
  };

  const goTo = (v) => { setView(v); setDrawerOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="soin-root">
      <style>{`
        ${FONTS}
        *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
        body { background:${C.warmWhite}; font-family: 'Nunito', sans-serif; }
        .soin-root { color: ${C.text}; min-height: 100vh; }
        .nav { position: sticky; top:0; z-index:200; background: rgba(250,250,246,0.96); backdrop-filter: blur(12px); border-bottom: 1px solid ${C.border}; padding: 0 5%; display: flex; align-items:center; justify-content:space-between; height: 64px; }
        .nav-logo { height:38px; cursor:pointer; }
        .nav-links { display:flex; gap:28px; align-items:center; }
        .nav-link { font-size: 12px; font-weight: 600; text-transform: uppercase; cursor:pointer; color:${C.textMuted}; border:none; background:none; }
        .nav-link.active { color:${C.greenDark}; }
        .cart-trigger { position:relative; background:${C.greenDark}; color:#fff; border:none; border-radius:50px; padding:9px 18px; display:flex; align-items:center; gap:7px; cursor:pointer; font-size: 13px; font-weight: 700; }
        .cart-badge { position:absolute; top:-7px; right:-7px; background:${C.gold}; color:#fff; font-size: 10px; width:20px; height:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid ${C.warmWhite}; }
        .hero { position:relative; width:100%; overflow:hidden; }
        .hero-img { width:100%; display:block; object-fit:cover; max-height:520px; }
        .section { padding:64px 5%; }
        .featured-grid, .products-grid { display:grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap:20px; max-width:1100px; margin:0 auto; }
        .pcard { background:#fff; border-radius:18px; overflow:hidden; border:1.5px solid ${C.border}; transition: transform .3s; }
        .pcard:hover { transform:translateY(-5px); border-color:${C.greenLight}; }
        .pcard-img { width:100%; height:190px; object-fit:cover; }
        .pcard-body { padding:16px; }
        .pcard-name { font-family: 'Fraunces', serif; font-size: 18px; color:${C.greenDark}; margin: 8px 0; }
        .pcard-price { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; color:${C.greenDark}; }
        .add-btn { background:${C.greenDark}; color:#fff; border:none; width:36px; height:36px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .drawer { position:fixed; top:0; right:0; bottom:0; width:min(400px,93%); background:${C.warmWhite}; z-index:1001; display:flex; flex-direction:column; box-shadow: -5px 0 15px rgba(0,0,0,0.1); }
        .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:1000; }
        .tap { cursor:pointer; transition: opacity 0.2s; }
        .tap:active { opacity: 0.7; transform: scale(0.98); }
        @media(max-width:640px){ .featured-grid, .products-grid { grid-template-columns: 1fr 1fr; gap:10px; } }
      `}</style>

      <Navbar currentView={view} goTo={goTo} totalItems={totalItems} openCart={() => setDrawerOpen(true)} />

      {view === "inicio" && (
        <>
          <div className="hero">
            <img className="hero-img" src="/soin-banner.png" alt="Soin Banner" />
          </div>
          <section className="section">
            <h2 style={{textAlign:'center', marginBottom:30, fontFamily:'Fraunces'}}>Destacados</h2>
            <div className="featured-grid">
              {PRODUCTS.filter(p => p.badge).map(p => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />
              ))}
            </div>
          </section>
        </>
      )}

      {view === "catalogo" && (
        <section className="section">
          <div style={{maxWidth:500, margin:'0 auto 30px', position:'relative'}}>
            <Search style={{position:'absolute', left:15, top:12, color:C.textMuted}} size={20} />
            <input 
              className="search-input" 
              style={{width:'100%', padding:'12px 12px 12px 45px', borderRadius:50, border:`1px solid ${C.border}`}}
              placeholder="Buscar productos..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="products-grid">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
        </section>
      )}

      {/* CARRITO (DRAWER) */}
      {drawerOpen && (
        <>
          <div className="overlay" onClick={() => setDrawerOpen(false)} />
          <div className="drawer">
            <div style={{padding:20, borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between'}}>
              <h3 style={{fontFamily:'Fraunces'}}>Tu Carrito</h3>
              <X className="tap" onClick={() => setDrawerOpen(false)} />
            </div>
            <div style={{flex:1, overflowY:'auto', padding:20}}>
              {cart.length === 0 ? <p style={{textAlign:'center', color:C.textMuted}}>El carrito está vacío</p> : 
                cart.map(item => (
                  <div key={item.id} style={{display:'flex', gap:10, marginBottom:15, borderBottom:`1px solid ${C.border}`, paddingBottom:10}}>
                    <img src={item.img} style={{width:60, height:60, borderRadius:8, objectFit:'cover'}} />
                    <div style={{flex:1}}>
                      <h4 style={{fontSize:14}}>{item.name}</h4>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:5}}>
                        <div style={{display:'flex', alignItems:'center', gap:10}}>
                          <Minus size={14} className="tap" onClick={() => updateQty(item.id, -1)} />
                          <span>{item.qty}</span>
                          <Plus size={14} className="tap" onClick={() => updateQty(item.id, 1)} />
                        </div>
                        <span style={{fontWeight:600}}>{formatPrice(item.price * item.qty)}</span>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
            <div style={{padding:20, background:C.greenMist}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:10}}>
                <span>Total:</span>
                <span style={{fontSize:20, fontWeight:700, color:C.greenDark}}>{formatPrice(grandTotal)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                style={{width:'100%', background:C.greenDark, color:'#fff', border:'none', padding:15, borderRadius:50, fontWeight:700, cursor:'pointer'}}
              >
                PEDIR POR WHATSAPP
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
