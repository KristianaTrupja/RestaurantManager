import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import { CartItem } from "@/app/types/CartItem";

interface CartState {
  items: CartItem[];
  tableId: string | null;
  sessionId: string | null;
  tableNumber: string | null;
}

// Start with empty state to avoid hydration mismatch
const initialState: CartState = {
  items: [],
  tableId: null,
  sessionId: null,
  tableNumber: null,
};

const saveCart = (state: CartState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }
};

const saveSession = (tableId: string | null, sessionId: string | null, tableNumber: string | null) => {
  if (typeof window !== "undefined") {
    if (tableId) localStorage.setItem("tableId", tableId);
    else localStorage.removeItem("tableId");
    
    if (sessionId) localStorage.setItem("sessionId", sessionId);
    else localStorage.removeItem("sessionId");
    
    if (tableNumber) localStorage.setItem("tableNumber", tableNumber);
    else localStorage.removeItem("tableNumber");
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      saveCart(state);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveCart(state);
    },

    clearCart: (state) => {
      state.items = [];
      saveCart(state);
    },

    decreaseQty: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
      saveCart(state);
    },

    // Set session info (tableId, sessionId, tableNumber)
    setSession: (state, action: PayloadAction<{ tableId: string; sessionId: string; tableNumber: string }>) => {
      state.tableId = action.payload.tableId;
      state.sessionId = action.payload.sessionId;
      state.tableNumber = action.payload.tableNumber;
      saveSession(action.payload.tableId, action.payload.sessionId, action.payload.tableNumber);
    },

    // Clear session info (on logout)
    clearSession: (state) => {
      state.tableId = null;
      state.sessionId = null;
      state.tableNumber = null;
      state.items = [];
      saveSession(null, null, null);
      saveCart(state);
    },

    // Initialize cart from localStorage (called after mount)
    initializeCart: (state) => {
      if (typeof window !== "undefined") {
        try {
          const storedCart = localStorage.getItem("cart");
          if (storedCart) {
            state.items = JSON.parse(storedCart);
          }
          state.tableId = localStorage.getItem("tableId");
          state.sessionId = localStorage.getItem("sessionId");
          state.tableNumber = localStorage.getItem("tableNumber");
        } catch {
          // Ignore errors
        }
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, decreaseQty, setSession, clearSession, initializeCart } =
  cartSlice.actions;

export default cartSlice.reducer;

export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
