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
