export default interface ModalState {
  isOpen: boolean;
  type?: "table" | "cart" | null;
  tableId?: string;
}
