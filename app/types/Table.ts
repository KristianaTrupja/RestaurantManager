// Backend uses uppercase, but we normalize to lowercase in the UI
export type TableStatus = 
  | "free" | "waiting" | "taken" | "served" | "requesting_bill" | "finished"
  | "FREE" | "WAITING" | "TAKEN" | "SERVED" | "REQUESTING_BILL" | "FINISHED";

export interface Table {
  id: string;
  number?: number;
  tableNumber?: number; // Backend might use this instead of 'number'
  capacity?: number;
  status: TableStatus;
  assignedWaiterId?: number;
  assignedWaiter?: string;
  currentSessionId?: string;
  location?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TableState {
  list: Table[];
  isLoading: boolean;
  error: string | null;
}
