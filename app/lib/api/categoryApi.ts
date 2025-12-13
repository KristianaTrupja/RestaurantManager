import { baseApi } from "./baseApi";
import type { Category, ApiResponse } from "@/app/types";

export interface CategoryRequest {
  name: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<ApiResponse<Category[]>, void>({
      query: () => "/categories",
      providesTags: ["Category"],
    }),

    getCategoryById: builder.query<ApiResponse<Category>, number>({
      query: (id) => `/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),

    createCategory: builder.mutation<ApiResponse<Category>, CategoryRequest>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategory: builder.mutation<ApiResponse<Category>, { id: number; data: CategoryRequest }>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Category", id }, "Category"],
    }),

    deleteCategory: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    updateCategorySortOrder: builder.mutation<ApiResponse<void>, { id: number; sortOrder: number }>({
      query: ({ id, sortOrder }) => ({
        url: `/categories/${id}/sort`,
        method: "PUT",
        params: { sortOrder },
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategorySortOrderMutation,
} = categoryApi;

