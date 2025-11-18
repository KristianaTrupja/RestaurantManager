import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TableState } from "../../types/Table";


const initialState: TableState = {
  list: [
    {
      id: "1",
      number: 1,
      status: "free",
      assignedWaiter: "null",
      orders: [
        { name: "Pizza Margherita", quantity: 2, price: 12 },
        { name: "Coke", quantity: 2, price: 2.5 },
      ],
    },
    {
      id: "2",
      number: 2,
      status: "free",
      assignedWaiter: "null",
      orders: [
        { name: "Pizza Margherita", quantity: 2, price: 12 },
        { name: "Coke", quantity: 2, price: 2.5 },
      ],
    },
    {
      id: "3",
      number: 3,
      status: "free",
      assignedWaiter: "null",
      orders: [
        { name: "Pizza Margherita", quantity: 2, price: 12 },
        { name: "Coke", quantity: 2, price: 2.5 },
      ],
    },
    {
      id: "4",
      number: 4,
      status: "waiting",
      assignedWaiter: "null",
      orders: [
        { name: "Pizza Margherita", quantity: 2, price: 12 },
        { name: "Coke", quantity: 2, price: 2.5 },
      ],
    },
    {
      id: "5",
      number: 5,
      status: "taken",
      assignedWaiter: "Kristiana Trupja",
      orders: [
        { name: "Sushi Roll", quantity: 1, price: 15 },
        { name: "Water", quantity: 1, price: 1 },
      ],
    },
    {
      id: "6",
      number: 6,
      status: "served",
      assignedWaiter: "Relando Vrapi",
      orders: [
        { name: "Sushi Roll", quantity: 1, price: 15 },
        { name: "Water", quantity: 1, price: 1 },
      ],
    },
        {
      id: "7",
      number: 7,
      status: "served",
      assignedWaiter: "Kristiana Trupja",
      orders: [
        { name: "Sushi Roll", quantity: 1, price: 15 },
        { name: "Water", quantity: 1, price: 1 },
      ],
    },
        {
      id: "8",
      number: 8,
      status: "served",
      assignedWaiter: "Jetmir Ahmati",
      orders: [
        { name: "Sushi Roll", quantity: 1, price: 15 },
        { name: "Water", quantity: 1, price: 1 },
      ],
    },
  ],
};

const tableSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    markTableTaken: (state, action: PayloadAction<string>) => {
      const table = state.list.find((t) => t.id === action.payload);
      if (table) table.status = "taken";
    },
    markTableServed: (state, action: PayloadAction<string>) => {
      const table = state.list.find((t) => t.id === action.payload);
      if (table) table.status = "served";
    },
    addOrder: (
      state,
      action: PayloadAction<{ tableId: string; name: string; quantity: number; price: number }>
    ) => {
      const table = state.list.find((t) => t.id === action.payload.tableId);
      if (table) table.orders.push({ name: action.payload.name, quantity: action.payload.quantity, price: action.payload.price });
    },
    clearOrders: (state, action: PayloadAction<string>) => {
      const table = state.list.find((t) => t.id === action.payload);
      if (table) table.orders = [];
    },
  },
});

export const { markTableTaken, markTableServed, addOrder, clearOrders } = tableSlice.actions;
export default tableSlice.reducer;
