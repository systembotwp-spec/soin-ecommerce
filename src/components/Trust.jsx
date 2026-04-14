export default function Trust({ TRUST, C }) {
  return (
    <div className="trust">
      {TRUST.map(({ icon: Icon, title, sub }) => (
        <div key={title} className="trust-item">
          <div className="trust-icon-wrap">
            <Icon size={18} color={C.greenPale} />
          </div>
          <div>
            <div className="trust-title">{title}</div>
            <div className="trust-sub">{sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
