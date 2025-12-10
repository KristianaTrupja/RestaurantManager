# Restaurant Manager - Spring Boot Backend Documentation

## Overview

This documentation provides a comprehensive guide for implementing the Restaurant Manager backend using **Spring Boot 3.x** with **Hibernate/JPA** integration and **MySQL** database.

## Project Structure

```
src/main/java/com/restaurant/manager/
├── config/                    # Configuration classes
│   ├── SecurityConfig.java
│   ├── JwtConfig.java
│   ├── CorsConfig.java
│   └── WebSocketConfig.java
├── controller/                # REST Controllers
│   ├── AuthController.java
│   ├── UserController.java
│   ├── CategoryController.java
│   ├── MenuItemController.java
│   ├── TableController.java
│   ├── SessionController.java
│   ├── OrderController.java
│   └── BillController.java
├── dto/                       # Data Transfer Objects
│   ├── request/
│   └── response/
├── entity/                    # JPA Entities
│   ├── User.java
│   ├── Category.java
│   ├── MenuItem.java
│   ├── RestaurantTable.java
│   ├── TableSession.java
│   ├── Order.java
│   └── OrderItem.java
├── enums/                     # Enumerations
│   ├── UserRole.java
│   ├── TableStatus.java
│   ├── OrderStatus.java
│   └── PaymentMethod.java
├── exception/                 # Custom Exceptions
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   └── UnauthorizedException.java
├── repository/                # JPA Repositories
├── security/                  # Security components
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── UserDetailsServiceImpl.java
├── service/                   # Business Logic
│   ├── impl/                  # Service implementations
│   └── interfaces/            # Service interfaces
└── RestaurantManagerApplication.java
```

## Documentation Index

1. **[Entities](./ENTITIES.md)** - JPA Entity definitions with Hibernate annotations
2. **[Repositories](./REPOSITORIES.md)** - Spring Data JPA Repository interfaces
3. **[Services](./SERVICES.md)** - Business logic layer implementation
4. **[Controllers](./CONTROLLERS.md)** - REST API endpoints
5. **[Configuration](./CONFIGURATION.md)** - Spring Boot configuration classes

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Spring Boot 3.2.x |
| ORM | Hibernate 6.x / Spring Data JPA |
| Database | MySQL 8.0+ |
| Security | Spring Security 6.x + JWT |
| Build Tool | Maven / Gradle |
| Java Version | Java 17+ |
| API Docs | SpringDoc OpenAPI (Swagger) |

## Quick Start

### Prerequisites
- Java 17+
- MySQL 8.0+
- Maven 3.8+ or Gradle 8+

### Dependencies (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- API Documentation -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.3.0</version>
    </dependency>
</dependencies>
```

### Application Properties

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/restaurant_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:password}
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true

jwt:
  secret: ${JWT_SECRET:your-256-bit-secret-key-here-minimum-32-chars}
  expiration: 86400000  # 24 hours
  refresh-expiration: 604800000  # 7 days

server:
  port: 8080
```

