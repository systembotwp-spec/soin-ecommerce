import { ShoppingCart, X } from "lucide-react";
import { useState } from "react";

export default function App() {

  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);

  const [category, setCategory] = useState("Todos");
  const [petType, setPetType] = useState("Todos");

  const products = [
    { id: 1, name: "Alimento Premium Perro", price: 85000, category: "Alimentos", pet: "Perro" },
    { id: 2, name: "Snacks Gato", price: 20000, category: "Snacks", pet: "Gato" },
    { id: 3, name: "Collar Perro", price: 25000, category: "Accesorios", pet: "Perro" },
    { id: 4, name: "Arena Gato", price: 45000, category: "Limpieza", pet: "Gato" },
  ];

  const filteredProducts = products.filter(p => {
    return (
      (category === "Todos" || p.category === category) &&
      (petType === "Todos" || p.pet === petType)
    );
  });

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ fontFamily: "Arial", background: "#f7f5f2", minHeight: "100vh" }}>

      {/* NAVBAR */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px"
      }}>
        <h1 style={{ color: "#2f4f3e" }}>SOIN</h1>

        <button onClick={() => setOpenCart(true)} style={{
          background: "#4f7c62",
          color: "white",
          padding: "10px",
          borderRadius: "10px",
          border: "none"
        }}>
          <ShoppingCart size={18}/> ({totalItems})
        </button>
      </div>

      {/* BANNER LIMPIO */}
      <div style={{
        width: "100%",
        height: "300px",
        overflow: "hidden"
      }}>
        <img 
          src="/soin-banner.png"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      </div>

      {/* FILTROS */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px 40px"
      }}>

        {/* Categorías */}
        <div>
          <strong>Categoría:</strong>
          {["Todos","Alimentos","Snacks","Accesorios","Limpieza"].map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                margin: "0 5px",
                padding: "8px 12px",
                borderRadius: "10px",
                border: "none",
                background: category === cat ? "#4f7c62" : "#ddd",
                color: category === cat ? "white" : "#333"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tipo mascota */}
        <div>
          <strong>Mascota:</strong>
          {["Todos","Perro","Gato"].map(pet => (
            <button
              key={pet}
              onClick={() => setPetType(pet)}
              style={{
                margin: "0 5px",
                padding: "8px 12px",
                borderRadius: "10px",
                border: "none",
                background: petType === pet ? "#4f7c62" : "#ddd",
                color: petType === pet ? "white" : "#333"
              }}
            >
              {pet}
            </button>
          ))}
        </div>

      </div>

      {/* PRODUCTOS */}
      <div style={{
        padding: "40px",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px"
      }}>
        {filteredProducts.map(p => (
          <div key={p.id} style={{
            background: "white",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
          }}>
            <div style={{
              height: "150px",
              background: "#eee",
              borderRadius: "10px",
              marginBottom: "10px"
            }}></div>

            <h4>{p.name}</h4>
            <p>${p.price.toLocaleString()}</p>

            <button onClick={() => addToCart(p)} style={{
              width: "100%",
              background: "#4f7c62",
              color: "white",
              padding: "10px",
              borderRadius: "10px",
              border: "none"
            }}>
              Agregar
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
