/**
 * Reviews API Endpoint
 * POST - Submit a new review
 * GET - Fetch reviews for a product with pagination and filtering
 */

import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/server/firebase-admin";
import { FirestoreReview } from "@/lib/firestore-models";

interface ReviewSubmitRequest {
  productId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  content: string;
  images?: string[];
}

/**
 * POST: Submit a new review
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;
    const userEmail = decodedToken.email || "";

    const body: ReviewSubmitRequest = await request.json();
    const { productId, rating, title, content, images = [] } = body;

    // Validate inputs
    if (!productId || !rating || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields: productId, rating, title, content" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    // Verify product exists
    const productDoc = await admin
      .firestore()
      .collection("products")
      .doc(productId)
      .get();

    if (!productDoc.exists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if user has purchased this product (verify buyer)
    const orderSnapshot = await admin
      .firestore()
      .collection("orders")
      .where("userId", "==", userId)
      .where("items", "array-contains", { productId })
      .where("status", "==", "delivered")
      .limit(1)
      .get();

    const verified = !orderSnapshot.empty;

    // Create review document
    const reviewId = admin.firestore().collection("reviews").doc().id;
    const now = new Date().toISOString();

    const reviewData: FirestoreReview = {
      id: reviewId,
      userId,
      userName: decodedToken.name || "Anonymous",
      email: userEmail,
      userAvatar: decodedToken.picture,
      rating,
      title,
      content,
      images,
      helpful: 0,
      unhelpful: 0,
      verified,
      purchaseDate: verified
        ? orderSnapshot.docs[0].get("orderDate")
        : undefined,
      createdAt: now,
      updatedAt: now,
      status: "pending", // Changed from "approved" to "pending" for moderation
      adminResponse: undefined,
      adminResponseDate: undefined,
    };

    // Save review in subcollection
    await admin
      .firestore()
      .collection("products")
      .doc(productId)
      .collection("reviews")
      .doc(reviewId)
      .set(reviewData);

    // Update product rating aggregate
    await updateProductRating(productId);

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully",
        review: reviewData,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET: Fetch reviews for a product
 * Query parameters:
 * - productId: Required
 * - limit: Number of reviews (default 10)
 * - offset: Pagination offset (default 0)
 * - sortBy: "recent" | "helpful" | "rating" (default "recent")
 * - filterRating: 1-5 (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");
    const sortBy = searchParams.get("sortBy") || "recent";
    const filterRating = searchParams.get("filterRating");

    if (!productId) {
      return NextResponse.json(
        { error: "productId query parameter is required" },
        { status: 400 },
      );
    }

    let query: FirebaseFirestore.Query = admin
      .firestore()
      .collection("products")
      .doc(productId)
      .collection("reviews")
      .where("status", "==", "approved");

    if (filterRating) {
      const rating = parseInt(filterRating);
      if (rating >= 1 && rating <= 5) {
        query = query.where("rating", "==", rating);
      }
    }

    // Apply sorting
    if (sortBy === "helpful") {
      query = query.orderBy("helpful", "desc").orderBy("createdAt", "desc");
    } else if (sortBy === "rating") {
      query = query.orderBy("rating", "desc").orderBy("createdAt", "desc");
    } else {
      query = query.orderBy("createdAt", "desc");
    }

    // Get total count
    const countSnapshot = await query.get();
    const totalCount = countSnapshot.size;

    // Get paginated results
    const reviews = await query.limit(limit).offset(offset).get();

    const reviewsData = reviews.docs.map((doc) => doc.data());

    return NextResponse.json({
      success: true,
      reviews: reviewsData,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
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
      // No reviews yet
      await admin.firestore().collection("products").doc(productId).update({
        rating: 0,
        reviewCount: 0,
      });
      return;
    }

    const reviews = reviewsSnapshot.docs.map(
      (doc) => doc.data() as FirestoreReview,
    );

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
