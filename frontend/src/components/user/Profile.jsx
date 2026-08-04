import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../utils/api";
import { loadUser } from "../../redux/slices/authSlice";
import Message from "../layout/Message";

export default function Profile() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || { street: "", city: "", state: "", zip: "" },
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      await api.put("/auth/me", form);
      dispatch(loadUser());
      setMessage("Profile updated");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="card form-box">
      <h2 style={{ marginBottom: 20 }}>My profile</h2>
      <Message>{error}</Message>
      <Message type="success">{message}</Message>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Street</label>
          <input value={form.address.street} onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })} />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>City</label>
            <input value={form.address.city} onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>PIN</label>
            <input value={form.address.zip} onChange={(e) => setForm({ ...form, address: { ...form.address, zip: e.target.value } })} />
          </div>
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }}>Save changes</button>
      </form>
    </div>
  );
}
