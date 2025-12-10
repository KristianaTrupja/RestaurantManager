# Controllers - REST API Layer

This document defines all REST controllers for the Restaurant Manager application.

---

## Base Response Structure

```java
package com.restaurant.manager.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private LocalDateTime timestamp;
    
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
            .success(true)
            .data(data)
            .timestamp(LocalDateTime.now())
            .build();
    }
    
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
            .success(true)
            .data(data)
            .message(message)
            .timestamp(LocalDateTime.now())
            .build();
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
            .success(false)
            .message(message)
            .timestamp(LocalDateTime.now())
            .build();
    }
}
```

---

## 1. AuthController

```java
package com.restaurant.manager.controller;

import com.restaurant.manager.dto.request.*;
import com.restaurant.manager.dto.response.*;
import com.restaurant.manager.entity.User;
import com.restaurant.manager.security.CurrentUser;
import com.restaurant.manager.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/login")
    @Operation(summary = "User login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }
    
    @PostMapping("/register")
    @Operation(summary = "User registration")
    public ResponseEntity<ApiResponse<UserDto>> register(
            @Valid @RequestBody RegisterRequest request) {
        User user = authService.register(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(UserDto.fromEntity(user), "Registration successful"));
    }
    
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "User logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader("Authorization") String token) {
        authService.logout(token.replace("Bearer ", ""));
        return ResponseEntity.ok(ApiResponse.success(null, "Logout successful"));
    }
    
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(
            @CurrentUser User user) {
        return ResponseEntity.ok(ApiResponse.success(UserDto.fromEntity(user)));
    }
    
    @PostMapping("/refresh")
    @Operation(summary = "Refresh JWT token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Change password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @CurrentUser User user,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(null, "Password changed successfully"));
    }
}
```

---

## 2. UserController

```java
package com.restaurant.manager.controller;

import com.restaurant.manager.dto.request.*;
import com.restaurant.manager.dto.response.*;
import com.restaurant.manager.entity.User;
import com.restaurant.manager.enums.UserRole;
import com.restaurant.manager.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management endpoints")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all users")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getAllUsers(Pageable pageable) {
        Page<User> users = userService.findAll(pageable);
        Page<UserDto> userDtos = users.map(UserDto::fromEntity);
        return ResponseEntity.ok(ApiResponse.success(userDtos));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(UserDto.fromEntity(user)));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new user")
    public ResponseEntity<ApiResponse<UserDto>> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        User user = userService.create(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(UserDto.fromEntity(user), "User created successfully"));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        User user = userService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(UserDto.fromEntity(user), "User updated"));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete user (soft delete)")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User deleted"));
    }
    
    @GetMapping("/waiters")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAITER')")
    @Operation(summary = "List all waiters")
    public ResponseEntity<ApiResponse<List<UserDto>>> getWaiters() {
        List<User> waiters = userService.getWaiters();
        List<UserDto> waiterDtos = waiters.stream()
            .map(UserDto::fromEntity)
            .toList();
        return ResponseEntity.ok(ApiResponse.success(waiterDtos));
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search users")
    public ResponseEntity<ApiResponse<List<UserDto>>> searchUsers(
            @RequestParam String query) {
        List<User> users = userService.searchUsers(query);
        List<UserDto> userDtos = users.stream()
            .map(UserDto::fromEntity)
            .toList();
        return ResponseEntity.ok(ApiResponse.success(userDtos));
    }
}
```

---

## 3. CategoryController

```java
package com.restaurant.manager.controller;

import com.restaurant.manager.dto.request.CategoryRequest;
import com.restaurant.manager.dto.response.*;
import com.restaurant.manager.entity.Category;
import com.restaurant.manager.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Menu category endpoints")
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @GetMapping
    @Operation(summary = "List all categories")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getAllCategories() {
        List<Category> categories = categoryService.findAllActive();
        List<CategoryDto> categoryDtos = categories.stream()
            .map(CategoryDto::fromEntity)
            .toList();
        return ResponseEntity.ok(ApiResponse.success(categoryDtos));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get category by ID")
    public ResponseEntity<ApiResponse<CategoryDto>> getCategoryById(@PathVariable Long id) {
        Category category = categoryService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(CategoryDto.fromEntity(category)));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create category")
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(
            @Valid @RequestBody CategoryRequest request) {
        Category category = categoryService.create(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(CategoryDto.fromEntity(category), "Category created"));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update category")
    public ResponseEntity<ApiResponse<CategoryDto>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        Category category = categoryService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(CategoryDto.fromEntity(category)));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete category")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Category deleted"));
    }
    
    @PutMapping("/{id}/sort")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update sort order")
    public ResponseEntity<ApiResponse<Void>> updateSortOrder(
            @PathVariable Long id,
            @RequestParam Integer sortOrder) {
        categoryService.updateSortOrder(id, sortOrder);
        return ResponseEntity.ok(ApiResponse.success(null, "Sort order updated"));
    }
}
```

---

## 4. MenuItemController

```java
package com.restaurant.manager.controller;

import com.restaurant.manager.dto.request.MenuItemRequest;
import com.restaurant.manager.dto.response.*;
import com.restaurant.manager.entity.MenuItem;
import com.restaurant.manager.service.MenuItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
@RequiredArgsConstructor
@Tag(name = "Menu Items", description = "Menu item endpoints")
public class MenuItemController {
    
    private final MenuItemService menuItemService;
    
    @GetMapping
    @Operation(summary = "List all menu items")
    public ResponseEntity<ApiResponse<List<MenuItemDto>>> getAllMenuItems() {
        List<MenuItem> items = menuItemService.findAllAvailable();
        List<MenuItemDto> itemDtos = items.stream()
            .map(MenuItemDto::fromEntity)
            .toList();
        return ResponseEntity.ok(ApiResponse.success(itemDtos));
    }
    
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all menu items including unavailable")
    public ResponseEntity<ApiResponse<Page<MenuItemDto>>> getAllMenuItemsAdmin(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        Page<MenuItem> items = menuItemService.findWithFilters(
            categoryId, available, search, pageable);
        Page<MenuItemDto> itemDtos = items.map(MenuItemDto::fromEntity);
        return ResponseEntity.ok(ApiResponse.success(itemDtos));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get menu item by ID")
    public ResponseEntity<ApiResponse<MenuItemDto>> getMenuItemById(@PathVariable Long id) {
        MenuItem item = menuItemService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(MenuItemDto.fromEntity(item)));
    }
    
    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get items by category")
    public ResponseEntity<ApiResponse<List<MenuItemDto>>> getItemsByCategory(
            @PathVariable Long categoryId) {
        List<MenuItem> items = menuItemService.findByCategory(categoryId);
        List<MenuItemDto> itemDtos = items.stream()
            .map(MenuItemDto::fromEntity)
            .toList();
        return ResponseEntity.ok(ApiResponse.success(itemDtos));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create menu item")
    public ResponseEntity<ApiResponse<MenuItemDto>> createMenuItem(
            @Valid @RequestBody MenuItemRequest request) {
        MenuItem item = menuItemService.create(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(MenuItemDto.fromEntity(item), "Menu item created"));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update menu item")
    public ResponseEntity<ApiResponse<MenuItemDto>> updateMenuItem(
            @PathVariable Long id,
            @Valid @RequestBody MenuItemRequest request) {
        MenuItem item = menuItemService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(MenuItemDto.fromEntity(item)));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete menu item")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
        menuItemService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Menu item deleted"));
    }
    
    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Toggle item availability")
    public ResponseEntity<ApiResponse<MenuItemDto>> toggleAvailability(@PathVariable Long id) {
        MenuItem item = menuItemService.toggleAvailability(id);
        return ResponseEntity.ok(ApiResponse.success(MenuItemDto.fromEntity(item)));
    }
    
    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Upload item image")
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        String imageUrl = menuItemService.uploadImage(id, file);
        return ResponseEntity.ok(ApiResponse.success(imageUrl, "Image uploaded"));
    }
}
```

---

## 5. TableController

```java
package com.restaurant.manager.controller;

import com.restaurant.manager.dto.request.TableRequest;
import com.restaurant.manager.dto.response.*;
import com.restaurant.manager.entity.RestaurantTable;
import com.restaurant.manager.entity.TableSession;
import com.restaurant.manager.enums.TableStatus;
import com.restaurant.manager.service.TableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
@Tag(name = "Tables", description = "Table management endpoints")
public class TableController {
    
    private final TableService tableService;
    
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "List all tables")
    public ResponseEntity<ApiResponse<List<TableDto>>> getAllTables() {
        List<RestaurantTable> tables = tableService.findAllWithDetails();
        List<TableDto> tableDtos = tables.stream()
            .map(TableDto::fromEntity)
            .toList();
        return ResponseEntity.ok(ApiResponse.success(tableDtos));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get table by ID")
    public ResponseEntity<ApiResponse<TableDto>> getTableById(@PathVariable UUID id) {
        RestaurantTable table = tableService.findByIdWithSession(id);
        return ResponseEntity.ok(ApiResponse.success(TableDto.fromEntity(table)));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create table")
    public ResponseEntity<ApiResponse<TableDto>> createTable(
            @Valid @RequestBody TableRequest request) {
        RestaurantTable table = tableService.create(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(TableDto.fromEntity(table), "Table created"));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update table")
    public ResponseEntity<ApiResponse<TableDto>> updateTable(
            @PathVariable UUID id,
            @Valid @RequestBody TableRequest request) {
        RestaurantTable table = tableService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(TableDto.fromEntity(table)));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete table")
    public ResponseEntity<ApiResponse<Void>> deleteTable(@PathVariable UUID id) {
        tableService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Table deleted"));
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('WAITER', 'ADMIN')")
    @Operation(summary = "Update table status")
    public ResponseEntity<ApiResponse<TableDto>> updateStatus(
            @PathVariable UUID id,
            @RequestParam TableStatus status) {
        RestaurantTable table = tableService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(TableDto.fromEntity(table)));
    }
    
    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('WAITER', 'ADMIN')")
    @Operation(summary = "Assign waiter to table")
    public ResponseEntity<ApiResponse<TableDto>> assignWaiter(
            @PathVariable UUID id,
            @RequestParam(required = false) Long waiterId) {
        RestaurantTable table = tableService.assignWaiter(id, waiterId);
        return ResponseEntity.ok(ApiResponse.success(TableDto.fromEntity(table)));
    }
    
    @GetMapping("/{id}/session")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current session for table")
    public ResponseEntity<ApiResponse<SessionDto>> getCurrentSession(@PathVariable UUID id) {
        TableSession session = tableService.getCurrentSession(id);
        if (session == null) {
            return ResponseEntity.ok(ApiResponse.success(null, "No active session"));
        }
        return ResponseEntity.ok(ApiResponse.success(SessionDto.fromEntity(session)));
    }
    
    @GetMapping("/free")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "List free tables")
    public ResponseEntity<ApiResponse<List<TableDto>>> getFreeTables() {
        List<RestaurantTable> tables = tableService.findFreeTables();
        List<TableDto> tableDtos = tables.stream()
            .map(TableDto::fromEntity)
            .toList();
        return ResponseEntity.ok(ApiResponse.success(tableDtos));
    }
}
```

---

## 6. SessionController

```java
package com.restaurant.manager.controller;

import com.restaurant.manager.dto.request.StartSessionRequest;
import com.restaurant.manager.dto.response.*;
import com.restaurant.manager.entity.TableSession;
import com.restaurant.manager.enums.PaymentMethod;
import com.restaurant.manager.service.SessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@Tag(name = "Sessions", description = "Table session endpoints")
public class SessionController {
    
    private final SessionService sessionService;
    
    @PostMapping("/start")
    @PreAuthorize("hasAnyRole('GUEST', 'WAITER')")
    @Operation(summary = "Start new session")
    public ResponseEntity<ApiResponse<SessionDto>> startSession(
            @Valid @RequestBody StartSessionRequest request) {
        TableSession session = sessionService.start(
            request.getTableId(), 
            request.getGuestId(), 
            request.getWaiterId()
        );
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(SessionDto.fromEntity(session), "Session started"));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get session details")
    public ResponseEntity<ApiResponse<SessionDto>> getSession(@PathVariable UUID id) {
        TableSession session = sessionService.findByIdWithDetails(id);
        return ResponseEntity.ok(ApiResponse.success(SessionDto.fromEntity(session)));
    }
    
    @PatchMapping("/{id}/end")
    @PreAuthorize("hasAnyRole('WAITER', 'ADMIN')")
    @Operation(summary = "End session")
    public ResponseEntity<ApiResponse<SessionDto>> endSession(@PathVariable UUID id) {
        TableSession session = sessionService.end(id);
        return ResponseEntity.ok(ApiResponse.success(SessionDto.fromEntity(session)));
    }
    
    @GetMapping("/{id}/bill")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get/Generate bill")
    public ResponseEntity<ApiResponse<BillDto>> getBill(@PathVariable UUID id) {
        TableSession session = sessionService.findByIdWithDetails(id);
        return ResponseEntity.ok(ApiResponse.success(BillDto.fromSession(session)));
    }
    
    @PostMapping("/{id}/pay")
    @PreAuthorize("hasAnyRole('WAITER', 'ADMIN')")
    @Operation(summary = "Mark session as paid")
    public ResponseEntity<ApiResponse<SessionDto>> markAsPaid(
            @PathVariable UUID id,
            @RequestParam PaymentMethod paymentMethod) {
        TableSession session = sessionService.markAsPaid(id, paymentMethod);
        return ResponseEntity.ok(ApiResponse.success(SessionDto.fromEntity(session)));
    }
}
```

---

## 7. OrderController

```java
package com.restaurant.manager.controller;

import com.restaurant.manager.dto.request.CreateOrderRequest;
import com.restaurant.manager.dto.response.*;
import com.restaurant.manager.entity.Order;
import com.restaurant.manager.enums.OrderStatus;
import com.restaurant.manager.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order management endpoints")
public class OrderController {
    
    private final OrderService orderService;
    
    @GetMapping
    @PreAuthorize("hasAnyRole('WAITER', 'ADMIN')")
    @Operation(summary = "List orders with filters")
    public ResponseEntity<ApiResponse<Page<OrderDto>>> getOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) UUID tableId,
            @RequestParam(required = false) Long waiterId,
            Pageable pageable) {
        Page<Order> orders = orderService.findWithFilters(status, tableId, waiterId, pageable);
        Page<OrderDto> orderDtos = orders.map(OrderDto::fromEntity);
        return ResponseEntity.ok(ApiResponse.success(orderDtos));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(@PathVariable UUID id) {
        Order order = orderService.findByIdWithDetails(id);
        return ResponseEntity.ok(ApiResponse.success(OrderDto.fromEntity(order)));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('GUEST', 'WAITER')")
    @Operation(summary = "Create new order")
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            @Valid @RequestBody CreateOrderRequest request) {
        Order order = orderService.create(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(OrderDto.fromEntity(order), "Order created"));
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('WAITER', 'ADMIN')")
    @Operation(summary = "Update order status")
    public ResponseEntity<ApiResponse<OrderDto>> updateStatus(
            @PathVariable UUID id,
            @RequestParam OrderStatus status) {
        Order order = orderService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(OrderDto.fromEntity(order)));
    }
    
    @PatchMapping("/{id}/confirm")
    @PreAuthorize("hasRole('WAITER')")
    @Operation(summary = "Confirm order")
    public ResponseEntity<ApiResponse<OrderDto>> confirmOrder(@PathVariable UUID id) {
        Order order = orderService.confirm(id);
        return ResponseEntity.ok(ApiResponse.success(OrderDto.fromEntity(order)));
    }
    
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('WAITER', 'ADMIN')")
    @Operation(summary = "Cancel order")
    public ResponseEntity<ApiResponse<OrderDto>> cancelOrder(@PathVariable UUID id) {
        Order order = orderService.cancel(id);
        return ResponseEntity.ok(ApiResponse.success(OrderDto.fromEntity(order)));
    }
    
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('WAITER', 'ADMIN')")
    @Operation(summary = "Get pending orders")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getPendingOrders() {
        List<Order> orders = orderService.getPending();
        List<OrderDto> orderDtos = orders.stream()
            .map(OrderDto::fromEntity)
            .toList();
        return ResponseEntity.ok(ApiResponse.success(orderDtos));
    }
    
    @GetMapping("/table/{tableId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get orders by table")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getOrdersByTable(
            @PathVariable UUID tableId) {
        List<Order> orders = orderService.findByTable(tableId);
        List<OrderDto> orderDtos = orders.stream()
            .map(OrderDto::fromEntity)
            .toList();
        return ResponseEntity.ok(ApiResponse.success(orderDtos));
    }
}
```

---

## Global Exception Handler

```java
package com.restaurant.manager.exception;

import com.restaurant.manager.dto.response.ApiResponse;
import com.restaurant.manager.dto.response.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(
            ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateResource(
            DuplicateResourceException ex) {
        log.warn("Duplicate resource: {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequest(
            BadRequestException ex) {
        log.warn("Bad request: {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorized(
            UnauthorizedException ex) {
        log.warn("Unauthorized: {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(
            AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());
        return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(ApiResponse.error("Access denied"));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationErrors(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        log.warn("Validation errors: {}", errors);
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.<Map<String, String>>builder()
                .success(false)
                .data(errors)
                .message("Validation failed")
                .build());
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
        log.error("Unexpected error: ", ex);
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error("An unexpected error occurred"));
    }
}
```

