import { baseApi } from "./baseApi";
import type { MenuItem, ApiResponse, PaginatedResponse } from "@/app/types";

export interface MenuItemRequest {
  categoryId: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  available?: boolean;
}

export interface MenuItemFilters {
  categoryId?: number;
  available?: boolean;
  search?: string;
  page?: number;
  size?: number;
}

export const menuItemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all available menu items (public)
    getMenuItems: builder.query<ApiResponse<MenuItem[]>, void>({
      query: () => "/menu-items",
      providesTags: ["MenuItem"],
    }),

    // Get all menu items with filters (admin)
    getAllMenuItems: builder.query<ApiResponse<PaginatedResponse<MenuItem>>, MenuItemFilters>({
      query: (filters) => ({
        url: "/menu-items/all",
        params: filters,
      }),
      providesTags: ["MenuItem"],
    }),

    // Get menu item by ID
    getMenuItemById: builder.query<ApiResponse<MenuItem>, number>({
      query: (id) => `/menu-items/${id}`,
      providesTags: (_result, _error, id) => [{ type: "MenuItem", id }],
    }),

    // Get items by category
    getMenuItemsByCategory: builder.query<ApiResponse<MenuItem[]>, number>({
      query: (categoryId) => `/menu-items/category/${categoryId}`,
      providesTags: (_result, _error, categoryId) => [
        { type: "MenuItem", id: `category-${categoryId}` },
        "MenuItem",
      ],
    }),

    // Create menu item
    createMenuItem: builder.mutation<ApiResponse<MenuItem>, MenuItemRequest>({
      query: (body) => ({
        url: "/menu-items",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MenuItem"],
    }),

    // Update menu item
    updateMenuItem: builder.mutation<ApiResponse<MenuItem>, { id: number; data: MenuItemRequest }>({
      query: ({ id, data }) => ({
        url: `/menu-items/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "MenuItem", id }, "MenuItem"],
    }),

    // Delete menu item
    deleteMenuItem: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/menu-items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MenuItem"],
    }),

    // Toggle availability
    toggleMenuItemAvailability: builder.mutation<ApiResponse<MenuItem>, number>({
      query: (id) => ({
        url: `/menu-items/${id}/availability`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "MenuItem", id }, "MenuItem"],
    }),

    // Upload image
    uploadMenuItemImage: builder.mutation<ApiResponse<string>, { id: number; file: FormData }>({
      query: ({ id, file }) => ({
        url: `/menu-items/${id}/image`,
        method: "POST",
        body: file,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "MenuItem", id }, "MenuItem"],
    }),
  }),
});

export const {
  useGetMenuItemsQuery,
  useGetAllMenuItemsQuery,
  useGetMenuItemByIdQuery,
  useGetMenuItemsByCategoryQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useToggleMenuItemAvailabilityMutation,
  useUploadMenuItemImageMutation,
} = menuItemApi;

