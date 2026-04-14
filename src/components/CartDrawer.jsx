export default function CartDrawer(props) {
  const {
    cart, drawerOpen, setDrawerOpen,
    updateQty, removeItem,
    subtotal, shipCost, grandTotal,
    shippingZone, setShippingZone,
    handleCheckout, SHIPPING, C
  } = props;

  if (!drawerOpen) return null;

  return (
    <>
      <div className="overlay" onClick={() => setDrawerOpen(false)} />
      <aside className="drawer">
        {/* PEGA TU CÓDIGO TAL CUAL AQUÍ */}
      </aside>
    </>
  );
}

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
      font-family: var(--f-display);
      font-size: var(--t-drawer);
      font-weight: var(--w-regular);
      color:${C.greenDark};
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
    .empty-txt {
      font-family: var(--f-body);
      font-size: var(--t-body);
      font-weight: var(--w-light);
      color:${C.textMuted};
    }

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
    .ci-name {
      font-family: var(--f-display);
      font-size: 15px;
      font-weight: var(--w-regular);
      color:${C.greenDark}; margin-bottom:8px;
      line-height: 1.3;
    }
    .ci-controls { display:flex; align-items:center; justify-content:space-between; }
    .qty-row { display:flex; align-items:center; gap:10px; }
    .qty-btn {
      width:28px; height:28px; border-radius:50%;
      border:1.5px solid ${C.border}; background:#fff;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; color:${C.greenDark}; transition: all .2s;
    }
    .qty-btn:hover { background:${C.greenDark}; color:#fff; border-color:${C.greenDark}; }
    .qty-val {
      font-family: var(--f-display);
      font-size: 16px;
      font-weight: var(--w-semi);
      min-width:18px; text-align:center; color:${C.greenDark};
    }
    .del-btn { background:none; border:none; cursor:pointer; color:#ccc; transition:color .2s; padding:4px; }
    .del-btn:hover { color:#e74c3c; }
    .ci-price {
      font-family: var(--f-display);
      font-size: var(--t-price-sm);
      font-weight: var(--w-semi);
      color:${C.greenDark};
