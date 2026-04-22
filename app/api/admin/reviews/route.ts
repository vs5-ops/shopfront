/**
 * Admin Reviews Management API Endpoint
 * GET - Fetch all reviews for moderation
 * POST - Moderate reviews (approve/reject)
 */

import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/server/firebase-admin";
import { verifyAdminToken } from "@/lib/server/verify-token";

interface ModerateReviewRequest {
  reviewId: string;
  action: "approve" | "reject";
  response?: string;
}

/**
 * GET: Fetch all reviews for moderation
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const authorization = request.headers.get("authorization");
    await verifyAdminToken(authorization);

    const reviews: any[] = [];

    // Get all products and their reviews
    const productsSnapshot = await admin
      .firestore()
      .collection("products")
      .get();

    for (const productDoc of productsSnapshot.docs) {
      const productId = productDoc.id;
      const productData = productDoc.data();

      const reviewsSnapshot = await admin
        .firestore()
        .collection("products")
        .doc(productId)
        .collection("reviews")
        .orderBy("createdAt", "desc")
        .get();

      reviewsSnapshot.forEach((reviewDoc) => {
        const reviewData = reviewDoc.data();
        reviews.push({
          id: reviewDoc.id,
          productId,
          productTitle: productData.title || `Product ${productId}`,
          ...reviewData,
        });
      });
    }

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews for moderation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST: Moderate a review
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authorization = request.headers.get("authorization");
    await verifyAdminToken(authorization);

    const body: ModerateReviewRequest = await request.json();
    const { reviewId, action, response } = body;

    if (!reviewId || !action) {
      return NextResponse.json(
        { error: "Missing required fields: reviewId, action" },
        { status: 400 },
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 },
      );
    }

    // Find the review across all products
    const productsSnapshot = await admin
      .firestore()
      .collection("products")
      .get();
    let reviewFound = false;
    let productId = "";

    for (const productDoc of productsSnapshot.docs) {
      const reviewDoc = await admin
        .firestore()
        .collection("products")
        .doc(productDoc.id)
        .collection("reviews")
        .doc(reviewId)
        .get();

      if (reviewDoc.exists) {
        reviewFound = true;
        productId = productDoc.id;
        break;
      }
    }

    if (!reviewFound) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const now = new Date().toISOString();
    const updateData: any = {
      status: action === "approve" ? "approved" : "rejected",
      updatedAt: now,
    };

    if (action === "reject" && response) {
      updateData.adminResponse = response;
      updateData.adminResponseDate = now;
    }

    // Update the review
    await admin
      .firestore()
      .collection("products")
      .doc(productId)
      .collection("reviews")
      .doc(reviewId)
      .update(updateData);

    // Update product rating aggregate
    await updateProductRating(productId);

    return NextResponse.json({
      success: true,
      message: `Review ${action}d successfully`,
    });
  } catch (error) {
    console.error("Error moderating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Helper function to update product rating aggregate
 */
async function updateProductRating(productId: string) {
  try {
    const reviewsSnapshot = await admin
      .firestore()
      .collection("products")
      .doc(productId)
      .collection("reviews")
      .where("status", "==", "approved")
      .get();

    if (reviewsSnapshot.empty) {
      // No approved reviews yet
      await admin.firestore().collection("products").doc(productId).update({
        rating: 0,
        reviewCount: 0,
      });
      return;
    }

    const reviews = reviewsSnapshot.docs.map((doc) => doc.data());

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await admin
      .firestore()
      .collection("products")
      .doc(productId)
      .update({
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length,
        updatedAt: new Date().toISOString(),
      });
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
}
