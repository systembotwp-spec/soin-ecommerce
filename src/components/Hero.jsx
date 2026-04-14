import { ChevronRight } from "lucide-react";

export default function Hero({ goTo }) {
  return (
    <>
      <div className="hero">
        <img className="hero-img" src="/soin-banner.png" />

        <div className="hero-overlay">
          <div className="hero-text">
            <div className="hero-eyebrow">🌿 Colección 2025</div>

            <h1 className="hero-title">
              Todo lo que tu<br />mascota <em>necesita,</em><br />en un solo lugar.
            </h1>

            <p className="hero-sub">
              Alimentos · Accesorios · Salud · Higiene · Y mucho amor
            </p>

            <button className="hero-cta tap" onClick={() => goTo("catalogo")}>
              ¡Compra para los que amas! <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile text */}
      <div className="hero-text-mobile">
        <div className="hero-eyebrow">🌿 Colección 2025</div>

        <h1 className="hero-title" style={{ fontSize: 26 }}>
          Todo lo que tu mascota <em>necesita</em>
        </h1>

        <button className="hero-cta tap" onClick={() => goTo("catalogo")}>
          Comprar
        </button>
      </div>
    </>
  );
}
