import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { menuItems } from "@/app/mock-data/mockMenu";
import { MenuItem, MenuState } from "@/app/types/MenuItem";


const initialState: MenuState = {
  items: menuItems,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    updateMenuItem: (state, action: PayloadAction<MenuItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
});

export const { updateMenuItem } = menuSlice.actions;
export default menuSlice.reducer;

                                                                 