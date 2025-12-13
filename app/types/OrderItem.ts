// Re-export from main types for backward compatibility
export type { OrderItem, Order, OrderStatus } from "./index";

// Legacy state type for backward compatibility
export interface OrdersState {
  orders: import("./index").Order[];
  round: number;
}
