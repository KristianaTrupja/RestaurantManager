import { baseApi } from "./baseApi";
import type { Order, OrderStatus, ApiResponse, PaginatedResponse } from "@/app/types";

export interface CreateOrderRequest {
  tableId: string;
  sessionId: string;
  items: {
    menuItemId: number;
    quantity: number;
    notes?: string;
  }[];
  notes?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  tableId?: string;
  waiterId?: number;
  page?: number;
  size?: number;
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get orders with filters
    getOrders: builder.query<ApiResponse<PaginatedResponse<Order>>, OrderFilters>({
      query: (filters) => ({
        url: "/orders",
        params: filters,
      }),
      providesTags: ["Order"],
    }),

    // Get order by ID
    getOrderById: builder.query<ApiResponse<Order>, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),

    // Create order
    createOrder: builder.mutation<ApiResponse<Order>, CreateOrderRequest>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Order", "Session"],
    }),

    // Update order status
    updateOrderStatus: builder.mutation<ApiResponse<Order>, { id: string; status: OrderStatus }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        params: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Order", id }, "Order"],
    }),

    // Confirm order
    confirmOrder: builder.mutation<ApiResponse<Order>, string>({
      query: (id) => ({
        url: `/orders/${id}/confirm`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Order", id }, "Order"],
    }),

    // Cancel order
    cancelOrder: builder.mutation<ApiResponse<Order>, string>({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Order", id }, "Order"],
    }),

    // Get pending orders
    getPendingOrders: builder.query<ApiResponse<Order[]>, void>({
      query: () => "/orders/pending",
      providesTags: ["Order"],
    }),

    // Get orders by table
    getOrdersByTable: builder.query<ApiResponse<Order[]>, string>({
      query: (tableId) => `/orders/table/${tableId}`,
      providesTags: (_result, _error, tableId) => [
        { type: "Order", id: `table-${tableId}` },
        "Order",
      ],
    }),

    // Get orders by session (more reliable)
    getOrdersBySession: builder.query<ApiResponse<Order[]>, string>({
      query: (sessionId) => `/orders/session/${sessionId}`,
      providesTags: (_result, _error, sessionId) => [
        { type: "Order", id: `session-${sessionId}` },
        "Order",
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useConfirmOrderMutation,
  useCancelOrderMutation,
  useGetPendingOrdersQuery,
  useGetOrdersByTableQuery,
  useGetOrdersBySessionQuery,
} = orderApi;

