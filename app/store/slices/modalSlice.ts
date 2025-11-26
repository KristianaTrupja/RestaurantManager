import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModalType = "table" | "cart" | "createMenuItem" | "bill" | null;

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  category?: string;
  tableId?: any | null;
}

const initialState: ModalState = {
  isOpen: false,
  type: null
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ type: ModalType; category?: string; tableId?: string }>) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.category = action.payload.category;
      state.tableId = action.payload.tableId;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = null;
      state.category = undefined;
      state.tableId = undefined;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
