import { createSlice } from "@reduxjs/toolkit";

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem("tiffinhub_cart")) || { cookId: null, cookName: null, items: [], coupon: null };
  } catch {
    return { cookId: null, cookName: null, items: [], coupon: null };
  }
};

const persist = (state) => {
  localStorage.setItem("tiffinhub_cart", JSON.stringify(state));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCart(),
  reducers: {
    addItem: (state, action) => {
      const { menuItem, cookId, cookName } = action.payload;

      // A cart can only hold items from one kitchen at a time.
      if (state.cookId && state.cookId !== cookId) {
        state.items = [];
        state.coupon = null;
      }
      state.cookId = cookId;
      state.cookName = cookName;

      const existing = state.items.find((i) => i._id === menuItem._id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...menuItem, qty: 1 });
      }
      persist(state);
    },
    incrementItem: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item) item.qty += 1;
      persist(state);
    },
    decrementItem: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item) {
        item.qty -= 1;
        if (item.qty <= 0) state.items = state.items.filter((i) => i._id !== action.payload);
      }
      persist(state);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      persist(state);
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload;
      persist(state);
    },
    clearCoupon: (state) => {
      state.coupon = null;
      persist(state);
    },
    clearCart: (state) => {
      state.cookId = null;
      state.cookName = null;
      state.items = [];
      state.coupon = null;
      persist(state);
    },
  },
});

export const { addItem, incrementItem, decrementItem, removeItem, applyCoupon, clearCoupon, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
