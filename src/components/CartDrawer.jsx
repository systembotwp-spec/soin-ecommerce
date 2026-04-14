import { X, Plus, Minus, Trash2 } from "lucide-react";
import { formatCOP } from "../utils/format";

export default function CartDrawer({
  cart,
  close,
  updateQty,
  remove,
  total,
  checkout
}) {
  return (
    <div style={{
      position: "fixed",
      right: 0,
      top: 0,
      width: 320,
      height: "100%",
      background: "#fff",
      padding: 20,
      zIndex: 200
    }}>
      <button onClick={close} aria-label="Cerrar carrito">
        <X />
      </button>

      {cart.map(i => (
        <div key={i.id}>
          <p>{i.name}</p>

          <button onClick={() => updateQty(i.id, -1)}><Minus/></button>
          {i.qty}
          <button onClick={() => updateQty(i.id, 1)}><Plus/></button>

          <button onClick={() => remove(i.id)}>
            <Trash2/>
          </button>

          <p>{formatCOP(i.price * i.qty)}</p>
        </div>
      ))}

      <h3>Total: {formatCOP(total)}</h3>

      <button onClick={checkout}>
        Finalizar por WhatsApp
      </button>
    </div>
  );
}
