import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchCooks = createAsyncThunk("cooks/fetchAll", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/cooks", { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Could not load kitchens");
  }
});

export const fetchCookDetails = createAsyncThunk("cooks/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/cooks/${id}`);
    return data.cook;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Could not load kitchen");
  }
});

const cookSlice = createSlice({
  name: "cooks",
  initialState: { list: [], count: 0, selected: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCooks.pending, (state) => { state.loading = true; })
      .addCase(fetchCooks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.cooks;
        state.count = action.payload.cooksCount;
      })
      .addCase(fetchCooks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchCookDetails.pending, (state) => { state.loading = true; })
      .addCase(fetchCookDetails.fulfilled, (state, action) => { state.loading = false; state.selected = action.payload; })
      .addCase(fetchCookDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default cookSlice.reducer;
