import { baseApi } from "./baseApi";
import type { Table, TableSession, TableStatus, ApiResponse } from "@/app/types";

export interface TableRequest {
  number: number;
  capacity: number;
  location?: string;
  isActive?: boolean;
}

export const tableApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tables
    getTables: builder.query<ApiResponse<Table[]>, void>({
      query: () => "/tables",
      providesTags: ["Table"],
    }),

    // Get table by ID
    getTableById: builder.query<ApiResponse<Table>, string>({
      query: (id) => `/tables/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Table", id }],
    }),

    // Create table (admin)
    createTable: builder.mutation<ApiResponse<Table>, TableRequest>({
      query: (body) => ({
        url: "/tables",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Table"],
    }),

    // Update table (admin)
    updateTable: builder.mutation<ApiResponse<Table>, { id: string; data: TableRequest }>({
      query: ({ id, data }) => ({
        url: `/tables/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Table", id }, "Table"],
    }),

    // Delete table (admin)
    deleteTable: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/tables/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Table"],
    }),

    // Update table status
    updateTableStatus: builder.mutation<ApiResponse<Table>, { id: string; status: TableStatus }>({
      query: ({ id, status }) => ({
        url: `/tables/${id}/status`,
        method: "PATCH",
        params: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Table", id }, "Table"],
    }),

    // Assign waiter to table
    assignWaiter: builder.mutation<ApiResponse<Table>, { id: string; waiterId?: number }>({
      query: ({ id, waiterId }) => ({
        url: `/tables/${id}/assign`,
        method: "PATCH",
        params: waiterId ? { waiterId } : {},
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Table", id }, "Table"],
    }),

    // Get current session for table
    getTableSession: builder.query<ApiResponse<TableSession | null>, string>({
      query: (id) => `/tables/${id}/session`,
      providesTags: (_result, _error, id) => [{ type: "Session", id: `table-${id}` }],
    }),

    // Get free tables
    getFreeTables: builder.query<ApiResponse<Table[]>, void>({
      query: () => "/tables/free",
      providesTags: ["Table"],
    }),
  }),
});

export const {
  useGetTablesQuery,
  useGetTableByIdQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
  useUpdateTableStatusMutation,
  useAssignWaiterMutation,
  useGetTableSessionQuery,
  useGetFreeTablesQuery,
} = tableApi;

