import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  title?: string;
  tableId?: string;
  orders?: { name: string; quantity: number; price: number }[];
  onConfirm?: () => void;
}

const initialState: ModalState = {
  isOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{
        title?: string;
        tableId?: string;
        orders?: { name: string; quantity: number; price: number }[];
        onConfirm?: () => void;
      }>
    ) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.tableId = action.payload.tableId;
      state.orders = action.payload.orders;
      state.onConfirm = action.payload.onConfirm;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.title = "";
      state.tableId = undefined;
      state.orders = undefined;
      state.onConfirm = undefined;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
