import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const placeOrder = createAsyncThunk("orders/create", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/orders", payload);
    return data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Could not place order");
  }
});

export const fetchMyOrders = createAsyncThunk("orders/fetchMine", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/orders/my-orders");
    return data.orders;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Could not load orders");
  }
});

export const fetchOrderDetails = createAsyncThunk("orders/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/orders/${id}`);
    return data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Could not load order");
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState: { mine: [], selected: null, lastPlaced: null, loading: false, error: null },
  reducers: {
    clearOrderError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(placeOrder.fulfilled, (state, action) => { state.loading = false; state.lastPlaced = action.payload; })
      .addCase(placeOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.mine = action.payload; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchOrderDetails.pending, (state) => { state.loading = true; })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => { state.loading = false; state.selected = action.payload; })
      .addCase(fetchOrderDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
