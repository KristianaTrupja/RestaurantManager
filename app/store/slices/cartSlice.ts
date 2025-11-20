import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { message: null },
  reducers: {}
});

export default cartSlice.reducer;
