import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
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
        content?: string;
        onConfirm?: () => void;
        onCancel?: () => void;
      }>
    ) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.onConfirm = action.payload.onConfirm;
      state.onCancel = action.payload.onCancel;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.title = "";
      state.content = "";
      state.onConfirm = undefined;
      state.onCancel = undefined;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
