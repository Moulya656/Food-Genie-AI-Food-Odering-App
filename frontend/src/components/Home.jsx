import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCooks } from "../redux/slices/cookSlice";
import Loader from "./layout/Loader";
import Message from "./layout/Message";

export default function Home() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.cooks);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    dispatch(fetchCooks(keyword ? { keyword } : {}));
  }, [dispatch, keyword]);

  return (
    <div>
      <section style={{ background: "var(--teal-800)", padding: "56px 0", color: "var(--cream-50)" }}>
        <div className="container">
          <h1 className="display" style={{ color: "var(--cream-50)", fontSize: "2.4rem", maxWidth: 560 }}>
            Home-cooked tiffins from real kitchens near you.
          </h1>
          <p style={{ maxWidth: 480, marginTop: 12, color: "var(--cream-100)" }}>
            Skip the restaurant menu — order lunch and dinner straight from home cooks who make it the way their family always has.
          </p>
          <div style={{ marginTop: 24, maxWidth: 420 }}>
            <input
              placeholder="Search by cuisine, region or kitchen name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: "40px 0" }}>
        <h2 style={{ marginBottom: 20 }}>Kitchens near you</h2>
        <Message>{error}</Message>
        {loading ? (
          <Loader />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 22 }}>
            {list.map((cook) => (
              <Link to={`/kitchen/${cook._id}`} key={cook._id} className="card" style={{ display: "block" }}>
                <div style={{ height: 150, background: "var(--cream-100)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img
                    src={cook.image}
                    alt={cook.kitchenName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                  />
                  <span style={{ display: "none", fontSize: "2rem" }}>🍛</span>
                </div>
                <div style={{ padding: 16 }}>
                  <h3 style={{ fontSize: "1.1rem" }}>{cook.kitchenName}</h3>
                  <p style={{ color: "var(--ink-500)", fontSize: "0.85rem", margin: "4px 0" }}>
                    {cook.city} · {cook.cuisineTypes?.join(", ")}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: "0.85rem" }}>
                    <span>⭐ {cook.rating?.toFixed(1)}</span>
                    <span>{cook.avgPrepTimeMins} min</span>
                  </div>
                </div>
              </Link>
            ))}
            {!loading && list.length === 0 && <p>No kitchens match that search yet.</p>}
          </div>
        )}
      </section>
    </div>
  );
}
