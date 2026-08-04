import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";

export default function Header() {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const cartCount = useSelector((s) => s.cart.items.reduce((sum, i) => sum + i.qty, 0));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/");
  };

  return (
    <header style={{ background: "var(--teal-950)", padding: "16px 0", position: "sticky", top: 0, zIndex: 10 }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" className="display" style={{ color: "var(--turmeric-500)", fontSize: "1.5rem" }}>
          🍱 TiffinHub
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Link to="/" style={{ color: "var(--cream-50)", fontWeight: 500 }}>Kitchens</Link>
          {isAuthenticated && (
            <Link to="/orders" style={{ color: "var(--cream-50)", fontWeight: 500 }}>My Orders</Link>
          )}
          <Link to="/cart" style={{ color: "var(--cream-50)", fontWeight: 600, position: "relative" }}>
            🛒 Cart
            {cartCount > 0 && (
              <span style={{
                background: "var(--terracotta-500)", color: "#fff", borderRadius: "999px",
                fontSize: "0.65rem", padding: "1px 6px", position: "absolute", top: -8, right: -14,
              }}>{cartCount}</span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" style={{ color: "var(--turmeric-500)", fontWeight: 600 }}>{user?.name?.split(" ")[0]}</Link>
              <button className="btn btn-outline" style={{ borderColor: "var(--turmeric-500)", color: "var(--turmeric-500)" }} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
