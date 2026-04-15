/**
 * Firestore Data Migration & Initialization Script
 * Migrates products from mock catalog to Firestore and initializes collections
 *
 * Run with: npx ts-node scripts/migrate-to-firestore.ts
 */

import * as admin from "firebase-admin";
import { CATALOG } from "../lib/catalog";
import {
  FirestoreProduct,
  FirestoreInventory,
  FirestoreSeller,
} from "../lib/firestore-models";

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK || "{}");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();

/**
 * Migrate products from catalog to Firestore
 */
async function migrateProducts() {
  console.log("🔄 Starting product migration...");

  try {
    // Default seller (AZCO Global)
    const defaultSellerId = "seller_azco_global";

    // Check if default seller exists
    const sellerDoc = await db.collection("sellers").doc(defaultSellerId).get();
    if (!sellerDoc.exists) {
      console.log("📝 Creating default seller...");
      await db
        .collection("sellers")
        .doc(defaultSellerId)
        .set({
          id: defaultSellerId,
          name: "AZCO Global",
          email: "support@azcoglobal.com",
          phone: "+91-XXXX-XXXX",
          logo: "https://via.placeholder.com/200/FF6B35/FFFFFF?text=AZCO",
          description: "Your trusted online marketplace for quality products",
          registrationDate: new Date().toISOString(),
          verificationStatus: "verified",
          rating: 4.5,
          reviewCount: 1240,
          productCount: CATALOG.length,
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
    }

    // Batch write products
    let batch = db.batch();
    let count = 0;
    const batchSize = 25;

    for (const product of CATALOG) {
      const firestoreProduct: FirestoreProduct = {
        id: product.id,
        slug: product.slug,
        title: product.title,
        brand: product.brand,
        category: product.category,
        description: product.description,
        fullDescription: product.description, // Use description as fullDescription for now
        price: product.price,
        mrp: product.mrp,
        discountPercent: Math.round(
          ((product.mrp - product.price) / product.mrp) * 100,
        ),
        rating: product.rating,
        reviewCount: product.reviews,
        stock: product.stock,
        reorderLevel: 20,
        images: [product.image], // Start with single image from catalog
        highlights: product.highlights,
        specifications: product.specifications,
        materials: product.materials,
        dimensions: product.dimensions,
        weight: product.weight,
        warranty: product.warranty,
        returnPolicy: product.returnPolicy,
        returnDays: product.returnDays,
        sellerId: defaultSellerId,
        sellerName: "AZCO Global",
        deliveryEstimate: {
          min: 1,
          max: 2,
        },
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
      const inventory: FirestoreInventory = {
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
        console.log(`✓ Migrated ${count}/${CATALOG.length} products`);
        batch = db.batch();
      }
    }

    // Commit remaining batch
    if (count % batchSize !== 0) {
      await batch.commit();
    }

    console.log(
      `✓ Successfully migrated ${CATALOG.length} products to Firestore`,
    );
  } catch (error) {
    console.error("❌ Error migrating products:", error);
    throw error;
  }
}

/**
 * Create initial Firestore collections and indexes
 */
async function initializeCollections() {
  console.log("📦 Initializing Firestore collections...");

  try {
    // Create collections by adding dummy documents (if needed)
    const collections = [
      { name: "users", dummyDoc: { createdAt: new Date().toISOString() } },
      { name: "orders", dummyDoc: { createdAt: new Date().toISOString() } },
      { name: "reviews", dummyDoc: { createdAt: new Date().toISOString() } },
      { name: "sellers", dummyDoc: { createdAt: new Date().toISOString() } },
      { name: "coupons", dummyDoc: { createdAt: new Date().toISOString() } },
      { name: "support", dummyDoc: { createdAt: new Date().toISOString() } },
    ];

    for (const { name, dummyDoc } of collections) {
      const collectionRef = db.collection(name);
      const snapshot = await collectionRef.limit(1).get();

      if (snapshot.empty && name !== "products") {
        // Create a dummy document to ensure collection exists
        await collectionRef.doc("_init").set(dummyDoc);
        console.log(`✓ Created collection: ${name}`);
      }
    }

    console.log("✓ Collections initialized");
  } catch (error) {
    console.error("❌ Error initializing collections:", error);
    throw error;
  }
}

/**
 * Create sample coupons for testing
 */
async function createSampleCoupons() {
  console.log("🎟️  Creating sample coupons...");

  try {
    const coupons = [
      {
        id: "coupon_new_user_20",
        code: "NEWUSER20",
        description: "20% off for new users",
        type: "percentage" as const,
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
        type: "fixed" as const,
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

    let batch = db.batch();
    coupons.forEach((coupon) => {
      batch.set(db.collection("coupons").doc(coupon.id), coupon);
    });
    await batch.commit();

    console.log(`✓ Created ${coupons.length} sample coupons`);
  } catch (error) {
    console.error("❌ Error creating coupons:", error);
    throw error;
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  try {
    console.log("🚀 Starting Firestore Migration");
    console.log("================================\n");

    await initializeCollections();
    console.log();

    await migrateProducts();
    console.log();

    await createSampleCoupons();
    console.log();

    console.log("================================");
    console.log("✅ Migration completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   • Products: ${CATALOG.length}`);
    console.log(`   • Collections initialized`);
    console.log(`   • Sample coupons created`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
runMigration();
