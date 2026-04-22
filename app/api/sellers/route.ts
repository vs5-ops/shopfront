/**
 * Sellers Management API Endpoint
 * POST - Register a new seller
 * GET - Fetch seller details
 */

import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/server/firebase-admin";
import { FirestoreSeller } from "@/lib/firestore-models";

interface SellerRegistrationRequest {
  name: string;
  email: string;
  phone: string;
  description: string;
  website?: string;
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
}

/**
 * POST: Register a new seller
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await admin.auth().verifyIdToken(token);

    const body: SellerRegistrationRequest = await request.json();
    const { name, email, phone, description, website, address, bankDetails } =
      body;

    // Validate required fields
    if (!name || !email || !phone || !description || !address || !bankDetails) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if seller already exists
    const existingQuery = await admin
      .firestore()
      .collection("sellers")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existingQuery.empty) {
      return NextResponse.json(
        { error: "Seller with this email already exists" },
        { status: 400 },
      );
    }

    // Create seller document
    const sellerId = admin.firestore().collection("sellers").doc().id;
    const now = new Date().toISOString();

    const sellerData: FirestoreSeller = {
      id: sellerId,
      name,
      email,
      phone,
      logo: "",
      description,
      website,
      registrationDate: now,
      verificationStatus: "pending",
      rating: 0,
      reviewCount: 0,
      productCount: 0,
      totalSales: 0,
      responseTime: 24,
      returnRate: 0,
      cancellationRate: 0,
      address,
      bankDetails,
      documents: {
        panCard: "",
        gstCertificate: "",
        businessProof: "",
      },
      isActive: false,
      joinedAt: now,
      lastUpdated: now,
    };

    await admin.firestore().collection("sellers").doc(sellerId).set(sellerData);

    // Create user document for seller with seller role
    await admin.firestore().collection("users").doc(decodedToken.uid).update({
      role: "seller",
      sellerId: sellerId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Seller registration submitted. Awaiting verification.",
        seller: sellerData,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error registering seller:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET: Fetch seller details
 * Query parameters:
 * - sellerId: Seller ID
 * - includeAnalytics: Include seller analytics (default false)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId");
    const includeAnalytics = searchParams.get("includeAnalytics") === "true";

    if (!sellerId) {
      return NextResponse.json(
        { error: "sellerId query parameter is required" },
        { status: 400 },
      );
    }

    const sellerDoc = await admin
      .firestore()
      .collection("sellers")
      .doc(sellerId)
      .get();

    if (!sellerDoc.exists) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    const seller = sellerDoc.data();

    // Count products
    const productsSnapshot = await admin
      .firestore()
      .collection("products")
      .where("sellerId", "==", sellerId)
      .count()
      .get();

    const response: any = {
      success: true,
      seller: {
        ...seller,
        productCount: productsSnapshot.data().count,
      },
    };

    // Optionally include analytics
    if (includeAnalytics) {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const analyticsDoc = await admin
        .firestore()
        .collection("sellers")
        .doc(sellerId)
        .collection("analytics")
        .doc(currentMonth)
        .get();

      if (analyticsDoc.exists) {
        response.analytics = analyticsDoc.data();
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching seller:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
