import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "@/lib/server/firebase-admin";
import { verifyAdminToken } from "@/lib/server/verify-token";

interface InventoryItem {
  productId: string;
  availableStock: number;
  reservedStock: number;
  reorderLevel: number;
  lastUpdated: string;
}

/**
 * GET /api/inventory
 * Fetch all inventory items (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const authorization = request.headers.get("authorization");
    await verifyAdminToken(authorization);

    const db = getFirestore();
    const snapshot = await db.collection("inventory").get();

    const inventory: InventoryItem[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      inventory.push({
        productId: doc.id,
        availableStock: data.availableStock || 0,
        reservedStock: data.reservedStock || 0,
        reorderLevel: data.reorderLevel || 10,
        lastUpdated: data.lastUpdated || new Date().toISOString(),
      });
    });

    return NextResponse.json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/inventory
 * Update inventory for a product (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authorization = request.headers.get("authorization");
    await verifyAdminToken(authorization);

    const body = await request.json();
    const { productId, availableStock, reorderLevel } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 },
      );
    }

    const db = getFirestore();
    const inventoryRef = db.collection("inventory").doc(productId);

    await inventoryRef.set(
      {
        availableStock: availableStock || 0,
        reservedStock: 0,
        reorderLevel: reorderLevel || 10,
        lastUpdated: new Date().toISOString(),
      },
      { merge: true },
    );

    // Also update the product stock field
    await db
      .collection("products")
      .doc(productId)
      .update({
        stock: availableStock || 0,
        updatedAt: new Date().toISOString(),
      });

    return NextResponse.json({
      message: "Inventory updated successfully",
      productId,
      availableStock,
    });
  } catch (error) {
    console.error("Error updating inventory:", error);
    return NextResponse.json(
      { error: "Failed to update inventory" },
      { status: 500 },
    );
  }
}
