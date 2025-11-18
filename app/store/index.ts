import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../lib/api/baseApi";

// Slices
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import tableReducer from "./slices/tableSlice";
import errorReducer from "./slices/errorSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    tables: tableReducer,
    errors: errorReducer,
    theme: themeReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
