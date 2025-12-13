// Base API
export { baseApi } from "./baseApi";

// Auth API
export {
  authApi,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
  useChangePasswordMutation,
} from "./authApi";

// Category API
export {
  categoryApi,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategorySortOrderMutation,
} from "./categoryApi";

// Menu Item API
export {
  menuItemApi,
  useGetMenuItemsQuery,
  useGetAllMenuItemsQuery,
  useGetMenuItemByIdQuery,
  useGetMenuItemsByCategoryQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useToggleMenuItemAvailabilityMutation,
  useUploadMenuItemImageMutation,
} from "./menuItemApi";

// Table API
export {
  tableApi,
  useGetTablesQuery,
  useGetTableByIdQuery,
  useCreateTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
  useUpdateTableStatusMutation,
  useAssignWaiterMutation,
  useGetTableSessionQuery,
  useGetFreeTablesQuery,
} from "./tableApi";

// Session API
export {
  sessionApi,
  useStartSessionMutation,
  useGetSessionQuery,
  useEndSessionMutation,
  useGetBillQuery,
  useMarkSessionPaidMutation,
} from "./sessionApi";

// Order API
export {
  orderApi,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useConfirmOrderMutation,
  useCancelOrderMutation,
  useGetPendingOrdersQuery,
  useGetOrdersByTableQuery,
} from "./orderApi";

// User API
export {
  userApi,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetWaitersQuery,
  useSearchUsersQuery,
} from "./userApi";

// Types
export type { ChangePasswordRequest } from "./authApi";
export type { CategoryRequest } from "./categoryApi";
export type { MenuItemRequest, MenuItemFilters } from "./menuItemApi";
export type { TableRequest } from "./tableApi";
export type { StartSessionRequest, PaymentMethod } from "./sessionApi";
export type { CreateOrderRequest, OrderFilters } from "./orderApi";
export type { CreateUserRequest, UpdateUserRequest, UserFilters } from "./userApi";

