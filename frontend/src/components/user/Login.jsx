import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, clearAuthError } from "../../redux/slices/authSlice";
import Message from "../layout/Message";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    const result = await dispatch(login(form));
    if (!result.error) navigate(params.get("redirect") || "/");
  };

  if (isAuthenticated) navigate("/");

  return (
    <div className="card form-box">
      <h2 style={{ marginBottom: 20 }}>Welcome back</h2>
      <Message>{error}</Message>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div style={{ textAlign: "right", marginBottom: 16 }}>
          <Link to="/forgot-password" style={{ fontSize: "0.85rem", color: "var(--teal-600)" }}>
            Forgot password?
          </Link>
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p style={{ marginTop: 16, fontSize: "0.9rem", textAlign: "center" }}>
        New here? <Link to="/register" style={{ color: "var(--teal-600)", fontWeight: 600 }}>Create an account</Link>
      </p>
    </div>
  );
}