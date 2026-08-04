import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrderDetails } from "../../redux/slices/orderSlice";
import Loader from "../layout/Loader";

const STEPS = ["placed", "preparing", "out_for_delivery", "delivered"];

export default function OrderDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected: order, loading } = useSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchOrderDetails(id)); }, [dispatch, id]);

  if (loading || !order) return <Loader />;

  const stepIndex = STEPS.indexOf(order.orderStatus);

  return (
    <div className="container" style={{ padding: "36px 0", maxWidth: 620 }}>
      <h2>Order #{order._id.slice(-6)}</h2>
      <p style={{ color: "var(--ink-500)", marginBottom: 20 }}>{order.cook?.kitchenName}</p>

      {order.orderStatus !== "cancelled" ? (
        <div style={{ display: "flex", marginBottom: 30 }}>
          {STEPS.map((step, i) => (
            <div key={step} style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                width: 14, height: 14, borderRadius: "50%", margin: "0 auto 6px",
                background: i <= stepIndex ? "var(--turmeric-500)" : "#e2dccd",
              }} />
              <span style={{ fontSize: "0.7rem", textTransform: "capitalize" }}>{step.replace(/_/g, " ")}</span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: "var(--terracotta-500)", fontWeight: 600, marginBottom: 20 }}>This order was cancelled.</p>
      )}

      <div className="card" style={{ padding: 20 }}>
        {order.items.map((item, idx) => (
          <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
            <span>{item.name} × {item.qty}</span>
            <span>₹{item.price * item.qty}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #eee", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
          <span>Total</span><span>₹{order.total}</span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--ink-500)", marginTop: 12 }}>
          Delivering to: {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
        </p>
        <p style={{ fontSize: "0.85rem", color: "var(--ink-500)" }}>
          Payment: {order.paymentMethod} · {order.paymentStatus}
        </p>
      </div>
    </div>
  );
}
