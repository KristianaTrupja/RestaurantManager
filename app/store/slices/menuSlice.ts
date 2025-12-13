import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { menuItemApi } from "@/app/lib/api/menuItemApi";
import { categoryApi } from "@/app/lib/api/categoryApi";
import type { MenuItem, Category } from "@/app/types";

interface MenuState {
  items: MenuItem[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  items: [],
  categories: [],
  isLoading: false,
  error: null,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.items = action.payload;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    updateMenuItem: (state, action: PayloadAction<MenuItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    addMenuItem: (state, action: PayloadAction<MenuItem>) => {
      state.items.push(action.payload);
    },
    removeMenuItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle getMenuItems query
    builder
      .addMatcher(menuItemApi.endpoints.getMenuItems.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(menuItemApi.endpoints.getMenuItems.matchFulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.data) {
          state.items = action.payload.data;
        }
      })
      .addMatcher(menuItemApi.endpoints.getMenuItems.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch menu items";
      });

    // Handle getCategories query
    builder
      .addMatcher(categoryApi.endpoints.getCategories.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(categoryApi.endpoints.getCategories.matchFulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.data) {
          state.categories = action.payload.data;
        }
      })
      .addMatcher(categoryApi.endpoints.getCategories.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch categories";
      });

    // Handle createMenuItem mutation
    builder
      .addMatcher(menuItemApi.endpoints.createMenuItem.matchFulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.items.push(action.payload.data);
        }
      });

    // Handle updateMenuItem mutation
    builder
      .addMatcher(menuItemApi.endpoints.updateMenuItem.matchFulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          const index = state.items.findIndex(item => item.id === action.payload.data!.id);
          if (index !== -1) {
            state.items[index] = action.payload.data;
          }
        }
      });

    // Handle deleteMenuItem mutation
    builder
      .addMatcher(menuItemApi.endpoints.deleteMenuItem.matchFulfilled, (state, action) => {
        const id = action.meta.arg.originalArgs;
        state.items = state.items.filter(item => item.id !== id);
      });

    // Handle toggleMenuItemAvailability mutation
    builder
      .addMatcher(menuItemApi.endpoints.toggleMenuItemAvailability.matchFulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          const index = state.items.findIndex(item => item.id === action.payload.data!.id);
          if (index !== -1) {
            state.items[index] = action.payload.data;
          }
        }
      });
  },
});

export const { 
  setMenuItems, 
  setCategories, 
  updateMenuItem, 
  addMenuItem, 
  removeMenuItem,
  setLoading,
  setError,
} = menuSlice.actions;
export default menuSlice.reducer;
