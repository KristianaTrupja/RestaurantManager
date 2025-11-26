import { OrderItem, OrdersState } from "@/app/types/OrderItem";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: OrdersState = {
  orders: [],
  round: 1,
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrderRound(state, action: PayloadAction<OrderItem[]>) {
      state.orders.push(...action.payload);
      state.round += 1;
    },
  },
});

export const { addOrderRound } = ordersSlice.actions;
export default ordersSlice.reducer;
