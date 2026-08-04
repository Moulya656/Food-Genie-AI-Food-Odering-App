import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchMenuForCook = createAsyncThunk("menu/fetchForCook", async (cookId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/menu/cook/${cookId}`);
    return data.items;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Could not load menu");
  }
});

export const searchMenu = createAsyncThunk("menu/search", async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/menu/search", { params });
    return data.items;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Search failed");
  }
});

const menuSlice = createSlice({
  name: "menu",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuForCook.pending, (state) => { state.loading = true; })
      .addCase(fetchMenuForCook.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchMenuForCook.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(searchMenu.pending, (state) => { state.loading = true; })
      .addCase(searchMenu.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(searchMenu.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default menuSlice.reducer;
