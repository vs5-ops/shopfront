/**
 * Firestore Migration Runner
 * Simple Node.js script to initialize and run the migration
 */

const admin = require("firebase-admin");

// Get credentials from environment or use placeholder
const serviceAccountJson = process.env.FIREBASE_ADMIN_SDK || "{}";

let serviceAccount;
try {
  serviceAccount =
    typeof serviceAccountJson === "string"
      ? JSON.parse(serviceAccountJson)
      : serviceAccountJson;
} catch (error) {
  console.error(
    "❌ Error: FIREBASE_ADMIN_SDK environment variable is not valid JSON",
  );
  console.error(
    "Please set the FIREBASE_ADMIN_SDK environment variable with your service account JSON",
  );
  process.exit(1);
}

// Check if we have a valid service account
if (!serviceAccount.type || !serviceAccount.project_id) {
  console.warn(
    "⚠️  Warning: FIREBASE_ADMIN_SDK credentials not fully configured",
  );
  console.log(
    "Need to set environment variable FIREBASE_ADMIN_SDK with Firebase service account JSON",
  );
  console.log(
    "You can get this from: Firebase Console → Project Settings → Service Accounts → Generate New Private Key",
  );
  process.exit(1);
}

console.log(
  `✅ Firebase credentials loaded for project: ${serviceAccount.project_id}`,
);

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
      process.env.FIREBASE_DATABASE_URL ||
      `https://${serviceAccount.project_id}.firebaseio.com`,
  });
  console.log("✅ Firebase Admin initialized");
} catch (error) {
  console.error("❌ Error initializing Firebase Admin:", error.message);
  process.exit(1);
}

const db = admin.firestore();

/**
 * Sample products data from catalog
 */
const SAMPLE_PRODUCTS = [
  {
    id: "p1",
    title: "Nova SoundCore Pro Earbuds",
    brand: "Nova",
    category: "electronics",
    price: 2999,
    mrp: 4999,
    rating: 4.4,
    reviews: 3241,
    stock: 94,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
  },
  {
    id: "p2",
    title: "Helios TurboCharge 67W Adapter",
    brand: "Helios",
    category: "electronics",
    price: 1499,
    mrp: 2299,
    rating: 4.3,
    reviews: 1187,
    stock: 212,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0",
  },
];

/**
 * Run the migration
 */
async function runMigration() {
  console.log("\n🚀 Starting Firestore Migration\n");
  console.log("================================\n");

  try {
    // Create default seller
    console.log("📝 Creating default seller...");
    const defaultSellerId = "seller_azco_global";

    await db
      .collection("sellers")
      .doc(defaultSellerId)
      .set({
        id: defaultSellerId,
        name: "AZCO Global",
        email: "support@azcoglobal.com",
        phone: "+91-XXXX-XXXX",
        logo: "https://via.placeholder.com/200",
        description: "Your trusted online marketplace",
        registrationDate: new Date().toISOString(),
        verificationStatus: "verified",
        rating: 4.5,
        reviewCount: 1240,
        productCount: SAMPLE_PRODUCTS.length,
        totalSales: 15000,
        responseTime: 4,
        returnRate: 1.2,
        cancellationRate: 0.8,
        address: {
          street: "123 Business District",
          city: "Bangalore",
          state: "Karnataka",
          postalCode: "560001",
          country: "India",
        },
        isActive: true,
        joinedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      });
    console.log("✓ Default seller created\n");

    // Migrate products
    console.log("📦 Migrating products...");
    let batch = db.batch();
    let count = 0;
    const batchSize = 25;

    for (const product of SAMPLE_PRODUCTS) {
      const firestoreProduct = {
        id: product.id,
        slug: product.id,
        title: product.title,
        brand: product.brand,
        category: product.category,
        description: product.title,
        fullDescription: product.title,
        price: product.price,
        mrp: product.mrp,
        discountPercent: Math.round(
          ((product.mrp - product.price) / product.mrp) * 100,
        ),
        rating: product.rating,
        reviewCount: product.reviews,
        stock: product.stock,
        reorderLevel: 20,
        images: [product.image],
        highlights: ["Quality guaranteed"],
        specifications: {},
        sellerId: defaultSellerId,
        sellerName: "AZCO Global",
        deliveryEstimate: { min: 1, max: 2 },
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 0,
        purchaseCount: 0,
      };

      const productRef = db.collection("products").doc(product.id);
      batch.set(productRef, firestoreProduct);

      // Create inventory record
      const inventoryRef = db.collection("inventory").doc(product.id);
      const inventory = {
        productId: product.id,
        availableStock: product.stock,
        reservedStock: 0,
        damagedStock: 0,
        totalStock: product.stock,
        reorderLevel: 20,
        reorderQuantity: 50,
        lastRestockDate: new Date().toISOString(),
        lastRestockQuantity: product.stock,
        warehouseLocation: "WH-001",
        batchNumbers: ["BATCH-001"],
        lastUpdated: new Date().toISOString(),
      };
      batch.set(inventoryRef, inventory);

      count++;
      if (count % batchSize === 0) {
        await batch.commit();
        console.log(`✓ Migrated ${count}/${SAMPLE_PRODUCTS.length} products`);
        batch = db.batch();
      }
    }

    // Commit remaining batch
    if (count % batchSize !== 0) {
      await batch.commit();
    }

    console.log(`✓ Successfully migrated ${SAMPLE_PRODUCTS.length} products\n`);

    // Create sample coupons
    console.log("🎟️  Creating sample coupons...");
    const coupons = [
      {
        id: "coupon_new_user_20",
        code: "NEWUSER20",
        description: "20% off for new users",
        type: "percentage",
        value: 20,
        maxUsage: 1000,
        currentUsage: 245,
        minOrderValue: 500,
        applicableCategories: [],
        applicableSellers: [],
        validFrom: new Date().toISOString(),
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        active: true,
        createdAt: new Date().toISOString(),
        createdBy: "admin",
      },
    ];

    batch = db.batch();
    coupons.forEach((coupon) => {
      batch.set(db.collection("coupons").doc(coupon.id), coupon);
    });
    await batch.commit();
    console.log(`✓ Created ${coupons.length} sample coupons\n`);

    console.log("================================");
    console.log("✅ Migration completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   • Products migrated: ${SAMPLE_PRODUCTS.length}`);
    console.log(`   • Seller created: AZCO Global`);
    console.log(`   • Coupons created: ${coupons.length}`);
    console.log(`   • Database: shopfront-e496f\n`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    console.error("\nTroubleshooting:");
    console.error("1. Verify FIREBASE_ADMIN_SDK environment variable is set");
    console.error(
      "2. Verify Firestore database is created in Firebase Console",
    );
    console.error("3. Check Firebase security rules allow writes");
    console.error("4. Verify database URL is correct");
    process.exit(1);
  }
}

// Run the migration
runMigration();
