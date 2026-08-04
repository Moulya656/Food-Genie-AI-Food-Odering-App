import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { incrementItem, decrementItem, removeItem, applyCoupon, clearCoupon } from "../../redux/slices/cartSlice";
import api from "../../utils/api";
import Message from "../layout/Message";

export default function Cart() {
  const cart = useSelector((s) => s.cart);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [applying, setApplying] = useState(false);

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = cart.coupon?.discount || 0;
  const deliveryFee = cart.items.length ? 25 : 0;
  const total = Math.max(0, subtotal - discount) + deliveryFee;

  const handleApplyCoupon = async () => {
    setCouponError("");
    setApplying(true);
    try {
      const { data } = await api.post("/coupons/validate", { code, orderValue: subtotal });
      dispatch(applyCoupon({ code: data.coupon.code, discount: data.discount }));
    } catch (err) {
      setCouponError(err.response?.data?.message || "Could not apply coupon");
    } finally {
      setApplying(false);
    }
  };

  const goToCheckout = () => {
    if (!isAuthenticated) return navigate("/login?redirect=/checkout");
    navigate("/checkout");
  };

  if (cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
        <h2>Your cart is empty</h2>
        <p style={{ color: "var(--ink-500)", margin: "12px 0 20px" }}>Browse kitchens and add a few dishes to get started.</p>
        <Link to="/" className="btn btn-primary">Browse Kitchens</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "36px 0", maxWidth: 640 }}>
      <h2 style={{ marginBottom: 20 }}>Your cart · {cart.cookName}</h2>

      {cart.items.map((item) => (
        <div key={item._id} className="card" style={{ padding: 16, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>{item.name}</strong>
            <p style={{ fontSize: "0.85rem", color: "var(--ink-500)" }}>₹{item.price} each</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn btn-outline" onClick={() => dispatch(decrementItem(item._id))}>-</button>
            <span>{item.qty}</span>
            <button className="btn btn-outline" onClick={() => dispatch(incrementItem(item._id))}>+</button>
            <button onClick={() => dispatch(removeItem(item._id))} style={{ background: "none", border: "none", color: "var(--terracotta-500)" }}>
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="card" style={{ padding: 20, marginTop: 20 }}>
        {!cart.coupon ? (
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <input placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value)} />
            <button className="btn btn-outline" onClick={handleApplyCoupon} disabled={applying || !code}>
              {applying ? "Checking..." : "Apply"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span>Coupon "{cart.coupon.code}" applied</span>
            <button onClick={() => dispatch(clearCoupon())} style={{ background: "none", border: "none", color: "var(--terracotta-500)" }}>
              Remove
            </button>
          </div>
        )}
        <Message>{couponError}</Message>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span>Subtotal</span><span>₹{subtotal}</span></div>
        {discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#1e7a34" }}><span>Discount</span><span>-₹{discount}</span></div>}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span>Delivery fee</span><span>₹{deliveryFee}</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginTop: 10, fontSize: "1.1rem" }}>
          <span>Total</span><span>₹{total.toFixed(0)}</span>
        </div>

        <button className="btn btn-primary" style={{ width: "100%", marginTop: 20 }} onClick={goToCheckout}>
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
