# Entities - JPA/Hibernate Models

This document defines all JPA entities for the Restaurant Manager application.

---

## Base Entity (Abstract)

```java
package com.restaurant.manager.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@MappedSuperclass
@Getter
@Setter
public abstract class BaseEntity {
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

---

## 1. User Entity

```java
package com.restaurant.manager.entity;

import com.restaurant.manager.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_username", columnList = "username"),
    @Index(name = "idx_user_email", columnList = "email"),
    @Index(name = "idx_user_role", columnList = "role")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(nullable = false, unique = true, length = 50)
    private String username;
    
    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String password;
    
    @Email(message = "Invalid email format")
    @Column(unique = true, length = 100)
    private String email;
    
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100)
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    // Relationships
    @OneToMany(mappedBy = "assignedWaiter", fetch = FetchType.LAZY)
    private java.util.Set<RestaurantTable> assignedTables;
    
    @OneToMany(mappedBy = "waiter", fetch = FetchType.LAZY)
    private java.util.Set<TableSession> sessions;
}
```

### UserRole Enum

```java
package com.restaurant.manager.enums;

public enum UserRole {
    GUEST,
    WAITER,
    ADMIN
}
```

---

## 2. Category Entity

```java
package com.restaurant.manager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories", indexes = {
    @Index(name = "idx_category_name", columnList = "name"),
    @Index(name = "idx_category_sort", columnList = "sort_order")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Category name is required")
    @Size(min = 2, max = 100)
    @Column(nullable = false, unique = true, length = 100)
    private String name;
    
    @Size(max = 500)
    @Column(length = 500)
    private String description;
    
    @Column(length = 255)
    private String image;
    
    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    // Relationships
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<MenuItem> menuItems = new ArrayList<>();
}
```

---

## 3. MenuItem Entity

```java
package com.restaurant.manager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "menu_items", indexes = {
    @Index(name = "idx_menu_item_category", columnList = "category_id"),
    @Index(name = "idx_menu_item_available", columnList = "available"),
    @Index(name = "idx_menu_item_sort", columnList = "sort_order")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItem extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @NotBlank(message = "Item name is required")
    @Size(min = 2, max = 150)
    @Column(nullable = false, length = 150)
    private String name;
    
    @Size(max = 1000)
    @Column(length = 1000)
    private String description;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Digits(integer = 8, fraction = 2)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(length = 255)
    private String image;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean available = true;
    
    @Column(name = "preparation_time")
    private Integer preparationTime; // in minutes
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "JSON")
    private List<String> allergens;
    
    @Column(name = "is_vegetarian")
    @Builder.Default
    private Boolean isVegetarian = false;
    
    @Column(name = "is_vegan")
    @Builder.Default
    private Boolean isVegan = false;
    
    @Column(name = "is_gluten_free")
    @Builder.Default
    private Boolean isGlutenFree = false;
    
    private Integer calories;
    
    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;
}
```

---

## 4. RestaurantTable Entity

```java
package com.restaurant.manager.entity;

import com.restaurant.manager.enums.TableStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "restaurant_tables", indexes = {
    @Index(name = "idx_table_number", columnList = "table_number"),
    @Index(name = "idx_table_status", columnList = "status"),
    @Index(name = "idx_table_waiter", columnList = "assigned_waiter_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantTable extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @NotNull(message = "Table number is required")
    @Min(value = 1, message = "Table number must be at least 1")
    @Column(name = "table_number", nullable = false, unique = true)
    private Integer tableNumber;
    
    @Min(value = 1, message = "Capacity must be at least 1")
    @Column(nullable = false)
    @Builder.Default
    private Integer capacity = 4;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TableStatus status = TableStatus.FREE;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_waiter_id")
    private User assignedWaiter;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_session_id")
    private TableSession currentSession;
    
    @Column(length = 50)
    private String location; // indoor, outdoor, terrace
    
    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;
}
```

### TableStatus Enum

```java
package com.restaurant.manager.enums;

public enum TableStatus {
    FREE,       // Available for new guests
    WAITING,    // Guest seated, waiting to order
    TAKEN,      // Order placed, preparing
    SERVED,     // Food served
    FINISHED    // Guest finished, ready for bill
}
```

---

## 5. TableSession Entity

```java
package com.restaurant.manager.entity;

import com.restaurant.manager.enums.PaymentMethod;
import com.restaurant.manager.enums.SessionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "table_sessions", indexes = {
    @Index(name = "idx_session_table", columnList = "table_id"),
    @Index(name = "idx_session_status", columnList = "status"),
    @Index(name = "idx_session_bill_number", columnList = "bill_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TableSession extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id", nullable = false)
    private RestaurantTable table;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id")
    private User guest;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "waiter_id")
    private User waiter;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private SessionStatus status = SessionStatus.ACTIVE;
    
    @Column(name = "started_at", nullable = false)
    @Builder.Default
    private LocalDateTime startedAt = LocalDateTime.now();
    
    @Column(name = "ended_at")
    private LocalDateTime endedAt;
    
    @Column(name = "total_price_without_tax", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalPriceWithoutTax = BigDecimal.ZERO;
    
    @Column(name = "tax_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal taxAmount = BigDecimal.ZERO;
    
    @Column(name = "tax_rate", precision = 5, scale = 4)
    @Builder.Default
    private BigDecimal taxRate = new BigDecimal("0.20"); // 20% VAT
    
    @Column(name = "total_price_with_tax", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalPriceWithTax = BigDecimal.ZERO;
    
    @Column(length = 10)
    @Builder.Default
    private String currency = "€";
    
    @Column(name = "bill_number", unique = true, length = 50)
    private String billNumber;
    
    @Column(name = "printed_at")
    private LocalDateTime printedAt;
    
    @Column(name = "paid_at")
    private LocalDateTime paidAt;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 20)
    private PaymentMethod paymentMethod;
    
    @Column(length = 500)
    private String notes;
    
    // Relationships
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Order> orders = new ArrayList<>();
}
```

### SessionStatus Enum

```java
package com.restaurant.manager.enums;

public enum SessionStatus {
    ACTIVE,
    COMPLETED,
    CANCELLED
}
```

### PaymentMethod Enum

```java
package com.restaurant.manager.enums;

public enum PaymentMethod {
    CASH,
    CARD,
    OTHER
}
```

---

## 6. Order Entity

```java
package com.restaurant.manager.entity;

import com.restaurant.manager.enums.OrderStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_order_session", columnList = "session_id"),
    @Index(name = "idx_order_table", columnList = "table_id"),
    @Index(name = "idx_order_status", columnList = "status"),
    @Index(name = "idx_order_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private TableSession session;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id", nullable = false)
    private RestaurantTable table;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "waiter_id")
    private User waiter;
    
    @NotNull
    @Min(value = 1, message = "Round must be at least 1")
    @Column(nullable = false)
    private Integer round;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;
    
    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;
    
    @Column(length = 500)
    private String notes;
    
    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;
    
    @Column(name = "served_at")
    private LocalDateTime servedAt;
    
    // Relationships
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();
    
    // Helper method to add items
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
    
    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }
}
```

### OrderStatus Enum

```java
package com.restaurant.manager.enums;

public enum OrderStatus {
    PENDING,     // Order created, not yet confirmed
    CONFIRMED,   // Waiter confirmed the order
    PREPARING,   // Kitchen is preparing
    READY,       // Ready to serve
    SERVED,      // Served to customer
    CANCELLED    // Order cancelled
}
```

---

## 7. OrderItem Entity

```java
package com.restaurant.manager.entity;

import com.restaurant.manager.enums.OrderStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "order_items", indexes = {
    @Index(name = "idx_order_item_order", columnList = "order_id"),
    @Index(name = "idx_order_item_menu", columnList = "menu_item_id"),
    @Index(name = "idx_order_item_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem extends BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;
    
    @NotNull
    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(nullable = false)
    private Integer quantity;
    
    @NotNull
    @DecimalMin(value = "0.01")
    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;
    
    @NotNull
    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;
    
    @Column(length = 500)
    private String notes;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;
    
    // Calculate total price
    @PrePersist
    @PreUpdate
    public void calculateTotalPrice() {
        if (unitPrice != null && quantity != null) {
            this.totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
    }
}
```

---

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │
│─────────────│
│ id (PK)     │
│ username    │
│ password    │
│ email       │
│ fullName    │
│ role        │
│ isActive    │
└──────┬──────┘
       │
       │ 1:N (waiter)
       ▼
┌──────────────────┐      1:N      ┌─────────────────┐
│ RestaurantTable  │───────────────│  TableSession   │
│──────────────────│               │─────────────────│
│ id (PK, UUID)    │               │ id (PK, UUID)   │
│ tableNumber      │               │ table_id (FK)   │
│ capacity         │               │ guest_id (FK)   │
│ status           │               │ waiter_id (FK)  │
│ waiter_id (FK)   │               │ status          │
│ session_id (FK)  │               │ totals...       │
│ location         │               │ billNumber      │
└──────────────────┘               └────────┬────────┘
                                            │
                                            │ 1:N
                                            ▼
┌─────────────┐      N:1      ┌─────────────────┐
│  Category   │◄──────────────│     Order       │
│─────────────│               │─────────────────│
│ id (PK)     │               │ id (PK, UUID)   │
│ name        │               │ session_id (FK) │
│ description │               │ table_id (FK)   │
│ sortOrder   │               │ waiter_id (FK)  │
└──────┬──────┘               │ round           │
       │                      │ status          │
       │ 1:N                  │ subtotal        │
       ▼                      └────────┬────────┘
┌─────────────────┐                    │
│    MenuItem     │                    │ 1:N
│─────────────────│                    ▼
│ id (PK)         │◄──────────┌─────────────────┐
│ category_id(FK) │   N:1     │   OrderItem     │
│ name            │           │─────────────────│
│ price           │           │ id (PK, UUID)   │
│ available       │           │ order_id (FK)   │
│ allergens       │           │ menu_item_id(FK)│
└─────────────────┘           │ quantity        │
                              │ unitPrice       │
                              │ totalPrice      │
                              └─────────────────┘
```

---

## Hibernate Configuration Notes

### Fetching Strategy
- Use `FetchType.LAZY` by default to prevent N+1 queries
- Use `@EntityGraph` or `JOIN FETCH` in repositories for eager loading when needed

### Cascade Types
- `CascadeType.ALL` for parent-child relationships (Order → OrderItem)
- Be careful with cascading deletes

### Indexes
- Add indexes on frequently queried columns
- Add indexes on foreign key columns
- Add composite indexes for common query patterns

### UUID vs Auto-increment
- Use `UUID` for entities that might be exposed to clients (tables, sessions, orders)
- Use `Long` with auto-increment for internal entities (users, categories, menu items)

