import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "errors",
  initialState: { message: null },
  reducers: {}
});

export default cartSlice.reducer;
