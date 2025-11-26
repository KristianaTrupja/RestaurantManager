
export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  round: number;
}

export interface OrdersState {
  orders: OrderItem[];
  round: number;
}