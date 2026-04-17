import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  ShoppingCart, X, Plus, Minus, Search,
  MessageCircle, Trash2, Truck, ChevronRight,
  Leaf, Heart, Shield, Zap, PackageSearch,
  MapPin, Mail, Phone, Facebook, Instagram,
  FileText, RefreshCw, Lock
} from "lucide-react";

/* ════════════════════════════════════════════════════════
   DESIGN TOKENS
════════════════════════════════════════════════════════ */
const C = {
  greenDark:  "#2D4A35",
  greenMid:   "#4A7A5A",
  greenLight: "#7AAB84",
  greenPale:  "#C8DECA",
  greenMist:  "#EAF2EB",
  cream:      "#F5F0E8",
  warmWhite:  "#FAFAF6",
  gold:       "#C9A84C",
  goldLight:  "#E2C97E",
  text:       "#2E2E24",
  textMuted:  "#7A7A6A",
  whatsapp:   "#25D366",
  border:     "rgba(74,122,90,0.18)",
};

/* ════════════════════════════════════════════════════════
   TIPOGRAFÍA
   DISPLAY → Fraunces         (serif orgánico, terminaciones redondas)
   BODY    → Plus Jakarta Sans (sans fresca, moderna, muy legible —
             más refinada que Nunito, misma calidez orgánica)
════════════════════════════════════════════════════════ */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');`;

/* ════════════════════════════════════════════════════════
   UTILIDAD — formato moneda colombiana: $85.000
════════════════════════════════════════════════════════ */
const fmt = (n) =>
  n == null ? "" : `$${Number(n).toLocaleString("es-CO")}`;

const toMoneyNumber = (value) => {
  if (value == null || value === "") return null;
  if (typeof value === "number") return value;
  const cleaned = value.toString().replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeCatalogLabel = (value = "") => {
  const label = value.toString().trim();
  const key = normalize(label);
  if (key === "snaks" || key === "snack") return "Snacks";
  if (key === "alimento") return "Alimentos";
  return label;
};

const uniqueSorted = (items) =>
  Array.from(new Set(items.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "es", { sensitivity: "base" })
  );

const isActiveStatus = (value) =>
  ["activo", "inactivo", "agotado"].includes(normalize(value));

const looksLikeImageUrl = (value) =>
  /^https?:\/\//i.test((value || "").toString());

const isFeaturedProduct = (product) => {
  const value = normalize(product.tag3);
  return Boolean(value) && !["no", "false", "0", "inactivo", "agotado"].includes(value);
};

const normalizePrices = (unitPrice, offerPrice) => {
  if (offerPrice == null || offerPrice === unitPrice) {
    return { price: unitPrice, salePrice: null };
  }

  return {
    price: Math.max(unitPrice, offerPrice),
    salePrice: Math.min(unitPrice, offerPrice),
  };
};

const normalize = (value = "") =>
  (value ?? "")
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

const normalizeKey = (value = "") =>
  normalize(value).replace(/[^a-z0-9]/g, "");

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=500&auto=format&fit=crop";

/* ════════════════════════════════════════════════════════
   CACHE — stale-while-revalidate para el catálogo
   Se guarda en localStorage bajo CACHE_KEY.
   TTL: 30 minutos. Al cargar, se sirve la caché inmediatamente
   y se actualiza en background desde Google Sheets.
════════════════════════════════════════════════════════ */
const CACHE_KEY   = "soin_catalog_v1";
const CACHE_TTL   = 30 * 60 * 1000; // 30 min en ms

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { products, ts } = JSON.parse(raw);
    if (!Array.isArray(products) || !products.length) return null;
    return { products, stale: Date.now() - ts > CACHE_TTL };
  } catch { return null; }
};

const writeCache = (products) => {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ products, ts: Date.now() })); }
  catch {}
};

const getProductVariants = (p) =>
  p.variants?.length
    ? p.variants
    : [{
        id: `${p.id}::${p.presentation || "Única"}`,
        presentation: p.presentation || "Única",
        price: p.price,
        salePrice: p.salePrice ?? null,
        img: p.img || "",
        images: p.images || [],
      }];

/* ════════════════════════════════════════════════════════
   CATÁLOGO ESTANDARIZADO
   Columnas Google Sheets (A→N):
     id | nombre | descripcion | categoria | subcategoria |
     presentacion | etiqueta1 | etiqueta2 | etiqueta3 | precioVenta |
     precioOferta | estado | imagen1 | imagen2 | imagen3
════════════════════════════════════════════════════════ */
export const rowToProduct = (row) => {
  const hasTag3Column = row.length > 14 || isActiveStatus(row[11]) || !looksLikeImageUrl(row[11]);
  const presentation = row[5] || "Única";
  const priceIndex = hasTag3Column ? 9 : 8;
  const salePriceIndex = hasTag3Column ? 10 : 9;
  const statusIndex = hasTag3Column ? 11 : 10;
  const imageStartIndex = hasTag3Column ? 12 : 11;
  const { price, salePrice } = normalizePrices(
    toMoneyNumber(row[priceIndex]) ?? 0,
    toMoneyNumber(row[salePriceIndex])
  );
  const images = [row[imageStartIndex], row[imageStartIndex + 1], row[imageStartIndex + 2]].filter(Boolean);

  return {
    id:          row[0],
    name:        row[1],
    description: row[2],
    category:    normalizeCatalogLabel(row[3]),
    subcategory: normalizeCatalogLabel(row[4]),
    presentation,
    tag1:        row[6] || null,
    tag2:        row[7] || null,
    tag3:        hasTag3Column ? row[8] || null : null,
    price,
    salePrice,
    status:      normalize(row[statusIndex] || "activo"),
    img:         images[0] || "",
    images,
    variants: [{
      id: `${row[0]}::${presentation}`,
      presentation,
      price,
      salePrice,
      img: images[0] || "",
      images,
    }],
  };
};

export const rowsToProducts = (rows) => {
  const grouped = new Map();

  rows.map(rowToProduct).forEach((product) => {
    const hasValidPrice = getProductVariants(product).some((v) => Number(v.price) > 0);
    if (!product.id || !product.name || !hasValidPrice || product.status !== "activo") return;

    const current = grouped.get(product.id);
    if (!current) {
      grouped.set(product.id, product);
      return;
    }

    const variant = product.variants[0];
    const exists = current.variants.some((v) => v.id === variant.id);
    if (!exists) current.variants.push(variant);

    current.images = Array.from(new Set([...(current.images || []), ...(product.images || [])]));
    current.img = current.img || product.img;
    current.tag1 = current.tag1 || product.tag1;
    current.tag2 = current.tag2 || product.tag2;
    current.tag3 = current.tag3 || product.tag3;
  });

  return Array.from(grouped.values());
};

const objectToRow = (item) => {
  const byKey = Object.entries(item || {}).reduce((acc, [key, value]) => {
    acc[normalizeKey(key)] = value;
    return acc;
  }, {});

  const pick = (...keys) => keys.map(normalizeKey).find((key) => byKey[key] != null && byKey[key] !== "");
  const value = (...keys) => byKey[pick(...keys)] ?? "";

  return [
    value("id"),
    value("nombre", "name"),
    value("descripcion", "descripción", "description"),
    value("categoria", "category"),
    value("subcategoria", "subcategory"),
    value("presentacion", "presentación", "presentation"),
    value("etiqueta1", "tag1"),
    value("etiqueta2", "tag2"),
    value("etiqueta3", "tag3", "destacado", "featured"),
    value("precioVenta", "precio venta", "precioUnitario", "precio unitario", "precio", "price"),
    value("precioOferta", "precio oferta", "salePrice"),
    value("estado", "status"),
    value("imagen1", "img", "image", "image1"),
    value("imagen2", "image2"),
    value("imagen3", "image3"),
  ];
};

const payloadToRows = (payload) => {
  const source = Array.isArray(payload)
    ? payload
    : payload?.rows || payload?.values || payload?.data || payload?.catalogo || payload?.products || [];

  if (!Array.isArray(source)) return [];

  const rows = source.map((item) => Array.isArray(item) ? item : objectToRow(item));
  const [firstRow] = rows;
  const firstCell = normalizeKey(firstRow?.[0]);
  const secondCell = normalizeKey(firstRow?.[1]);

  return firstCell === "id" || secondCell === "nombre" ? rows.slice(1) : rows;
};

/* datos locales — misma forma que rowToProduct */
const PRODUCTS = [
  { id:"P001", name:"Alimento Premium Adulto",
    description:"Fórmula balanceada con proteínas naturales para razas grandes. Bolsa 12 kg.",
    category:"Alimentos",  subcategory:"Perro",  tag1:"Más vendido", tag2:"Natural",
    price:85000, salePrice:null,   status:"activo",
    img:"https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500&auto=format&fit=crop" },
  { id:"P002", name:"Snacks Naturales Felinos",
    description:"Premios 100 % naturales con atún del Atlántico. Sin conservantes artificiales.",
    category:"Snacks",     subcategory:"Gato",   tag1:"Natural",     tag2:"Sin gluten",
    price:20000, salePrice:17000,  status:"activo",
    img:"https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&auto=format&fit=crop" },
  { id:"P003", name:"Collar Artesanal Cuero",
    description:"Cuero vegetal con herrajes en cobre. Ajustable. Fabricación artesanal colombiana.",
    category:"Accesorios", subcategory:"Perro",  tag1:null,          tag2:null,
    price:25000, salePrice:null,   status:"activo",
    img:"https://images.unsplash.com/photo-1601758064224-16b7d9e9a4e4?w=500&auto=format&fit=crop" },
  { id:"P004", name:"Arena Sanitaria Premium",
    description:"Aglomerante de alta absorción con fragancia natural de bambú. 4 kg.",
    category:"Limpieza",   subcategory:"Gato",   tag1:null,          tag2:null,
    price:45000, salePrice:null,   status:"activo",
    img:"https://images.unsplash.com/photo-1598137269279-2f6f7b1f6c7c?w=500&auto=format&fit=crop" },
  { id:"P005", name:"Juguete Kong Resistente",
    description:"Goma natural ultrarresistente. Ideal para razas activas y mordedores.",
    category:"Accesorios", subcategory:"Perro",  tag1:"Nuevo",       tag2:null,
    price:15000, salePrice:null,   status:"activo",
    img:"https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop" },
  { id:"P006", name:"Shampoo Hipoalergénico",
    description:"Fórmula suave con avena y aloe vera. Para pieles sensibles.",
    category:"Limpieza",   subcategory:"Todos",  tag1:null,          tag2:"Vegano",
    price:32000, salePrice:28000,  status:"activo",
    img:"https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=500&auto=format&fit=crop" },
];

const SHEETS_CONFIG = {
  scriptUrl: "https://script.google.com/macros/s/AKfycbzLmc1aW6_EYcQLW8EcABdU-M3xGe1Iw3EiYkXULLqf2r0RF9W4eCY3QGTf_aXJhcho/exec",
  deploymentId: "AKfycbzLmc1aW6_EYcQLW8EcABdU-M3xGe1Iw3EiYkXULLqf2r0RF9W4eCY3QGTf_aXJhcho",
  catalogPage: "Catalogo",
  clientePage: "Cliente",
  detallePage: "DetallePedido",
  ordersAction: "createOrder",
};

const SHIPPING = {
  "Zona Sur":       15000,
  "Zona Norte":     25000,
  "Resto del País": null,
};

const PAYMENT_METHODS = [
  "Transferencia bancaria",
  "Efectivo",
  "Wompi",
  "T. crédito o débito",
];

const createOrderId = () => {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SOIN-${stamp}-${random}`;
};

/* --- buildOrderPayload y enviarPedidoASheets a nivel de módulo --- */
const buildOrderPayload = ({ orderId, customer, cart, shippingZone, shipCost, subtotal, grandTotal }) => {
  const fecha = new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
  return {
    action: "createOrder",
    sheets: { cliente: "Cliente", detalle: "DetallePedido" },
    cliente: {
      pedidoId: orderId,
      fecha,
      nombreCompleto: customer.fullName.trim(),
      celular: customer.phone.trim(),
      direccionEntrega: customer.address.trim(),
      zonaEnvio: shippingZone,
      tipoPago: customer.paymentMethod,
      subtotal,
      envio: shipCost,
      total: grandTotal,
      estado: "Pendiente",
    },
    detalle: cart.map((item) => ({
      pedidoId: orderId,
      fecha,
      item: item.id,
      productoId: item.id,
      producto: item.name,
      presentacion: item.presentation || "Única",
      cantidad: item.qty,
      precioUnitario: item.salePrice ?? item.price,
      subtotalLinea: (item.salePrice ?? item.price) * item.qty,
    })),
  };
};

const enviarPedidoASheets = async (datosPedido) => {
  try {
    await fetch(SHEETS_CONFIG.scriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(datosPedido),
    });
    return true;
  } catch (error) {
    console.error("Error de conexión:", error);
    throw error;
  }
};

const TRUST = [
  { icon: Leaf,   title:"Productos Naturales",  sub:"Alta calidad"  },
  { icon: Heart,  title:"Cuidado con Amor",      sub:"Cada etapa"    },
  { icon: Shield, title:"Respaldo Veterinario",  sub:"Certificado"   },
  { icon: Zap,    title:"Envíos Rápidos",        sub:"24–48h"        },
];

/* ════════════════════════════════════════════════════════
   HOOKS
════════════════════════════════════════════════════════ */

/** Carrito persistido en localStorage */
function usePersistedCart() {
  const [cart, setCartRaw] = useState(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(window.localStorage.getItem("soin_cart") || "[]"); }
    catch { return []; }
  });
  const setCart = useCallback((updater) => {
    setCartRaw((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try { window.localStorage.setItem("soin_cart", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);
  return [cart, setCart];
}

/** Toasts efímeros */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);
  return { toasts, push };
}

/** Animación shake del icono del carrito */
function useCartShake() {
  const [shaking, setShaking] = useState(false);
  const shake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);
  return [shaking, shake];
}

/* ════════════════════════════════════════════════════════
   STYLES
════════════════════════════════════════════════════════ */
const injectStyles = () => (
  <style>{`
    ${FONTS}
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    body { background:${C.warmWhite}; }

    :root {
      --f-display : 'Fraunces', Georgia, serif;
      --f-body    : 'Plus Jakarta Sans', system-ui, sans-serif;

      --t-hero   : clamp(28px, 4.5vw, 54px);
      --t-h2     : clamp(24px, 3vw,   38px);
      --t-card   : 17px;
      --t-drawer : 21px;
      --t-body   : 14px;
      --t-meta   : 13px;
      --t-small  : 12px;
      --t-label  : 11px;
      --t-nav    : 12px;
      --t-btn    : 13px;
      --t-price-lg : 21px;
      --t-price-sm : 16px;

      --w-light : 300;
      --w-reg   : 400;
      --w-med   : 500;
      --w-semi  : 600;
      --w-bold  : 700;

      --ls-label : 0.11em;
      --ls-nav   : 0.07em;
      --ls-btn   : 0.07em;
    }

    .soin-root {
      font-family:var(--f-body); font-weight:var(--w-reg);
      font-size:var(--t-body); line-height:1.65;
      background:${C.warmWhite}; min-height:100vh; color:${C.text};
    }

    /* ── NAV ── */
    .nav {
      position:sticky; top:0; z-index:200;
      background:rgba(250,250,246,0.97); backdrop-filter:blur(14px);
      border-bottom:1px solid ${C.border};
      padding:0 5%; display:flex; align-items:center; justify-content:space-between; height:64px;
    }
    .nav-logo { height:46px; cursor:pointer; transition:opacity .2s; }
    .nav-logo:hover { opacity:.75; }
    .nav-links { display:flex; gap:28px; align-items:center; }
    .nav-link {
      font-family:var(--f-body); font-size:var(--t-nav); font-weight:var(--w-semi);
      letter-spacing:var(--ls-nav); text-transform:uppercase;
      cursor:pointer; color:${C.textMuted}; border:none; background:none; padding:0; transition:color .2s;
    }
    .nav-link:hover,.nav-link.active { color:${C.greenDark}; }
    .cart-trigger {
      position:relative; background:${C.greenDark}; color:#fff;
      border:none; border-radius:50px; padding:9px 18px;
      display:flex; align-items:center; gap:7px;
      font-family:var(--f-body); font-size:var(--t-btn); font-weight:var(--w-bold);
      letter-spacing:var(--ls-btn); text-transform:uppercase;
      cursor:pointer; transition:background .2s, transform .15s;
    }
    .cart-trigger:hover { background:${C.greenMid}; transform:translateY(-1px); }
    .cart-trigger.shake { animation:cartShake .45s ease; }
    @keyframes cartShake {
      0%,100%{transform:translateX(0)}
      15%{transform:translateX(-5px) rotate(-4deg)}
      30%{transform:translateX(5px)  rotate(4deg)}
      45%{transform:translateX(-4px) rotate(-2deg)}
      60%{transform:translateX(4px)  rotate(2deg)}
      75%{transform:translateX(-2px)}
    }
    .cart-badge {
      position:absolute; top:-7px; right:-7px;
      background:${C.gold}; color:#fff;
      font-family:var(--f-body); font-size:10px; font-weight:var(--w-bold);
      width:20px; height:20px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      border:2px solid ${C.warmWhite};
      animation:popIn .25s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes popIn { from{transform:scale(0)} to{transform:scale(1)} }

    /* ── HERO desktop ── */
    .hero { position:relative; width:100%; overflow:hidden; }
    .hero-img { width:100%; display:block; object-fit:cover; max-height:520px; min-height:340px; }
    .hero-overlay {
      position:absolute; inset:0;
      background:linear-gradient(105deg,rgba(45,74,53,.72) 0%,rgba(45,74,53,.28) 52%,transparent 100%);
      display:flex; align-items:center; padding:0 6%;
    }
    .hero-content { max-width:500px; }

    /* ── HERO móvil — texto DEBAJO, izquierda ── */
    .hero-text-mobile {
      display:none; background:${C.greenDark};
      padding:28px 5% 32px; text-align:left;
    }

    .hero-eyebrow {
      display:inline-flex; align-items:center; gap:7px;
      background:rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.28);
      border-radius:50px; padding:5px 15px; backdrop-filter:blur(6px);
      font-family:var(--f-body); font-size:var(--t-label); font-weight:var(--w-semi);
      letter-spacing:var(--ls-label); text-transform:uppercase; color:#fff; margin-bottom:14px;
    }
    .hero-title {
      font-family:var(--f-display); font-size:var(--t-hero);
      font-weight:var(--w-reg); line-height:1.1; color:#fff; margin-bottom:12px;
    }
    .hero-title em { font-style:italic; color:${C.goldLight}; }
    .hero-sub {
      font-family:var(--f-body); font-size:var(--t-meta); font-weight:var(--w-light);
      color:rgba(255,255,255,.72); margin-bottom:24px; line-height:1.75;
    }
    .hero-cta {
      background:${C.gold}; color:${C.greenDark}; border:none; border-radius:50px; padding:13px 28px;
      font-family:var(--f-body); font-size:var(--t-btn); font-weight:var(--w-bold);
      letter-spacing:var(--ls-btn); text-transform:uppercase; cursor:pointer;
      transition:background .2s, transform .15s; display:inline-flex; align-items:center; gap:8px;
    }
    .hero-cta:hover { background:${C.goldLight}; transform:translateY(-2px); }

    /* ── TRUST ── */
    .trust { background:${C.greenDark}; display:flex; justify-content:center; flex-wrap:wrap; overflow:hidden; }
    .trust-item {
      display:flex; align-items:center; gap:10px; padding:18px 32px; color:#fff;
      border-right:1px solid rgba(255,255,255,.08); flex:1; min-width:160px; max-width:260px;
    }
    .trust-item:last-child { border-right:none; }
    .trust-icon-wrap { width:38px; height:38px; border-radius:50%; background:rgba(255,255,255,.1); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .trust-title { font-family:var(--f-body); font-size:var(--t-meta); font-weight:var(--w-semi); color:#fff; }
    .trust-sub   { font-family:var(--f-body); font-size:var(--t-small); font-weight:var(--w-reg); color:${C.greenPale}; }

    /* ── SECTIONS ── */
    .section { padding:64px 5%; }
    .section-alt { background:${C.greenMist}; }
    .section-header { text-align:center; margin-bottom:48px; }
    .eyebrow { font-family:var(--f-body); font-size:var(--t-label); font-weight:var(--w-semi); letter-spacing:var(--ls-label); text-transform:uppercase; color:${C.greenMid}; display:block; margin-bottom:10px; }
    .section-title { font-family:var(--f-display); font-size:var(--t-h2); font-weight:var(--w-reg); line-height:1.2; color:${C.greenDark}; }
    .section-title em { font-style:italic; color:${C.greenMid}; }
    .catalog-msg { margin-top:10px; font-family:var(--f-body); font-size:var(--t-small); color:${C.textMuted}; }

    .featured-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:20px; max-width:1100px; margin:0 auto 40px; }
    .featured-scroll-wrap { max-width:1100px; margin:0 auto 16px; position:relative; }
    .featured-scroll {
      display:flex; gap:16px;
      overflow-x:auto; scroll-snap-type:x mandatory; padding:4px 2px 14px;
      scrollbar-width:none; overscroll-behavior-x:contain;
      -webkit-overflow-scrolling:touch;
    }
    .featured-scroll::-webkit-scrollbar { display:none; }
    .featured-scroll .pcard {
      min-width:240px; max-width:240px; flex:0 0 240px; scroll-snap-align:start;
    }
    /* ── DOTS indicadores de scroll ── */
    .featured-dots {
      display:flex; justify-content:center; gap:10px;
      margin-top:4px; margin-bottom:24px;
    }
    .featured-dot-btn {
      width:10px; height:10px; border-radius:50%; border:none; cursor:pointer;
      background:${C.greenPale}; padding:0;
      transition:background .25s, transform .25s;
    }
    .featured-dot-btn.active {
      background:${C.greenMid}; transform:scale(1.35);
    }
    .featured-dot-btn:hover { background:${C.greenLight}; }
    .products-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:20px; max-width:1100px; margin:0 auto; }

    /* ── SEARCH & FILTERS ── */
    .search-wrap { position:relative; max-width:520px; margin:0 auto 20px; }
    .search-wrap svg { position:absolute; left:16px; top:50%; transform:translateY(-50%); color:${C.textMuted}; pointer-events:none; }
    .search-input {
      width:100%; padding:13px 16px 13px 46px; border-radius:50px; border:1.5px solid ${C.border};
      background:#fff; font-family:var(--f-body); font-size:var(--t-body); font-weight:var(--w-reg);
      outline:none; color:${C.text}; transition:border-color .2s, box-shadow .2s;
    }
    .search-input:focus { border-color:${C.greenMid}; box-shadow:0 0 0 3px rgba(74,122,90,.12); }
    .search-input::placeholder { color:${C.textMuted}; font-weight:var(--w-light); }
    .filters-grid {
      display:grid; grid-template-columns:repeat(3,minmax(0,1fr));
      gap:10px; max-width:760px; margin:0 auto 28px;
    }
    .filter-field { display:flex; flex-direction:column; gap:5px; text-align:left; }
    .filter-label {
      font-family:var(--f-body); font-size:var(--t-label); font-weight:var(--w-semi);
      letter-spacing:var(--ls-label); text-transform:uppercase; color:${C.greenMid};
    }
    .filter-select {
      width:100%; padding:11px 12px; border-radius:8px; border:1.5px solid ${C.border};
      background:#fff; color:${C.greenDark}; font-family:var(--f-body);
      font-size:var(--t-meta); font-weight:var(--w-semi); outline:none; cursor:pointer;
      transition:border-color .2s, box-shadow .2s;
    }
    .filter-select:focus { border-color:${C.greenMid}; box-shadow:0 0 0 3px rgba(74,122,90,.12); }

    /* ── EMPTY STATE catálogo ── */
    .empty-catalog {
      text-align:center; padding:64px 20px;
      display:flex; flex-direction:column; align-items:center; gap:14px;
    }
    .empty-catalog h3 { font-family:var(--f-display); font-size:22px; font-weight:var(--w-reg); color:${C.greenDark}; }
    .empty-catalog p  { font-family:var(--f-body); font-size:var(--t-meta); color:${C.textMuted}; max-width:320px; line-height:1.7; }
    .empty-catalog button {
      margin-top:4px; padding:10px 24px; border-radius:50px; border:none;
      background:${C.greenDark}; color:#fff;
      font-family:var(--f-body); font-size:var(--t-btn); font-weight:var(--w-semi); cursor:pointer; transition:background .2s;
    }
    .empty-catalog button:hover { background:${C.greenMid}; }

    /* ── PRODUCT CARD ── */
    .pcard {
      background:#fff; border-radius:18px; overflow:hidden; border:1.5px solid ${C.border};
      transition:transform .3s, box-shadow .3s, border-color .3s; display:flex; flex-direction:column;
    }
    .pcard:hover { transform:translateY(-5px); box-shadow:0 12px 32px rgba(45,74,53,.11); border-color:${C.greenLight}; }
    .pcard-img-wrap { position:relative; overflow:hidden; background:${C.greenMist}; }
    .pcard-img-scroll {
      display:flex; overflow-x:auto; scroll-snap-type:x mandatory;
      scrollbar-width:none; overscroll-behavior-x:contain;
    }
    .pcard-img-scroll::-webkit-scrollbar { display:none; }
    .pcard-img { width:100%; height:190px; object-fit:contain; object-position:center; display:block; flex:0 0 100%; scroll-snap-align:start; transition:transform .5s; background:${C.greenMist}; }
    .pcard:hover .pcard-img { transform:scale(1.02); }
    .pcard-dots {
      position:absolute; left:50%; bottom:9px; transform:translateX(-50%);
      display:flex; gap:5px; padding:4px 7px; border-radius:50px;
      background:rgba(45,74,53,.42); backdrop-filter:blur(6px);
      pointer-events:none;
    }
    .pcard-dot {
      width:6px; height:6px; border-radius:50%;
      background:rgba(255,255,255,.62);
    }
    .pcard-dot:first-child { background:#fff; }
    .pcard-badge {
      position:absolute; top:10px; left:10px; background:${C.greenDark}; color:#fff;
      font-family:var(--f-body); font-size:9px; font-weight:var(--w-bold); letter-spacing:var(--ls-label);
      text-transform:uppercase; padding:4px 11px; border-radius:50px;
    }
    .pcard-badge.gold-b { background:${C.gold}; color:${C.greenDark}; }
    .pcard-body { padding:13px 15px 15px; flex:1; display:flex; flex-direction:column; justify-content:space-between; }
    .pcard-cat  { font-family:var(--f-body); font-size:var(--t-label); font-weight:var(--w-semi); letter-spacing:var(--ls-label); text-transform:uppercase; color:${C.greenMid}; margin-bottom:5px; }
    .pcard-name { font-family:var(--f-display); font-size:var(--t-card); font-weight:var(--w-reg); line-height:1.25; color:${C.greenDark}; margin-bottom:5px; }
    .pcard-desc { font-family:var(--f-body); font-size:11px; font-weight:var(--w-reg); color:${C.textMuted}; line-height:1.55; margin-bottom:12px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
    .pcard-footer { display:flex; align-items:center; justify-content:space-between; gap:8px; }
    .pcard-prices { display:flex; flex-direction:column; }
    .pcard-price { font-family:var(--f-display); font-size:var(--t-price-lg); font-weight:600; color:${C.greenDark}; line-height:1; }
    .pcard-price sub { font-family:var(--f-body); font-size:10px; font-weight:var(--w-reg); vertical-align:baseline; color:${C.textMuted}; }
    .pcard-price.sale { color:${C.greenMid}; }
    .pcard-price-orig { font-family:var(--f-body); font-size:11px; color:${C.textMuted}; text-decoration:line-through; font-weight:var(--w-reg); }
    .variant-select {
      width:100%; margin:0 0 12px; padding:9px 12px;
      border:1.5px solid ${C.border}; border-radius:8px; background:#fff;
      font-family:var(--f-body); font-size:var(--t-small); font-weight:var(--w-semi);
      color:${C.greenDark}; outline:none; cursor:pointer;
      transition:border-color .2s, box-shadow .2s;
    }
    .variant-select:focus { border-color:${C.greenMid}; box-shadow:0 0 0 3px rgba(74,122,90,.12); }
    .variant-note {
      font-family:var(--f-body); font-size:10px; color:${C.textMuted};
      margin-bottom:8px; line-height:1.35;
    }
    .add-btn { background:${C.greenDark}; color:#fff; border:none; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background .2s, transform .15s; flex-shrink:0; }
    .add-btn:hover { background:${C.greenMid}; transform:scale(1.1); }

    /* ── DRAWER ── */
    .overlay { position:fixed; inset:0; background:rgba(0,0,0,.42); z-index:1000; backdrop-filter:blur(5px); animation:fadeIn .25s ease; }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    .drawer { position:fixed; top:0; right:0; bottom:0; width:min(400px,93%); background:${C.warmWhite}; z-index:1001; display:flex; flex-direction:column; animation:slideIn .35s cubic-bezier(.16,1,.3,1); }
    @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }

    .drawer-head { padding:20px 24px; background:${C.greenMist}; border-bottom:1px solid ${C.border}; display:flex; justify-content:space-between; align-items:center; }
    .drawer-head h3 { font-family:var(--f-display); font-size:var(--t-drawer); font-weight:var(--w-reg); color:${C.greenDark}; }
    .close-btn { width:34px; height:34px; border-radius:50%; background:#fff; border:1.5px solid ${C.border}; display:flex; align-items:center; justify-content:center; cursor:pointer; color:${C.textMuted}; transition:all .2s; }
    .close-btn:hover { background:${C.greenDark}; color:#fff; border-color:${C.greenDark}; }
    .drawer-body { flex:1; overflow-y:auto; padding:20px 24px; }

    .empty-state { text-align:center; padding:60px 0; }
    .empty-txt { font-family:var(--f-body); font-size:var(--t-body); font-weight:var(--w-light); color:${C.textMuted}; margin-top:14px; }

    .cart-item { display:grid; grid-template-columns:68px 1fr; gap:13px; padding:14px 0; border-bottom:1px solid ${C.border}; align-items:start; }
    .ci-img { width:68px; height:68px; border-radius:12px; object-fit:cover; border:1.5px solid ${C.border}; }
    .ci-name { font-family:var(--f-display); font-size:15px; font-weight:var(--w-reg); color:${C.greenDark}; margin-bottom:6px; line-height:1.3; }
    .ci-controls { display:flex; align-items:center; justify-content:space-between; }
    .qty-row { display:flex; align-items:center; gap:10px; }
    .qty-btn { width:28px; height:28px; border-radius:50%; border:1.5px solid ${C.border}; background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; color:${C.greenDark}; transition:all .2s; }
    .qty-btn:hover { background:${C.greenDark}; color:#fff; border-color:${C.greenDark}; }
    .qty-val { font-family:var(--f-display); font-size:16px; font-weight:600; min-width:18px; text-align:center; color:${C.greenDark}; }
    .del-btn { background:none; border:none; cursor:pointer; color:#ccc; transition:color .2s; padding:4px; }
    .del-btn:hover { color:#e74c3c; }
    .ci-price { font-family:var(--f-display); font-size:var(--t-price-sm); font-weight:600; color:${C.greenDark}; }

    .ship-section { margin-top:26px; padding-top:18px; border-top:1px solid ${C.border}; }
    .ship-label { display:flex; align-items:center; gap:8px; font-family:var(--f-body); font-size:var(--t-label); font-weight:var(--w-semi); letter-spacing:var(--ls-label); text-transform:uppercase; color:${C.greenDark}; margin-bottom:12px; }
    .ship-opt { width:100%; padding:11px 15px; border:1.5px solid ${C.border}; border-radius:12px; margin-bottom:8px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; font-family:var(--f-body); font-size:var(--t-meta); font-weight:var(--w-reg); transition:all .2s; background:#fff; color:${C.text}; text-align:left; }
    .ship-opt:hover { border-color:${C.greenLight}; }
    .ship-opt.chosen { border-color:${C.greenMid}; background:${C.greenMist}; font-weight:var(--w-semi); color:${C.greenDark}; }
    .ship-price { font-family:var(--f-display); font-size:var(--t-meta); font-weight:600; color:${C.greenMid}; }
    .checkout-form { margin-top:24px; padding-top:18px; border-top:1px solid ${C.border}; }
    .checkout-form-grid { display:flex; flex-direction:column; gap:10px; }
    .checkout-field { display:flex; flex-direction:column; gap:5px; }
    .checkout-label {
      font-family:var(--f-body); font-size:var(--t-label); font-weight:var(--w-semi);
      letter-spacing:var(--ls-label); text-transform:uppercase; color:${C.greenDark};
    }
    .checkout-input {
      width:100%; padding:11px 12px; border-radius:8px; border:1.5px solid ${C.border};
      background:#fff; color:${C.text}; font-family:var(--f-body); font-size:var(--t-meta);
      outline:none; transition:border-color .2s, box-shadow .2s;
    }
    .checkout-input:focus { border-color:${C.greenMid}; box-shadow:0 0 0 3px rgba(74,122,90,.12); }
    .checkout-input::placeholder { color:${C.textMuted}; }
    .checkout-help { margin-top:9px; font-family:var(--f-body); font-size:11px; color:${C.textMuted}; line-height:1.5; }

    .drawer-foot { padding:18px 24px; border-top:1px solid ${C.border}; background:${C.greenMist}; }
    .totals { display:flex; flex-direction:column; gap:7px; margin-bottom:16px; }
    .total-row { display:flex; justify-content:space-between; font-family:var(--f-body); font-size:var(--t-meta); font-weight:var(--w-reg); color:${C.textMuted}; }
    .total-grand { display:flex; justify-content:space-between; align-items:baseline; padding-top:10px; border-top:1px solid ${C.border}; margin-top:4px; }
    .total-grand-label { font-family:var(--f-body); font-size:var(--t-label); font-weight:var(--w-semi); letter-spacing:var(--ls-label); text-transform:uppercase; color:${C.greenDark}; }
    .total-grand-value { font-family:var(--f-display); font-size:var(--t-price-lg); font-weight:600; color:${C.greenDark}; }
    .checkout-btn { width:100%; padding:14px; border-radius:50px; border:none; font-family:var(--f-body); font-size:var(--t-btn); font-weight:var(--w-bold); letter-spacing:var(--ls-btn); text-transform:uppercase; cursor:pointer; transition:all .2s; margin-top:14px; display:flex; align-items:center; justify-content:center; gap:10px; }
    .checkout-btn.ready { background:${C.greenDark}; color:#fff; }
    .checkout-btn.ready:hover { background:${C.greenMid}; transform:translateY(-1px); }
    .checkout-btn.blocked { background:#ddd; color:#aaa; cursor:not-allowed; }

    /* ── ORDER SUCCESS ── */
    .order-success {
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      padding:48px 24px; text-align:center; gap:0;
    }
    .order-success-icon {
      width:76px; height:76px; border-radius:50%;
      background:${C.greenMist}; border:2px solid ${C.greenPale};
      display:flex; align-items:center; justify-content:center;
      margin-bottom:22px;
      animation:popIn .4s cubic-bezier(.34,1.56,.64,1);
    }
    .order-success h3 {
      font-family:var(--f-display); font-size:22px; font-weight:var(--w-reg);
      color:${C.greenDark}; margin-bottom:12px; line-height:1.2;
    }
    .order-success p {
      font-family:var(--f-body); font-size:var(--t-meta); color:${C.textMuted};
      line-height:1.75; max-width:270px; margin-bottom:28px;
    }
    .order-success-id {
      font-family:var(--f-body); font-size:var(--t-small); font-weight:var(--w-semi);
      color:${C.greenMid}; background:${C.greenMist}; border-radius:50px;
      padding:6px 16px; margin-bottom:28px; letter-spacing:.04em;
    }
    .order-catalog-btn {
      width:100%; padding:14px; border-radius:50px; border:none;
      background:${C.greenDark}; color:#fff;
      font-family:var(--f-body); font-size:var(--t-btn); font-weight:var(--w-bold);
      letter-spacing:var(--ls-btn); text-transform:uppercase;
      cursor:pointer; transition:background .2s, transform .15s;
      display:flex; align-items:center; justify-content:center; gap:9px;
    }
    .order-catalog-btn:hover { background:${C.greenMid}; transform:translateY(-1px); }

    /* ── TOASTS ── */
    .toast-wrap { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:8px; z-index:2000; pointer-events:none; }
    .toast { background:${C.greenDark}; color:#fff; padding:10px 22px; border-radius:50px; font-family:var(--f-body); font-size:var(--t-meta); font-weight:var(--w-semi); white-space:nowrap; box-shadow:0 6px 20px rgba(45,74,53,.3); border-left:3px solid ${C.gold}; animation:toastIn .35s cubic-bezier(.16,1,.3,1); }
    @keyframes toastIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration:.01ms !important;
        animation-iteration-count:1 !important;
        scroll-behavior:auto !important;
        transition-duration:.01ms !important;
      }
    }

    /* ── WA ── */
    .wa-btn { position:fixed; bottom:28px; right:22px; background:${C.whatsapp}; color:#fff; width:56px; height:56px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 6px 20px rgba(37,211,102,.4); z-index:999; text-decoration:none; transition:transform .2s, box-shadow .2s; }
    .wa-btn:hover { transform:scale(1.08); box-shadow:0 8px 28px rgba(37,211,102,.5); }

    /* ── FOOTER ── */
    .footer { background:${C.greenDark}; padding:52px 5% 28px; }
    .footer-grid {
      display:grid; grid-template-columns:1.8fr 1fr 1fr 1fr;
      gap:36px; max-width:1100px; margin:0 auto 40px;
    }
    .footer-logo { height:38px; filter:brightness(0) invert(1); margin-bottom:14px; display:block; }
    .footer-tagline { font-family:var(--f-body); font-size:var(--t-meta); font-weight:var(--w-light); line-height:1.8; max-width:280px; color:rgba(255,255,255,.5); margin-bottom:18px; }
    .footer-social { display:flex; gap:10px; margin-top:4px; }
    .footer-social-btn {
      width:36px; height:36px; border-radius:50%; border:1.5px solid rgba(255,255,255,.18);
      display:flex; align-items:center; justify-content:center;
      color:rgba(255,255,255,.55); text-decoration:none;
      transition:background .2s, border-color .2s, color .2s;
    }
    .footer-social-btn:hover { background:rgba(255,255,255,.12); border-color:rgba(255,255,255,.4); color:#fff; }
    .footer-col h4 { font-family:var(--f-body); font-size:var(--t-small); font-weight:var(--w-semi); letter-spacing:var(--ls-label); text-transform:uppercase; color:${C.greenPale}; margin-bottom:16px; }
    .footer-col ul { list-style:none; }
    .footer-col ul li { margin-bottom:9px; }
    .footer-col ul li a,.footer-col ul li span {
      font-family:var(--f-body); font-size:var(--t-meta); font-weight:var(--w-light);
      color:rgba(255,255,255,.4); text-decoration:none; transition:color .2s;
      display:flex; align-items:flex-start; gap:7px; line-height:1.5;
    }
    .footer-col ul li a:hover { color:${C.greenPale}; }
    .footer-col ul li svg { flex-shrink:0; margin-top:2px; opacity:.6; }
    .footer-strip { text-align:center; font-family:var(--f-body); font-size:var(--t-small); font-weight:var(--w-reg); letter-spacing:.03em; color:${C.goldLight}; padding:13px; background:rgba(255,255,255,.05); border-radius:8px; max-width:1100px; margin:0 auto 32px; }
    .footer-bottom { border-top:1px solid rgba(255,255,255,.08); padding-top:22px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; font-family:var(--f-body); font-size:var(--t-small); font-weight:var(--w-reg); color:rgba(255,255,255,.25); max-width:1100px; margin:0 auto; }

    /* ── POLÍTICAS (vista inline) ── */
    .policy-section { background:${C.warmWhite}; padding:60px 5%; max-width:860px; margin:0 auto; }
    .policy-section h2 { font-family:var(--f-display); font-size:clamp(22px,2.5vw,32px); color:${C.greenDark}; margin-bottom:8px; }
    .policy-section h3 { font-family:var(--f-display); font-size:18px; color:${C.greenMid}; margin:28px 0 8px; }
    .policy-section p,.policy-section li {
      font-family:var(--f-body); font-size:var(--t-meta); color:${C.textMuted}; line-height:1.8;
    }
    .policy-section ul { padding-left:20px; margin-bottom:12px; }
    .policy-section ul li { margin-bottom:6px; }
    .policy-back { display:inline-flex; align-items:center; gap:6px; margin-bottom:28px; font-family:var(--f-body); font-size:var(--t-meta); font-weight:var(--w-semi); color:${C.greenMid}; border:none; background:none; cursor:pointer; padding:0; transition:color .2s; }
    .policy-back:hover { color:${C.greenDark}; }
    .policy-divider { height:1px; background:${C.border}; margin:36px 0; }

    /* ── RESPONSIVE ── */
    @media(max-width:640px){
      .hero               { min-height:0; overflow:hidden; background:#dfeadf; }
      .hero-img           { height:auto; max-height:none; min-height:0; object-fit:contain; object-position:center top; display:block; }
      .hero-overlay       {
        display:flex; align-items:center; justify-content:flex-start;
        padding:0 4%;
        background:linear-gradient(90deg,rgba(45,74,53,.68) 0%,rgba(45,74,53,.42) 34%,rgba(45,74,53,.08) 55%,transparent 76%);
      }
      .hero-content       { max-width:48%; padding-top:4px; }
      .hero-title         { font-size:clamp(18px,5vw,27px); line-height:1.05; margin-bottom:7px; }
      .hero-sub           { font-size:10px; line-height:1.35; margin-bottom:11px; max-width:175px; }
      .hero-eyebrow       { font-size:8px; padding:3px 8px; margin-bottom:7px; }
      .hero-cta           { font-size:9px; padding:8px 10px; gap:4px; max-width:100%; line-height:1.2; }
      .hero-text-mobile   { display:none; }

      .nav-links .nav-link:not(.cart-trigger) { display:none; }
      .nav { height:56px; }
      .nav-logo { height:38px; }

      .trust              { display:grid; grid-template-columns:1fr 1fr; }
      .trust-item         { min-width:0; padding:13px 10px; border-right:none; max-width:100%; border-bottom:1px solid rgba(255,255,255,.08); }
      .trust-item:nth-child(odd)       { border-right:1px solid rgba(255,255,255,.08); }
      .trust-item:nth-last-child(-n+2) { border-bottom:none; }

      .featured-grid      { grid-template-columns:1fr 1fr; gap:10px; }
      .featured-scroll    { gap:10px; }
      .featured-scroll .pcard { min-width:172px; max-width:172px; flex-basis:172px; }
      .products-grid      { grid-template-columns:1fr 1fr; gap:10px; }
      .filters-grid       { grid-template-columns:1fr; gap:9px; margin-bottom:22px; }
      .footer-grid        { grid-template-columns:1fr 1fr; gap:20px; }

      .pcard-img          { height:130px; object-fit:contain; }
      .pcard-name         { font-size:15px; }
      .pcard-desc         { display:none; }
      .pcard-body         { padding:10px 11px 12px; }

      .section            { padding:36px 4%; }
      .section-header     { margin-bottom:28px; }
      .drawer             { width:100%; }
      .footer             { padding:36px 5% 24px; }
    }

    @media(max-width:380px){
      .hero-content       { max-width:46%; }
      .hero-title         { font-size:clamp(16px,4.9vw,22px); }
      .hero-sub           { font-size:9px; margin-bottom:9px; max-width:150px; }
      .hero-eyebrow       { font-size:7px; padding:3px 7px; }
      .hero-cta           { font-size:8px; padding:7px 8px; }
    }

    .tap { cursor:pointer; user-select:none; }
    .tap:active { opacity:.76; transform:scale(.97); transition:.1s; }
  `}</style>
);

/* ════════════════════════════════════════════════════════
   APP COMPONENT
════════════════════════════════════════════════════════ */
export default function App() {
  const {
    products: sheetsProducts,
    loading: catalogLoading,
    error: catalogError,
    fromCache: catalogFromCache,
  } = useSheetsCatalog(SHEETS_CONFIG);
  const sheetsEnabled = Boolean(SHEETS_CONFIG.scriptUrl);
  const catalogProducts = sheetsProducts.length ? sheetsProducts : PRODUCTS;
  const [cart, setCart]             = usePersistedCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView]             = useState("inicio");
  const [policyView, setPolicyView] = useState(null); // "envios" | "devoluciones" | "datos"
  const [filterPet, setFilterPet]   = useState("");
  const [filterCat, setFilterCat]   = useState("");
  const [filterSubcat, setFilterSubcat] = useState("");
  const [search, setSearch]         = useState("");
  const [shippingZone, setShipping] = useState("");
  const [customer, setCustomer] = useState({
    fullName: "",
    phone: "",
    address: "",
    paymentMethod: "",
  });
  const [orderSaving, setOrderSaving] = useState(false);
  const { toasts, push: toast }     = useToast();
  const [shaking, shake]            = useCartShake();

  const updateCustomer = useCallback((field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  }, []);

  /* carrito */
  const addToCart = useCallback((p) => {
    setCart((c) => {
      const key = p.cartId || p.id;
      const ex = c.find((i) => (i.cartId || i.id) === key);
      return ex
        ? c.map((i) => ((i.cartId || i.id) === key ? { ...i, qty: i.qty + 1 } : i))
        : [...c, { ...p, cartId: key, qty: 1 }];
    });
    shake();
    toast(`✓ ${p.name}${p.presentation ? ` (${p.presentation})` : ""} agregado`);
  }, [setCart, shake, toast]);

  const updateQty = useCallback((id, d) =>
    setCart((c) =>
      c.map((i) => ((i.cartId || i.id) === id ? { ...i, qty: Math.max(0, i.qty + d) } : i))
       .filter((i) => i.qty > 0)
    ), [setCart]);

  const removeItem = useCallback((id) => {
    setCart((c) => c.filter((i) => (i.cartId || i.id) !== id));
    toast("Producto eliminado del carrito");
  }, [setCart, toast]);

  const [orderCompleted, setOrderCompleted] = useState(false);

  /* totales */
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal   = cart.reduce((s, i) => s + (i.salePrice ?? i.price) * i.qty, 0);
  const shippingNeedsQuote = shippingZone && SHIPPING[shippingZone] === null;
  const shipCost   = shippingZone && !shippingNeedsQuote ? SHIPPING[shippingZone] : 0;
  const grandTotal = subtotal + shipCost;

  const filterOptions = useMemo(() => ({
    categories: uniqueSorted(catalogProducts.map((p) => p.category)),
    subcategories: uniqueSorted(
      catalogProducts
        .filter((p) => !filterCat || normalize(p.category) === normalize(filterCat))
        .map((p) => p.subcategory)
    ),
    pets: uniqueSorted(catalogProducts.map((p) => p.tag2)),
  }), [catalogProducts, filterCat]);

  const featuredProducts = useMemo(() =>
    catalogProducts
      .filter((p) => p.status === "activo" && isFeaturedProduct(p))
      .slice(0, 10),
  [catalogProducts]);

  useEffect(() => {
    if (filterSubcat && !filterOptions.subcategories.includes(filterSubcat)) {
      setFilterSubcat("");
    }
  }, [filterSubcat, filterOptions.subcategories]);

  /* filtrado — busca también en descripción y etiquetas */
  const filtered = useMemo(() =>
    catalogProducts.filter((p) => {
      if (p.status !== "activo") return false;
      const q = normalize(search);
      const matchS = !q || [
        p.name,
        p.description,
        p.category,
        p.subcategory,
        p.tag1,
        p.tag2,
        p.tag3,
        ...getProductVariants(p).map((v) => v.presentation),
      ].map(normalize).join(" ").includes(q);
      const petLabel = normalize(p.tag2);
      const matchP =
        !filterPet ||
        petLabel === normalize(filterPet) ||
        petLabel.includes(normalize(filterPet)) ||
        petLabel === "todos";
      const matchC = !filterCat || normalize(p.category) === normalize(filterCat);
      const matchSubcat = !filterSubcat || normalize(p.subcategory) === normalize(filterSubcat);
      return matchS && matchP && matchC && matchSubcat;
    }),
  [catalogProducts, search, filterPet, filterCat, filterSubcat]);

  /* checkout — encodeURIComponent en texto dinámico */
const handleCheckout = useCallback(async () => {
    // 1. Validaciones iniciales
    if (orderSaving) return;

    if (cart.length === 0) {
      toast("Agrega productos antes de finalizar");
      return;
    }

    if (!shippingZone) {
      toast("Elige una zona de envío para continuar");
      return;
    }

    const missingCustomerField = [
      ["fullName", "nombre completo"],
      ["phone", "número de celular"],
      ["address", "dirección de entrega"],
      ["paymentMethod", "tipo de pago"],
    ].find(([field]) => !customer[field].trim());

    if (missingCustomerField) {
      toast(`Completa ${missingCustomerField[1]} para continuar`);
      return;
    }

    // 2. Preparación de datos
    const orderId = createOrderId();
    const orderPayload = buildOrderPayload({
      orderId,
      customer,
      cart,
      shippingZone,
      shipCost,
      subtotal,
      grandTotal,
    });

    setOrderSaving(true);

    // 3. Intento de registro y cambio de vista
    try {
      await enviarPedidoASheets(orderPayload);
      setCart([]);
      setShipping("");
      setCustomer({ fullName: "", phone: "", address: "", paymentMethod: "" });
      setOrderCompleted(true);
    } catch (error) {
      console.error("Error al registrar pedido:", error);
      toast("No pudimos registrar el pedido. Revisa tu conexión.");
    } finally {
      setOrderSaving(false);
    }
  }, [cart, customer, orderSaving, shippingZone, subtotal, shipCost, grandTotal, toast]);

  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen]);

  const goTo = (v) => { setView(v); setPolicyView(null); setDrawerOpen(false); window.scrollTo({ top:0, behavior:"smooth" }); };
  const resetFilters = () => { setSearch(""); setFilterPet(""); setFilterCat(""); setFilterSubcat(""); };
  
  return (
    <div className="soin-root">
      {injectStyles()}

      {/* NAV */}
      <nav className="nav">
        <img className="nav-logo tap" src="/Logo.png" alt="SOIN — volver al inicio" onClick={() => goTo("inicio")} />
        <div className="nav-links">
          <button className={`nav-link tap ${view==="inicio"?"active":""}`} onClick={() => goTo("inicio")}>Inicio</button>
          <button className={`nav-link tap ${view==="catalogo"?"active":""}`} onClick={() => goTo("catalogo")}>Tienda</button>
          <button
            className={`cart-trigger tap${shaking?" shake":""}`}
            onClick={() => setDrawerOpen(true)}
            aria-label={`Abrir carrito, ${totalItems} ${totalItems===1?"producto":"productos"}`}
          >
            <ShoppingCart size={16} aria-hidden="true" />
            Carrito
            {totalItems > 0 && <span className="cart-badge" aria-hidden="true">{totalItems}</span>}
          </button>
        </div>
      </nav>

      {/* ══ INICIO ══ */}
      {view === "inicio" && (
        <>
          {/* Hero desktop */}
          <div className="hero">
            <img className="hero-img" src="/soin-banner.png"
              alt="SOIN — Todo lo que tu mascota necesita en un solo lugar" />
            <div className="hero-overlay" aria-hidden="true">
              <div className="hero-content">
                <h1 className="hero-title">
                  Todo lo que tu<br />mascota <em>necesita,</em><br />en un solo lugar.
                </h1>
                <p className="hero-sub">Alimentos · Accesorios · Salud · Higiene · Y mucho amor</p>
                <button className="hero-cta tap" onClick={() => goTo("catalogo")}
                  aria-label="Ir al catálogo de productos">
                  ¡Compra Ahora! <ChevronRight size={15} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Hero móvil — texto debajo, alineado izquierda */}
          <div className="hero-text-mobile">
            <h1 className="hero-title">
              Todo lo que tu mascota <em>necesita,</em> en un solo lugar.
            </h1>
            <p className="hero-sub" style={{marginBottom:22}}>
              Alimentos · Accesorios · Salud · Higiene · Y mucho amor
            </p>
            <button className="hero-cta tap" onClick={() => goTo("catalogo")}
              aria-label="Ir al catálogo de productos">
              ¡Compra Ahora! <ChevronRight size={15} aria-hidden="true" />
            </button>
          </div>

          {/* Trust strip */}
          <div className="trust" role="list">
            {TRUST.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="trust-item" role="listitem">
                <div className="trust-icon-wrap" aria-hidden="true">
                  <Icon size={18} color={C.greenPale} />
                </div>
                <div>
                  <div className="trust-title">{title}</div>
                  <div className="trust-sub">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Destacados */}
          {featuredProducts.length > 0 && (
            <section className="section" aria-labelledby="dest-h">
              <div className="section-header">
                <span className="eyebrow">Selección especial</span>
                <h2 className="section-title" id="dest-h">Productos <em>Destacados</em></h2>
              </div>
              <FeaturedScroll products={featuredProducts} onAdd={addToCart} />
              <div style={{textAlign:"center",marginTop:8}}>
                <button className="hero-cta tap"
                  style={{background:C.gold,color:C.greenDark}}
                  onClick={() => goTo("catalogo")}
                  aria-label="Ver catálogo completo">
                  Ver todo el catálogo <ChevronRight size={15} aria-hidden="true" />
                </button>
              </div>
            </section>
          )}
        </>
      )}

      {/* ══ CATÁLOGO ══ */}
      {view === "catalogo" && (
        <section className="section section-alt" style={{paddingTop:40}} aria-labelledby="cat-h">
          <div className="section-header">
            <span className="eyebrow">Catálogo SOIN</span>
            <h2 className="section-title" id="cat-h">Todos los <em>Productos</em></h2>
            {sheetsEnabled && catalogLoading && !catalogFromCache && <p className="catalog-msg">Cargando catálogo...</p>}
            {sheetsEnabled && catalogLoading && catalogFromCache  && <p className="catalog-msg">Actualizando catálogo en segundo plano…</p>}
            {sheetsEnabled && catalogError && <p className="catalog-msg">No pudimos sincronizar con Sheets. Mostrando catálogo guardado.</p>}
          </div>

          <div className="search-wrap" role="search">
            <Search size={17} aria-hidden="true" />
            <input
              className="search-input" type="search"
              placeholder="Buscar por nombre, categoría o etiqueta…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar productos"
            />
          </div>

          <div className="filters-grid" aria-label="Filtros del catálogo">
            <label className="filter-field">
              <span className="filter-label">Categoría</span>
              <select
                className="filter-select"
                value={filterCat}
                onChange={(event) => setFilterCat(event.target.value)}
              >
                <option value="">Todas</option>
                {filterOptions.categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>

            <label className="filter-field">
              <span className="filter-label">Subcategoría</span>
              <select
                className="filter-select"
                value={filterSubcat}
                onChange={(event) => setFilterSubcat(event.target.value)}
              >
                <option value="">Todas</option>
                {filterOptions.subcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>{subcategory}</option>
                ))}
              </select>
            </label>

            <label className="filter-field">
              <span className="filter-label">Mascota</span>
              <select
                className="filter-select"
                value={filterPet}
                onChange={(event) => setFilterPet(event.target.value)}
              >
                <option value="">Todas</option>
                {filterOptions.pets.map((pet) => (
                  <option key={pet} value={pet}>{pet}</option>
                ))}
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-catalog" role="status" aria-live="polite">
              <PackageSearch size={56} color={C.greenPale} aria-hidden="true" />
              <h3>¡Ups! No encontramos productos</h3>
              <p>Intenta con otra palabra o explora otras categorías. ¡Tenemos muchas opciones para tu mascota!</p>
              <button onClick={resetFilters}>Ver todos los productos</button>
            </div>
          ) : (
            <div className="products-grid" role="list"
              aria-label={`${filtered.length} productos encontrados`}>
              {filtered.map((p,i) => (
                <ProductCard key={p.id} p={p} onAdd={addToCart} delay={i*50} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ══ POLÍTICAS ══ */}
      {policyView && (
        <div className="policy-section">
          <button className="policy-back tap" onClick={() => { setPolicyView(null); window.scrollTo({top:0,behavior:"smooth"}); }}>
            <ChevronRight size={14} style={{transform:"rotate(180deg)"}} /> Volver
          </button>

          {policyView === "envios" && (
            <>
              <h2>Política de Envío</h2>
              <p>SOIN Pets se compromete a enviar los productos de manera eficiente, segura y transparente. Antes de despachar cualquier pedido verificamos la orden, la disponibilidad del producto, la dirección de entrega y el correcto pago.</p>
              <h3>Tiempos de entrega</h3>
              <ul>
                <li><strong>La Estrella, Itagüí, Sabaneta, Envigado:</strong> 24 horas.</li>
                <li><strong>Medellín y Bello:</strong> 48 horas.</li>
                <li><strong>Caldas, Copacabana, Girardota y Barbosa:</strong> 1 a 2 días hábiles.</li>
                <li><strong>Demás ciudades de Colombia:</strong> 2 a 5 días hábiles. Se envía número de guía para rastreo.</li>
              </ul>
              <h3>Costos de envío</h3>
              <p>Los costos se calculan y muestran al momento de finalizar la compra según la zona seleccionada.</p>
            </>
          )}

          {policyView === "devoluciones" && (
            <>
              <h2>Política de Cambios, Devoluciones y Garantías</h2>
              <p>Para solicitar un cambio o devolución el producto debe estar en las mismas condiciones en que fue recibido, en su embalaje original, con mínimo el 90% de su contenido y presentando el recibo de compra original.</p>
              <h3>Procedimiento</h3>
              <p>Contáctanos por WhatsApp al <strong>312 7325195</strong>. Verificamos la solicitud, emitimos un número de autorización y revisamos el producto al recibirlo.</p>
              <h3>Tiempos de procesamiento</h3>
              <ul>
                <li><strong>Devolución de dinero:</strong> 24 horas.</li>
                <li><strong>Cambio de producto:</strong> 1 a 2 días hábiles (puede variar según disponibilidad).</li>
              </ul>
              <h3>Garantía</h3>
              <p>Garantizamos que los productos están libres de defectos de fabricación. En caso de defecto, reemplazamos el producto o devolvemos el dinero. La garantía no cubre daños por uso indebido, falta de mantenimiento o manipulación por parte del cliente.</p>
            </>
          )}

          {policyView === "datos" && (
            <>
              <h2>Política de Protección de Datos Personales</h2>
              <p>SOIN Pets asume toda la responsabilidad del tratamiento de los datos personales de clientes, proveedores, empleados y terceros. Los datos recibidos se usan únicamente con fines comerciales, promocionales e informativos.</p>
              <h3>Finalidad del tratamiento</h3>
              <ul>
                <li>Recibir, preparar y enviar pedidos.</li>
                <li>Mejorar el servicio al cliente.</li>
                <li>Informar sobre promociones y productos.</li>
                <li>Cumplir obligaciones legales y contractuales.</li>
              </ul>
              <h3>Derechos de los titulares</h3>
              <p>Puedes conocer, actualizar, rectificar o solicitar la cancelación de tus datos escribiéndonos por WhatsApp o al correo soinpets@gmail.com. La cancelación se hace efectiva dentro de 3 días hábiles.</p>
            </>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-strip">♡ Cuidamos a quienes llenan tu vida de amor, alegría y compañía. ♡</div>
        <div className="footer-grid">
          {/* Columna 1 — Marca + redes */}
          <div>
            <img className="footer-logo" src="/Logo.png" alt="SOIN" />
            <p className="footer-tagline">Todo lo que tu mascota necesita, en un solo lugar. Productos naturales con respaldo veterinario para perros y gatos de Colombia.</p>
            <div className="footer-social">
              <a className="footer-social-btn"
                href="https://www.facebook.com/profile.php?id=61572112329789"
                target="_blank" rel="noreferrer" aria-label="Facebook de SOIN Pets">
                <Facebook size={16} />
              </a>
              <a className="footer-social-btn"
                href="https://www.instagram.com/soin.pets/"
                target="_blank" rel="noreferrer" aria-label="Instagram de SOIN Pets">
                <Instagram size={16} />
              </a>
              <a className="footer-social-btn"
                href="https://wa.me/573125071461"
                target="_blank" rel="noreferrer" aria-label="WhatsApp de SOIN Pets">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Columna 2 — Tienda */}
          <div className="footer-col">
            <h4>Tienda</h4>
            <ul>
              {["Perros","Gatos","Alimentos Nutritivos","Accesorios","Salud y Bienestar"].map(l => (
                <li key={l}><a href="#" onClick={(e)=>{e.preventDefault();goTo("catalogo");}}>{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Columna 3 — Políticas */}
          <div className="footer-col">
            <h4>Políticas</h4>
            <ul>
              <li>
                <a href="#" onClick={(e)=>{e.preventDefault();setPolicyView("envios");window.scrollTo({top:0,behavior:"smooth"});}}>
                  <Truck size={12} /> Política de envíos
                </a>
              </li>
              <li>
                <a href="#" onClick={(e)=>{e.preventDefault();setPolicyView("devoluciones");window.scrollTo({top:0,behavior:"smooth"});}}>
                  <RefreshCw size={12} /> Cambios y devoluciones
                </a>
              </li>
              <li>
                <a href="#" onClick={(e)=>{e.preventDefault();setPolicyView("datos");window.scrollTo({top:0,behavior:"smooth"});}}>
                  <Lock size={12} /> Protección de datos
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4 — Contacto */}
          <div className="footer-col">
            <h4>Contacto</h4>
            <ul>
              <li>
                <span>
                  <MapPin size={12} />
                  Envigado, Antioquia, Colombia
                </span>
              </li>
              <li>
                <a href="tel:+573125071461">
                  <Phone size={12} />
                  312 507 1461
                </a>
              </li>
              <li>
                <a href="mailto:soinpets@gmail.com">
                  <Mail size={12} />
                  soinpets@gmail.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/573125071461" target="_blank" rel="noreferrer">
                  <MessageCircle size={12} />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2025 SOIN Pets, Envigado — Todos los derechos reservados.</span>
          <span>Hecho con 🤍 en Colombia</span>
        </div>
      </footer>

      {/* CART DRAWER */}
      {drawerOpen && (
        <>
          <div className="overlay" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <aside className="drawer" role="dialog" aria-modal="true" aria-label="Carrito de compras">
            <div className="drawer-head">
              <h3>🛒 Tu Pedido</h3>
              <button className="close-btn tap" onClick={() => setDrawerOpen(false)}
                aria-label="Cerrar carrito">
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="drawer-body">
              {orderCompleted ? (
                <div className="order-success" role="status" aria-live="polite">
                  <div className="order-success-icon">
                    <Shield size={36} color={C.greenMid} aria-hidden="true" />
                  </div>
                  <h3>¡Pedido registrado! 🐾</h3>
                  <p>
                    Tu solicitud fue recibida correctamente. Un agente de SOIN se comunicará contigo
                    muy pronto para ultimar los detalles del envío y el pago.
                  </p>
                  <button
                    className="order-catalog-btn tap"
                    onClick={() => {
                      setOrderCompleted(false);
                      setDrawerOpen(false);
                      goTo("catalogo");
                    }}
                    aria-label="Ir al catálogo para generar otro pedido"
                  >
                    <ShoppingCart size={16} aria-hidden="true" />
                    Ver catálogo y hacer otro pedido
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="empty-state" role="status">
                  <ShoppingCart size={52} color={C.greenPale} aria-hidden="true" />
                  <p className="empty-txt">El carrito está vacío</p>
                </div>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.cartId || item.id} className="cart-item">
                      <img
                        className="ci-img"
                        src={item.img || FALLBACK_IMG}
                        alt={item.name}
                        loading="lazy"
                        onError={(event) => { event.currentTarget.src = FALLBACK_IMG; }}
                      />
                      <div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
                          <div>
                            <p className="ci-name">{item.name}</p>
                            {item.presentation && <p className="variant-note">{item.presentation}</p>}
                          </div>
                          <button className="del-btn tap" onClick={() => removeItem(item.cartId || item.id)}
                            aria-label={`Eliminar ${item.name} del carrito`}>
                            <Trash2 size={14} aria-hidden="true" />
                          </button>
                        </div>
                        <div className="ci-controls">
                          <div className="qty-row">
                            <button className="qty-btn tap" onClick={() => updateQty(item.cartId || item.id,-1)}
                              aria-label={`Quitar una unidad de ${item.name}`}>
                              <Minus size={12} aria-hidden="true" />
                            </button>
                            <span className="qty-val" aria-label={`${item.qty} unidades`}>{item.qty}</span>
                            <button className="qty-btn tap" onClick={() => updateQty(item.cartId || item.id,1)}
                              aria-label={`Agregar una unidad de ${item.name}`}>
                              <Plus size={12} aria-hidden="true" />
                            </button>
                          </div>
                          <span className="ci-price">{fmt((item.salePrice ?? item.price) * item.qty)}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="ship-section">
                    <p className="ship-label">
                      <Truck size={16} color={C.greenMid} aria-hidden="true" /> Zona de envío
                    </p>
                    {Object.entries(SHIPPING).map(([zone, cost]) => (
                      <button key={zone}
                        type="button"
                        className={`ship-opt tap ${shippingZone===zone?"chosen":""}`}
                        onClick={() => setShipping(zone)}
                        aria-pressed={shippingZone===zone}>
                        <span>{zone}</span>
                        <span className="ship-price">
                          {cost===null ? "Por confirmar" : fmt(cost)}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="checkout-form">
                    <p className="ship-label">Datos de entrega</p>
                    <div className="checkout-form-grid">
                      <label className="checkout-field">
                        <span className="checkout-label">Nombre completo</span>
                        <input
                          className="checkout-input"
                          type="text"
                          value={customer.fullName}
                          onChange={(event) => updateCustomer("fullName", event.target.value)}
                          placeholder="Ej. Ana María Pérez"
                          autoComplete="name"
                        />
                      </label>

                      <label className="checkout-field">
                        <span className="checkout-label">Celular</span>
                        <input
                          className="checkout-input"
                          type="tel"
                          value={customer.phone}
                          onChange={(event) => updateCustomer("phone", event.target.value)}
                          placeholder="Ej. 300 123 4567"
                          autoComplete="tel"
                        />
                      </label>

                      <label className="checkout-field">
                        <span className="checkout-label">Dirección de entrega</span>
                        <input
                          className="checkout-input"
                          type="text"
                          value={customer.address}
                          onChange={(event) => updateCustomer("address", event.target.value)}
                          placeholder="Dirección, barrio y referencias"
                          autoComplete="street-address"
                        />
                      </label>

                      <label className="checkout-field">
                        <span className="checkout-label">Tipo de pago</span>
                        <select
                          className="checkout-input"
                          value={customer.paymentMethod}
                          onChange={(event) => updateCustomer("paymentMethod", event.target.value)}
                        >
                          <option value="">Selecciona una opción</option>
                          {PAYMENT_METHODS.map((method) => (
                            <option key={method} value={method}>{method}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <p className="checkout-help">Estos datos se guardaran junto con tu pedido.</p>
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="drawer-foot">
                <div className="totals">
                  <div className="total-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                  <div className="total-row">
                    <span>Envío</span>
                    <span>
                      {!shippingZone
                        ? <em style={{color:C.gold}}>Elige zona</em>
                        : SHIPPING[shippingZone]===null
                          ? "Sujeto a verificación"
                          : fmt(shipCost)}
                    </span>
                  </div>
                  <div className="total-grand">
                    <span className="total-grand-label">Total</span>
                    <span className="total-grand-value">
                      {shippingNeedsQuote ? `${fmt(subtotal)} + envío` : fmt(grandTotal)}
                    </span>
                  </div>
                </div>
                <button
                  className={`checkout-btn tap ${shippingZone && !orderSaving?"ready":"blocked"}`}
                  onClick={shippingZone && !orderSaving ? handleCheckout : undefined}
                  disabled={!shippingZone || orderSaving}
                  aria-label={shippingZone
                    ? "Finalizar pedido"
                    : "Selecciona una zona de envío para continuar"}>
                  <MessageCircle size={18} aria-hidden="true" />
                  {orderSaving
                    ? "Registrando pedido..."
                    : shippingZone
                      ? "Finalizar Pedido"
                      : "Elige zona de envío"}
                </button>
              </div>
            )}
          </aside>
        </>
      )}


      {/* WhatsApp flotante */}
      <a className="wa-btn tap" href="https://wa.me/573125071461"
        target="_blank" rel="noreferrer" aria-label="Contactar a SOIN por WhatsApp">
        <MessageCircle size={28} aria-hidden="true" />
      </a>

      {/* Toasts */}
      <div className="toast-wrap" role="status" aria-live="polite" aria-atomic="false">
        {toasts.map(t => <div key={t.id} className="toast">{t.msg}</div>)}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   FEATURED SCROLL — carrusel con 3 círculos indicadores
   Los dots muestran cuántas "páginas" hay (máx visible = 3)
   y se activan con IntersectionObserver conforme el usuario
   hace scroll, sin necesidad de estado manual.
════════════════════════════════════════════════════════ */
function FeaturedScroll({ products, onAdd }) {
  const scrollRef  = useRef(null);
  const [activeDot, setActiveDot] = useState(0);

  // Número de dots: mínimo 1, máximo 3, o igual al número de productos si < 3
  const dotCount = Math.min(3, products.length);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || products.length <= 1) return;

    // Observamos cada card directamente
    const cards = Array.from(container.querySelectorAll(".pcard"));
    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth + 16; // 16 = gap
    const containerWidth = container.offsetWidth;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const maxScroll  = container.scrollWidth - containerWidth;
      // Progreso 0-1
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      // Mapear a índice de dot (0 a dotCount-1)
      setActiveDot(Math.round(progress * (dotCount - 1)));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [products.length, dotCount]);

  const scrollTo = (dotIndex) => {
    const container = scrollRef.current;
    if (!container) return;
    const maxScroll = container.scrollWidth - container.offsetWidth;
    const targetScroll = dotCount > 1
      ? (dotIndex / (dotCount - 1)) * maxScroll
      : 0;
    container.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  return (
    <div className="featured-scroll-wrap">
      <div className="featured-scroll" ref={scrollRef} role="list" aria-label="Productos destacados">
        {products.map((p, i) => (
          <ProductCard key={p.id} p={p} onAdd={onAdd} delay={i * 60} />
        ))}
      </div>
      {dotCount > 1 && (
        <div className="featured-dots" aria-label="Indicador de posición" role="tablist">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              className={`featured-dot-btn${activeDot === i ? " active" : ""}`}
              onClick={() => scrollTo(i)}
              aria-label={`Ir a la sección ${i + 1}`}
              role="tab"
              aria-selected={activeDot === i}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PRODUCT CARD
════════════════════════════════════════════════════════ */
function ProductCard({ p, onAdd, delay = 0 }) {
  const variants = getProductVariants(p);
  const [variantIndex, setVariantIndex] = useState(0);
  const selectedVariant = variants[variantIndex] || variants[0];
  const displayPrice = selectedVariant.salePrice ?? selectedVariant.price;
  const hasDiscount  = selectedVariant.salePrice != null && selectedVariant.salePrice < selectedVariant.price;
  const productImages = Array.from(new Set([
    ...(selectedVariant.images || []),
    selectedVariant.img,
    ...(p.images || []),
    p.img,
  ].filter(Boolean))).slice(0, 3);
  const imageList = productImages.length ? productImages : [FALLBACK_IMG];
  const productImage = imageList[0];

  const handleAdd = () => {
    onAdd({
      ...p,
      cartId: selectedVariant.id,
      presentation: selectedVariant.presentation,
      price: selectedVariant.price,
      salePrice: selectedVariant.salePrice,
      img: productImage,
      variants: undefined,
      images: undefined,
    });
  };

  return (
    <article className="pcard" role="listitem"
      style={{animationDelay:`${delay}ms`, animation:"fadeUp .45s ease both"}}>

      <div className="pcard-img-wrap">
        <div
          className="pcard-img-scroll"
          key={selectedVariant.id}
          aria-label={`Imágenes de ${p.name}`}
        >
          {imageList.map((src, index) => (
            <img
              key={`${src}-${index}`}
              className="pcard-img"
              src={src}
              alt={index === 0 ? p.name : `${p.name} imagen ${index + 1}`}
              loading="lazy"
              width="400"
              height="190"
              onError={(event) => { event.currentTarget.src = FALLBACK_IMG; }}
            />
          ))}
        </div>
        {imageList.length > 1 && (
          <div className="pcard-dots" aria-hidden="true">
            {imageList.map((src, index) => (
              <span className="pcard-dot" key={`${src}-dot-${index}`} />
            ))}
          </div>
        )}
        {p.tag1 && (
          <span className={`pcard-badge ${p.tag1==="Más vendido"?"gold-b":""}`}>
            {p.tag1}
          </span>
        )}
      </div>

      <div className="pcard-body">
        <div>
          <p className="pcard-cat">{p.category} · {p.subcategory}</p>
          <h3 className="pcard-name">{p.name}</h3>
          <p className="pcard-desc">{p.description}</p>
        </div>
        {variants.length > 1 ? (
          <select
            className="variant-select"
            value={variantIndex}
            onChange={(event) => setVariantIndex(Number(event.target.value))}
            aria-label={`Elegir presentación de ${p.name}`}
          >
            {variants.map((variant, index) => (
              <option key={variant.id} value={index}>
                {variant.presentation} · {fmt(variant.salePrice ?? variant.price)}
              </option>
            ))}
          </select>
        ) : selectedVariant.presentation !== "Única" ? (
          <p className="variant-note">{selectedVariant.presentation}</p>
        ) : null}
        <div className="pcard-footer">
          <div className="pcard-prices">
            <p className={`pcard-price${hasDiscount?" sale":""}`}
              aria-label={`Precio: ${fmt(displayPrice)}`}>
              {fmt(displayPrice)}
            </p>
            {hasDiscount && (
              <span className="pcard-price-orig"
                aria-label={`Precio original: ${fmt(selectedVariant.price)}`}>
                {fmt(selectedVariant.price)}
              </span>
            )}
          </div>
          <button className="add-btn tap" onClick={handleAdd}
            aria-label={`Agregar ${p.name} ${selectedVariant.presentation} al carrito`}>
            <Plus size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ════════════════════════════════════════════════════════
   GOOGLE SHEETS CONNECTOR  —  stale-while-revalidate
   ────────────────────────────────────────────────────────
   1. Al montar: sirve caché de localStorage inmediatamente
      (sin spinner si hay datos guardados).
   2. En background: consulta Sheets. Si hay datos nuevos,
      actualiza estado y reescribe caché.
   3. Si Sheets falla y no hay caché → usa PRODUCTS local.
════════════════════════════════════════════════════════ */
export function useSheetsCatalog(config = {}) {
  // Inicializa con la caché si existe, para evitar flash de contenido
  const [products, setProducts] = useState(() => {
    if (!config.scriptUrl) return [];
    const cached = readCache();
    return cached ? cached.products : [];
  });
  const [loading,  setLoading]  = useState(() => {
    if (!config.scriptUrl) return false;
    const cached = readCache();
    // Solo mostramos spinner si no hay caché para mostrar
    return !cached || cached.stale;
  });
  const [error,    setError]    = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [fromCache, setFromCache] = useState(() => {
    const cached = readCache();
    return Boolean(cached && !cached.stale);
  });

  useEffect(() => {
    if (!config.scriptUrl) { setLoading(false); return; }

    const controller = new AbortController();

    const doFetch = () => {
      const url = new URL(config.scriptUrl);
      if (config.catalogPage) url.searchParams.set("page", config.catalogPage);

      fetch(url.toString(), { signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw new Error(`Catalog API ${r.status}`);
          const ct = r.headers.get("content-type") || "";
          if (!ct.includes("application/json"))
            throw new Error("El Apps Script debe responder JSON");
          return r.json();
        })
        .then((data) => {
          const rows = payloadToRows(data);
          const nextProducts = rowsToProducts(rows);
          if (!rows.length) throw new Error("El catálogo no devolvió filas");
          if (!nextProducts.length) throw new Error("No hay productos activos");

          const validVariantCount = nextProducts.reduce(
            (t, p) => t + getProductVariants(p).length, 0
          );
          const invalidRows = Math.max(0, rows.length - validVariantCount);
          setWarnings(invalidRows > 0 ? [`${invalidRows} filas incompletas`] : []);
          setProducts(nextProducts);
          writeCache(nextProducts);
          setFromCache(false);
        })
        .catch((e) => {
          if (e.name === "AbortError") return;
          // Si hay datos de caché (aunque stale), los mantenemos y solo anotamos el error
          setError(e.message);
          // Si no hay nada en estado aún, quedamos con array vacío (App usará PRODUCTS)
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    };

    // Si la caché existe pero está stale, buscar en background sin bloquear UI
    const cached = readCache();
    if (cached && !cached.stale) {
      // Caché fresca: igual revalidamos en background pero sin mostrar loading
      setLoading(false);
      setTimeout(doFetch, 0);
    } else {
      doFetch();
    }

    return () => controller.abort();
  }, [config.scriptUrl, config.catalogPage]);

  return { products, loading, error, warnings, fromCache };
}
