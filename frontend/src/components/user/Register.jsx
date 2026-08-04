import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { register, clearAuthError } from "../../redux/slices/authSlice";
import Message from "../layout/Message";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(register(form));
    if (!result.error) navigate("/");
  };

  return (
    <div className="card form-box">
      <h2 style={{ marginBottom: 20 }}>Create your account</h2>
      <Message>{error}</Message>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: "0.9rem", textAlign: "center" }}>
        Already have an account? <Link to="/login" style={{ color: "var(--teal-600)", fontWeight: 600 }}>Sign in</Link>
      </p>
    </div>
  );
}
