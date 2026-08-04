import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { placeOrder } from "../../redux/slices/orderSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import Message from "../layout/Message";
import api from "../../utils/api";

export default function Checkout() {
  const cart = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const { loading, error } = useSelector((s) => s.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zip: user?.address?.zip || "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [payError, setPayError] = useState("");
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = cart.coupon?.discount || 0;
  const deliveryFee = 25;
  const total = Math.max(0, subtotal - discount) + deliveryFee;

  const buildOrderPayload = (paymentRef = null) => ({
    cook: cart.cookId,
    items: cart.items.map((i) => ({ menuItem: i._id, name: i.name, price: i.price, qty: i.qty })),
    subtotal,
    discount,
    deliveryFee,
    couponApplied: cart.coupon?.code || null,
    total,
    deliveryAddress: address,
    paymentMethod,
    paymentRef,
  });

  const finalizeOrder = async (paymentRef = null) => {
    const payload = buildOrderPayload(paymentRef);
    const result = await dispatch(placeOrder(payload));
    if (!result.error) {
      dispatch(clearCart());
      navigate(`/order-success/${result.payload._id}`);
    }
  };

  const handleOnlinePayment = async () => {
    setPayError("");
    setProcessing(true);
    try {
      const { data } = await api.post("/payment/create-session", { amount: total });

      const options = {
        key: data.key,
        amount: data.session.amount,
        currency: data.session.currency,
        order_id: data.session.id,
        name: "TiffinHub",
        description: "Order payment",
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#157b7e" },
        handler: async function (response) {
          try {
            const verifyRes = await api.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.data.verified) {
              await finalizeOrder(response.razorpay_payment_id);
            } else {
              setPayError("Payment verification failed. Please try again.");
            }
          } catch (err) {
            setPayError("Payment verification failed. Please try again.");
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setPayError("Payment failed. Please try again.");
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      setPayError(err.response?.data?.message || "Could not start payment");
      setProcessing(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPayError("");

    if (paymentMethod === "ONLINE") {
      handleOnlinePayment();
    } else {
      finalizeOrder();
    }
  };

  return (
    <div className="container" style={{ padding: "36px 0", maxWidth: 560 }}>
      <h2 style={{ marginBottom: 20 }}>Checkout</h2>
      <Message>{error || payError}</Message>
      <form onSubmit={handlePlaceOrder} className="card" style={{ padding: 24 }}>
        <div className="form-group">
          <label>Street address</label>
          <input required value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>City</label>
            <input required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>State</label>
            <input required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label>PIN code</label>
          <input required value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Payment method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="COD">Cash on delivery</option>
            <option value="ONLINE">Pay online (UPI / Card / Netbanking)</option>
          </select>
        </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: 14, marginTop: 10, fontWeight: 700, display: "flex", justifyContent: "space-between" }}>
          <span>Total to pay</span><span>₹{total.toFixed(0)}</span>
        </div>

        <button className="btn btn-primary" type="submit" style={{ width: "100%", marginTop: 20 }} disabled={loading || processing}>
          {processing ? "Opening payment..." : loading ? "Placing order..." : paymentMethod === "ONLINE" ? "Pay now" : "Place order"}
        </button>
      </form>
    </div>
  );
}