/**
 * Firestore Data Models & TypeScript Interfaces
 * Defines the complete schema for the real ecommerce system
 */

// ============================================================================
// PHASE 1: CRITICAL IMPLEMENTATIONS
// ============================================================================

/**
 * Product Reviews Firestore Collection: /products/{productId}/reviews/{reviewId}
 */
export interface FirestoreReview {
  id: string;
  userId: string;
  userName: string;
  email: string;
  userAvatar?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  content: string;
  images: string[];
  helpful: number;
  unhelpful: number;
  verified: boolean; // Verified buyer status
  purchaseDate?: string;
  createdAt: string;
  updatedAt: string;
  status: "pending" | "approved" | "rejected";
  adminResponse?: string;
  adminResponseDate?: string;
}

/**
 * Sellers Firestore Collection: /sellers/{sellerId}
 */
export interface FirestoreSeller {
  id: string;
  name: string;
  email: string;
  phone: string;
  logo: string;
  description: string;
  website?: string;
  registrationDate: string;
  verificationStatus: "pending" | "verified" | "rejected";
  verificationDate?: string;
  rating: number; // Aggregated from orders/reviews
  reviewCount: number;
  productCount: number;
  totalSales: number;
  responseTime: number; // in hours
  returnRate: number; // percentage
  cancellationRate: number; // percentage
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  documents: {
    panCard: string;
    gstCertificate: string;
    businessProof: string;
  };
  isActive: boolean;
  joinedAt: string;
  lastUpdated: string;
}

/**
 * Products Firestore Collection: /products/{productId}
 * Extended from catalog to include seller info and dynamic data
 */
export interface FirestoreProduct {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: "electronics" | "fashion" | "home" | "sports" | "books";
  description: string;
  fullDescription: string; // Rich text editor content
  price: number;
  mrp: number;
  discountPercent: number;
  rating: number; // Calculated from reviews
  reviewCount: number;
  stock: number;
  reorderLevel: number; // Minimum stock for alerts
  images: string[]; // Multiple images from Firebase Storage
  highlights: string[];
  specifications: Record<string, string>;
  materials?: string;
  dimensions?: string;
  weight?: string;
  warranty?: string;
  returnPolicy?: string;
  returnDays?: number;
  sellerId: string; // New: Multi-seller support
  sellerName: string;
  deliveryEstimate: {
    min: number; // days
    max: number;
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  purchaseCount: number;
}

/**
 * Orders Firestore Collection: /orders/{orderId}
 */
export interface FirestoreOrder {
  id: string;
  userId: string;
  userEmail: string;
  orderDate: string;
  status:
    | "pending"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  couponDiscount: number;
  total: number;
  shippingAddress: ShippingAddressData;
  billingAddress?: ShippingAddressData;
  paymentMethod: "razorpay" | "upi" | "wallet" | "cod";
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
  cancelReason?: string;
  returnRequested: boolean;
  returnDate?: string;
  refundAmount?: number;
  notes?: string;
  updatedAt: string;
}

interface OrderItem {
  productId: string;
  productTitle: string;
  sellerId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  status: "pending" | "shipped" | "delivered" | "cancelled" | "returned";
}

interface ShippingAddressData {
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// ============================================================================
// PHASE 2: DYNAMIC PRICING & INVENTORY
// ============================================================================

/**
 * Price History Firestore Collection: /products/{productId}/priceHistory/{entryId}
 */
export interface PriceHistoryEntry {
  id: string;
  oldPrice: number;
  newPrice: number;
  reason: string;
  changedBy: string;
  changedAt: string;
  validFrom: string;
  validTo?: string;
}

/**
 * Inventory Firestore Collection: /inventory/{productId}
 */
export interface FirestoreInventory {
  productId: string;
  availableStock: number;
  reservedStock: number;
  damagedStock: number;
  totalStock: number;
  reorderLevel: number;
  reorderQuantity: number;
  lastRestockDate: string;
  lastRestockQuantity: number;
  warehouseLocation: string;
  expiryDate?: string;
  batchNumbers: string[];
  lastUpdated: string;
}

/**
 * Stock Movement Logs: /inventory/{productId}/movements/{movementId}
 */
export interface StockMovement {
  id: string;
  productId: string;
  type: "inbound" | "outbound" | "adjustment" | "damage" | "return";
  quantity: number;
  reason: string;
  orderId?: string;
  reference: string;
  movedAt: string;
  movedBy: string;
  beforeStock: number;
  afterStock: number;
}

// ============================================================================
// PHASE 3: RETURNS & REFUNDS
// ============================================================================

/**
 * Returns Firestore Collection: /orders/{orderId}/returns/{returnId}
 */
export interface FirestoreReturn {
  id: string;
  orderId: string;
  productId: string;
  userId: string;
  quantity: number;
  reason:
    | "defective"
    | "notAsDescribed"
    | "damageInShipping"
    | "wrongItem"
    | "other";
  reasonDescription: string;
  requestDate: string;
  status:
    | "requested"
    | "approved"
    | "rejected"
    | "shipped"
    | "received"
    | "refunded";
  approvalDate?: string;
  approverNotes?: string;
  refundAmount?: number;
  refundDate?: string;
  trackingNumber?: string;
  images: string[];
  resolutionNotes?: string;
}

/**
 * Refund Transactions: /refunds/{refundId}
 */
export interface FirestoreRefund {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  requestDate: string;
  processedDate?: string;
  status: "pending" | "processed" | "failed";
  transactionId: string;
  notes?: string;
}

// ============================================================================
// PHASE 4: SELLER ANALYTICS & ADMIN
// ============================================================================

/**
 * Seller Analytics: /sellers/{sellerId}/analytics/{analyticsId}
 */
export interface SellerAnalytics {
  id: string;
  sellerId: string;
  period: string; // YYYY-MM format
  totalOrders: number;
  totalRevenue: number;
  totalRefunds: number;
  cancellations: number;
  returns: number;
  averageRating: number;
  reviewCount: number;
  viewsReceived: number;
  conversionRate: number;
  averageDeliveryTime: number; // days
  onTimeDeliveryRate: number; // percentage
  lastUpdated: string;
}

/**
 * Dispute/Support Tickets: /support/{ticketId}
 */
export interface SupportTicket {
  id: string;
  orderId: string;
  userId: string;
  sellerId: string;
  subject: string;
  description: string;
  category:
    | "payment"
    | "delivery"
    | "product_quality"
    | "seller_behavior"
    | "other";
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  resolution?: string;
  resolutionDate?: string;
}

interface Message {
  id: string;
  senderId: string;
  senderRole: "customer" | "seller" | "admin";
  message: string;
  attachments?: string[];
  sentAt: string;
}

/**
 * Wishlist: /users/{userId}/wishlist/{wishlistId}
 */
export interface FirestoreWishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: string;
  notifyOnPriceDropBelow?: number;
  currentPrice: number;
  lastCheckedPrice?: number;
}

/**
 * Coupons: /coupons/{couponId}
 */
export interface FirestoreCoupon {
  id: string;
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
  maxUsage: number;
  currentUsage: number;
  minOrderValue: number;
  applicableCategories: string[];
  applicableSellers: string[];
  validFrom: string;
  validTo: string;
  active: boolean;
  createdAt: string;
  createdBy: string;
}

/**
 * User Profiles: /users/{userId}
 */
export interface FirestoreUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  profileImage?: string;
  role: "customer" | "seller" | "admin";
  addresses: ShippingAddressData[];
  defaultAddressId?: string;
  paymentMethods: PaymentMethod[];
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  preferences: UserPreferences;
}

interface PaymentMethod {
  id: string;
  type: "card" | "upi" | "wallet";
  lastFourDigits?: string;
  isDefault: boolean;
}

interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  preferredLanguage: string;
  currency: string;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export interface AggregatedRating {
  averageRating: number;
  totalReviews: number;
  distribution: {
    "5star": number;
    "4star": number;
    "3star": number;
    "2star": number;
    "1star": number;
  };
  verifiedPurchases: number;
}

export interface ProductWildcard {
  [key: string]: unknown;
}
