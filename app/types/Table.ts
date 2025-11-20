export type TableStatus = "free" | "taken" | "served" | "waiting" | "cleaning";

export interface Table {
  id: string;
  number: number;
  status: TableStatus;
  assignedWaiter: string;
  orders: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
    round: number;
  }[];
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
