import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMyOrders } from "../../redux/slices/orderSlice";
import Loader from "../layout/Loader";

const statusColor = {
  placed: "#e8a33d", preparing: "#157b7e", out_for_delivery: "#0f5257",
  delivered: "#1e7a34", cancelled: "#c1502e",
};

export default function OrderHistory() {
  const dispatch = useDispatch();
  const { mine, loading } = useSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="container" style={{ padding: "36px 0", maxWidth: 700 }}>
      <h2 style={{ marginBottom: 20 }}>My orders</h2>
      {mine.length === 0 && <p>No orders yet — your tiffin history will show up here.</p>}
      {mine.map((order) => (
        <Link to={`/orders/${order._id}`} key={order._id} className="card" style={{ display: "flex", justifyContent: "space-between", padding: 18, marginBottom: 12 }}>
          <div>
            <strong>{order.cook?.kitchenName}</strong>
            <p style={{ fontSize: "0.85rem", color: "var(--ink-500)" }}>
              {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div>₹{order.total}</div>
            <span style={{ fontSize: "0.75rem", color: statusColor[order.orderStatus], fontWeight: 700, textTransform: "capitalize" }}>
              {order.orderStatus.replace(/_/g, " ")}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
