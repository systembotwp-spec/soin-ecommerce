import { useState, useEffect, useMemo } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";
import Footer from "./components/Footer";

const PRODUCTS = [
  { id:1,name:"Alimento Premium",price:85000,img:"https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500" },
  { id:2,name:"Snacks Gato",price:20000,img:"https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500" }
];

export default function App(){

  const [cart,setCart]=useState(()=>{
    const saved=localStorage.getItem("cart");
    return saved?JSON.parse(saved):[];
  });

  const [toast,setToast]=useState("");
  const [open,setOpen]=useState(false);

  useEffect(()=>{
    localStorage.setItem("cart",JSON.stringify(cart));
  },[cart]);

  const add=(p)=>{
    setCart(c=>{
      const ex=c.find(i=>i.id===p.id);
      return ex?c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...c,{...p,qty:1}]
    });
    setToast("Producto agregado 🐾");
    setTimeout(()=>setToast(""),2000);
  };

  const updateQty=(id,d)=>{
    setCart(c=>c.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty+d)}:i));
  };

  const remove=(id)=>{
    setCart(c=>c.filter(i=>i.id!==id));
  };

  const totalItems=cart.reduce((s,i)=>s+i.qty,0);
  const total=cart.reduce((s,i)=>s+i.price*i.qty,0);

  const checkout=()=>{
    const msg=encodeURIComponent(
      cart.map(i=>`${i.name} x${i.qty}`).join("\n")
    );
    window.open(`https://wa.me/?text=${msg}`);
  };

  return (
    <div>

      <Navbar totalItems={totalItems} openCart={()=>setOpen(true)}/>
      <Hero/>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,padding:20}}>
        {PRODUCTS.map(p=>(
          <ProductCard key={p.id} product={p} add={add}/>
        ))}
      </div>

      {open && (
        <CartDrawer
          cart={cart}
          close={()=>setOpen(false)}
          updateQty={updateQty}
          remove={remove}
          total={total}
          checkout={checkout}
        />
      )}

      <Toast message={toast}/>
      <Footer/>

    </div>
  );
}
