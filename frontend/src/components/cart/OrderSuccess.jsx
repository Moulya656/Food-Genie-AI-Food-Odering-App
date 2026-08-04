import { Link, useParams } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();
  return (
    <div className="container" style={{ padding: "70px 0", textAlign: "center" }}>
      <div style={{ fontSize: "3rem" }}>🎉</div>
      <h2>Order placed!</h2>
      <p style={{ color: "var(--ink-500)", margin: "10px 0 24px" }}>
        Order <strong>#{id?.slice(-6)}</strong> is confirmed. Your home cook has started prepping.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Link to={`/orders/${id}`} className="btn btn-primary">Track order</Link>
        <Link to="/" className="btn btn-outline">Back to kitchens</Link>
      </div>
    </div>
  );
}
