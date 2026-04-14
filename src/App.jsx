import { useState, useMemo } from "react";
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
  { id:1, name:"Alimento Premium Adulto", price:85000, category:"Alimentos", pet:"Perro", badge:"Más vendido",
    img:"https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500&auto=format&fit=crop" },
  { id:2, name:"Snacks Naturales Felinos", price:20000, category:"Snacks", pet:"Gato", badge:"Natural",
    img:"https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&auto=format&fit=crop" },
  { id:3, name:"Collar Artesanal Cuero", price:25000, category:"Accesorios", pet:"Perro", badge:null,
    img:"https://images.unsplash.com/photo-1601758064224-16b7d9e9a4e4?w=500&auto=format&fit=crop" },
  { id:4, name:"Arena Sanitaria Premium", price:45000, category:"Limpieza", pet:"Gato", badge:null,
    img:"https://images.unsplash.com/photo-1598137269279-2f6f7b1f6c7c?w=500&auto=format&fit=crop" },
  { id:5, name:"Juguete Kong Resistente", price:15000, category:"Accesorios", pet:"Perro", badge:"Nuevo",
    img:"https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop" },
  { id:6, name:"Shampoo Hipoalergénico", price:32000, category:"Limpieza", pet:"Todos", badge:null,
    img:"https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=500&auto=format&fit=crop" },
];

const SHIPPING = {
  "Zona Sur":          15000,
  "Zona Norte":        25000,
  "Resto del País":    null,
};

const TRUST = [
  { icon: Leaf,    title:"Productos Naturales",    sub:"Alta calidad" },
  { icon: Heart,   title:"Cuidado con Amor",       sub:"Cada etapa" },
  { icon: Shield,  title:"Respaldo Veterinario",   sub:"Certificado" },
  { icon: Zap,     title:"Envíos Rápidos",         sub:"24-48h" },
];

/* ─── STYLES ─────────────────────────────────────────── */
const injectStyles = () => (
  <style>{`
    ${FONTS}
    *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
    body { background:${C.warmWhite}; }

    :root {
      --f-display : 'Fraunces', Georgia, serif;
      --f-body    : 'Nunito', system-ui, sans-serif;
      --t-hero    : clamp(30px, 5vw, 56px);
      --t-h2      : clamp(26px, 3vw, 40px);
      --t-card    : 18px;
      --t-drawer  : 22px;
      --t-body    : 14px;
      --t-meta    : 13px;
      --t-small   : 12px;
      --t-label   : 11px;
      --t-nav     : 12px;
      --t-btn     : 13px;
      --t-price-lg : 22px;
      --t-price-sm : 17px;
      --w-regular : 400;
      --w-medium  : 600;
      --w-semi    : 700;
      --ls-label  : 0.12em;
      --ls-nav    : 0.08em;
      --ls-btn    : 0.08em;
    }

    .num { font-family: var(--f-display); font-weight: var(--w-semi); color: ${C.greenDark}; }

    .soin-root {
      font-family: var(--f-body);
      font-weight: 300;
      font-size: var(--t-body);
      line-height: 1.65;
      background: ${C.warmWhite};
      min-height: 100vh;
      color: ${C.text};
    }

    /* NAV */
    .nav {
      position: sticky; top:0; z-index:200;
      background: rgba(250,250,246,0.96);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid ${C.border};
      padding: 0 5%;
      display: flex; align-items:center; justify-content:space-between;
      height: 64px;
    }
    .nav-logo { height:38px; cursor:pointer; }
    .nav-links { display:flex; gap:28px; align-items:center; }
    .nav-link {
      font-family: var(--f-body);
      font-size: var(--t-nav);
      font-weight: var(--w-medium);
      letter-spacing: var(--ls-nav);
      text-transform: uppercase;
      cursor:pointer; color:${C.textMuted};
      transition: color .2s; border:none; background:none;
    }
    .nav-link:hover, .nav-link.active { color:${C.greenDark}; }
    
    .cart-trigger {
      position:relative; background:${C.greenDark}; color:#fff;
      border:none; border-radius:50px; padding:9px 18px;
      display:flex; align-items:center; gap:7px;
      font-family: var(--f-body);
      font-size: var(--t-btn);
      font-weight: var(--w-semi);
      letter-spacing: var(--ls-btn);
      text-transform: uppercase;
      cursor:pointer;
    }
    .cart-badge {
      position:absolute; top:-7px; right:-7px;
      background:${C.gold}; color:#fff;
      font-size: 10px; font-weight: 700;
      width:20px; height:20px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      border:2px solid ${C.warmWhite};
    }

    /* HERO */
    .hero { position:relative; width:100%; overflow:hidden; }
    .hero-img { width:100%; display:block; object-fit:cover; max-height:520px; min-height:340px; }
    .hero-overlay {
      position:absolute; inset:0;
      background: linear-gradient(100deg, rgba(45,74,53,.6) 0%, rgba(45,74,53,.2) 60%, transparent 100%);
      display:flex; align-items:center; padding:0 6%;
    }
    .hero-text { max-width:480px; }
    .hero-text-mobile { display:none; background:${C.greenDark}; padding:26px 5%; }

    .hero-eyebrow {
      display:inline-flex; background:rgba(255,255,255,.15); border:1px solid rgba(255,255,255,.3);
      border-radius:50px; padding:5px 14px; font-size: var(--t-label);
      text-transform: uppercase; color:#fff; margin-bottom:14px;
      letter-spacing: var(--ls-label);
    }
    .hero-title {
      font-family: var(--f-display);
      font-size: var(--t-hero);
      font-weight: 400; line-height: 1.1; color:#fff; margin-bottom:12px;
    }
    .hero-title em { font-style:italic; color:${C.goldLight}; }
    .hero-sub { color:rgba(255,255,255,.8); margin-bottom:22px; font-weight: 300; }
    .hero-cta {
      background:${C.gold}; color:${C.greenDark}; border:none;
      border-radius:50px; padding:13px 28px;
      font-family: var(--f-body); font-weight: var(--w-semi);
      text-transform: uppercase; cursor:pointer;
      display:inline-flex; align-items:center; gap:8px;
    }

    /* TRUST STRIP */
    .trust { background:${C.greenDark}; display:flex; justify-content:center; flex-wrap:wrap; }
    .trust-item {
      display:flex; align-items:center; gap:10px;
      padding:18px 32px; color:#fff; border-right:1px solid rgba(255,255,255,.1);
      flex:1; min-width:160px;
    }
    .trust-title { font-weight: 600; font-size: var(--t-meta); }
    .trust-sub { font-size: var(--t-small); color:${C.greenPale}; font-weight: 400; }

    /* CATALOG FILTERS */
    .search-wrap { position:relative; max-width:520px; margin:0 auto 20px; }
    .search-input {
      width:100%; padding:13px 16px 13px 46px; border-radius:50px;
      border:1.5px solid ${C.border}; background:#fff; font-family: var(--f-body);
    }
    .filter-scroll { display:flex; gap:8px; justify-content:center; flex-wrap:wrap; margin-bottom:30px; }
    .filter-pill {
      padding:8px 20px; border-radius:50px; border:1.5px solid ${C.border};
      background:#fff; cursor:pointer; font-size: var(--t-label);
      text-transform: uppercase; transition: all .2s; color: ${C.textMuted};
    }
    .filter-pill.on { background:${C.greenDark}; color:#fff; border-color: ${C.greenDark}; }

    /* PRODUCT CARD */
    .products-grid {
      display:grid; grid-template-columns: repeat(auto-fill, minmax(210px,1fr));
      gap:20px; max-width:1100px; margin:0 auto;
    }
    .pcard {
      background:#fff; border-radius:18px; overflow:hidden;
      border:1.5px solid ${C.border}; display:flex; flex-direction:column;
      transition: transform .3s;
    }
    .pcard:hover { transform: translateY(-5px); border-color: ${C.greenLight}; }
    .pcard-img { width:100%; height:190px; object-fit:cover; }
    .pcard-body { padding:14px 16px 16px; flex:1; display:flex; flex-direction:column; justify-content:space-between; }
    .pcard-name { font-family: var(--f-display); font-size: var(--t-card); color:${C.greenDark}; margin-bottom:12px; }
    .pcard-price { font-family: var(--f-display); font-size: var(--t-price-lg); font-weight: 600; color:${C.greenDark}; }
    .add-btn {
      background:${C.greenDark}; color:#fff; border:none;
      width:36px; height:36px; border-radius:50%;
      display:flex; align-items:center; justify-content:center; cursor:pointer;
    }

    /* CART DRAWER */
    .overlay { position:fixed; inset:0; background:rgba(0,0,0,.4); z-index:1000; backdrop-filter: blur(4px); }
    .drawer {
      position:fixed; top:0; right:0; bottom:0; width:min(400px,93%);
      background:${C.warmWhite}; z-index:1001; display:flex; flex-direction:column;
    }
    .drawer-head { padding:22px 24px; background:${C.greenMist}; border-bottom:1px solid ${C.border}; display:flex; justify-content:space-between; align-items:center; }
    .drawer-head h3 { font-family: var(--f-display); font-size: var(--t-drawer); color: ${C.greenDark}; }
    .drawer-body { flex:1; overflow-y:auto; padding:20px 24px; }
    .cart-item { display:grid; grid-template-columns:68px 1fr; gap:14px; padding:16px 0; border-bottom:1px solid ${C.border}; }
    .ci-img { width:68px; height:68px; border-radius:12px; object-fit:cover; border: 1px solid ${C.border}; }
    .ci-name { font-family: var(--f-display); font-size: 15px; color:${C.greenDark}; line-height:1.3; }
    
    /* FOOTER */
    .footer { background:${C.greenDark}; padding:52px 5% 28px; color:rgba(255,255,255,0.6); }
    .footer-grid { display:grid; grid-template-columns: 1.8fr 1fr 1fr; gap:40px; max-width:1100px; margin:0 auto 40px; }
    .footer-logo { height:38px; filter: brightness(0) invert(1); margin-bottom:14px; }
    .footer-col h4 { color: ${C.greenPale}; text-transform: uppercase; font-size: var(--t-small); margin-bottom:16px; letter-spacing: var(--ls-label); }

    @media(max-width:640px){
      .hero-overlay { display:none; }
      .hero-text-mobile { display:block; }
      .hero-img { max-height:none; height:auto; }
      .trust { display:grid; grid-template-columns: 1fr 1fr; }
      .trust-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); }
      .products-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
      .footer-grid { grid-template-columns: 1fr; }
    }
    .tap { cursor:pointer; }
    .tap:active { transform: scale(0.95); }
  `}</style>
);

/* ─── COMPONENT ──────────────────────────────────────── */
export default function App() {
  const [cart, setCart] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState("inicio");
  const [filterPet, setFilterPet] = useState("Todos");
  const [filterCat, setFilterCat] = useState("Todos");
  const [search, setSearch] = useState("");
  const [shippingZone, setShippingZone] = useState("");

  const addToCart = (p) =>
    setCart(c => {
      const ex = c.find(i => i.id === p.id);
      return ex ? c.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
                : [...c, { ...p, qty: 1 }];
    });

  const updateQty = (id, d) =>
    setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + d) } : i).filter(i => i.qty > 0));

  const removeItem = (id) => setCart(c => c.filter(i => i.id !== id));

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipCost   = shippingZone ? (SHIPPING[shippingZone] ?? 0) : 0;
  const grandTotal = subtotal + shipCost;

  const filtered = useMemo(() =>
    PRODUCTS.filter(p => {
      const matchS = p.name.toLowerCase().includes(search.toLowerCase());
      const matchP = filterPet === "Todos" || p.pet === filterPet || p.pet === "Todos";
      const matchC = filterCat === "Todos" || p.category === filterCat;
      return matchS && matchP && matchC;
    }),
  [search, filterPet, filterCat]);

  const handleCheckout = () => {
    const lines = cart
      .map(i => `- ${i.name} x${i.qty} ($${(i.price * i.qty).toLocaleString('es-CO')})`)
      .join("%0A");
    const ship = SHIPPING[shippingZone] === null ? "Sujeto a verificación" : `$${shipCost.toLocaleString('es-CO')}`;
    const url = `https://wa.me/573158429286?text=¡Hola SOIN! 🐾%0AQuiero hacer un pedido:%0A%0A${lines}%0A%0ASubtotal: $${subtotal.toLocaleString('es-CO')}%0AZona: ${shippingZone}%0AEnvío: ${ship}%0A*TOTAL: $${grandTotal.toLocaleString('es-CO')}*`;
    window.open(url, "_blank");
  };

  const goTo = (v) => { setView(v); setDrawerOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <div className="soin-root">
      {injectStyles()}

      {/* NAV */}
      <nav className="nav">
        <img className="nav-logo tap" src="/Logo.png" alt="SOIN" onClick={() => goTo("inicio")} />
        <div className="nav-links">
          <button className={`nav-link tap ${view === "inicio" ? "active" : ""}`} onClick={() => goTo("inicio")}>Inicio</button>
          <button className={`nav-link tap ${view === "catalogo" ? "active" : ""}`} onClick={() => goTo("catalogo")}>Tienda</button>
          <button className="cart-trigger tap" onClick={() => setDrawerOpen(true)}>
            <ShoppingCart size={16} /> Carrito {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
        </div>
      </nav>

      {/* INICIO */}
      {view === "inicio" && (
        <>
          <div className="hero">
            <img className="hero-img" src="/soin-banner.png" alt="SOIN Banner" />
            <div className="hero-overlay">
              <div className="hero-text">
                <div className="hero-eyebrow">🌿 Colección 2025</div>
                <h1 className="hero-title">Todo lo que tu<br />mascota <em>necesita,</em><br />en un solo lugar.</h1>
                <p className="hero-sub">Alimentos · Accesorios · Salud · Higiene · Y mucho amor</p>
                <button className="hero-cta tap" onClick={() => goTo("catalogo")}>
                  ¡Compra para los que amas! <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="hero-text-mobile">
            <div className="hero-eyebrow">🌿 Colección 2025</div>
            <h1 className="hero-title">Todo lo que tu mascota <em>necesita.</em></h1>
            <button className="hero-cta tap" onClick={() => goTo("catalogo")}>¡Ver tienda!</button>
          </div>

          <div className="trust">
            {TRUST.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="trust-item">
                <Icon size={18} color={C.greenPale} />
                <div><div className="trust-title">{title}</div><div className="trust-sub">{sub}</div></div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* TIENDA / CATALOGO */}
      {view === "catalogo" && (
        <section className="section" style={{padding:'40px 5%'}}>
          <div style={{textAlign:'center', marginBottom:32}}>
            <h2 className="hero-title" style={{color:C.greenDark, fontSize:'2rem'}}>Nuestro Catálogo</h2>
          </div>

          <div className="search-wrap">
            <Search size={18} style={{position:'absolute', left:16, top:13, color:C.textMuted}} />
            <input className="search-input" placeholder="¿Qué buscas hoy?" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="filter-scroll">
            {["Todos", "Perro", "Gato"].map(f => (
              <button key={f} className={`filter-pill tap ${filterPet === f ? "on" : ""}`} onClick={() => setFilterPet(f)}>{f}</button>
            ))}
          </div>

          <div className="products-grid">
            {filtered.map(p => (
              <div key={p.id} className="pcard">
                <img src={p.img} className="pcard-img" alt={p.name} />
                <div className="pcard-body">
                  <div className="pcard-name">{p.name}</div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                    <div className="pcard-price">${p.price.toLocaleString('es-CO')}</div>
                    <button className="add-btn tap" onClick={() => addToCart(p)}><Plus size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <img src="/Logo.png" className="footer-logo" alt="SOIN" />
            <p style={{maxWidth:280, fontSize:14}}>Expertos en el cuidado y bienestar integral de tus mascotas. Calidad garantizada.</p>
          </div>
          <div className="footer-col">
            <h4>Navegación</h4>
            <ul style={{listStyle:'none', fontSize:14}}>
              <li className="tap" style={{marginBottom:8}} onClick={() => goTo("inicio")}>Inicio</li>
              <li className="tap" onClick={() => goTo("catalogo")}>Tienda</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <p style={{fontSize:14}}>WhatsApp: +57 315 842 9286</p>
            <p style={{fontSize:14, marginTop:8}}>Envíos a todo el país 🇨🇴</p>
          </div>
        </div>
        <div style={{textAlign:'center', fontSize:12, marginTop:40, borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:20}}>
          © 2025 SOIN Mascotas. Todos los derechos reservados.
        </div>
      </footer>

      {/* CARRITO */}
      {drawerOpen && (
        <>
          <div className="overlay" onClick={() => setDrawerOpen(false)} />
          <div className="drawer">
            <div className="drawer-head">
              <h3>Tu Pedido</h3>
              <button className="tap" style={{background:'none', border:'none'}} onClick={() => setDrawerOpen(false)}><X /></button>
            </div>
            <div className="drawer-body">
              {cart.length === 0 ? <p style={{textAlign:'center', marginTop:40}}>El carrito está vacío</p> : (
                <>
                  {cart.map(i => (
                    <div key={i.id} className="cart-item">
                      <img src={i.img} className="ci-img" alt={i.name} />
                      <div>
                        <div className="ci-name">{i.name}</div>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8}}>
                          <div className="num" style={{fontSize:16}}>${(i.price * i.qty).toLocaleString('es-CO')}</div>
                          <div style={{display:'flex', alignItems:'center', gap:10}}>
                            <button className="tap" style={{background:'none', border:'1px solid #ccc', borderRadius:'50%', width:24, height:24}} onClick={() => updateQty(i.id, -1)}>-</button>
                            <span>{i.qty}</span>
                            <button className="tap" style={{background:'none', border:'1px solid #ccc', borderRadius:'50%', width:24, height:24}} onClick={() => updateQty(i.id, 1)}>+</button>
                            <Trash2 size={16} color="#e74c3c" className="tap" onClick={() => removeItem(i.id)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{marginTop:30, borderTop:`2px solid ${C.border}`, paddingTop:20}}>
                    <div style={{display:'flex', justifyContent:'space-between', marginBottom:15}}>
                      <span style={{fontWeight:600}}>Total:</span>
                      <span className="num" style={{fontSize:20}}>${subtotal.toLocaleString('es-CO')}</span>
                    </div>
                    <button className="hero-cta tap" style={{width:'100%', justifyContent:'center'}} onClick={handleCheckout}>Finalizar por WhatsApp</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* WHATSAPP FLOAT */}
      <a href="https://wa.me/573158429286" className="wa-btn tap" style={{position:'fixed', bottom:25, right:25, background:C.whatsapp, color:'#fff', width:56, height:56, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', textDecoration:'none', zIndex:999}} target="_blank" rel="noreferrer">
        <MessageCircle size={30} />
      </a>
    </div>
  );
}
