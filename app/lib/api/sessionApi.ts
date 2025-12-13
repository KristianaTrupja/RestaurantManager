import { baseApi } from "./baseApi";
import type { TableSession, Bill, ApiResponse } from "@/app/types";

export interface StartSessionRequest {
  tableId: string;
  guestId?: number;
  waiterId?: number;
}

export type PaymentMethod = "cash" | "card" | "other";

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Start new session
    startSession: builder.mutation<ApiResponse<TableSession>, StartSessionRequest>({
      query: (body) => ({
        url: "/sessions/start",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Session", "Table"],
    }),

    // Get session details
    getSession: builder.query<ApiResponse<TableSession>, string>({
      query: (id) => `/sessions/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Session", id }],
    }),

    // End session
    endSession: builder.mutation<ApiResponse<TableSession>, string>({
      query: (id) => ({
        url: `/sessions/${id}/end`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Session", id }, "Session", "Table"],
    }),

    // Get/Generate bill
    getBill: builder.query<ApiResponse<Bill>, string>({
      query: (id) => `/sessions/${id}/bill`,
      providesTags: (_result, _error, id) => [{ type: "Bill", id }],
    }),

    // Mark session as paid
    markSessionPaid: builder.mutation<ApiResponse<TableSession>, { id: string; paymentMethod: PaymentMethod }>({
      query: ({ id, paymentMethod }) => ({
        url: `/sessions/${id}/pay`,
        method: "POST",
        params: { paymentMethod: paymentMethod.toUpperCase() },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Session", id }, "Session", "Table"],
    }),

    // Request bill (for guests)
    requestBill: builder.mutation<ApiResponse<TableSession>, string>({
      query: (id) => ({
        url: `/sessions/${id}/request-bill`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Session", id }, "Session", "Table"],
    }),
  }),
});

export const {
  useStartSessionMutation,
  useGetSessionQuery,
  useEndSessionMutation,
  useGetBillQuery,
  useMarkSessionPaidMutation,
  useRequestBillMutation,
} = sessionApi;

