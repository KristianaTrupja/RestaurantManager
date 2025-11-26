import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../lib/api/baseApi";

// Slices
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import tableReducer from "./slices/tableSlice";
import errorReducer from "./slices/errorSlice";
import modalReducer from "./slices/modalSlice";
import menuReducer from "./slices/menuSlice";
import ordersReducer from "./slices/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    modal: modalReducer,
    tables: tableReducer,
    menu: menuReducer,
    orders: ordersReducer,
    errors: errorReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
