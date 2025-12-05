# Backend Planning Document

## Overview

This document outlines the backend architecture for the Restaurant Manager application. It includes database models, API endpoints, services, and controllers needed to support the frontend functionality.

---

## Database Models (Entities)

### 1. User
```
User {
  id: number (PK, auto-increment)
  username: string (unique, not null)
  password: string (hashed, not null)
  email: string (unique, nullable)
  fullName: string (not null)
  role: enum('GUEST', 'WAITER', 'ADMIN')
  isActive: boolean (default: true)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### 2. Category
```
Category {
  id: number (PK, auto-increment)
  name: string (unique, not null)
  description: string (nullable)
  image: string (nullable)
  sortOrder: number (default: 0)
  isActive: boolean (default: true)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### 3. MenuItem
```
MenuItem {
  id: number (PK, auto-increment)
  categoryId: number (FK -> Category)
  name: string (not null)
  description: string
  price: decimal(10,2) (not null)
  image: string (nullable)
  available: boolean (default: true)
  preparationTime: number (minutes, nullable)
  allergens: string[] (nullable, JSON)
  isVegetarian: boolean (default: false)
  isVegan: boolean (default: false)
  isGlutenFree: boolean (default: false)
  calories: number (nullable)
  sortOrder: number (default: 0)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### 4. Table
```
Table {
  id: string (PK, UUID)
  number: number (unique, not null)
  capacity: number (default: 4)
  status: enum('free', 'waiting', 'taken', 'served', 'finished')
  assignedWaiterId: number (FK -> User, nullable)
  currentSessionId: string (FK -> TableSession, nullable)
  location: string (nullable) // indoor, outdoor, terrace
  isActive: boolean (default: true)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### 5. TableSession
```
TableSession {
  id: string (PK, UUID)
  tableId: string (FK -> Table)
  guestId: number (FK -> User, nullable)
  waiterId: number (FK -> User, nullable)
  status: enum('active', 'completed', 'cancelled')
  startedAt: timestamp
  endedAt: timestamp (nullable)
  totalPriceWithoutTax: decimal(10,2) (default: 0)
  taxAmount: decimal(10,2) (default: 0)
  taxRate: decimal(5,4) (default: 0.20)
  totalPriceWithTax: decimal(10,2) (default: 0)
  currency: string (default: '€')
  billNumber: string (nullable, unique)
  printedAt: timestamp (nullable)
  paidAt: timestamp (nullable)
  paymentMethod: enum('cash', 'card', 'other', null)
  notes: string (nullable)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### 6. Order
```
Order {
  id: string (PK, UUID)
  sessionId: string (FK -> TableSession)
  tableId: string (FK -> Table)
  waiterId: number (FK -> User, nullable)
  round: number (not null) // Order round (1, 2, 3...)
  status: enum('pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled')
  subtotal: decimal(10,2)
  notes: string (nullable)
  createdAt: timestamp
  updatedAt: timestamp
  confirmedAt: timestamp (nullable)
  servedAt: timestamp (nullable)
}
```

### 7. OrderItem
```
OrderItem {
  id: string (PK, UUID)
  orderId: string (FK -> Order)
  menuItemId: number (FK -> MenuItem)
  quantity: number (not null, min: 1)
  unitPrice: decimal(10,2) (not null)
  totalPrice: decimal(10,2) (not null)
  notes: string (nullable)
  status: enum('pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled')
  createdAt: timestamp
  updatedAt: timestamp
}
```

---

## API Endpoints

### Authentication Controller (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/register` | User registration | Public |
| POST | `/api/auth/logout` | User logout | Authenticated |
| GET | `/api/auth/me` | Get current user | Authenticated |
| POST | `/api/auth/refresh` | Refresh JWT token | Authenticated |
| PUT | `/api/auth/change-password` | Change password | Authenticated |

### Users Controller (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | List all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Admin |
| POST | `/api/users` | Create new user | Admin |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user (soft) | Admin |
| GET | `/api/users/waiters` | List all waiters | Admin, Waiter |

### Categories Controller (`/api/categories`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/categories` | List all categories | Public |
| GET | `/api/categories/:id` | Get category by ID | Public |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |
| PUT | `/api/categories/:id/sort` | Update sort order | Admin |

### Menu Items Controller (`/api/menu-items`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/menu-items` | List all menu items | Public |
| GET | `/api/menu-items/:id` | Get menu item by ID | Public |
| GET | `/api/menu-items/category/:categoryId` | Get items by category | Public |
| POST | `/api/menu-items` | Create menu item | Admin |
| PUT | `/api/menu-items/:id` | Update menu item | Admin |
| DELETE | `/api/menu-items/:id` | Delete menu item | Admin |
| PATCH | `/api/menu-items/:id/availability` | Toggle availability | Admin |
| POST | `/api/menu-items/:id/image` | Upload item image | Admin |

### Tables Controller (`/api/tables`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tables` | List all tables | Authenticated |
| GET | `/api/tables/:id` | Get table by ID | Authenticated |
| POST | `/api/tables` | Create table | Admin |
| PUT | `/api/tables/:id` | Update table | Admin |
| DELETE | `/api/tables/:id` | Delete table | Admin |
| PATCH | `/api/tables/:id/status` | Update table status | Waiter, Admin |
| PATCH | `/api/tables/:id/assign` | Assign waiter to table | Waiter, Admin |
| GET | `/api/tables/:id/session` | Get current session | Authenticated |

### Table Sessions Controller (`/api/sessions`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/sessions/start` | Start new session | Guest, Waiter |
| GET | `/api/sessions/:id` | Get session details | Authenticated |
| PATCH | `/api/sessions/:id/end` | End session | Waiter, Admin |
| GET | `/api/sessions/:id/orders` | Get session orders | Authenticated |
| GET | `/api/sessions/:id/bill` | Get/Generate bill | Authenticated |
| POST | `/api/sessions/:id/pay` | Mark as paid | Waiter, Admin |

### Orders Controller (`/api/orders`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/orders` | List orders (filterable) | Waiter, Admin |
| GET | `/api/orders/:id` | Get order by ID | Authenticated |
| POST | `/api/orders` | Create new order | Guest, Waiter |
| PATCH | `/api/orders/:id/status` | Update order status | Waiter, Admin |
| PATCH | `/api/orders/:id/confirm` | Confirm order | Waiter |
| PATCH | `/api/orders/:id/cancel` | Cancel order | Waiter, Admin |
| GET | `/api/orders/pending` | Get pending orders | Waiter, Admin |
| GET | `/api/orders/table/:tableId` | Get orders by table | Authenticated |

### Order Items Controller (`/api/order-items`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| PATCH | `/api/order-items/:id/status` | Update item status | Waiter, Admin |
| DELETE | `/api/order-items/:id` | Remove item from order | Waiter (if pending) |

### Bills Controller (`/api/bills`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/bills` | List all bills | Admin |
| GET | `/api/bills/:id` | Get bill by ID | Authenticated |
| POST | `/api/bills/:id/print` | Mark bill as printed | Waiter, Admin |
| GET | `/api/bills/:id/pdf` | Generate PDF | Authenticated |
| GET | `/api/bills/daily-report` | Daily sales report | Admin |

---

## Services Architecture

### 1. AuthService
- `login(username, password)` → AuthResponse
- `register(userData)` → User
- `logout(userId)` → void
- `validateToken(token)` → User
- `refreshToken(token)` → AuthResponse
- `changePassword(userId, oldPassword, newPassword)` → void
- `hashPassword(password)` → string
- `comparePasswords(plain, hashed)` → boolean

### 2. UserService
- `findAll(filters?)` → User[]
- `findById(id)` → User
- `findByUsername(username)` → User
- `create(userData)` → User
- `update(id, userData)` → User
- `delete(id)` → void
- `getWaiters()` → User[]

### 3. CategoryService
- `findAll()` → Category[]
- `findById(id)` → Category
- `create(categoryData)` → Category
- `update(id, categoryData)` → Category
- `delete(id)` → void
- `updateSortOrder(id, sortOrder)` → Category

### 4. MenuItemService
- `findAll(filters?)` → MenuItem[]
- `findById(id)` → MenuItem
- `findByCategory(categoryId)` → MenuItem[]
- `create(itemData)` → MenuItem
- `update(id, itemData)` → MenuItem
- `delete(id)` → void
- `toggleAvailability(id)` → MenuItem
- `uploadImage(id, file)` → string (imageUrl)

### 5. TableService
- `findAll()` → Table[]
- `findById(id)` → Table
- `create(tableData)` → Table
- `update(id, tableData)` → Table
- `delete(id)` → void
- `updateStatus(id, status)` → Table
- `assignWaiter(id, waiterId)` → Table
- `getCurrentSession(id)` → TableSession | null

### 6. SessionService
- `start(tableId, guestId?, waiterId?)` → TableSession
- `findById(id)` → TableSession
- `end(id)` → TableSession
- `getOrders(id)` → Order[]
- `calculateTotals(id)` → { subtotal, tax, total }
- `generateBillNumber()` → string
- `markAsPaid(id, paymentMethod)` → TableSession

### 7. OrderService
- `findAll(filters?)` → Order[]
- `findById(id)` → Order
- `findByTable(tableId)` → Order[]
- `findBySession(sessionId)` → Order[]
- `create(orderData)` → Order
- `confirm(id)` → Order
- `updateStatus(id, status)` → Order
- `cancel(id)` → Order
- `getPending()` → Order[]
- `getNextRound(sessionId)` → number

### 8. BillService
- `generate(sessionId)` → Bill
- `findById(id)` → Bill
- `findAll(filters?)` → Bill[]
- `markAsPrinted(id)` → Bill
- `generatePDF(id)` → Buffer
- `getDailyReport(date)` → DailyReport

---

## Middleware

### 1. AuthMiddleware
- Validates JWT token
- Attaches user to request
- Handles token refresh

### 2. RoleMiddleware
- Checks user role against allowed roles
- Returns 403 if unauthorized

### 3. ValidationMiddleware
- Validates request body/params against schemas
- Returns 400 with validation errors

### 4. ErrorMiddleware
- Catches all errors
- Formats error responses
- Logs errors

### 5. RateLimitMiddleware
- Limits requests per IP/user
- Prevents abuse

---

## WebSocket Events (Real-time Updates)

### Server → Client Events
- `table:statusChanged` - Table status updated
- `order:created` - New order placed
- `order:statusChanged` - Order status updated
- `session:started` - New session started
- `session:ended` - Session ended

### Client → Server Events
- `table:subscribe` - Subscribe to table updates
- `orders:subscribe` - Subscribe to order updates

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/restaurant_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=8080
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5MB

# Tax
DEFAULT_TAX_RATE=0.20
```

---

## Suggested Tech Stack

### Backend Framework Options
1. **Node.js + Express + TypeScript** - Lightweight, flexible
2. **NestJS + TypeScript** - Full-featured, enterprise-ready
3. **Spring Boot + Java** - Enterprise standard
4. **ASP.NET Core + C#** - Microsoft ecosystem

### Database
- **PostgreSQL** - Recommended for complex queries
- **MySQL** - Alternative relational DB
- **MongoDB** - If going document-based

### ORM/Query Builder
- **Prisma** (Node.js) - Type-safe, modern
- **TypeORM** (Node.js) - Full-featured
- **Hibernate** (Java) - Enterprise standard
- **Entity Framework** (C#) - Microsoft ORM

### Authentication
- **JWT** - Stateless, scalable
- **Passport.js** (Node.js) - Flexible strategies

### Real-time
- **Socket.io** - WebSocket with fallbacks
- **SignalR** (.NET) - Microsoft real-time

---

## Implementation Priority

### Phase 1: Core Authentication & Menu
1. User model + AuthService
2. Login/Register endpoints
3. JWT middleware
4. Category model + CRUD
5. MenuItem model + CRUD

### Phase 2: Table Management
1. Table model + CRUD
2. TableSession model
3. Table status management
4. Waiter assignment

### Phase 3: Order System
1. Order model + CRUD
2. OrderItem model
3. Order status workflow
4. Session totals calculation

### Phase 4: Billing
1. Bill generation
2. PDF generation
3. Payment tracking
4. Daily reports

### Phase 5: Real-time
1. WebSocket setup
2. Real-time table updates
3. Real-time order notifications

---

## Security Considerations

1. **Password Hashing** - Use bcrypt with salt
2. **JWT Security** - Short expiry, refresh tokens
3. **Input Validation** - Validate all inputs
4. **SQL Injection** - Use parameterized queries/ORM
5. **Rate Limiting** - Prevent brute force
6. **CORS** - Restrict origins
7. **HTTPS** - Always in production
8. **Role-based Access** - Check permissions on every request

