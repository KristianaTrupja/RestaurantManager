import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Table, TableState } from "../../types/Table";

const initialState: TableState = {
  list: [
    {
      id: "1",
      number: 1,
      status: "free",
      assignedWaiter: "null",
      orders: [],
      totalPriceWithoutTVSH: 0,
      tvsh: 0,
      totalPriceWithTVSH: 0,
      currency: "€",
      billNumber: null,
      printedAt: null,
    },
    {
      id: "2",
      number: 2,
      status: "cleaning",
      assignedWaiter: "null",
      orders: [],
      totalPriceWithoutTVSH: 0,
      tvsh: 0,
      totalPriceWithTVSH: 0,
      currency: "€",
      billNumber: null,
      printedAt: null,
    },
    {
      id: "3",
      number: 3,
      status: "free",
      assignedWaiter: "null",
      orders: [],
      totalPriceWithoutTVSH: 0,
      tvsh: 0,
      totalPriceWithTVSH: 0,
      currency: "€",
      billNumber: null,
      printedAt: null,
    },

    // TABLE 4
    {
      id: "4",
      number: 4,
      status: "waiting",
      assignedWaiter: "null",
      orders: [
        { id: "1", name: "Pizza Margherita", quantity: 2, price: 12, total: 24, round: 1 },
        { id: "2", name: "Coke", quantity: 2, price: 2.5, total: 5, round: 1 },
        { id: "3", name: "Salad", quantity: 1, price: 5, total: 5, round: 1 },
        { id: "4", name: "Pasta Carbonara", quantity: 1, price: 10, total: 10, round: 2 },
        { id: "5", name: "Lemonade", quantity: 1, price: 3, total: 3, round: 2 },
        { id: "6", name: "Tiramisu", quantity: 1, price: 6, total: 6, round: 3 },
        { id: "7", name: "Espresso", quantity: 1, price: 2.1, total: 2.1, round: 3 },
        { id: "8", name: "Water", quantity: 1, price: 1, total: 1, round: 3 },
      ],
      totalPriceWithoutTVSH: 56.1,
      tvsh: 11.22,
      totalPriceWithTVSH: 67.32,
      currency: "€",
      billNumber: "BILL-004",
      printedAt: "2025-01-15T12:40:00Z",
    },

    // TABLE 5
    {
      id: "5",
      number: 5,
      status: "taken",
      assignedWaiter: "Kristiana Trupja",
      orders: [
        { id: "1", name: "Sushi Roll", quantity: 1, price: 15, total: 15, round: 1 },
        { id: "2", name: "Water", quantity: 1, price: 1, total: 1, round: 1 },
        { id: "3", name: "Miso Soup", quantity: 2, price: 4, total: 8, round: 2 },
        { id: "4", name: "Green Tea", quantity: 1, price: 3, total: 3, round: 2 },
        { id: "5", name: "Tempura", quantity: 1, price: 8, total: 8, round: 3 },
      ],
      totalPriceWithoutTVSH: 35,
      tvsh: 7,
      totalPriceWithTVSH: 42,
      currency: "€",
      billNumber: "BILL-005",
      printedAt: null,
    },

    // TABLE 6
    {
      id: "6",
      number: 6,
      status: "served",
      assignedWaiter: "Relando Vrapi",
      orders: [
        { id: "1", name: "Sushi Roll", quantity: 1, price: 15, total: 15, round: 1 },
        { id: "2", name: "Water", quantity: 1, price: 1, total: 1, round: 1 },
        { id: "3", name: "Miso Soup", quantity: 2, price: 4, total: 8, round: 1 },
        { id: "4", name: "Green Tea", quantity: 1, price: 3, total: 3, round: 1 },
      ],
      totalPriceWithoutTVSH: 27,
      tvsh: 5.4,
      totalPriceWithTVSH: 32.4,
      currency: "€",
      billNumber: "BILL-006",
      printedAt: "2025-01-12T10:15:00Z",
    },

    // TABLE 7
    {
      id: "7",
      number: 7,
      status: "served",
      assignedWaiter: "Kristiana Trupja",
      orders: [
        { id: "1", name: "Sushi Roll", quantity: 1, price: 15, total: 15, round: 1 },
        { id: "2", name: "Water", quantity: 1, price: 1, total: 1, round: 1 },
      ],
      totalPriceWithoutTVSH: 16,
      tvsh: 3.2,
      totalPriceWithTVSH: 19.2,
      currency: "€",
      billNumber: "BILL-007",
      printedAt: "2025-01-10T14:00:00Z",
    },

    // TABLE 8
    {
      id: "8",
      number: 8,
      status: "served",
      assignedWaiter: "Jetmir Ahmati",
      orders: [
        { id: "1", name: "Sushi Roll", quantity: 1, price: 15, total: 15, round: 1 },
        { id: "2", name: "Water", quantity: 1, price: 1, total: 1, round: 1 },
      ],
      totalPriceWithoutTVSH: 16,
      tvsh: 3.2,
      totalPriceWithTVSH: 19.2,
      currency: "€",
      billNumber: "BILL-008",
      printedAt: "2025-01-09T18:30:00Z",
    },
  ],
};

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
      table.tvsh = table.totalPriceWithoutTVSH * 0.20; // 20% example
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
