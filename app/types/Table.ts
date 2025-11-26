import { OrderItem } from "./OrderItem";

export type TableStatus = "free" | "taken" | "served" | "waiting" | "finished";

export interface Table {
  id: string;
  number: number;
  status: TableStatus;
  assignedWaiter: string;
  orders: OrderItem[];
  totalPriceWithoutTVSH: number;
  tvsh: number;
  totalPriceWithTVSH: number;
  currency: string;
  billNumber: string | null;
  printedAt: string | null;
}

export interface TableState {
  list: Table[];
}
