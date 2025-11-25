import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModalType = "table" | "cart" | null;

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  tableId?: string;
}

const initialState: ModalState = {
  isOpen: false,
  type: null
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ type: ModalType; tableId?: string }>) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.tableId = action.payload.tableId;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = null;
      state.tableId = undefined;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
