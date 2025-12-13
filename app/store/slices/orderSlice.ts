import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { orderApi } from "@/app/lib/api/orderApi";
import type { Order, OrderStatus, CartItem } from "@/app/types";

// Local order for tracking placed orders (before backend confirms)
export interface LocalOrderItem {
  menuItemId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface LocalOrder {
  id: string; // Temporary ID
  round: number;
  items: LocalOrderItem[];
  subtotal: number;
  createdAt: string;
}

interface OrdersState {
  orders: Order[];
  localOrders: LocalOrder[]; // Track orders locally for bill display
  currentRound: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  localOrders: [],
  currentRound: 1,
  isLoading: false,
  error: null,
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
    },
    // Add local order (from cart items) for bill tracking
    addLocalOrder: (state, action: PayloadAction<{ items: CartItem[] }>) => {
      const { items } = action.payload;
      const localOrder: LocalOrder = {
        id: `local-${Date.now()}`,
        round: state.currentRound,
        items: items.map(item => ({
          menuItemId: item.id,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
        subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        createdAt: new Date().toISOString(),
      };
      state.localOrders.push(localOrder);
      state.currentRound += 1;
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: OrderStatus }>) => {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
    incrementRound: (state) => {
      state.currentRound += 1;
    },
    resetRound: (state) => {
      state.currentRound = 1;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.localOrders = [];
      state.currentRound = 1;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle createOrder mutation
    builder
      .addMatcher(orderApi.endpoints.createOrder.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(orderApi.endpoints.createOrder.matchFulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.data) {
          state.orders.push(action.payload.data);
        }
      })
      .addMatcher(orderApi.endpoints.createOrder.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create order";
      });

    // Handle getOrdersByTable query
    builder
      .addMatcher(orderApi.endpoints.getOrdersByTable.matchFulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.orders = action.payload.data;
          // Calculate current round from existing orders
          const maxRound = state.orders.reduce((max, order) => Math.max(max, order.round), 0);
          state.currentRound = maxRound + 1;
        }
      });

    // Handle updateOrderStatus mutation
    builder
      .addMatcher(orderApi.endpoints.updateOrderStatus.matchFulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          const index = state.orders.findIndex(o => o.id === action.payload.data!.id);
          if (index !== -1) {
            state.orders[index] = action.payload.data;
          }
        }
      });

    // Handle confirmOrder mutation
    builder
      .addMatcher(orderApi.endpoints.confirmOrder.matchFulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          const index = state.orders.findIndex(o => o.id === action.payload.data!.id);
          if (index !== -1) {
            state.orders[index] = action.payload.data;
          }
        }
      });

    // Handle cancelOrder mutation
    builder
      .addMatcher(orderApi.endpoints.cancelOrder.matchFulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          const index = state.orders.findIndex(o => o.id === action.payload.data!.id);
          if (index !== -1) {
            state.orders[index] = action.payload.data;
          }
        }
      });
  },
});

export const { 
  setOrders, 
  addOrder,
  addLocalOrder,
  updateOrderStatus, 
  incrementRound, 
  resetRound, 
  clearOrders,
  setLoading,
  setError,
} = ordersSlice.actions;
export default ordersSlice.reducer;
