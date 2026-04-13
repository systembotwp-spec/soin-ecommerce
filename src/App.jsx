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

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');`;

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
  "Zona Sur":         15000,
  "Zona Norte":       25000,
  "Resto del País":   null,
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

    .soin-root {
      font-family: 'DM Sans', sans-serif;
      font-weight: 300;
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
    .nav-logo { height:38px; cursor:pointer; transition: opacity .2s; }
    .nav-logo:hover { opacity:.8; }
    .nav-links { display:flex; gap:28px; align-items:center; }
    .nav-link {
      font-size:12px; letter-spacing:.1em; text-transform:uppercase;
      font-weight:500; cursor:pointer; color:${C.textMuted};
      transition: color .2s; border:none; background:none;
      padding:0;
    }
    .nav-link:hover, .nav-link.active { color:${C.greenDark}; }
    .cart-trigger {
      position:relative; background:${C.greenDark}; color:#fff;
      border:none; border-radius:50px; padding:9px 18px;
      display:flex; align-items:center; gap:7px;
      font-family:'DM Sans',sans-serif; font-size:12px;
      letter-spacing:.08em; text-transform:uppercase; font-weight:500;
      cursor:pointer; transition: background .2s, transform .15s;
    }
    .cart-trigger:hover { background:${C.greenMid}; transform:translateY(-1px); }
    .cart-badge {
      position:absolute; top:-7px; right:-7px;
      background:${C.gold}; color:#fff;
      font-size:10px; font-weight:700;
      width:20px; height:20px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      border:2px solid ${C.warmWhite};
    }

    /* HERO BANNER */
    .hero {
      position:relative; width:100%;
      overflow:hidden; max-height:520px;
    }
    .hero img {
      width:100%; height:100%; object-fit:cover;
      display:block; max-height:520px;
    }
    .hero-overlay {
      position:absolute; inset:0;
      background: linear-gradient(100deg, rgba(45,74,53,.62) 0%, rgba(45,74,53,.22) 55%, transparent 100%);
      display:flex; align-items:center; padding:0 6%;
    }
    .hero-text { max-width:480px; }
    .hero-eyebrow {
      display:inline-flex; align-items:center; gap:7px;
      background:rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.28);
      border-radius:50px; padding:5px 14px; backdrop-filter:blur(6px);
      font-size:11px; letter-spacing:.14em; text-transform:uppercase;
      color:#fff; margin-bottom:18px;
    }
    .hero-title {
      font-family:'Playfair Display',serif;
      font-size:clamp(30px,4.5vw,54px); font-weight:400; line-height:1.12;
      color:#fff; margin-bottom:14px;
    }
    .hero-title em { font-style:italic; color:${C.goldLight}; }
    .hero-sub {
      font-size:14px; color:rgba(255,255,255,.72);
      margin-bottom:28px; line-height:1.75;
    }
    .hero-cta {
      background:${C.greenDark}; color:#fff; border:none;
      border-radius:50px; padding:13px 30px;
      font-family:'DM Sans',sans-serif; font-size:12px;
      letter-spacing:.1em; text-transform:uppercase; font-weight:500;
      cursor:pointer; transition: background .2s, transform .15s;
      display:inline-flex; align-items:center; gap:8px;
    }
    .hero-cta:hover { background:${C.greenMid}; transform:translateY(-2px); }

    /* TRUST STRIP */
    .trust {
      background:${C.greenDark};
      display:flex; justify-content:center; flex-wrap:wrap;
      gap:0; overflow:hidden;
    }
    .trust-item {
      display:flex; align-items:center; gap:10px;
      padding:18px 32px; color:#fff;
      border-right:1px solid rgba(255,255,255,.08);
      flex:1; min-width:160px; max-width:260px;
    }
    .trust-item:last-child { border-right:none; }
    .trust-icon-wrap {
      width:38px; height:38px; border-radius:50%;
      background:rgba(255,255,255,.1);
      display:flex; align-items:center; justify-content:center; flex-shrink:0;
    }
    .trust-title { font-size:13px; font-weight:500; color:#fff; }
    .trust-sub   { font-size:11px; color:${C.greenPale}; }

    /* SECTIONS */
    .section { padding:64px 5%; }
    .section-alt { background:${C.greenMist}; }
    .section-header { text-align:center; margin-bottom:48px; }
    .eyebrow {
      font-size:11px; letter-spacing:.18em; text-transform:uppercase;
      color:${C.greenMid}; display:block; margin-bottom:10px;
    }
    .section-title {
      font-family:'Playfair Display',serif;
      font-size:clamp(26px,3vw,40px); font-weight:400; line-height:1.2;
      color:${C.greenDark};
    }
    .section-title em { font-style:italic; color:${C.greenMid}; }

    /* FEATURED GRID */
    .featured-grid {
      display:grid;
      grid-template-columns: repeat(auto-fill, minmax(220px,1fr));
      gap:20px; max-width:1100px; margin:0 auto 40px;
    }

    /* CATALOG */
    .search-wrap { position:relative; max-width:520px; margin:0 auto 20px; }
    .search-wrap svg { position:absolute; left:16px; top:50%; transform:translateY(-50%); color:${C.textMuted}; pointer-events:none; }
    .search-input {
      width:100%; padding:13px 16px 13px 46px;
      border-radius:50px; border:1.5px solid ${C.border};
      background:#fff; font-family:'DM Sans',sans-serif;
      font-size:14px; outline:none; color:${C.text};
      transition: border-color .2s, box-shadow .2s;
    }
    .search-input:focus { border-color:${C.greenMid}; box-shadow:0 0 0 3px rgba(74,122,90,.12); }
    .search-input::placeholder { color:${C.textMuted}; }

    .filter-scroll {
      display:flex; gap:8px; overflow-x:auto; padding:0 0 12px;
      scrollbar-width:none; justify-content:center; flex-wrap:wrap;
    }
    .filter-scroll::-webkit-scrollbar { display:none; }
    .filter-pill {
      white-space:nowrap; padding:8px 20px; border-radius:50px;
      border:1.5px solid ${C.border}; background:#fff;
      font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500;
      letter-spacing:.06em; cursor:pointer; color:${C.textMuted};
      transition: all .2s;
    }
    .filter-pill:hover { border-color:${C.greenMid}; color:${C.greenDark}; }
    .filter-pill.on { background:${C.greenDark}; color:#fff; border-color:${C.greenDark}; }

    .products-grid {
      display:grid;
      grid-template-columns: repeat(auto-fill, minmax(210px,1fr));
      gap:20px; max-width:1100px; margin:0 auto;
    }

    /* PRODUCT CARD */
    .pcard {
      background:#fff; border-radius:18px; overflow:hidden;
      border:1.5px solid ${C.border};
      transition: transform .3s, box-shadow .3s, border-color .3s;
      display:flex; flex-direction:column;
    }
    .pcard:hover {
      transform:translateY(-5px);
      box-shadow:0 12px 32px rgba(45,74,53,.11);
      border-color:${C.greenLight};
    }
    .pcard-img-wrap { position:relative; overflow:hidden; }
    .pcard-img { width:100%; height:190px; object-fit:cover; display:block; transition: transform .5s; }
    .pcard:hover .pcard-img { transform:scale(1.04); }
    .pcard-badge {
      position:absolute; top:10px; left:10px;
      background:${C.greenDark}; color:#fff;
      font-size:9px; letter-spacing:.1em; text-transform:uppercase;
      padding:4px 10px; border-radius:50px; font-weight:500;
    }
    .pcard-badge.gold-b { background:${C.gold}; color:${C.greenDark}; }
    .pcard-body { padding:14px 16px 16px; flex:1; display:flex; flex-direction:column; justify-content:space-between; }
    .pcard-cat { font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:${C.greenMid}; font-weight:500; margin-bottom:4px; }
    .pcard-name { font-family:'Playfair Display',serif; font-size:17px; font-weight:400; color:${C.greenDark}; margin-bottom:12px; line-height:1.25; }
    .pcard-footer { display:flex; align-items:center; justify-content:space-between; }
    .pcard-price { font-family:'Playfair Display',serif; font-size:20px; font-weight:600; color:${C.greenDark}; }
    .pcard-price sub { font-size:12px; font-weight:400; font-family:'DM Sans',sans-serif; vertical-align:baseline; color:${C.textMuted}; }
    .add-btn {
      background:${C.greenDark}; color:#fff; border:none;
      width:36px; height:36px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; transition: background .2s, transform .15s;
      flex-shrink:0;
    }
    .add-btn:hover { background:${C.greenMid}; transform:scale(1.08); }

    /* CART DRAWER */
    .overlay {
      position:fixed; inset:0; background:rgba(0,0,0,.42);
      z-index:1000; backdrop-filter:blur(5px);
      animation: fadeIn .25s ease;
    }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    .drawer {
      position:fixed; top:0; right:0; bottom:0;
      width:min(400px,93%);
      background:${C.warmWhite}; z-index:1001;
      display:flex; flex-direction:column;
      animation: slideIn .35s cubic-bezier(.16,1,.3,1);
    }
    @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }

    .drawer-head {
      padding:22px 24px;
      background:${C.greenMist};
      border-bottom:1px solid ${C.border};
      display:flex; justify-content:space-between; align-items:center;
    }
    .drawer-head h3 {
      font-family:'Playfair Display',serif;
      font-size:22px; font-weight:400; color:${C.greenDark};
    }
    .close-btn {
      width:34px; height:34px; border-radius:50%;
      background:#fff; border:1.5px solid ${C.border};
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; color:${C.textMuted}; transition: all .2s;
    }
    .close-btn:hover { background:${C.greenDark}; color:#fff; border-color:${C.greenDark}; }

    .drawer-body { flex:1; overflow-y:auto; padding:20px 24px; }

    .empty-state { text-align:center; padding:60px 0; }
    .empty-icon { color:${C.greenPale}; margin:0 auto 14px; display:block; }
    .empty-txt { font-size:14px; color:${C.textMuted}; }

    .cart-item {
      display:grid; grid-template-columns:68px 1fr;
      gap:14px; padding:16px 0;
      border-bottom:1px solid ${C.border};
      align-items:start;
    }
    .ci-img {
      width:68px; height:68px; border-radius:12px;
      object-fit:cover; border:1.5px solid ${C.border};
    }
    .ci-name { font-family:'Playfair Display',serif; font-size:15px; font-weight:400; color:${C.greenDark}; margin-bottom:8px; }
    .ci-controls { display:flex; align-items:center; justify-content:space-between; }
    .qty-row { display:flex; align-items:center; gap:10px; }
    .qty-btn {
      width:28px; height:28px; border-radius:50%;
      border:1.5px solid ${C.border}; background:#fff;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; color:${C.greenDark}; transition: all .2s;
    }
    .qty-btn:hover { background:${C.greenDark}; color:#fff; border-color:${C.greenDark}; }
    .qty-val { font-size:14px; font-weight:600; min-width:18px; text-align:center; color:${C.greenDark}; }
    .del-btn { background:none; border:none; cursor:pointer; color:#ccc; transition:color .2s; padding:4px; }
    .del-btn:hover { color:#e74c3c; }
    .ci-price { font-family:'Playfair Display',serif; font-size:17px; font-weight:600; color:${C.greenDark}; }

    /* SHIPPING */
    .ship-section { margin-top:28px; padding-top:20px; border-top:1px solid ${C.border}; }
    .ship-label {
      display:flex; align-items:center; gap:8px;
      font-size:13px; font-weight:500; color:${C.greenDark};
      margin-bottom:12px; text-transform:uppercase; letter-spacing:.07em;
    }
    .ship-opt {
      padding:12px 16px; border:1.5px solid ${C.border};
      border-radius:12px; margin-bottom:8px; cursor:pointer;
      display:flex; justify-content:space-between; align-items:center;
      font-size:13px; transition: all .2s; background:#fff; color:${C.text};
    }
    .ship-opt:hover { border-color:${C.greenLight}; }
    .ship-opt.chosen { border-color:${C.greenMid}; background:${C.greenMist}; font-weight:500; color:${C.greenDark}; }
    .ship-price { font-weight:600; color:${C.greenMid}; }

    /* DRAWER FOOTER */
    .drawer-foot {
      padding:20px 24px; border-top:1px solid ${C.border};
      background:${C.greenMist};
    }
    .totals { display:flex; flex-direction:column; gap:7px; margin-bottom:18px; }
    .total-row { display:flex; justify-content:space-between; font-size:13px; color:${C.textMuted}; }
    .total-grand {
      display:flex; justify-content:space-between;
      font-family:'Playfair Display',serif;
      font-size:22px; font-weight:600; color:${C.greenDark};
      padding-top:10px; border-top:1px solid ${C.border};
      margin-top:6px;
    }
    .checkout-btn {
      width:100%; padding:15px; border-radius:50px; border:none;
      font-family:'DM Sans',sans-serif; font-size:13px;
      font-weight:600; letter-spacing:.1em; text-transform:uppercase;
      cursor:pointer; transition: all .2s;
      display:flex; align-items:center; justify-content:center; gap:10px;
    }
    .checkout-btn.ready { background:${C.greenDark}; color:#fff; }
    .checkout-btn.ready:hover { background:${C.greenMid}; transform:translateY(-1px); }
    .checkout-btn.blocked { background:#ddd; color:#aaa; cursor:not-allowed; }

    /* WHATSAPP */
    .wa-btn {
      position:fixed; bottom:28px; right:22px;
      background:${C.whatsapp}; color:#fff;
      width:58px; height:58px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 6px 20px rgba(37,211,102,.4); z-index:999;
      text-decoration:none; transition: transform .2s, box-shadow .2s;
    }
    .wa-btn:hover { transform:scale(1.08); box-shadow:0 8px 28px rgba(37,211,102,.5); }

    /* FOOTER */
    .footer {
      background:${C.greenDark}; padding:52px 5% 28px; color:rgba(255,255,255,.55);
    }
    .footer-grid {
      display:grid; grid-template-columns:1.8fr 1fr 1fr;
      gap:40px; max-width:1100px; margin:0 auto 40px;
    }
    .footer-logo { height:38px; filter:brightness(0) invert(1); margin-bottom:14px; display:block; }
    .footer-tagline { font-size:13px; line-height:1.8; max-width:280px; color:rgba(255,255,255,.5); }
    .footer-col h4 {
      font-size:10px; letter-spacing:.15em; text-transform:uppercase;
      color:${C.greenPale}; margin-bottom:16px; font-weight:500;
    }
    .footer-col ul { list-style:none; }
    .footer-col ul li { margin-bottom:9px; }
    .footer-col ul li a { color:rgba(255,255,255,.4); text-decoration:none; font-size:13px; transition:color .2s; }
    .footer-col ul li a:hover { color:${C.greenPale}; }
    .footer-strip {
      text-align:center; font-size:12px; color:${C.goldLight};
      padding:14px; background:rgba(255,255,255,.05); border-radius:8px;
      max-width:1100px; margin:0 auto 32px; letter-spacing:.04em;
    }
    .footer-bottom {
      border-top:1px solid rgba(255,255,255,.08);
      padding-top:22px; display:flex; justify-content:space-between;
      font-size:11px; color:rgba(255,255,255,.25);
      max-width:1100px; margin:0 auto;
    }

    /* RESPONSIVE */
    @media(max-width:640px){
      .hero-title { font-size:28px; }
      .hero-overlay { padding:0 5%; }
      .featured-grid { grid-template-columns:1fr 1fr; gap:12px; }
      .products-grid { grid-template-columns:1fr 1fr; gap:12px; }
      .footer-grid { grid-template-columns:1fr; gap:28px; }
      .trust-item { min-width:140px; padding:14px 16px; }
      .nav-links .nav-link:not(.cart-trigger) { display:none; }
    }

    /* UTIL */
    .tap { cursor:pointer; user-select:none; }
    .tap:active { opacity:.75; transform:scale(.97); transition:.1s; }
  `}</style>
);

/* ─── COMPONENT ──────────────────────────────────────── */
export default function App() {
  const [cart,          setCart]          = useState([]);
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [view,          setView]          = useState("inicio");
  const [filterPet,     setFilterPet]     = useState("Todos");
  const [filterCat,     setFilterCat]     = useState("Todos");
  const [search,        setSearch]        = useState("");
  const [shippingZone,  setShippingZone]  = useState("");

  /* cart helpers */
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

  /* filtered products */
  const filtered = useMemo(() =>
    PRODUCTS.filter(p => {
      const matchS = p.name.toLowerCase().includes(search.toLowerCase());
      const matchP = filterPet === "Todos" || p.pet === filterPet || p.pet === "Todos";
      const matchC = filterCat === "Todos" || p.category === filterCat;
      return matchS && matchP && matchC;
    }),
  [search, filterPet, filterCat]);

  /* whatsapp checkout */
  const handleCheckout = () => {
    const lines = cart
      .map(i => `- ${i.name} x${i.qty} ($${(i.price * i.qty).toLocaleString()})`)
      .join("%0A");
    const ship = SHIPPING[shippingZone] === null
      ? "Sujeto a verificación" : `$${shipCost.toLocaleString()}`;
    const url = `https://wa.me/573158429286?text=¡Hola SOIN! 🐾%0AQuiero hacer un pedido:%0A%0A${lines}%0A%0ASubtotal: $${subtotal.toLocaleString()}%0AZona: ${shippingZone}%0AEnvío: ${ship}%0A*TOTAL: $${grandTotal.toLocaleString()}*`;
    window.open(url, "_blank");
  };

  const goTo = (v) => { setView(v); setDrawerOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  /* ─── RENDER ─────────────────────────────────────── */
  return (
    <div className="soin-root">
      {injectStyles()}

      {/* NAV */}
      <nav className="nav">
        <img
          className="nav-logo tap"
          src="/Logo.png"
          alt="SOIN"
          onClick={() => goTo("inicio")}
        />
        <div className="nav-links">
          <button
            className={`nav-link tap ${view === "inicio" ? "active" : ""}`}
            onClick={() => goTo("inicio")}
          >Inicio</button>
          <button
            className={`nav-link tap ${view === "catalogo" ? "active" : ""}`}
            onClick={() => goTo("catalogo")}
          >Tienda</button>
          <button
            className="cart-trigger tap"
            onClick={() => setDrawerOpen(true)}
          >
            <ShoppingCart size={16} />
            Carrito
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
        </div>
      </nav>

      {/* ── INICIO ─────────────────────────────────── */}
      {view === "inicio" && (
        <>
          {/* Hero banner */}
          <div className="hero">
            <img src="/soin-banner.png" alt="SOIN — Todo lo que tu mascota necesita" />
            <div className="hero-overlay">
              <div className="hero-text">
                <div className="hero-eyebrow">🌿 Colección 2025</div>
                <h1 className="hero-title">
                  Todo lo que tu<br />mascota <em>necesita,</em><br />en un solo lugar.
                </h1>
                <p className="hero-sub">Alimentos · Accesorios · Salud · Higiene · Y mucho amor</p>
                <button className="hero-cta tap" onClick={() => goTo("catalogo")}>
                  ¡Compra para los que amas! <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="trust">
            {TRUST.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="trust-item">
                <div className="trust-icon-wrap">
                  <Icon size={18} color={C.greenPale} />
                </div>
                <div>
                  <div className="trust-title">{title}</div>
                  <div className="trust-sub">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Featured */}
          <section className="section">
            <div className="section-header">
              <span className="eyebrow">Selección especial</span>
              <h2 className="section-title">Productos <em>Destacados</em></h2>
            </div>
            <div className="featured-grid">
              {PRODUCTS.slice(0, 4).map((p, i) => (
                <ProductCard key={p.id} p={p} onAdd={addToCart} delay={i * 60} />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button
                className="hero-cta tap"
                style={{ background: C.gold, color: C.greenDark }}
                onClick={() => goTo("catalogo")}
              >
                Ver todo el catálogo <ChevronRight size={15} />
              </button>
            </div>
          </section>
        </>
      )}

      {/* ── CATALOGO ───────────────────────────────── */}
      {view === "catalogo" && (
        <section className="section section-alt" style={{ paddingTop: 40 }}>
          <div className="section-header">
            <span className="eyebrow">Catálogo SOIN</span>
            <h2 className="section-title">Todos los <em>Productos</em></h2>
          </div>

          {/* Search */}
          <div className="search-wrap">
            <Search size={17} />
            <input
              className="search-input"
              type="text"
              placeholder="¿Qué estás buscando?"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filter pets */}
          <div className="filter-scroll" style={{ marginBottom: 8 }}>
            {["Todos","Perro","Gato"].map(v => (
              <button
                key={v}
                className={`filter-pill tap ${filterPet === v ? "on" : ""}`}
                onClick={() => setFilterPet(v)}
              >{v}</button>
            ))}
          </div>
          {/* Filter categories */}
          <div className="filter-scroll" style={{ marginBottom: 28 }}>
            {["Todos","Alimentos","Snacks","Accesorios","Limpieza"].map(v => (
              <button
                key={v}
                className={`filter-pill tap ${filterCat === v ? "on" : ""}`}
                onClick={() => setFilterCat(v)}
              >{v}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p style={{ textAlign: "center", color: C.textMuted, padding: "40px 0" }}>
              No encontramos productos con esa búsqueda 🐾
            </p>
          ) : (
            <div className="products-grid">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} p={p} onAdd={addToCart} delay={i * 50} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-strip">
          ♡ Cuidamos a quienes llenan tu vida de amor, alegría y compañía. ♡
        </div>
        <div className="footer-grid">
          <div>
            <img className="footer-logo" src="/Logo.png" alt="SOIN" />
            <p className="footer-tagline">
              Todo lo que tu mascota necesita, en un solo lugar. Productos naturales con respaldo veterinario para perros y gatos de Colombia.
            </p>
          </div>
          <div className="footer-col">
            <h4>Tienda</h4>
            <ul>
              {["Perros","Gatos","Alimentos Nutritivos","Accesorios","Salud y Bienestar"].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Soporte</h4>
            <ul>
              {["Centro de ayuda","Política de envíos","Devoluciones","WhatsApp","Contacto"].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 SOIN Medellín — Todos los derechos reservados.</span>
          <span>Hecho con 🤍 en Colombia</span>
        </div>
      </footer>

      {/* ── CART DRAWER ────────────────────────────── */}
      {drawerOpen && (
        <>
          <div className="overlay" onClick={() => setDrawerOpen(false)} />
          <aside className="drawer">
            <div className="drawer-head">
              <h3>🛒 Tu Pedido</h3>
              <button className="close-btn tap" onClick={() => setDrawerOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="drawer-body">
              {cart.length === 0 ? (
                <div className="empty-state">
                  <ShoppingCart size={52} className="empty-icon" color={C.greenPale} />
                  <p className="empty-txt">El carrito está vacío</p>
                </div>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img className="ci-img" src={item.img} alt={item.name} />
                      <div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start" }}>
                          <p className="ci-name">{item.name}</p>
                          <button className="del-btn tap" onClick={() => removeItem(item.id)}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="ci-controls">
                          <div className="qty-row">
                            <button className="qty-btn tap" onClick={() => updateQty(item.id, -1)}><Minus size={12} /></button>
                            <span className="qty-val">{item.qty}</span>
                            <button className="qty-btn tap" onClick={() => updateQty(item.id,  1)}><Plus  size={12} /></button>
                          </div>
                          <span className="ci-price">${(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Shipping */}
                  <div className="ship-section">
                    <p className="ship-label"><Truck size={16} color={C.greenMid} /> Zona de envío</p>
                    {Object.entries(SHIPPING).map(([zone, cost]) => (
                      <div
                        key={zone}
                        className={`ship-opt tap ${shippingZone === zone ? "chosen" : ""}`}
                        onClick={() => setShippingZone(zone)}
                      >
                        <span>{zone}</span>
                        <span className="ship-price">
                          {cost === null ? "Por confirmar" : `$${cost.toLocaleString()}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="drawer-foot">
                <div className="totals">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="total-row">
                    <span>Envío</span>
                    <span>
                      {!shippingZone
                        ? <em style={{ color: C.gold }}>Elige zona</em>
                        : SHIPPING[shippingZone] === null
                          ? "Sujeto a verificación"
                          : `$${shipCost.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="total-grand">
                    <span>Total</span>
                    <span>${grandTotal.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  className={`checkout-btn tap ${shippingZone ? "ready" : "blocked"}`}
                  onClick={shippingZone ? handleCheckout : undefined}
                  disabled={!shippingZone}
                >
                  <MessageCircle size={18} />
                  {shippingZone ? "Finalizar por WhatsApp" : "Elige zona de envío"}
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      {/* WhatsApp flotante */}
      <a
        className="wa-btn tap"
        href="https://wa.me/573158429286"
        target="_blank"
        rel="noreferrer"
        title="Escríbenos por WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
}

/* ─── PRODUCT CARD COMPONENT ─────────────────────────── */
function ProductCard({ p, onAdd, delay = 0 }) {
  return (
    <div
      className="pcard"
      style={{ animationDelay: `${delay}ms`, animation: "fadeUp .45s ease both" }}
    >
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div className="pcard-img-wrap">
        <img className="pcard-img" src={p.img} alt={p.name} loading="lazy" />
        {p.badge && (
          <span className={`pcard-badge ${p.badge === "Más vendido" ? "gold-b" : ""}`}>
            {p.badge}
          </span>
        )}
      </div>
      <div className="pcard-body">
        <div>
          <p className="pcard-cat">{p.category} · {p.pet}</p>
          <h3 className="pcard-name">{p.name}</h3>
        </div>
        <div className="pcard-footer">
          <p className="pcard-price">
            ${p.price.toLocaleString()}<sub> COP</sub>
          </p>
          <button className="add-btn tap" onClick={() => onAdd(p)} aria-label={`Agregar ${p.name}`}>
            <Plus size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
