import { ShoppingCart, X } from "lucide-react";
        </div>
      </div>

      {/* 🛒 CARRITO */}
      {openCart && (
        <div style={{ position: "fixed", top: 0, right: 0, width: "350px", height: "100%", background: "white", boxShadow: "-5px 0 15px rgba(0,0,0,0.1)", padding: "20px", display: "flex", flexDirection: "column" }}>
          
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <h3>Tu carrito</h3>
            <X onClick={() => setOpenCart(false)} style={{ cursor: "pointer" }}/>
          </div>

          {/* LISTA SCROLL */}
          <div style={{ flex: 1, overflowY: "auto", paddingRight: "5px" }}>
            {cart.length === 0 ? (
              <p>Tu carrito está vacío</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
                  <p>{item.name}</p>
                  <p>Cantidad: {item.quantity}</p>
                  <p>${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>

          {/* Footer fijo */}
          <div>
            <h4>Total: ${total.toLocaleString()}</h4>

            <button style={{
              width: "100%",
              marginTop: "10px",
              background: "#4f7c62",
              color: "white",
              padding: "12px",
              borderRadius: "10px",
              border: "none"
            }}>
              Finalizar compra
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
