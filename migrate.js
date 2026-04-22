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
  console.warn("\n⚠️  FIREBASE_ADMIN_SDK credentials not configured\n");
  console.log(
    "To run the migration, you need to set the FIREBASE_ADMIN_SDK environment variable.",
  );
  console.log("\n📋 Steps to get the service account credentials:\n");
  console.log("1. Go to: https://console.firebase.google.com/");
  console.log("2. Select project: shopfront-e496f");
  console.log("3. Click ⚙️ Settings (gear icon) → Project Settings");
  console.log('4. Go to the "Service Accounts" tab');
  console.log('5. Click "Generate New Private Key"');
  console.log("6. A JSON file will download with the full service account");
  console.log("\n7. Set environment variable (PowerShell):");
  console.log("   $env:FIREBASE_ADMIN_SDK = @'");
  console.log("   < paste entire JSON contents here >");
  console.log("   '@");
  console.log("\n8. Set database URL:");
  console.log(
    '   $env:FIREBASE_DATABASE_URL = "https://shopfront-e496f.firebaseio.com"',
  );
  console.log("\n9. Run this script again:");
  console.log("   node migrate.js\n");
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
  {
    id: "p3",
    title: "Urban Fit Pro Smartwatch",
    brand: "Urban",
    category: "electronics",
    price: 5999,
    mrp: 9999,
    rating: 4.6,
    reviews: 2891,
    stock: 145,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  },
  {
    id: "p4",
    title: "Aqua Shield Water Bottle",
    brand: "Aqua",
    category: "home",
    price: 899,
    mrp: 1499,
    rating: 4.2,
    reviews: 876,
    stock: 287,
    image: "https://images.unsplash.com/photo-1602734929591-44a7147e0b98",
  },
  {
    id: "p5",
    title: "Cloud Comfort Pillow",
    brand: "Cloud",
    category: "home",
    price: 1299,
    mrp: 2299,
    rating: 4.5,
    reviews: 1543,
    stock: 156,
    image: "https://images.unsplash.com/photo-1584881604436-071a6965ba1b",
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
        description: "Your trusted online marketplace for quality products",
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
        bankDetails: {
          accountHolderName: "AZCO Global",
          accountNumber: "XXXXXXXXXXXX",
          ifscCode: "HDFC0001234",
          bankName: "HDFC Bank",
        },
        documents: {
          panCard: "AAAPA1234X",
          gstCertificate: "18AABCU1234H1Z0",
          businessProof: "verified",
        },
        isActive: true,
        joinedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      });
    console.log("✓ Default seller created");

    // Migrate products
    console.log("\n📦 Migrating products to Firestore...");
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
        highlights: ["Quality guaranteed", "Fast shipping"],
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
        console.log(`  ✓ Committed batch: ${count}/${SAMPLE_PRODUCTS.length}`);
        batch = db.batch();
      }
    }

    // Commit remaining batch
    if (count % batchSize !== 0) {
      await batch.commit();
    }

    console.log(`✓ Successfully migrated ${SAMPLE_PRODUCTS.length} products`);

    // Create sample coupons
    console.log("\n🎟️  Creating sample coupons...");
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
      {
        id: "coupon_summer_flat_500",
        code: "SUMMER500",
        description: "Flat Rs.500 off on purchases above Rs.3000",
        type: "fixed",
        value: 500,
        maxUsage: 500,
        currentUsage: 89,
        minOrderValue: 3000,
        applicableCategories: [],
        applicableSellers: [],
        validFrom: new Date().toISOString(),
        validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
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
    console.log(`✓ Created ${coupons.length} sample coupons`);

    console.log("\n================================");
    console.log("✅ Migration completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   • Products: ${SAMPLE_PRODUCTS.length}`);
    console.log(`   • Seller: AZCO Global`);
    console.log(`   • Inventory records: ${SAMPLE_PRODUCTS.length}`);
    console.log(`   • Coupons: ${coupons.length}`);
    console.log(`   • Database: shopfront-e496f`);
    console.log(`   • Collections created/populated:`);
    console.log(`     - products (${SAMPLE_PRODUCTS.length} docs)`);
    console.log(`     - inventory (${SAMPLE_PRODUCTS.length} docs)`);
    console.log(`     - sellers (1 doc)`);
    console.log(`     - coupons (${coupons.length} docs)\n`);
    console.log("Next steps:");
    console.log("  1. Verify data in Firebase Console → Firestore");
    console.log("  2. Deploy to Vercel: git push origin master");
    console.log("  3. Test APIs with: npm run dev");
    console.log("  4. Read PHASE1_COMPLETE.md for testing endpoints\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    console.error("\nTroubleshooting:");
    console.error("1. Verify FIREBASE_ADMIN_SDK environment variable is set");
    console.error("2. Verify Firestore database exists in Firebase Console");
    console.error("3. Check Firestore security rules allow writes");
    console.error("4. Verify Firebase project ID is correct: shopfront-e496f");
    console.error("\nFull error:");
    console.error(error);
    process.exit(1);
  }
}

// Run the migration
runMigration();
