export default function Hero() {
  return (
    <div style={{ position: "relative", height: "320px" }}>
      <img
        src="/soin-banner.png"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      />

      <div style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        padding: "20px",
        background: "linear-gradient(90deg, rgba(0,0,0,0.5), transparent)"
      }}>
        <div style={{ maxWidth: "280px", color: "#fff" }}>
          <h1>Todo lo que tu mascota necesita</h1>
          <button>Comprar ahora</button>
        </div>
      </div>
    </div>
  );
}
