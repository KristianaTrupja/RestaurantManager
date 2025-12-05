/**
 * ============================================
 * RESTAURANT MANAGER - MOCK DATA
 * ============================================
 * 
 * Centralized mock data for development and testing.
 * This data structure mirrors the expected backend API responses.
 */

import type { 
  User, 
  Category, 
  MenuItem, 
  Table, 
  TableSession,
  Order,
  OrderItem 
} from "../types";

// ============================================
// USERS
// ============================================

export const mockUsers: User[] = [
  {
    id: 1,
    username: "guest",
    password: "1234",
    fullName: "Maria Johnson",
    email: "maria@example.com",
    role: "GUEST",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: 2,
    username: "waiter1",
    password: "1234",
    fullName: "Kristiana Trupja",
    email: "kristiana@restaurant.com",
    role: "WAITER",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: 3,
    username: "waiter2",
    password: "1234",
    fullName: "Relando Vrapi",
    email: "relando@restaurant.com",
    role: "WAITER",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: 4,
    username: "admin",
    password: "1234",
    fullName: "Admin User",
    email: "admin@restaurant.com",
    role: "ADMIN",
    isActive: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

// ============================================
// CATEGORIES
// ============================================

export const mockCategories: Category[] = [
  { id: 1, name: "Starters", description: "Appetizers and small plates", sortOrder: 1, isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 2, name: "Salads", description: "Fresh salads", sortOrder: 2, isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 3, name: "Pizza", description: "Italian pizzas", sortOrder: 3, isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 4, name: "Pasta", description: "Fresh pasta dishes", sortOrder: 4, isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 5, name: "Burgers", description: "Gourmet burgers", sortOrder: 5, isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 6, name: "Main Course", description: "Main dishes", sortOrder: 6, isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 7, name: "Sushi", description: "Japanese sushi", sortOrder: 7, isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 8, name: "Grill", description: "Grilled meats", sortOrder: 8, isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 9, name: "Seafood", description: "Fresh seafood", sortOrder: 9, isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 10, name: "Desserts", description: "Sweet desserts", sortOrder: 10, isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 11, name: "Drinks", description: "Soft drinks and juices", sortOrder: 11, isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 12, name: "Cocktails", description: "Alcoholic cocktails", sortOrder: 12, isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 13, name: "Wines", description: "Wine selection", sortOrder: 13, isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
  { id: 14, name: "Coffee & Tea", description: "Hot beverages", sortOrder: 14, isActive: true, createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z" },
];

// Helper to get category names array (for backward compatibility)
export const categories = mockCategories.map(c => c.name);

// ============================================
// MENU ITEMS
// ============================================

export const mockMenuItems: MenuItem[] = [
  // Starters
  {
    id: 1, categoryId: 1, category: "Starters", name: "Bruschetta", price: 4.50,
    description: "Grilled bread topped with fresh tomatoes, garlic, and olive oil",
    image: "https://safrescobaldistatic.blob.core.windows.net/media/2022/11/PIZZA-MARGHERITA.jpg",
    available: true, preparationTime: 10, isVegetarian: true, sortOrder: 1,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 2, categoryId: 1, category: "Starters", name: "Chicken Wings", price: 7.00,
    description: "Crispy wings with BBQ sauce",
    image: "https://www.recipetineats.com/tachyon/2024/11/New-Oreleans-chicken-wings_1.jpg",
    available: true, preparationTime: 15, sortOrder: 2,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 3, categoryId: 1, category: "Starters", name: "Garlic Bread", price: 3.50,
    description: "Toasted bread with garlic butter and herbs",
    image: "https://www.recipetineats.com/tachyon/2020/06/Garlic-Bread_5.jpg",
    available: true, preparationTime: 8, isVegetarian: true, sortOrder: 3,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },

  // Salads
  {
    id: 4, categoryId: 2, category: "Salads", name: "Caesar Salad", price: 6.50,
    description: "Lettuce, parmesan, croutons, Caesar dressing",
    image: "https://cdn.loveandlemons.com/wp-content/uploads/2024/12/caesar-salad.jpg",
    available: true, preparationTime: 8, isVegetarian: true, sortOrder: 1,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 5, categoryId: 2, category: "Salads", name: "Greek Salad", price: 7.00,
    description: "Tomatoes, cucumber, olives, feta cheese",
    image: "https://www.recipetineats.com/tachyon/2019/10/Greek-Salad_6.jpg",
    available: true, preparationTime: 8, isVegetarian: true, sortOrder: 2,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },

  // Pizza
  {
    id: 6, categoryId: 3, category: "Pizza", name: "Margherita", price: 8.00,
    description: "Tomato sauce, mozzarella, fresh basil",
    image: "https://au.ooni.com/cdn/shop/articles/20220211142645-margherita-9920.jpg?v=1737368217&width=1080",
    available: true, preparationTime: 15, isVegetarian: true, sortOrder: 1,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 7, categoryId: 3, category: "Pizza", name: "Pepperoni", price: 10.00,
    description: "Tomato sauce, mozzarella, pepperoni",
    image: "https://www.simplyrecipes.com/thmb/KE6iMblr3R2Db6oE8HdyVsFSj2A=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Homemade-Pepperoni-Pizza-LEAD-5-b8a936e9e9f045ba9e3e7c0e4ec0a5e3.jpg",
    available: true, preparationTime: 15, sortOrder: 2,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 8, categoryId: 3, category: "Pizza", name: "Quattro Formaggi", price: 11.00,
    description: "Four cheese pizza with mozzarella, gorgonzola, parmesan, ricotta",
    image: "https://www.simplyrecipes.com/thmb/a_Yo3H8RkJT5z_d_dUiP3A4gF-c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Four-Cheese-Pizza-LEAD-03-e84dad90f3a24a6a9e5d3bc6a83b3fb1.jpg",
    available: false, preparationTime: 15, isVegetarian: true, sortOrder: 3,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },

  // Pasta
  {
    id: 9, categoryId: 4, category: "Pasta", name: "Spaghetti Carbonara", price: 9.00,
    description: "Pancetta, pecorino, egg, black pepper",
    image: "https://www.allrecipes.com/thmb/Vg2cRidr2zcYhWGvPD8M18xM_WY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/11973-spaghetti-carbonara-ii-DDMFS-4x3-6edea51e421e4457ac0c3269f3be5157.jpg",
    available: true, preparationTime: 12, sortOrder: 1,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 10, categoryId: 4, category: "Pasta", name: "Penne Arrabiata", price: 8.50,
    description: "Spicy tomato sauce with garlic and chili",
    image: "https://www.recipetineats.com/tachyon/2020/02/Penne-Arrabiata_6.jpg",
    available: true, preparationTime: 12, isVegetarian: true, isVegan: true, sortOrder: 2,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },

  // Burgers
  {
    id: 11, categoryId: 5, category: "Burgers", name: "Classic Cheeseburger", price: 10.50,
    description: "Beef patty, cheddar, lettuce, tomato, special sauce",
    image: "https://rhubarbandcod.com/wp-content/uploads/2022/06/The-Classic-Cheeseburger-1.jpg",
    available: true, preparationTime: 15, sortOrder: 1,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 12, categoryId: 5, category: "Burgers", name: "Bacon Burger", price: 12.00,
    description: "Beef patty, crispy bacon, cheddar, onion rings",
    image: "https://www.seriouseats.com/thmb/5eSAVpgNuLH6zI2T9f1f_BKQC5c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__images__2014__09__20140918-jamie-olivers-comfort-food-insanity-burger-david-loftus-f7d9042bdc404a3cbd64d1d7db0ec5c4.jpg",
    available: true, preparationTime: 18, sortOrder: 2,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },

  // Main Course
  {
    id: 13, categoryId: 6, category: "Main Course", name: "Chicken Alfredo", price: 11.00,
    description: "Grilled chicken with creamy Alfredo sauce and fettuccine",
    image: "https://www.allrecipes.com/thmb/ziUOvj4f_me5yvZhYCUy0n4IKbQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/276725-creamy-chicken-alfredo-VAT-001-Beauty-4x3-c4b026db5cb349f4b8fd627c56f91a42.jpg",
    available: true, preparationTime: 20, sortOrder: 1,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },

  // Sushi
  {
    id: 14, categoryId: 7, category: "Sushi", name: "California Roll", price: 9.50,
    description: "Crab, avocado, cucumber (8 pieces)",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9f/California_Sushi_%2826571101885%29.jpg",
    available: true, preparationTime: 12, sortOrder: 1,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 15, categoryId: 7, category: "Sushi", name: "Salmon Nigiri", price: 8.00,
    description: "Fresh salmon over pressed rice (4 pieces)",
    image: "https://www.seriouseats.com/thmb/0U2HqJY4JQXL5fJ_Fl6GEfHlNbQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2016__10__20161017-salmon-nigiri-overhead-vicky-wasik-1-6c5f5c5e3c8a4a9a99a15e5e5e5e5e5e.jpg",
    available: true, preparationTime: 10, isGlutenFree: true, sortOrder: 2,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },

  // Grill
  {
    id: 16, categoryId: 8, category: "Grill", name: "Grilled Steak", price: 15.00,
    description: "300g ribeye steak grilled to perfection, with fries",
    image: "https://www.seriouseats.com/thmb/DohQC_iADRKgJPdXvcxSjsPA930=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2016__06__20110516-cowboy-steak-kenji-lopez-alt-bb4a825bd05b4e91b7672bc1603043a8.jpg",
    available: true, preparationTime: 25, isGlutenFree: true, sortOrder: 1,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },

  // Seafood
  {
    id: 17, categoryId: 9, category: "Seafood", name: "Grilled Salmon", price: 14.00,
    description: "Fresh salmon fillet with lemon butter sauce",
    image: "https://static01.nyt.com/images/2024/02/28/multimedia/LH-seafood-boil-gktl/LH-seafood-boil-gktl-googleFourByThree.jpg",
    available: true, preparationTime: 18, isGlutenFree: true, sortOrder: 1,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },

  // Desserts
  {
    id: 18, categoryId: 10, category: "Desserts", name: "Tiramisu", price: 5.50,
    description: "Classic Italian coffee-flavoured dessert",
    image: "https://www.giallozafferano.com/images/260-26067/Tiramisu_1200x800.jpg",
    available: true, preparationTime: 5, isVegetarian: true, sortOrder: 1,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 19, categoryId: 10, category: "Desserts", name: "Chocolate Lava Cake", price: 6.00,
    description: "Warm chocolate cake with molten center",
    image: "https://www.recipetineats.com/tachyon/2021/01/Chocolate-Lava-Cake_9.jpg",
    available: true, preparationTime: 12, isVegetarian: true, sortOrder: 2,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },

  // Drinks
  {
    id: 20, categoryId: 11, category: "Drinks", name: "Coca Cola", price: 2.50,
    description: "330ml can",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/27/Coca_Cola_Flasche_-_Original_Taste.jpg",
    available: true, preparationTime: 1, isVegetarian: true, isVegan: true, sortOrder: 1,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 21, categoryId: 11, category: "Drinks", name: "Fresh Orange Juice", price: 3.50,
    description: "Freshly squeezed orange juice",
    image: "https://www.seriouseats.com/thmb/Y5E5mN1Y5E5mN1Y5E5mN1Y5E5mN=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/orange-juice.jpg",
    available: true, preparationTime: 3, isVegetarian: true, isVegan: true, sortOrder: 2,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 22, categoryId: 11, category: "Drinks", name: "Sparkling Water", price: 2.00,
    description: "500ml bottle",
    image: "",
    available: true, preparationTime: 1, isVegetarian: true, isVegan: true, sortOrder: 3,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },

  // Cocktails
  {
    id: 23, categoryId: 12, category: "Cocktails", name: "Mojito", price: 6.00,
    description: "Rum, fresh mint, lime, sugar, soda water",
    image: "https://www.liquor.com/thmb/Mojito-recipe-904x904-c.jpg",
    available: true, preparationTime: 5, isVegetarian: true, isVegan: true, sortOrder: 1,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 24, categoryId: 12, category: "Cocktails", name: "Margarita", price: 7.00,
    description: "Tequila, lime juice, triple sec, salt rim",
    image: "",
    available: true, preparationTime: 5, isVegetarian: true, isVegan: true, sortOrder: 2,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },

  // Wines
  {
    id: 25, categoryId: 13, category: "Wines", name: "Red House Wine", price: 4.50,
    description: "Glass of house red wine",
    image: "",
    available: true, preparationTime: 1, isVegetarian: true, sortOrder: 1,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 26, categoryId: 13, category: "Wines", name: "White House Wine", price: 4.50,
    description: "Glass of house white wine",
    image: "",
    available: true, preparationTime: 1, isVegetarian: true, sortOrder: 2,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },

  // Coffee & Tea
  {
    id: 27, categoryId: 14, category: "Coffee & Tea", name: "Espresso", price: 2.00,
    description: "Single shot espresso",
    image: "",
    available: true, preparationTime: 2, isVegetarian: true, isVegan: true, sortOrder: 1,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 28, categoryId: 14, category: "Coffee & Tea", name: "Cappuccino", price: 3.00,
    description: "Espresso with steamed milk and foam",
    image: "",
    available: true, preparationTime: 3, isVegetarian: true, sortOrder: 2,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 29, categoryId: 14, category: "Coffee & Tea", name: "Green Tea", price: 2.50,
    description: "Japanese green tea",
    image: "",
    available: true, preparationTime: 3, isVegetarian: true, isVegan: true, sortOrder: 3,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z"
  },
];

// For backward compatibility
export const menuItems = mockMenuItems;

// ============================================
// TABLES
// ============================================

export const mockTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  number: i + 1,
  capacity: i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2,
  status: "free" as const,
  location: i < 6 ? "indoor" : "outdoor",
  isActive: true,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
}));

// ============================================
// TABLE SESSIONS (Active orders)
// ============================================

export const mockTableSessions: TableSession[] = [
  {
    id: "session-4",
    tableId: "4",
    waiterId: 2,
    status: "finished",
    startedAt: "2025-01-15T11:30:00Z",
    orders: [],
    totalPriceWithoutTax: 56.10,
    taxAmount: 11.22,
    taxRate: 0.20,
    totalPriceWithTax: 67.32,
    currency: "€",
    billNumber: "BILL-2025-0004",
    printedAt: "2025-01-15T12:40:00Z",
  },
  {
    id: "session-5",
    tableId: "5",
    waiterId: 2,
    status: "taken",
    startedAt: "2025-01-15T12:00:00Z",
    orders: [],
    totalPriceWithoutTax: 35.00,
    taxAmount: 7.00,
    taxRate: 0.20,
    totalPriceWithTax: 42.00,
    currency: "€",
  },
  {
    id: "session-6",
    tableId: "6",
    waiterId: 3,
    status: "served",
    startedAt: "2025-01-15T11:45:00Z",
    orders: [],
    totalPriceWithoutTax: 27.00,
    taxAmount: 5.40,
    taxRate: 0.20,
    totalPriceWithTax: 32.40,
    currency: "€",
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getMenuItemsByCategory(categoryName: string): MenuItem[] {
  return mockMenuItems.filter(item => item.category === categoryName);
}

export function getMenuItemById(id: number): MenuItem | undefined {
  return mockMenuItems.find(item => item.id === id);
}

export function getCategoryById(id: number): Category | undefined {
  return mockCategories.find(cat => cat.id === id);
}

export function getUserByUsername(username: string): User | undefined {
  return mockUsers.find(user => user.username === username);
}

export function getTableById(id: string): Table | undefined {
  return mockTables.find(table => table.id === id);
}

