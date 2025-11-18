export type TableStatus = "free" | "taken" | "served" | "waiting";

export interface Table {
  id: string;
  number: number;
  status: TableStatus;
  orders: { name: string; quantity: number; price: number }[];
}

export interface TableState {
  list: Table[];
}