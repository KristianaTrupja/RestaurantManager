import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Table } from "../../types/Table";
import { initialState } from "@/app/mock-data/tablesData";


const tableSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    markTableWaiting: (state, action: PayloadAction<string>) => {
      const table = state.list.find((t) => t.id === action.payload);
      if (table) table.status = "waiting";
    },
    markTableTaken: (state, action: PayloadAction<string>) => {
      const table = state.list.find((t) => t.id === action.payload);
      if (table) table.status = "taken";
    },
    markTableServed: (state, action: PayloadAction<string>) => {
      const table = state.list.find((t) => t.id === action.payload);
      if (table) table.status = "served";
    },
    setTableData: (state, action: PayloadAction<Table>) => {
      const i = state.list.findIndex((t) => t.id === action.payload.id);
      if (i !== -1) state.list[i] = action.payload;
    },
    addOrder: (
      state,
      action: PayloadAction<{
        tableId: string;
        name: string;
        quantity: number;
        price: number;
        total: number;
        round: number;
      }>
    ) => {
      const table = state.list.find((t) => t.id === action.payload.tableId);
      if (!table) return;

      // add order
      table.orders.push({
        id: (table.orders.length + 1).toString(),
        name: action.payload.name,
        quantity: action.payload.quantity,
        price: action.payload.price,
        total: action.payload.total,
        round: action.payload.round,
      });

      // recalc totals
      table.totalPriceWithoutTVSH = table.orders.reduce((sum, o) => sum + o.total, 0);
      table.tvsh = table.totalPriceWithoutTVSH * table.tvsh;
      table.totalPriceWithTVSH = table.totalPriceWithoutTVSH + table.tvsh;
    },
    clearOrders: (state, action: PayloadAction<string>) => {
      const table = state.list.find((t) => t.id === action.payload);
      if (!table) return;

      table.orders = [];
      table.totalPriceWithoutTVSH = 0;
      table.tvsh = 0;
      table.totalPriceWithTVSH = 0;
    },
  },
});

export const {
  markTableWaiting,
  markTableTaken,
  markTableServed,
  setTableData,
  addOrder,
  clearOrders,
} = tableSlice.actions;

export default tableSlice.reducer;
