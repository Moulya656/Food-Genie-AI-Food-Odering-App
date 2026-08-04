import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import Message from "../layout/Message";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setDevResetUrl("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message || "Reset link sent");
      if (data.resetUrl) setDevResetUrl(data.resetUrl); // remove once real email sending is added
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container form-box">
      <h2 style={{ marginBottom: 20 }}>Forgot Password</h2>
      <Message>{error}</Message>
      {message && <div className="alert alert-success">{message}</div>}

      {devResetUrl && (
        <div className="alert alert-success" style={{ wordBreak: "break-all" }}>
          Dev mode — reset link: <Link to={devResetUrl.replace(window.location.origin, "")}>{devResetUrl}</Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: 24 }}>
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <button className="btn btn-primary" type="submit" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p style={{ marginTop: 16, textAlign: "center" }}>
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  );
}