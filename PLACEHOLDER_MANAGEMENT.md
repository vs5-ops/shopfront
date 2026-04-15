# ECOMMERCE PLACEHOLDER MANAGEMENT SYSTEM

## Shopfront Marketplace - Placeholder Tracking & Real Implementation

---

## 📋 PLACEHOLDER INVENTORY

### CATEGORY 1: PRODUCT IMAGES (CRITICAL)

| ID      | Current         | Type                | Location             | Replacement Strategy              | Priority |
| ------- | --------------- | ------------------- | -------------------- | --------------------------------- | -------- |
| IMG-001 | Unsplash URLs   | External            | `lib/catalog.ts`     | Migrate to Firebase Storage       | HIGH     |
| IMG-002 | `product.image` | Dynamic             | Product detail pages | CDN + image optimization          | HIGH     |
| IMG-003 | Category icons  | Missing             | Navigation           | Add category-specific assets      | MEDIUM   |
| IMG-004 | Brand logos     | Missing             | Product cards        | Implement brand asset library     | MEDIUM   |
| IMG-005 | User avatars    | Placeholder circles | Order history        | Profile picture upload to Storage | LOW      |

**Implementation Plan:**

```
Phase 1: Create Firebase Storage buckets
- /products/{productId}/images/
- /brands/{brandId}/logos/
- /users/{userId}/avatar/

Phase 2: Migrate Unsplash URLs
- Write migration script to download images
- Upload to Firebase Storage with proper metadata
- Update product records with new URLs

Phase 3: Implement image upload in admin panel
- Allow sellers to upload multiple images per product
- Implement image compression & optimization
- Generate thumbnails automatically
```

---

### CATEGORY 2: PRODUCT RATINGS & REVIEWS (CRITICAL)

| ID      | Current                      | Type               | Location            | Real Implementation               | Data Source         |
| ------- | ---------------------------- | ------------------ | ------------------- | --------------------------------- | ------------------- |
| REV-001 | `product.rating: 4.4`        | Hardcoded          | `lib/catalog.ts`    | Calculate from reviews collection | Firestore           |
| REV-002 | `product.reviews: 3241`      | Hardcoded          | `lib/catalog.ts`    | Count of review documents         | Firestore           |
| REV-003 | "Share your feedback" button | Placeholder button | Product detail page | Reviews submission form           | Firestore writes    |
| REV-004 | No review display            | Missing            | Product detail page | Review list component             | Firestore queries   |
| REV-005 | No verified badge system     | Missing            | Review section      | Verified buyer indicator          | Order history check |
| REV-006 | No review filtering          | Missing            | Product page        | Sort by helpful/recent/rating     | Dynamic queries     |

**Firestore Schema for Reviews:**

```javascript
/products/{productId}/reviews/{reviewId}
{
  userId: "user_123",
  userName: "John Doe",
  email: "john@example.com",
  userAvatar: "https://...",
  rating: 5,
  title: "Excellent product",
  content: "Best purchase ever",
  images: ["url1", "url2"],
  helpful: 124,
  unhelpful: 3,
  verified: true,
  purchaseDate: "2024-03-15",
  createdAt: "2024-04-01",
  updatedAt: "2024-04-01",
  adminResponse: null
}
```

---

### CATEGORY 3: PRODUCT DESCRIPTIONS & SPECIFICATIONS (HIGH)

| ID       | Current                  | Type         | Location         | Implementation                   | Source      |
| -------- | ------------------------ | ------------ | ---------------- | -------------------------------- | ----------- |
| DESC-001 | Minimal 1-line           | Hardcoded    | `lib/catalog.ts` | Rich text editor with formatting | Admin panel |
| DESC-002 | Generic highlights array | Hardcoded    | Product cards    | Dynamic from specifications      | Firestore   |
| DESC-003 | `specifications: {}`     | Empty object | `lib/catalog.ts` | Key-value pairs per category     | Admin input |
| DESC-004 | No dimensions/weight     | Incomplete   | Catalog schema   | Pull from specifications         | Database    |
| DESC-005 | No material info         | Missing      | Product detail   | Add to specifications            | Vendor data |
| DESC-006 | No care instructions     | Missing      | Fashion items    | Add category-specific fields     | Database    |

**Extended Specification Schema:**

```javascript
{
  // Electronics specs
  isElectronics: true,
  deviceSpecs: {
    processor: "Snapdragon 888",
    ram: "8GB",
    storage: "256GB",
    battery: "5000mAh",
    display: "6.7 inch AMOLED"
  },

  // Fashion specs
  isFashion: true,
  fashionSpecs: {
    material: "100% Cotton",
    fit: "Regular fit",
    careInstructions: ["Machine wash cold", "Dry on low"],
    sizeGuide: "url_to_size_chart"
  },

  // Universal
  warranty: "2 years",
  manufacturer: "Brand Name",
  manufacturerCountry: "China",
  certifications: ["ISO 9001", "CE"]
}
```

---

### CATEGORY 4: SELLER & VENDOR INFORMATION (HIGH)

| ID         | Current                   | Type              | Location         | Real Implementation      | Details                      |
| ---------- | ------------------------- | ----------------- | ---------------- | ------------------------ | ---------------------------- |
| SELLER-001 | Hardcoded "AZCO Global"   | String            | `lib/catalog.ts` | Multi-seller system      | Firestore sellers collection |
| SELLER-002 | "Maverick Sports" etc     | Generic names     | Catalog          | Real seller profiles     | Seller verification          |
| SELLER-003 | No seller ratings         | Missing           | Product detail   | Aggregate seller metrics | Dynamic calculation          |
| SELLER-004 | No seller contact         | Missing           | Product page     | Seller profile link      | Public profile page          |
| SELLER-005 | No shipping info          | Hardcoded generic | Products         | Seller-specific policies | Seller configuration         |
| SELLER-006 | No return policy variance | Generic text      | Catalog          | Per-seller policies      | Database                     |

**Firestore Schema for Sellers:**

```javascript
/sellers/{sellerId}
{
  businessName: "Maverick Sports Pvt Ltd",
  storeName: "Maverick Sports",
  email: "seller@maverick.com",
  phone: "+91-9876543210",
  gst: "27AABCT1234H1Z0",
  panCard: "ABCDE1234F",
  bankAccount: "****4567",
  address: "...",

  // Ratings & Trust
  overallRating: 4.7,
  totalReviews: 1245,
  responseTime: "2.5 hours",
  positiveReviews: 89.5%,
  onTimeShipment: 97.3%,

  // Policies
  returnDays: 7,
  refundDays: 5,
  shippingCost: 0,
  freeShippingAbove: 500,

  // Store
  storeDescription: "...",
  storeLogo: "url",
  bannerImage: "url",

  // Verification
  verified: true,
  verifiedDate: "2024-01-15",
  kyc_status: "approved",

  createdAt: "2023-12-01",
  updatedAt: "2024-04-15",
  active: true
}
```

---

### CATEGORY 5: CUSTOMER REVIEWS/FEEDBACK (HIGH)

| ID     | Current                      | Type        | Location       | Real Implementation         | Status          |
| ------ | ---------------------------- | ----------- | -------------- | --------------------------- | --------------- |
| FB-001 | "Share your feedback" button | Placeholder | Product page   | Review submission form      | NOT IMPLEMENTED |
| FB-002 | No review list               | Missing     | Product detail | Display actual reviews      | NOT IMPLEMENTED |
| FB-003 | No review moderation         | Missing     | Admin panel    | Review approval system      | NOT IMPLEMENTED |
| FB-004 | No merchant response         | Missing     | Review section | Seller can reply to reviews | NOT IMPLEMENTED |
| FB-005 | No review verification       | Missing     | Review badge   | Verified purchase indicator | NOT IMPLEMENTED |
| FB-006 | No review images             | Missing     | Review details | Photo upload support        | NOT IMPLEMENTED |

---

### CATEGORY 6: DELIVERY & LOGISTICS (MEDIUM)

| ID           | Current                      | Type      | Location     | Real Implementation      | Integration       |
| ------------ | ---------------------------- | --------- | ------------ | ------------------------ | ----------------- |
| DELIVERY-001 | "Free delivery by tomorrow"  | Hardcoded | Catalog      | Dynamic based on pincode | Logistics API     |
| DELIVERY-002 | No tracking                  | Missing   | Order page   | Real-time tracking       | Shiprocket/Logi   |
| DELIVERY-003 | No shipping cost calculation | Missing   | Checkout     | Distance-based pricing   | Logistics partner |
| DELIVERY-004 | No delivery slot selection   | Missing   | Checkout     | Time window selection    | Logistics config  |
| DELIVERY-005 | Generic "Free delivery"      | Hardcoded | Product card | Conditional display      | Database logic    |

**Logistics Integration Points:**

- Shiprocket API for shipping labels
- Real-time tracking updates
- Pincode serviceability check
- Delivery estimate calculation

---

### CATEGORY 7: RETURN & REFUND POLICIES (MEDIUM)

| ID      | Current                      | Type       | Location          | Real Implementation        | Business Logic    |
| ------- | ---------------------------- | ---------- | ----------------- | -------------------------- | ----------------- |
| RET-001 | Generic "30-day return"      | Fixed text | Catalog           | Category-specific policies | Rules engine      |
| RET-002 | No return reason tracking    | Missing    | Return flow       | Reason dropdown            | Database          |
| RET-003 | No return condition checking | Missing    | Return acceptance | Accept/reject logic        | Admin review      |
| RET-004 | No refund timeline           | Hardcoded  | Product detail    | Calculated based on policy | Dynamic display   |
| RET-005 | No partial return support    | Missing    | Order management  | Item-level returns         | Advanced features |

**Return Policy Schema:**

```javascript
{
  categoryId: "electronics",
  returnableDays: 30,
  returnConditions: [
    "Unused and unopened",
    "Original packaging intact",
    "All accessories included"
  ],
  refundTimeline: {
    processingDays: 3,
    bankTransferDays: 5,
    totalDays: 8
  },
  nonReturnableItems: ["custom", "used", "damaged"],
  restockingFee: 0,
  sellerApprovalRequired: true
}
```

---

### CATEGORY 8: PRICING & DISCOUNTS (MEDIUM)

| ID        | Current              | Type      | Location       | Real Implementation     | Features            |
| --------- | -------------------- | --------- | -------------- | ----------------------- | ------------------- |
| PRICE-001 | Static `price + mrp` | Hardcoded | Catalog        | Dynamic offers engine   | Database            |
| PRICE-002 | No coupon system     | Missing   | Checkout       | Coupon code validation  | Discounts table     |
| PRICE-003 | No dynamic pricing   | Missing   | Product page   | Real-time price updates | Price history       |
| PRICE-004 | No bulk discounts    | Missing   | Cart           | Quantity-based pricing  | Rules table         |
| PRICE-005 | No seasonal offers   | Missing   | Homepage       | Time-based promotions   | Scheduled queries   |
| PRICE-006 | No price history     | Missing   | Product detail | Show price trends       | Historical tracking |

---

### CATEGORY 9: PRODUCT INVENTORY (MEDIUM)

| ID      | Current             | Type          | Location         | Real Implementation    | Logic             |
| ------- | ------------------- | ------------- | ---------------- | ---------------------- | ----------------- |
| INV-001 | Static `stock: 188` | Hardcoded     | Catalog          | Real-time stock sync   | Firestore updates |
| INV-002 | No stock warnings   | Missing       | Admin            | Low stock alerts       | Trigger system    |
| INV-003 | No pre-order        | Missing       | Product page     | Out-of-stock feature   | Queue system      |
| INV-004 | Manual updates      | Not automated | Admin panel      | Stock level management | Database          |
| INV-005 | No multi-warehouse  | Missing       | Inventory system | Multiple locations     | Location-based    |

---

## 🔄 REAL ECOMMERCE IMPLEMENTATION ROADMAP

### PHASE 1: CRITICAL (Week 1-2)

- [ ] Migrate product images to Firebase Storage
- [ ] Implement real reviews system (collection & display)
- [ ] Setup seller profiles & verification
- [ ] Create multi-seller assignment

### PHASE 2: IMPORTANT (Week 3-4)

- [ ] Integrate logistics API (Shiprocket)
- [ ] Implement dynamic pricing & discounts
- [ ] Add coupon system
- [ ] Create inventory management

### PHASE 3: ENHANCEMENT (Week 5-6)

- [ ] Add review moderation & seller responses
- [ ] Implement return/refund workflow
- [ ] Add price history & analytics
- [ ] Setup pre-order system

### PHASE 4: OPTIMIZATION (Week 7+)

- [ ] Add product recommendations
- [ ] Implement wishlist
- [ ] Create comparison tool
- [ ] Add advanced filters

---

## 📊 MANAGEMENT DASHBOARD STRUCTURE

Create `/admin/placeholders` route to monitor and manage:

```
DASHBOARD: Placeholder Status Tracker

├── Images Management
│   ├── Count: 10/10 migrated
│   ├── Missing: Brand logos (4), Category icons (5)
│   └── Upload new: [Upload button]
│
├── Reviews System
│   ├── Total: 8,534 reviews
│   ├── Pending approval: 23
│   ├── Average rating: 4.3
│   └── Manage: [View pending]
│
├── Seller Profiles
│   ├── Total sellers: 1 (AZCO Global)
│   ├── Need migration: 5
│   ├── Verified: 1
│   └── Add seller: [+ New seller]
│
├── Inventory Status
│   ├── Products: 10 total
│   ├── Real-time sync: OFF
│   ├── Low stock items: 2
│   └── Configure: [Settings]
│
├── Pricing & Discounts
│   ├── Active offers: 0
│   ├── Coupon codes: 0
│   └── Create offer: [+ New offer]
│
└── Logistics Setup
    ├── Integration: NOT CONFIGURED
    ├── Test shipment: Not done
    └── Configure: [Setup wizard]
```

---

## 🛠️ IMPLEMENTATION CODE TEMPLATE

Create `/app/admin/placeholders/page.tsx`:

```typescript
"use client";

type PlaceholderStatus = {
  id: string;
  category: string;
  current: string;
  target: string;
  progress: number; // 0-100
  priority: "HIGH" | "MEDIUM" | "LOW";
  completedItems: number;
  totalItems: number;
  lastUpdated: string;
  notes: string;
};

const placeholders: PlaceholderStatus[] = [
  {
    id: "images",
    category: "Product Images",
    current: "Unsplash URLs (hardcoded)",
    target: "Firebase Storage + CDN",
    progress: 0,
    priority: "HIGH",
    completedItems: 0,
    totalItems: 10,
    lastUpdated: "2024-04-15",
    notes: "Need to migrate 10 product images"
  },
  {
    id: "reviews",
    category: "Customer Reviews",
    current: "Hardcoded mock numbers",
    target: "Firestore collection with real reviews",
    progress: 15,
    priority: "HIGH",
    completedItems: 380,
    totalItems: 2500,
    lastUpdated: "2024-04-15",
    notes: "Review submission form partially done"
  },
  // ... more items
];

export default function PlaceholdersPage() {
  return (
    <div className="admin-panel">
      <h1>Placeholder Management Dashboard</h1>

      <div className="placeholder-grid">
        {placeholders.map(item => (
          <div key={item.id} className="placeholder-card">
            <h3>{item.category}</h3>
            <p className={`priority-${item.priority}`}>{item.priority}</p>
            <div className="progress-bar">
              <div className="progress" style={{width: `${item.progress}%`}}/>
            </div>
            <p>{item.completedItems} / {item.totalItems}</p>
            <button>Manage →</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 📝 TRACKING CHECKLIST

Use this for ongoing management:

- [ ] Daily standup: Check critical placeholders
- [ ] Weekly: Update migration progress
- [ ] Complete all HIGH priority items before launch
- [ ] Test each real system before removing placeholder
- [ ] Keep fallbacks for new features during transition

---

**Status:** 🔴 IN PROGRESS
**Last Updated:** April 15, 2026
**Next Review:** April 20, 2026
