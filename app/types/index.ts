/**
 * ============================================
 * RESTAURANT MANAGER - TYPE DEFINITIONS
 * ============================================
 * 
 * This file contains all TypeScript interfaces and types
 * used throughout the application. These types should mirror
 * your backend database models and API responses.
 */

// ============================================
// USER & AUTHENTICATION
// ============================================

export type UserRole = "GUEST" | "WAITER" | "ADMIN";

export interface User {
  id: number;
  username: string;
  password?: string; // Only used for registration, never returned from API
  email?: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
  expiresAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  role: UserRole;
}

// ============================================
// MENU & CATEGORIES
// ============================================

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: number;
  categoryId: number;
  category?: string; // Category name for display
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMenuItemRequest {
  categoryId: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  available?: boolean;
}

export interface UpdateMenuItemRequest extends Partial<CreateMenuItemRequest> {
  id: number;
}

// ============================================
// TABLES
// ============================================

// Backend uses uppercase, but we normalize to lowercase in the UI
export type TableStatus = 
  | "free" | "waiting" | "taken" | "served" | "requesting_bill" | "finished"
  | "FREE" | "WAITING" | "TAKEN" | "SERVED" | "REQUESTING_BILL" | "FINISHED";

export interface Table {
  id: string;
  number?: number;
  tableNumber?: number; // Backend might use this instead of 'number'
  capacity?: number;
  status: TableStatus;
  assignedWaiterId?: number;
  assignedWaiter?: string; // Waiter name for display
  currentSessionId?: string;
  location?: string; // e.g., "indoor", "outdoor", "terrace"
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TableSession {
  id: string;
  tableId: string;
  guestId?: number;
  waiterId?: number;
  status: TableStatus;
  startedAt: string;
  endedAt?: string;
  orders?: Order[];
  totalPriceWithoutTax: number;
  taxAmount: number;
  taxRate: number; // e.g., 0.20 for 20%
  totalPriceWithTax: number;
  currency: string;
  billNumber?: string;
  paidAt?: string;
  paymentMethod?: "cash" | "card" | "other";
}

// ============================================
// ORDERS
// ============================================

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "served" | "cancelled";

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
  status: OrderStatus;
}

export interface Order {
  id: string;
  sessionId: string;
  tableId: string;
  waiterId?: number;
  round: number; // Order round (1, 2, 3...)
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  servedAt?: string;
}

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

// ============================================
// CART (Client-side only)
// ============================================

export interface CartItem {
  id: number; // menuItemId
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  tableId?: string;
  sessionId?: string;
}

// ============================================
// BILL / INVOICE
// ============================================

export interface Bill {
  id: string;
  billNumber: string;
  sessionId: string;
  tableNumber: number;
  waiterName?: string;
  items: BillItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  createdAt: string;
  paidAt?: string;
  paymentMethod?: "cash" | "card" | "other";
}

export interface BillItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  round: number;
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// ============================================
// REDUX STATE TYPES
// ============================================

export interface AuthState {
  user: Omit<User, "password"> | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface MenuState {
  items: MenuItem[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

export interface TableState {
  list: Table[];
  sessions: Record<string, TableSession>;
  isLoading: boolean;
  error: string | null;
}

export interface OrderState {
  orders: Order[];
  currentRound: number;
  isLoading: boolean;
  error: string | null;
}

export interface ErrorState {
  message: string | null;
  code?: string;
  timestamp?: string;
}

