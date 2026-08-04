import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCookDetails } from "../redux/slices/cookSlice";
import { fetchMenuForCook } from "../redux/slices/menuSlice";
import { addItem } from "../redux/slices/cartSlice";
import Loader from "./layout/Loader";
import Message from "./layout/Message";

const dietBadge = { veg: "badge-veg", nonveg: "badge-nonveg", vegan: "badge-vegan" };

export default function CookMenu() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selected: cook, loading: cookLoading } = useSelector((s) => s.cooks);
  const { items, loading: menuLoading, error } = useSelector((s) => s.menu);

  useEffect(() => {
    dispatch(fetchCookDetails(id));
    dispatch(fetchMenuForCook(id));
  }, [dispatch, id]);

  const handleAdd = (menuItem) => {
    dispatch(addItem({ menuItem, cookId: id, cookName: cook?.kitchenName }));
  };

  if (cookLoading || !cook) return <Loader />;

  return (
    <div className="container" style={{ padding: "36px 0" }}>
      <div className="card" style={{ padding: 24, marginBottom: 28, display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ width: 110, height: 110, borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--cream-100)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <img
            src={cook.image}
            alt={cook.kitchenName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
          />
          <span style={{ display: "none", fontSize: "2rem" }}>🍲</span>
        </div>
        <div>
          <h2>{cook.kitchenName}</h2>
          <p style={{ color: "var(--ink-500)" }}>{cook.story}</p>
          <p style={{ fontSize: "0.85rem", marginTop: 8 }}>
            ⭐ {cook.rating?.toFixed(1)} ({cook.numReviews} reviews) · {cook.city} · {cook.cuisineTypes?.join(", ")}
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--ink-500)" }}>
            Delivery ₹{cook.deliveryFee} · Min order ₹{cook.minOrderValue} · ~{cook.avgPrepTimeMins} min prep
          </p>
        </div>
      </div>

      <h3 style={{ marginBottom: 16 }}>Menu</h3>
      <Message>{error}</Message>
      {menuLoading ? (
        <Loader />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
          {items.map((item) => (
            <div key={item._id} className="card" style={{ padding: 0 }}>
              <div style={{ width: "100%", height: 130, overflow: "hidden", background: "var(--cream-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                />
                <span style={{ display: "none", fontSize: "1.8rem" }}>🍽️</span>
              </div>
              <div style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h4 style={{ fontFamily: "inherit", fontWeight: 600 }}>{item.name}</h4>
                <span className={`badge ${dietBadge[item.dietType]}`}>{item.dietType}</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--ink-500)", minHeight: 40 }}>{item.description}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <strong>₹{item.price}</strong>
                <button className="btn btn-primary" onClick={() => handleAdd(item)}>Add +</button>
              </div>
              </div>
            </div>
          ))}
          {!menuLoading && items.length === 0 && <p>This kitchen hasn't listed any dishes yet.</p>}
        </div>
      )}
    </div>
  );
}
