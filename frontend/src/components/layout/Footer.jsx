export default function Footer() {
  return (
    <footer style={{ background: "var(--teal-950)", color: "var(--cream-100)", marginTop: 60, padding: "28px 0" }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span>🍱 TiffinHub — home cooks, delivered fresh.</span>
        <span style={{ opacity: 0.7, fontSize: "0.85rem" }}>.</span>
      </div>
    </footer>
  );
}
