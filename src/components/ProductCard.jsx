import { formatCOP } from "../utils/format";

export default function ProductCard({ product, add }) {
  return (
    <div style={{ background: "#fff", padding: 10 }}>
      <img src={product.img} width="100%" loading="lazy" />
      <h3>{product.name}</h3>
      <p>{formatCOP(product.price)}</p>

      <button
        onClick={() => add(product)}
        aria-label={`Agregar ${product.name}`}
      >
        Agregar
      </button>
    </div>
  );
}
