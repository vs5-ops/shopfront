/**
 * Admin Sellers Management API Endpoint
 * GET - Fetch all sellers for management
 * POST - Verify or reject seller applications
 */

import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/server/firebase-admin";
import { verifyAdminToken } from "@/lib/server/verify-token";

interface VerifySellerRequest {
  sellerId: string;
  action: "verify" | "reject";
  notes?: string;
}

/**
 * GET: Fetch all sellers for management
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const authorization = request.headers.get("authorization");
    await verifyAdminToken(authorization);

    const sellersSnapshot = await admin.firestore().collection("sellers").get();
    const sellers: any[] = [];

    for (const sellerDoc of sellersSnapshot.docs) {
      const sellerData = sellerDoc.data();

      // Count products for this seller
      const productsSnapshot = await admin
        .firestore()
        .collection("products")
        .where("sellerId", "==", sellerDoc.id)
        .count()
        .get();

      sellers.push({
        id: sellerDoc.id,
        ...sellerData,
        productCount: productsSnapshot.data().count,
      });
    }

    return NextResponse.json(sellers);
  } catch (error) {
    console.error("Error fetching sellers for management:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST: Verify or reject a seller application
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authorization = request.headers.get("authorization");
    await verifyAdminToken(authorization);

    const body: VerifySellerRequest = await request.json();
    const { sellerId, action, notes } = body;

    if (!sellerId || !action) {
      return NextResponse.json(
        { error: "Missing required fields: sellerId, action" },
        { status: 400 },
      );
    }

    if (!["verify", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'verify' or 'reject'" },
        { status: 400 },
      );
    }

    // Get seller document
    const sellerDoc = await admin
      .firestore()
      .collection("sellers")
      .doc(sellerId)
      .get();

    if (!sellerDoc.exists) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    const sellerData = sellerDoc.data();
    const now = new Date().toISOString();

    const updateData: any = {
      verificationStatus: action === "verify" ? "verified" : "rejected",
      isActive: action === "verify",
      lastUpdated: now,
    };

    if (action === "reject" && notes) {
      updateData.rejectionNotes = notes;
      updateData.rejectionDate = now;
    } else if (action === "verify") {
      updateData.verificationDate = now;
    }

    // Update seller document
    await admin
      .firestore()
      .collection("sellers")
      .doc(sellerId)
      .update(updateData);

    // Update user document if verifying
    if (action === "verify") {
      // Find user by sellerId
      const userSnapshot = await admin
        .firestore()
        .collection("users")
        .where("sellerId", "==", sellerId)
        .limit(1)
        .get();

      if (!userSnapshot.empty) {
        await admin
          .firestore()
          .collection("users")
          .doc(userSnapshot.docs[0].id)
          .update({
            role: "seller",
            sellerVerified: true,
            updatedAt: now,
          });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seller ${action}d successfully`,
    });
  } catch (error) {
    console.error("Error verifying seller:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
