# Services - Business Logic Layer

This document defines all service interfaces and implementations for the Restaurant Manager application.

---

## Service Architecture Pattern

```
Controller → Service Interface → Service Implementation → Repository
```

---

## 1. AuthService

### Interface

```java
package com.restaurant.manager.service;

import com.restaurant.manager.dto.request.LoginRequest;
import com.restaurant.manager.dto.request.RegisterRequest;
import com.restaurant.manager.dto.request.ChangePasswordRequest;
import com.restaurant.manager.dto.response.AuthResponse;
import com.restaurant.manager.entity.User;

public interface AuthService {
    
    AuthResponse login(LoginRequest request);
    
    User register(RegisterRequest request);
    
    void logout(String token);
    
    User validateToken(String token);
    
    AuthResponse refreshToken(String refreshToken);
    
    void changePassword(Long userId, ChangePasswordRequest request);
}
```

### Implementation

```java
package com.restaurant.manager.service.impl;

import com.restaurant.manager.dto.request.*;
import com.restaurant.manager.dto.response.AuthResponse;
import com.restaurant.manager.entity.User;
import com.restaurant.manager.enums.UserRole;
import com.restaurant.manager.exception.*;
import com.restaurant.manager.repository.UserRepository;
import com.restaurant.manager.security.JwtTokenProvider;
import com.restaurant.manager.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));
        
        if (!user.getIsActive()) {
            throw new UnauthorizedException("Account is deactivated");
        }
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }
        
        String token = jwtTokenProvider.generateToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);
        
        return AuthResponse.builder()
            .user(mapToUserDto(user))
            .token(token)
            .refreshToken(refreshToken)
            .expiresAt(jwtTokenProvider.getExpirationDate(token))
            .build();
    }
    
    @Override
    public User register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists");
        }
        
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }
        
        User user = User.builder()
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .email(request.getEmail())
            .fullName(request.getFullName())
            .role(request.getRole() != null ? request.getRole() : UserRole.GUEST)
            .isActive(true)
            .build();
        
        return userRepository.save(user);
    }
    
    @Override
    public void logout(String token) {
        // Add token to blacklist if implementing token invalidation
        jwtTokenProvider.invalidateToken(token);
    }
    
    @Override
    @Transactional(readOnly = true)
    public User validateToken(String token) {
        if (!jwtTokenProvider.validateToken(token)) {
            throw new UnauthorizedException("Invalid or expired token");
        }
        
        String username = jwtTokenProvider.getUsernameFromToken(token);
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UnauthorizedException("User not found"));
    }
    
    @Override
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }
        
        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UnauthorizedException("User not found"));
        
        String newToken = jwtTokenProvider.generateToken(user);
        
        return AuthResponse.builder()
            .user(mapToUserDto(user))
            .token(newToken)
            .refreshToken(refreshToken)
            .expiresAt(jwtTokenProvider.getExpirationDate(newToken))
            .build();
    }
    
    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    
    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole())
            .isActive(user.getIsActive())
            .build();
    }
}
```

---

## 2. UserService

### Interface

```java
package com.restaurant.manager.service;

import com.restaurant.manager.dto.request.CreateUserRequest;
import com.restaurant.manager.dto.request.UpdateUserRequest;
import com.restaurant.manager.entity.User;
import com.restaurant.manager.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    
    List<User> findAll();
    
    Page<User> findAll(Pageable pageable);
    
    User findById(Long id);
    
    User findByUsername(String username);
    
    User create(CreateUserRequest request);
    
    User update(Long id, UpdateUserRequest request);
    
    void delete(Long id);
    
    void activate(Long id);
    
    void deactivate(Long id);
    
    List<User> findByRole(UserRole role);
    
    List<User> getWaiters();
    
    List<User> searchUsers(String query);
}
```

### Implementation

```java
package com.restaurant.manager.service.impl;

import com.restaurant.manager.dto.request.CreateUserRequest;
import com.restaurant.manager.dto.request.UpdateUserRequest;
import com.restaurant.manager.entity.User;
import com.restaurant.manager.enums.UserRole;
import com.restaurant.manager.exception.*;
import com.restaurant.manager.repository.UserRepository;
import com.restaurant.manager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }
    
    @Override
    public User create(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists");
        }
        
        User user = User.builder()
            .username(request.getUsername())
            .password(passwordEncoder.encode(request.getPassword()))
            .email(request.getEmail())
            .fullName(request.getFullName())
            .role(request.getRole())
            .isActive(true)
            .build();
        
        return userRepository.save(user);
    }
    
    @Override
    public User update(Long id, UpdateUserRequest request) {
        User user = findById(id);
        
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException("Email already exists");
            }
            user.setEmail(request.getEmail());
        }
        
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        
        return userRepository.save(user);
    }
    
    @Override
    public void delete(Long id) {
        User user = findById(id);
        user.setIsActive(false); // Soft delete
        userRepository.save(user);
    }
    
    @Override
    public void activate(Long id) {
        User user = findById(id);
        user.setIsActive(true);
        userRepository.save(user);
    }
    
    @Override
    public void deactivate(Long id) {
        delete(id); // Same as soft delete
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> findByRole(UserRole role) {
        return userRepository.findByRoleAndIsActiveTrue(role);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> getWaiters() {
        return userRepository.findAllActiveWaiters();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> searchUsers(String query) {
        return userRepository.searchUsers(query);
    }
}
```

---

## 3. CategoryService

```java
package com.restaurant.manager.service.impl;

import com.restaurant.manager.dto.request.CategoryRequest;
import com.restaurant.manager.entity.Category;
import com.restaurant.manager.exception.*;
import com.restaurant.manager.repository.CategoryRepository;
import com.restaurant.manager.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<Category> findAll() {
        return categoryRepository.findAllByOrderBySortOrderAsc();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Category> findAllActive() {
        return categoryRepository.findByIsActiveTrueOrderBySortOrderAsc();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Category> findAllWithMenuItems() {
        return categoryRepository.findAllWithMenuItems();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Category findById(Long id) {
        return categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
    }
    
    @Override
    public Category create(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Category with this name already exists");
        }
        
        Integer maxOrder = categoryRepository.findMaxSortOrder();
        
        Category category = Category.builder()
            .name(request.getName())
            .description(request.getDescription())
            .image(request.getImage())
            .sortOrder(maxOrder + 1)
            .isActive(true)
            .build();
        
        return categoryRepository.save(category);
    }
    
    @Override
    public Category update(Long id, CategoryRequest request) {
        Category category = findById(id);
        
        if (!category.getName().equals(request.getName()) 
            && categoryRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Category with this name already exists");
        }
        
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImage(request.getImage());
        
        return categoryRepository.save(category);
    }
    
    @Override
    public void delete(Long id) {
        Category category = findById(id);
        category.setIsActive(false);
        categoryRepository.save(category);
    }
    
    @Override
    public void updateSortOrder(Long id, Integer sortOrder) {
        Category category = findById(id);
        category.setSortOrder(sortOrder);
        categoryRepository.save(category);
    }
}
```

---

## 4. MenuItemService

```java
package com.restaurant.manager.service.impl;

import com.restaurant.manager.dto.request.MenuItemRequest;
import com.restaurant.manager.entity.Category;
import com.restaurant.manager.entity.MenuItem;
import com.restaurant.manager.exception.*;
import com.restaurant.manager.repository.CategoryRepository;
import com.restaurant.manager.repository.MenuItemRepository;
import com.restaurant.manager.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MenuItemServiceImpl implements MenuItemService {
    
    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;
    
    @Override
    @Transactional(readOnly = true)
    public List<MenuItem> findAll() {
        return menuItemRepository.findAllWithCategory();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<MenuItem> findAllAvailable() {
        return menuItemRepository.findAllAvailableWithCategory();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<MenuItem> findWithFilters(Long categoryId, Boolean available, 
                                          String search, Pageable pageable) {
        return menuItemRepository.findWithFilters(categoryId, available, search, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public MenuItem findById(Long id) {
        return menuItemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<MenuItem> findByCategory(Long categoryId) {
        return menuItemRepository.findByCategoryIdAndAvailableTrueOrderBySortOrderAsc(categoryId);
    }
    
    @Override
    public MenuItem create(MenuItemRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
        
        MenuItem menuItem = MenuItem.builder()
            .category(category)
            .name(request.getName())
            .description(request.getDescription())
            .price(request.getPrice())
            .image(request.getImage())
            .available(request.getAvailable() != null ? request.getAvailable() : true)
            .preparationTime(request.getPreparationTime())
            .allergens(request.getAllergens())
            .isVegetarian(request.getIsVegetarian())
            .isVegan(request.getIsVegan())
            .isGlutenFree(request.getIsGlutenFree())
            .calories(request.getCalories())
            .sortOrder(0)
            .build();
        
        return menuItemRepository.save(menuItem);
    }
    
    @Override
    public MenuItem update(Long id, MenuItemRequest request) {
        MenuItem menuItem = findById(id);
        
        if (request.getCategoryId() != null && 
            !request.getCategoryId().equals(menuItem.getCategory().getId())) {
            Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            menuItem.setCategory(category);
        }
        
        if (request.getName() != null) menuItem.setName(request.getName());
        if (request.getDescription() != null) menuItem.setDescription(request.getDescription());
        if (request.getPrice() != null) menuItem.setPrice(request.getPrice());
        if (request.getImage() != null) menuItem.setImage(request.getImage());
        if (request.getAvailable() != null) menuItem.setAvailable(request.getAvailable());
        if (request.getPreparationTime() != null) menuItem.setPreparationTime(request.getPreparationTime());
        if (request.getAllergens() != null) menuItem.setAllergens(request.getAllergens());
        if (request.getIsVegetarian() != null) menuItem.setIsVegetarian(request.getIsVegetarian());
        if (request.getIsVegan() != null) menuItem.setIsVegan(request.getIsVegan());
        if (request.getIsGlutenFree() != null) menuItem.setIsGlutenFree(request.getIsGlutenFree());
        if (request.getCalories() != null) menuItem.setCalories(request.getCalories());
        
        return menuItemRepository.save(menuItem);
    }
    
    @Override
    public void delete(Long id) {
        MenuItem menuItem = findById(id);
        menuItemRepository.delete(menuItem);
    }
    
    @Override
    public MenuItem toggleAvailability(Long id) {
        MenuItem menuItem = findById(id);
        menuItem.setAvailable(!menuItem.getAvailable());
        return menuItemRepository.save(menuItem);
    }
    
    @Override
    public String uploadImage(Long id, MultipartFile file) {
        MenuItem menuItem = findById(id);
        String imageUrl = fileStorageService.storeFile(file, "menu-items");
        menuItem.setImage(imageUrl);
        menuItemRepository.save(menuItem);
        return imageUrl;
    }
}
```

---

## 5. TableService

```java
package com.restaurant.manager.service.impl;

import com.restaurant.manager.dto.request.TableRequest;
import com.restaurant.manager.entity.RestaurantTable;
import com.restaurant.manager.entity.TableSession;
import com.restaurant.manager.entity.User;
import com.restaurant.manager.enums.TableStatus;
import com.restaurant.manager.exception.*;
import com.restaurant.manager.repository.TableRepository;
import com.restaurant.manager.repository.UserRepository;
import com.restaurant.manager.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TableServiceImpl implements TableService {
    
    private final TableRepository tableRepository;
    private final UserRepository userRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<RestaurantTable> findAll() {
        return tableRepository.findByIsActiveTrueOrderByTableNumberAsc();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RestaurantTable> findAllWithDetails() {
        return tableRepository.findAllWithDetails();
    }
    
    @Override
    @Transactional(readOnly = true)
    public RestaurantTable findById(UUID id) {
        return tableRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Table", "id", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public RestaurantTable findByIdWithSession(UUID id) {
        return tableRepository.findByIdWithSession(id)
            .orElseThrow(() -> new ResourceNotFoundException("Table", "id", id));
    }
    
    @Override
    public RestaurantTable create(TableRequest request) {
        if (tableRepository.existsByTableNumber(request.getTableNumber())) {
            throw new DuplicateResourceException("Table with this number already exists");
        }
        
        RestaurantTable table = RestaurantTable.builder()
            .tableNumber(request.getTableNumber())
            .capacity(request.getCapacity() != null ? request.getCapacity() : 4)
            .location(request.getLocation())
            .status(TableStatus.FREE)
            .isActive(true)
            .build();
        
        return tableRepository.save(table);
    }
    
    @Override
    public RestaurantTable update(UUID id, TableRequest request) {
        RestaurantTable table = findById(id);
        
        if (!table.getTableNumber().equals(request.getTableNumber()) 
            && tableRepository.existsByTableNumber(request.getTableNumber())) {
            throw new DuplicateResourceException("Table with this number already exists");
        }
        
        table.setTableNumber(request.getTableNumber());
        if (request.getCapacity() != null) table.setCapacity(request.getCapacity());
        if (request.getLocation() != null) table.setLocation(request.getLocation());
        
        return tableRepository.save(table);
    }
    
    @Override
    public void delete(UUID id) {
        RestaurantTable table = findById(id);
        
        if (table.getStatus() != TableStatus.FREE) {
            throw new BadRequestException("Cannot delete table with active session");
        }
        
        table.setIsActive(false);
        tableRepository.save(table);
    }
    
    @Override
    public RestaurantTable updateStatus(UUID id, TableStatus status) {
        RestaurantTable table = findById(id);
        table.setStatus(status);
        return tableRepository.save(table);
    }
    
    @Override
    public RestaurantTable assignWaiter(UUID tableId, Long waiterId) {
        RestaurantTable table = findById(tableId);
        
        if (waiterId != null) {
            User waiter = userRepository.findById(waiterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", waiterId));
            table.setAssignedWaiter(waiter);
        } else {
            table.setAssignedWaiter(null);
        }
        
        return tableRepository.save(table);
    }
    
    @Override
    @Transactional(readOnly = true)
    public TableSession getCurrentSession(UUID tableId) {
        RestaurantTable table = findByIdWithSession(tableId);
        return table.getCurrentSession();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RestaurantTable> findByStatus(TableStatus status) {
        return tableRepository.findByStatusAndIsActiveTrue(status);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RestaurantTable> findFreeTables() {
        return tableRepository.findFreeTables();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RestaurantTable> findByWaiter(Long waiterId) {
        return tableRepository.findByAssignedWaiterIdAndIsActiveTrue(waiterId);
    }
}
```

---

## 6. SessionService

```java
package com.restaurant.manager.service.impl;

import com.restaurant.manager.entity.*;
import com.restaurant.manager.enums.*;
import com.restaurant.manager.exception.*;
import com.restaurant.manager.repository.*;
import com.restaurant.manager.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SessionServiceImpl implements SessionService {
    
    private final TableSessionRepository sessionRepository;
    private final TableRepository tableRepository;
    private final UserRepository userRepository;
    
    @Override
    public TableSession start(UUID tableId, Long guestId, Long waiterId) {
        RestaurantTable table = tableRepository.findById(tableId)
            .orElseThrow(() -> new ResourceNotFoundException("Table", "id", tableId));
        
        if (table.getStatus() != TableStatus.FREE) {
            throw new BadRequestException("Table is not available");
        }
        
        User guest = guestId != null ? userRepository.findById(guestId).orElse(null) : null;
        User waiter = waiterId != null ? userRepository.findById(waiterId).orElse(null) : null;
        
        TableSession session = TableSession.builder()
            .table(table)
            .guest(guest)
            .waiter(waiter != null ? waiter : table.getAssignedWaiter())
            .status(SessionStatus.ACTIVE)
            .startedAt(LocalDateTime.now())
            .taxRate(new BigDecimal("0.20"))
            .currency("€")
            .build();
        
        session = sessionRepository.save(session);
        
        // Update table status and session reference
        table.setStatus(TableStatus.WAITING);
        table.setCurrentSession(session);
        tableRepository.save(table);
        
        return session;
    }
    
    @Override
    @Transactional(readOnly = true)
    public TableSession findById(UUID id) {
        return sessionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Session", "id", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public TableSession findByIdWithDetails(UUID id) {
        return sessionRepository.findByIdWithDetails(id)
            .orElseThrow(() -> new ResourceNotFoundException("Session", "id", id));
    }
    
    @Override
    public TableSession end(UUID id) {
        TableSession session = findById(id);
        
        if (session.getStatus() != SessionStatus.ACTIVE) {
            throw new BadRequestException("Session is not active");
        }
        
        // Calculate final totals
        calculateTotals(session);
        
        // Generate bill number if not exists
        if (session.getBillNumber() == null) {
            session.setBillNumber(generateBillNumber());
        }
        
        session.setStatus(SessionStatus.COMPLETED);
        session.setEndedAt(LocalDateTime.now());
        
        // Update table status
        RestaurantTable table = session.getTable();
        table.setStatus(TableStatus.FINISHED);
        tableRepository.save(table);
        
        return sessionRepository.save(session);
    }
    
    @Override
    public void calculateTotals(TableSession session) {
        BigDecimal subtotal = session.getOrders().stream()
            .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
            .map(Order::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal taxAmount = subtotal.multiply(session.getTaxRate())
            .setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(taxAmount);
        
        session.setTotalPriceWithoutTax(subtotal);
        session.setTaxAmount(taxAmount);
        session.setTotalPriceWithTax(total);
    }
    
    @Override
    public String generateBillNumber() {
        String prefix = "BILL-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-";
        Integer sequence = sessionRepository.getNextBillSequence(prefix);
        return prefix + String.format("%04d", sequence);
    }
    
    @Override
    public TableSession markAsPaid(UUID id, PaymentMethod paymentMethod) {
        TableSession session = findById(id);
        
        if (session.getStatus() != SessionStatus.COMPLETED) {
            throw new BadRequestException("Session must be completed before payment");
        }
        
        session.setPaidAt(LocalDateTime.now());
        session.setPaymentMethod(paymentMethod);
        
        // Free up the table
        RestaurantTable table = session.getTable();
        table.setStatus(TableStatus.FREE);
        table.setCurrentSession(null);
        tableRepository.save(table);
        
        return sessionRepository.save(session);
    }
}
```

---

## 7. OrderService

```java
package com.restaurant.manager.service.impl;

import com.restaurant.manager.dto.request.CreateOrderRequest;
import com.restaurant.manager.entity.*;
import com.restaurant.manager.enums.*;
import com.restaurant.manager.exception.*;
import com.restaurant.manager.repository.*;
import com.restaurant.manager.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final TableSessionRepository sessionRepository;
    private final TableRepository tableRepository;
    private final MenuItemRepository menuItemRepository;
    
    @Override
    @Transactional(readOnly = true)
    public List<Order> findBySession(UUID sessionId) {
        return orderRepository.findBySessionIdOrderByRoundAsc(sessionId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Order> findByTable(UUID tableId) {
        return orderRepository.findByTableIdOrderByCreatedAtDesc(tableId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Order findById(UUID id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
    }
    
    @Override
    @Transactional(readOnly = true)
    public Order findByIdWithDetails(UUID id) {
        return orderRepository.findByIdWithDetails(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
    }
    
    @Override
    public Order create(CreateOrderRequest request) {
        TableSession session = sessionRepository.findById(request.getSessionId())
            .orElseThrow(() -> new ResourceNotFoundException("Session", "id", request.getSessionId()));
        
        if (session.getStatus() != SessionStatus.ACTIVE) {
            throw new BadRequestException("Session is not active");
        }
        
        RestaurantTable table = session.getTable();
        Integer nextRound = orderRepository.getNextRound(session.getId());
        
        Order order = Order.builder()
            .session(session)
            .table(table)
            .waiter(session.getWaiter())
            .round(nextRound)
            .status(OrderStatus.PENDING)
            .notes(request.getNotes())
            .build();
        
        BigDecimal subtotal = BigDecimal.ZERO;
        
        for (var itemRequest : request.getItems()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", itemRequest.getMenuItemId()));
            
            if (!menuItem.getAvailable()) {
                throw new BadRequestException("Item '" + menuItem.getName() + "' is not available");
            }
            
            OrderItem orderItem = OrderItem.builder()
                .menuItem(menuItem)
                .quantity(itemRequest.getQuantity())
                .unitPrice(menuItem.getPrice())
                .totalPrice(menuItem.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())))
                .notes(itemRequest.getNotes())
                .status(OrderStatus.PENDING)
                .build();
            
            order.addItem(orderItem);
            subtotal = subtotal.add(orderItem.getTotalPrice());
        }
        
        order.setSubtotal(subtotal);
        
        // Update table status
        table.setStatus(TableStatus.TAKEN);
        tableRepository.save(table);
        
        return orderRepository.save(order);
    }
    
    @Override
    public Order confirm(UUID id) {
        Order order = findById(id);
        
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Only pending orders can be confirmed");
        }
        
        order.setStatus(OrderStatus.CONFIRMED);
        order.setConfirmedAt(LocalDateTime.now());
        
        // Update all items status
        order.getItems().forEach(item -> item.setStatus(OrderStatus.CONFIRMED));
        
        return orderRepository.save(order);
    }
    
    @Override
    public Order updateStatus(UUID id, OrderStatus status) {
        Order order = findById(id);
        order.setStatus(status);
        
        if (status == OrderStatus.SERVED) {
            order.setServedAt(LocalDateTime.now());
            
            // Update table status
            RestaurantTable table = order.getTable();
            table.setStatus(TableStatus.SERVED);
            tableRepository.save(table);
        }
        
        return orderRepository.save(order);
    }
    
    @Override
    public Order cancel(UUID id) {
        Order order = findById(id);
        
        if (order.getStatus() == OrderStatus.SERVED) {
            throw new BadRequestException("Cannot cancel served order");
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        order.getItems().forEach(item -> item.setStatus(OrderStatus.CANCELLED));
        
        return orderRepository.save(order);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Order> getPending() {
        return orderRepository.findActiveOrders();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<Order> findWithFilters(OrderStatus status, UUID tableId, 
                                       Long waiterId, Pageable pageable) {
        return orderRepository.findWithFilters(status, tableId, waiterId, pageable);
    }
}
```

---

## Service Best Practices

### 1. Transaction Management
- Use `@Transactional` at class level for write operations
- Use `@Transactional(readOnly = true)` for read-only methods

### 2. Exception Handling
- Throw specific business exceptions
- Let GlobalExceptionHandler handle them

### 3. Validation
- Validate business rules in service layer
- Use DTOs for input validation (with Bean Validation)

### 4. Logging
```java
@Slf4j
@Service
public class OrderServiceImpl {
    
    @Override
    public Order create(CreateOrderRequest request) {
        log.info("Creating order for session: {}", request.getSessionId());
        // ... implementation
        log.debug("Order created with {} items", request.getItems().size());
    }
}
```

