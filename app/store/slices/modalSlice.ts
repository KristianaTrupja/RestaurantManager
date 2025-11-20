import ModalState from "@/app/types/ModalState";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: ModalState = {
  isOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ tableId: string }>) => {
      state.isOpen = true;
      state.tableId = action.payload.tableId;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.tableId = undefined;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
