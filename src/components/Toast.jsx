export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      left: "50%",
      transform: "translateX(-50%)",
      background: "#2D4A35",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "20px",
      zIndex: 999
    }}>
      {message}
    </div>
  );
}
