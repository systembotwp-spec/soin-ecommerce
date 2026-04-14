import { useState, useMemo } from "react";
import {
  ShoppingCart, X, Plus, Minus, Search,
  MessageCircle, Trash2, Truck, ChevronRight,
  Leaf, Heart, Shield, Zap
} from "lucide-react";

/* ─── DESIGN TOKENS ───────────────────────────────────── */
const C = {
  greenDark:"#2D4A35",
  greenMid:"#4A7A5A",
  greenLight:"#7AAB84",
  greenPale:"#C8DECA",
  greenMist:"#EAF2EB",
  warmWhite:"#FAFAF6",
  gold:"#C9A84C",
  goldLight:"#E2C97E",
  text:"#2E2E24",
  textMuted:"#7A7A6A",
  whatsapp:"#25D366",
  border:"rgba(74,122,90,0.18)",
};

/* ─── STYLES ─────────────────────────────────────────── */
const injectStyles = () => (
<style>{`
*{box-sizing:border-box;margin:0;padding:0}
body{background:${C.warmWhite};font-family:sans-serif}

/* NAV */
.nav{
position:sticky;top:0;z-index:200;
background:rgba(250,250,246,.96);
padding:0 5%;
display:flex;justify-content:space-between;align-items:center;
height:64px;
border-bottom:1px solid ${C.border};
}
.nav-logo{height:36px}
.nav-links{display:flex;gap:20px;align-items:center}
.nav-link{background:none;border:none;cursor:pointer;color:${C.textMuted}}
.cart-trigger{
background:${C.greenDark};
color:#fff;
border:none;
border-radius:30px;
padding:8px 16px;
cursor:pointer;
display:flex;gap:6px;align-items:center;
}

/* HERO */
.hero{
position:relative;
width:100%;
height:420px;
overflow:hidden;
}
.hero-img{
width:100%;
height:100%;
object-fit:cover;
}

/* overlay */
.hero-overlay{
position:absolute;
top:0;left:0;
width:100%;height:100%;
display:flex;
align-items:center;
justify-content:flex-start;
padding:0 6%;
background:linear-gradient(
90deg,
rgba(45,74,53,.65) 0%,
rgba(45,74,53,.3) 40%,
transparent 70%
);
}

.hero-text{
max-width:500px;
color:#fff;
}

.hero-title{
font-size:48px;
line-height:1.1;
margin-bottom:12px;
}
.hero-title em{color:${C.gold}}

.hero-sub{
opacity:.8;
margin-bottom:20px;
}

.hero-cta{
background:${C.gold};
border:none;
padding:12px 24px;
border-radius:40px;
cursor:pointer;
}

/* TRUST */
.trust{
background:${C.greenDark};
color:#fff;
display:flex;
justify-content:center;
}
.trust-item{padding:20px}

/* MOBILE FIX REAL */
@media(max-width:640px){

.hero{
height:320px; /* 🔥 clave */
}

.hero-overlay {
  position: absolute;
  inset: 0;

  display: flex;
  justify-content: flex-start; /* 🔥 CAMBIO AQUÍ */
  align-items: center;

  padding: 0 16px;

  background: linear-gradient(
    270deg, /* 👈 invertimos dirección */
    rgba(45,74,53,0.7) 0%,
    rgba(45,74,53,0.4) 40%,
    transparent 75%
  );
}

.hero-text{
max-width:180px;
text-align:left;
}

.hero-title{
font-size:22px;
line-height:1.2;
}

.hero-sub{
font-size:12px;
}

.hero-cta{
font-size:11px;
padding:10px 16px;
}

.nav-link{display:none}
}

/* PRODUCTS */
.products-grid{
display:grid;
grid-template-columns:repeat(auto-fill,minmax(200px,1fr));
gap:20px;
padding:40px;
}

.pcard{
background:#fff;
border-radius:12px;
overflow:hidden;
border:1px solid ${C.border};
}
.pcard img{width:100%;height:150px;object-fit:cover}
.pcard-body{padding:12px}

`}</style>
);

/* ─── DATA ───────────────── */
const PRODUCTS=[
{id:1,name:"Alimento Premium",price:85000,img:"https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500"},
{id:2,name:"Collar Natural",price:25000,img:"https://images.unsplash.com/photo-1601758064224-16b7d9e9a4e4?w=500"},
];

/* ─── APP ───────────────── */
export default function App(){
const[cart,setCart]=useState([]);
const[open,setOpen]=useState(false);

const add=(p)=>{
setCart(c=>{
const ex=c.find(i=>i.id===p.id);
return ex?c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...c,{...p,qty:1}]
})
};

return(
<div>
{injectStyles()}

/* NAV */
<nav className="nav">
<img src="/Logo.png" className="nav-logo"/>
<div className="nav-links">
<button className="nav-link">Inicio</button>
<button className="nav-link">Tienda</button>
<button className="cart-trigger" onClick={()=>setOpen(true)}>
<ShoppingCart size={16}/> Carrito
</button>
</div>
</nav>

/* HERO */
<div className="hero">
<img src="/soin-banner.png" className="hero-img"/>

<div className="hero-overlay">
<div className="hero-text">
<h1 className="hero-title">
Todo lo que tu mascota <em>necesita</em>
</h1>
<p className="hero-sub">
Alimentos, accesorios y bienestar
</p>
<button className="hero-cta">Comprar</button>
</div>
</div>
</div>

/* PRODUCTS */
<div className="products-grid">
{PRODUCTS.map(p=>(
<div key={p.id} className="pcard">
<img src={p.img}/>
<div className="pcard-body">
<h4>{p.name}</h4>
<p>${p.price.toLocaleString()}</p>
<button onClick={()=>add(p)}>Agregar</button>
</div>
</div>
))}
</div>

</div>
)
}
