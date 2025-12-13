import { baseApi } from "./baseApi";
import type { User, UserRole, ApiResponse, PaginatedResponse } from "@/app/types";

export interface CreateUserRequest {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UserFilters {
  page?: number;
  size?: number;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users (admin)
    getUsers: builder.query<ApiResponse<PaginatedResponse<Omit<User, "password">>>, UserFilters>({
      query: (filters) => ({
        url: "/users",
        params: filters,
      }),
      providesTags: ["User"],
    }),

    // Get user by ID (admin)
    getUserById: builder.query<ApiResponse<Omit<User, "password">>, number>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    // Create user (admin)
    createUser: builder.mutation<ApiResponse<Omit<User, "password">>, CreateUserRequest>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // Update user (admin)
    updateUser: builder.mutation<ApiResponse<Omit<User, "password">>, { id: number; data: UpdateUserRequest }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "User", id }, "User"],
    }),

    // Delete user (admin)
    deleteUser: builder.mutation<ApiResponse<void>, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Get all waiters
    getWaiters: builder.query<ApiResponse<Omit<User, "password">[]>, void>({
      query: () => "/users/waiters",
      providesTags: ["User"],
    }),

    // Search users (admin)
    searchUsers: builder.query<ApiResponse<Omit<User, "password">[]>, string>({
      query: (query) => ({
        url: "/users/search",
        params: { query },
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetWaitersQuery,
  useSearchUsersQuery,
} = userApi;

