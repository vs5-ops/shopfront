/**
 * Placeholder Management System
 * Tracks and manages the migration from mock data to real ecommerce features
 * Location: app/admin/placeholders/config.ts
 */

export type PlaceholderCategory = "IMAGES" | "REVIEWS" | "INVENTORY" | "PRICING" | "SELLERS" | "LOGISTICS" | "DESCRIPTIONS";
export type PriorityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface Placeholder {
  id: string;
  category: PlaceholderCategory;
  name: string;
  description: string;
  currentImplementation: string;
  targetImplementation: string;
  dataSource: string;
  firebaseCollection?: string;
  priority: PriorityLevel;
  estimatedCompletionDays: number;
  completionPercentage: number;
  dependsOn: string[];
  affectedPages: string[];
  testingRequired: string[];
  notes: string;
  lastUpdated: string;
  assignee?: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "TESTING" | "COMPLETED";
}

export const PLACEHOLDERS: Placeholder[] = [
  // ============== IMAGES ==============
  {
    id: "IMG-001",
    category: "IMAGES",
    name: "Product Images Migration",
    description: "Migrate all product images from Unsplash URLs to Firebase Storage",
    currentImplementation: "Hardcoded Unsplash URLs in lib/catalog.ts",
    targetImplementation: "Dynamic URLs from Firebase Storage with CDN caching",
    dataSource: "Firebase Storage: /products/{productId}/images/",
    firebaseCollection: "products",
    priority: "CRITICAL",
    estimatedCompletionDays: 5,
    completionPercentage: 30,
    dependsOn: [],
    affectedPages: ["/", "/products", "/products/[slug]"],
    testingRequired: ["Image loading speed", "CDN caching", "Mobile rendering"],
    notes: "API endpoints created (POST/DELETE). Migration script ready. Needs product migration execution.",
    lastUpdated: "2024-04-15",
    assignee: "Development Team",
    status: "IN_PROGRESS"
  },

  {
    id: "IMG-002",
    category: "IMAGES",
    name: "Brand Logos",
    description: "Add brand logos for product display",
    currentImplementation: "None - text only",
    targetImplementation: "Brand logo images in Firebase Storage",
    dataSource: "Firebase Storage: /brands/{brandId}/logos/",
    firebaseCollection: "brands",
    priority: "MEDIUM",
    estimatedCompletionDays: 3,
    completionPercentage: 0,
    dependsOn: [],
    affectedPages: ["/products", "/products/[slug]"],
    testingRequired: ["Logo rendering", "Brand page display"],
    notes: "Need to create brand collection and upload logos",
    lastUpdated: "2024-04-15",
    status: "NOT_STARTED"
  },

  // ============== REVIEWS ==============
  {
    id: "REV-001",
    category: "REVIEWS",
    name: "Product Rating System",
    description: "Replace hardcoded ratings with calculated values from reviews",
    currentImplementation: "Static rating values in catalog.ts (4.4, 4.2, etc)",
    targetImplementation: "Calculated from products/{id}/reviews collection",
    dataSource: "Firestore: products/{id}/reviews (aggregate query)",
    firebaseCollection: "products,reviews",
    priority: "CRITICAL",
    estimatedCompletionDays: 3,
    completionPercentage: 100,
    dependsOn: ["REV-003"],
    affectedPages: ["/products", "/products/[slug]"],
    testingRequired: ["Rating calculation", "Real-time updates", "Average accuracy"],
    notes: "API endpoints complete. Rating aggregation in updateProductRating() function. Fully functional with real-time calculated ratings.",
    lastUpdated: "2024-12-19",
    assignee: "Development Team",
    status: "COMPLETED"
  },

  {
    id: "REV-002",
    category: "REVIEWS",
    name: "Customer Reviews Collection",
    description: "Implement review submission and display system",
    currentImplementation: '"Share your feedback" button with no backend',
    targetImplementation: "Full review CRUD with moderation workflow",
    dataSource: "Firestore: products/{id}/reviews/{reviewId}",
    firebaseCollection: "products -> reviews",
    priority: "CRITICAL",
    estimatedCompletionDays: 7,
    completionPercentage: 100,
    dependsOn: [],
    affectedPages: ["/products/[slug]", "/admin"],
    testingRequired: ["Review submission", "Validation", "Display", "Moderation"],
    notes: "API (POST/GET) created. Components created. Admin moderation dashboard implemented. Reviews set to pending by default.",
    lastUpdated: "2024-12-19",
    assignee: "Development Team",
    status: "COMPLETED"
  },

  {
    id: "REV-003",
    category: "REVIEWS",
    name: "Verified Purchase Badge",
    description: "Show verified buyer indicator on reviews",
    currentImplementation: "Not implemented",
    targetImplementation: "Check order history for verification",
    dataSource: "Cross-reference orders collection with review userId",
    firebaseCollection: "orders,reviews",
    priority: "HIGH",
    estimatedCompletionDays: 2,
    completionPercentage: 100,
    dependsOn: ["REV-002"],
    affectedPages: ["/products/[slug]"],
    testingRequired: ["Verification logic", "Order history matching"],
    notes: "Logic implemented in review API. Checks verified order status. Shows verified badge on reviews.",
    lastUpdated: "2024-12-19",
    assignee: "Development Team",
    status: "COMPLETED"
  },

  // ============== DESCRIPTIONS ==============
  {
    id: "DESC-001",
    category: "DESCRIPTIONS",
    name: "Product Descriptions",
    description: "Expand minimal descriptions to comprehensive product info",
    currentImplementation: "One-liner descriptions in catalog.ts",
    targetImplementation: "Rich text descriptions with formatting",
    dataSource: "Admin panel input -> Firestore products collection",
    firebaseCollection: "products",
    priority: "HIGH",
    estimatedCompletionDays: 4,
    completionPercentage: 5,
    dependsOn: [],
    affectedPages: ["/products/[slug]"],
    testingRequired: ["Rich text rendering", "HTML sanitization", "SEO"],
    notes: "Create rich text editor in admin panel. Migrate existing data.",
    lastUpdated: "2024-04-15",
    status: "NOT_STARTED"
  },

  // ============== INVENTORY ==============
  {
    id: "INV-001",
    category: "INVENTORY",
    name: "Real-time Stock Management",
    description: "Replace hardcoded stock numbers with real-time inventory",
    currentImplementation: "Static stock: 188 values in catalog.ts",
    targetImplementation: "Real-time updates from inventory table",
    dataSource: "Firestore: inventory collection with product references",
    firebaseCollection: "inventory",
    priority: "HIGH",
    estimatedCompletionDays: 3,
    completionPercentage: 100,
    dependsOn: [],
    affectedPages: ["/products", "/products/[slug]", "/cart", "/checkout"],
    testingRequired: ["Stock availability", "Concurrent updates", "Cart validation"],
    notes: "API created. Dashboard UI created. Migration script ready. Fully functional with real-time updates.",
    lastUpdated: "2024-12-19",
    assignee: "Development Team",
    status: "COMPLETED"
  },

  // ============== PRICING ==============
  {
    id: "PRICE-001",
    category: "PRICING",
    name: "Dynamic Pricing & Discounts",
    description: "Replace static price/MRP with dynamic offer engine",
    currentImplementation: "Hardcoded price and MRP in catalog.ts",
    targetImplementation: "Dynamic pricing from offers collection",
    dataSource: "Firestore: offers collection + price history",
    firebaseCollection: "offers,prices",
    priority: "HIGH",
    estimatedCompletionDays: 5,
    completionPercentage: 0,
    dependsOn: [],
    affectedPages: ["/", "/products", "/products/[slug]", "/cart"],
    testingRequired: ["Discount calculation", "Offer validation", "Coupon system"],
    notes: "Include time-based offers, category-based, and coupon codes",
    lastUpdated: "2024-04-15",
    status: "NOT_STARTED"
  },

  // ============== SELLERS ==============
  {
    id: "SELLER-001",
    category: "SELLERS",
    name: "Multi-Seller System",
    description: "Replace hardcoded seller with proper seller profiles",
    currentImplementation: "All products use "AZCO Global" hardcoded",
    targetImplementation: "Multiple verified sellers with profiles",
    dataSource: "Firestore: sellers collection, products.sellerId reference",
    firebaseCollection: "sellers",
    priority: "CRITICAL",
    estimatedCompletionDays: 6,
    completionPercentage: 100,
    dependsOn: [],
    affectedPages: ["/products/[slug]", "/admin"],
    testingRequired: ["Seller profile", "Verification", "Ratings", "Policies"],
    notes: "API created. Dashboard UI created. Seller model in Firestore. Admin verification system implemented with approval/rejection workflow.",
    lastUpdated: "2024-12-19",
    assignee: "Development Team",
    status: "COMPLETED"
  },

  // ============== LOGISTICS ==============
  {
    id: "LOGISTICS-001",
    category: "LOGISTICS",
    name: "Shipping Integration",
    description: "Replace hardcoded delivery text with real shipping API",
    currentImplementation: "Generic "Free delivery by tomorrow" text",
    targetImplementation: "Real-time delivery estimates from Shiprocket API",
    dataSource: "External API: Shiprocket / Blue Dart",
    firebaseCollection: null,
    priority: "CRITICAL",
    estimatedCompletionDays: 7,
    completionPercentage: 20,
    dependsOn: [],
    affectedPages: ["/products/[slug]", "/checkout"],
    testingRequired: ["Pincode lookup", "Delivery calculation", "API reliability"],
    notes: "Order API with delivery estimate fields ready. Needs Shiprocket SDK integration.",
    lastUpdated: "2024-04-15",
    assignee: "Development Team",
    status: "IN_PROGRESS"
  },
];

/**
 * Get placeholders by priority
 */
export function getPlaceholdersByPriority(priority: PriorityLevel): Placeholder[] {
  return PLACEHOLDERS.filter(p => p.priority === priority);
}

/**
 * Calculate overall completion percentage
 */
export function calculateOverallProgress(): number {
  const total = PLACEHOLDERS.reduce((sum, p) => sum + p.completionPercentage, 0);
  return Math.round(total / PLACEHOLDERS.length);
}

/**
 * Get completion status for dashboard
 */
export function getStatusSummary() {
  return {
    total: PLACEHOLDERS.length,
    notStarted: PLACEHOLDERS.filter(p => p.status === "NOT_STARTED").length,
    inProgress: PLACEHOLDERS.filter(p => p.status === "IN_PROGRESS").length,
    testing: PLACEHOLDERS.filter(p => p.status === "TESTING").length,
    completed: PLACEHOLDERS.filter(p => p.status === "COMPLETED").length,
    overallProgress: calculateOverallProgress(),
    criticalRemaining: PLACEHOLDERS.filter(p => p.priority === "CRITICAL" && p.status !== "COMPLETED").length,
  };
}

/**
 * Get blocking placeholders (others depend on them)
 */
export function getBlockingItems(): Placeholder[] {
  const ids = new Set<string>();
  PLACEHOLDERS.forEach(p => p.dependsOn.forEach(id => ids.add(id)));
  return PLACEHOLDERS.filter(p => ids.has(p.id));
}

/**
 * Estimate total days to completion (critical items only)
 */
export function estimateTimeToLaunch(): number {
  const critical = PLACEHOLDERS.filter(p => p.priority === "CRITICAL" && p.status !== "COMPLETED");
  return Math.max(...critical.map(p => p.estimatedCompletionDays), 0);
}
