import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cookReducer from "./slices/cookSlice";
import menuReducer from "./slices/menuSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cooks: cookReducer,
    menu: menuReducer,
    cart: cartReducer,
    orders: orderReducer,
  },
});
