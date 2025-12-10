# Repositories - Spring Data JPA

This document defines all repository interfaces for the Restaurant Manager application.

---

## Base Repository Pattern

All repositories extend `JpaRepository` which provides standard CRUD operations.

---

## 1. UserRepository

```java
package com.restaurant.manager.repository;

import com.restaurant.manager.entity.User;
import com.restaurant.manager.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find by username (for authentication)
    Optional<User> findByUsername(String username);
    
    // Find by email
    Optional<User> findByEmail(String email);
    
    // Check if username exists
    boolean existsByUsername(String username);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Find all users by role
    List<User> findByRole(UserRole role);
    
    // Find all active users
    List<User> findByIsActiveTrue();
    
    // Find all active users by role
    List<User> findByRoleAndIsActiveTrue(UserRole role);
    
    // Find waiters (commonly used)
    @Query("SELECT u FROM User u WHERE u.role = 'WAITER' AND u.isActive = true ORDER BY u.fullName")
    List<User> findAllActiveWaiters();
    
    // Search users by name or username
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<User> searchUsers(@Param("search") String search);
    
    // Count users by role
    long countByRole(UserRole role);
}
```

---

## 2. CategoryRepository

```java
package com.restaurant.manager.repository;

import com.restaurant.manager.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    // Find by name
    Optional<Category> findByName(String name);
    
    // Check if name exists
    boolean existsByName(String name);
    
    // Find all active categories ordered by sortOrder
    List<Category> findByIsActiveTrueOrderBySortOrderAsc();
    
    // Find all categories ordered by sortOrder
    List<Category> findAllByOrderBySortOrderAsc();
    
    // Find categories with menu items (eager fetch)
    @Query("SELECT DISTINCT c FROM Category c " +
           "LEFT JOIN FETCH c.menuItems m " +
           "WHERE c.isActive = true " +
           "ORDER BY c.sortOrder")
    List<Category> findAllWithMenuItems();
    
    // Find max sort order for new category positioning
    @Query("SELECT COALESCE(MAX(c.sortOrder), 0) FROM Category c")
    Integer findMaxSortOrder();
}
```

---

## 3. MenuItemRepository

```java
package com.restaurant.manager.repository;

import com.restaurant.manager.entity.MenuItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long>, 
                                            JpaSpecificationExecutor<MenuItem> {
    
    // Find all available items
    List<MenuItem> findByAvailableTrue();
    
    // Find by category ID
    List<MenuItem> findByCategoryIdOrderBySortOrderAsc(Long categoryId);
    
    // Find available items by category
    List<MenuItem> findByCategoryIdAndAvailableTrueOrderBySortOrderAsc(Long categoryId);
    
    // Find all items with category (eager fetch)
    @Query("SELECT m FROM MenuItem m JOIN FETCH m.category ORDER BY m.category.sortOrder, m.sortOrder")
    List<MenuItem> findAllWithCategory();
    
    // Find available items with category
    @Query("SELECT m FROM MenuItem m JOIN FETCH m.category " +
           "WHERE m.available = true " +
           "ORDER BY m.category.sortOrder, m.sortOrder")
    List<MenuItem> findAllAvailableWithCategory();
    
    // Search items by name or description
    @Query("SELECT m FROM MenuItem m " +
           "WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(m.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<MenuItem> searchItems(@Param("search") String search);
    
    // Search with pagination
    @Query("SELECT m FROM MenuItem m JOIN FETCH m.category " +
           "WHERE (:categoryId IS NULL OR m.category.id = :categoryId) " +
           "AND (:available IS NULL OR m.available = :available) " +
           "AND (:search IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<MenuItem> findWithFilters(
        @Param("categoryId") Long categoryId,
        @Param("available") Boolean available,
        @Param("search") String search,
        Pageable pageable
    );
    
    // Toggle availability
    @Modifying
    @Query("UPDATE MenuItem m SET m.available = NOT m.available WHERE m.id = :id")
    int toggleAvailability(@Param("id") Long id);
    
    // Find vegetarian items
    List<MenuItem> findByIsVegetarianTrueAndAvailableTrue();
    
    // Find vegan items
    List<MenuItem> findByIsVeganTrueAndAvailableTrue();
    
    // Find gluten-free items
    List<MenuItem> findByIsGlutenFreeTrueAndAvailableTrue();
    
    // Count items by category
    long countByCategoryId(Long categoryId);
}
```

---

## 4. TableRepository

```java
package com.restaurant.manager.repository;

import com.restaurant.manager.entity.RestaurantTable;
import com.restaurant.manager.enums.TableStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TableRepository extends JpaRepository<RestaurantTable, UUID> {
    
    // Find by table number
    Optional<RestaurantTable> findByTableNumber(Integer tableNumber);
    
    // Check if table number exists
    boolean existsByTableNumber(Integer tableNumber);
    
    // Find all active tables ordered by number
    List<RestaurantTable> findByIsActiveTrueOrderByTableNumberAsc();
    
    // Find tables by status
    List<RestaurantTable> findByStatusAndIsActiveTrue(TableStatus status);
    
    // Find free tables
    @Query("SELECT t FROM RestaurantTable t " +
           "WHERE t.status = 'FREE' AND t.isActive = true " +
           "ORDER BY t.tableNumber")
    List<RestaurantTable> findFreeTables();
    
    // Find tables assigned to waiter
    List<RestaurantTable> findByAssignedWaiterIdAndIsActiveTrue(Long waiterId);
    
    // Find tables by location
    List<RestaurantTable> findByLocationAndIsActiveTrue(String location);
    
    // Find table with current session (eager fetch)
    @EntityGraph(attributePaths = {"currentSession", "assignedWaiter"})
    @Query("SELECT t FROM RestaurantTable t WHERE t.id = :id")
    Optional<RestaurantTable> findByIdWithSession(@Param("id") UUID id);
    
    // Find all tables with sessions and waiters
    @EntityGraph(attributePaths = {"currentSession", "assignedWaiter"})
    @Query("SELECT t FROM RestaurantTable t WHERE t.isActive = true ORDER BY t.tableNumber")
    List<RestaurantTable> findAllWithDetails();
    
    // Count tables by status
    long countByStatusAndIsActiveTrue(TableStatus status);
    
    // Find occupied tables (not FREE)
    @Query("SELECT t FROM RestaurantTable t " +
           "WHERE t.status != 'FREE' AND t.isActive = true " +
           "ORDER BY t.tableNumber")
    List<RestaurantTable> findOccupiedTables();
}
```

---

## 5. TableSessionRepository

```java
package com.restaurant.manager.repository;

import com.restaurant.manager.entity.TableSession;
import com.restaurant.manager.enums.SessionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TableSessionRepository extends JpaRepository<TableSession, UUID> {
    
    // Find active session for table
    Optional<TableSession> findByTableIdAndStatus(UUID tableId, SessionStatus status);
    
    // Find current active session for table
    @Query("SELECT s FROM TableSession s WHERE s.table.id = :tableId AND s.status = 'ACTIVE'")
    Optional<TableSession> findActiveSessionByTableId(@Param("tableId") UUID tableId);
    
    // Find session with orders (eager fetch)
    @EntityGraph(attributePaths = {"orders", "orders.items", "table", "waiter"})
    @Query("SELECT s FROM TableSession s WHERE s.id = :id")
    Optional<TableSession> findByIdWithDetails(@Param("id") UUID id);
    
    // Find sessions by waiter
    List<TableSession> findByWaiterIdAndStatus(Long waiterId, SessionStatus status);
    
    // Find sessions by date range
    @Query("SELECT s FROM TableSession s " +
           "WHERE s.startedAt BETWEEN :startDate AND :endDate " +
           "ORDER BY s.startedAt DESC")
    List<TableSession> findByDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    // Find completed sessions (for billing/reports)
    Page<TableSession> findByStatusOrderByEndedAtDesc(SessionStatus status, Pageable pageable);
    
    // Find by bill number
    Optional<TableSession> findByBillNumber(String billNumber);
    
    // Generate bill number
    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(s.billNumber, 9) AS integer)), 0) + 1 " +
           "FROM TableSession s " +
           "WHERE s.billNumber LIKE :prefix%")
    Integer getNextBillSequence(@Param("prefix") String prefix);
    
    // Daily revenue
    @Query("SELECT COALESCE(SUM(s.totalPriceWithTax), 0) FROM TableSession s " +
           "WHERE s.paidAt BETWEEN :startOfDay AND :endOfDay")
    java.math.BigDecimal getDailyRevenue(
        @Param("startOfDay") LocalDateTime startOfDay,
        @Param("endOfDay") LocalDateTime endOfDay
    );
    
    // Count sessions by status
    long countByStatus(SessionStatus status);
    
    // Find unpaid completed sessions
    @Query("SELECT s FROM TableSession s " +
           "WHERE s.status = 'COMPLETED' AND s.paidAt IS NULL " +
           "ORDER BY s.endedAt DESC")
    List<TableSession> findUnpaidSessions();
}
```

---

## 6. OrderRepository

```java
package com.restaurant.manager.repository;

import com.restaurant.manager.entity.Order;
import com.restaurant.manager.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    
    // Find orders by session
    List<Order> findBySessionIdOrderByRoundAsc(UUID sessionId);
    
    // Find orders by table
    List<Order> findByTableIdOrderByCreatedAtDesc(UUID tableId);
    
    // Find orders by status
    List<Order> findByStatusOrderByCreatedAtAsc(OrderStatus status);
    
    // Find pending orders (for kitchen display)
    @Query("SELECT o FROM Order o " +
           "WHERE o.status IN ('PENDING', 'CONFIRMED', 'PREPARING') " +
           "ORDER BY o.createdAt ASC")
    List<Order> findActiveOrders();
    
    // Find order with items (eager fetch)
    @EntityGraph(attributePaths = {"items", "items.menuItem", "table", "waiter"})
    @Query("SELECT o FROM Order o WHERE o.id = :id")
    Optional<Order> findByIdWithDetails(@Param("id") UUID id);
    
    // Find orders by waiter
    List<Order> findByWaiterIdAndStatusIn(Long waiterId, List<OrderStatus> statuses);
    
    // Get next round number for session
    @Query("SELECT COALESCE(MAX(o.round), 0) + 1 FROM Order o WHERE o.session.id = :sessionId")
    Integer getNextRound(@Param("sessionId") UUID sessionId);
    
    // Find orders with filters (paginated)
    @Query("SELECT o FROM Order o " +
           "WHERE (:status IS NULL OR o.status = :status) " +
           "AND (:tableId IS NULL OR o.table.id = :tableId) " +
           "AND (:waiterId IS NULL OR o.waiter.id = :waiterId) " +
           "ORDER BY o.createdAt DESC")
    Page<Order> findWithFilters(
        @Param("status") OrderStatus status,
        @Param("tableId") UUID tableId,
        @Param("waiterId") Long waiterId,
        Pageable pageable
    );
    
    // Find orders created in date range
    List<Order> findByCreatedAtBetweenOrderByCreatedAtDesc(
        LocalDateTime start, 
        LocalDateTime end
    );
    
    // Count orders by status
    long countByStatus(OrderStatus status);
    
    // Count orders for session
    long countBySessionId(UUID sessionId);
    
    // Find orders ready to serve
    @Query("SELECT o FROM Order o " +
           "JOIN FETCH o.table t " +
           "WHERE o.status = 'READY' " +
           "ORDER BY o.updatedAt ASC")
    List<Order> findReadyToServe();
}
```

---

## 7. OrderItemRepository

```java
package com.restaurant.manager.repository;

import com.restaurant.manager.entity.OrderItem;
import com.restaurant.manager.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {
    
    // Find items by order
    List<OrderItem> findByOrderId(UUID orderId);
    
    // Find items by status
    List<OrderItem> findByStatus(OrderStatus status);
    
    // Find items by menu item (for analytics)
    List<OrderItem> findByMenuItemId(Long menuItemId);
    
    // Update item status
    @Modifying
    @Query("UPDATE OrderItem oi SET oi.status = :status WHERE oi.id = :id")
    int updateStatus(@Param("id") UUID id, @Param("status") OrderStatus status);
    
    // Find pending items for kitchen
    @Query("SELECT oi FROM OrderItem oi " +
           "JOIN FETCH oi.menuItem m " +
           "JOIN FETCH oi.order o " +
           "WHERE oi.status IN ('PENDING', 'CONFIRMED', 'PREPARING') " +
           "ORDER BY o.createdAt ASC, oi.createdAt ASC")
    List<OrderItem> findPendingItems();
    
    // Get popular items (for analytics)
    @Query("SELECT oi.menuItem.id, oi.menuItem.name, SUM(oi.quantity) as totalQuantity " +
           "FROM OrderItem oi " +
           "WHERE oi.createdAt BETWEEN :startDate AND :endDate " +
           "AND oi.status != 'CANCELLED' " +
           "GROUP BY oi.menuItem.id, oi.menuItem.name " +
           "ORDER BY totalQuantity DESC")
    List<Object[]> findPopularItems(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    // Count items by menu item
    @Query("SELECT COUNT(oi) FROM OrderItem oi " +
           "WHERE oi.menuItem.id = :menuItemId AND oi.status != 'CANCELLED'")
    long countByMenuItemId(@Param("menuItemId") Long menuItemId);
    
    // Delete items by order (when order is cancelled)
    @Modifying
    @Query("DELETE FROM OrderItem oi WHERE oi.order.id = :orderId")
    void deleteByOrderId(@Param("orderId") UUID orderId);
}
```

---

## Custom Repository Implementation Example

For complex queries, create custom implementations:

```java
// Interface
public interface CustomOrderRepository {
    List<Order> findOrdersWithComplexFilters(OrderFilterCriteria criteria);
}

// Implementation
@Repository
public class CustomOrderRepositoryImpl implements CustomOrderRepository {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public List<Order> findOrdersWithComplexFilters(OrderFilterCriteria criteria) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Order> query = cb.createQuery(Order.class);
        Root<Order> order = query.from(Order.class);
        
        List<Predicate> predicates = new ArrayList<>();
        
        if (criteria.getStatus() != null) {
            predicates.add(cb.equal(order.get("status"), criteria.getStatus()));
        }
        
        if (criteria.getTableId() != null) {
            predicates.add(cb.equal(order.get("table").get("id"), criteria.getTableId()));
        }
        
        if (criteria.getStartDate() != null) {
            predicates.add(cb.greaterThanOrEqualTo(
                order.get("createdAt"), criteria.getStartDate()));
        }
        
        query.where(predicates.toArray(new Predicate[0]));
        query.orderBy(cb.desc(order.get("createdAt")));
        
        return entityManager.createQuery(query).getResultList();
    }
}
```

---

## Repository Best Practices

### 1. Use @EntityGraph for Eager Loading
```java
@EntityGraph(attributePaths = {"items", "items.menuItem"})
Optional<Order> findByIdWithItems(UUID id);
```

### 2. Use Projections for Read-Only Data
```java
public interface OrderSummary {
    UUID getId();
    Integer getRound();
    OrderStatus getStatus();
    BigDecimal getSubtotal();
}

List<OrderSummary> findBySessionId(UUID sessionId);
```

### 3. Use @Modifying for Update/Delete
```java
@Modifying
@Query("UPDATE MenuItem m SET m.available = :available WHERE m.id = :id")
int updateAvailability(@Param("id") Long id, @Param("available") boolean available);
```

### 4. Use Pagination
```java
Page<Order> findByStatus(OrderStatus status, Pageable pageable);
```

### 5. Use Specification for Dynamic Queries
```java
public interface MenuItemRepository extends JpaRepository<MenuItem, Long>,
                                            JpaSpecificationExecutor<MenuItem> {}

// Usage
Specification<MenuItem> spec = (root, query, cb) -> {
    List<Predicate> predicates = new ArrayList<>();
    if (categoryId != null) {
        predicates.add(cb.equal(root.get("category").get("id"), categoryId));
    }
    return cb.and(predicates.toArray(new Predicate[0]));
};
menuItemRepository.findAll(spec, pageable);
```

