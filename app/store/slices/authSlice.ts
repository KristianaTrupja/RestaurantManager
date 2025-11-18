import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { token: null, user: null },
  reducers: {}
});

export default authSlice.reducer;
