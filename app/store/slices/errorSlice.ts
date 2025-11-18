import { createSlice } from "@reduxjs/toolkit";

const errorSlice = createSlice({
  name: "errors",
  initialState: {
    message: null,
  },
  reducers: {
    setError: (state, action) => {
      state.message = action.payload;
    },
    clearError: (state) => {
      state.message = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;
