/**
 * Orders Management API Endpoint
 * Creates orders with inventory management, payment processing, and stock tracking
 */

import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/server/firebase-admin";
import {
  FirestoreOrder,
  ShippingAddressData,
  FirestoreInventory,
} from "@/lib/firestore-models";

interface CreateOrderRequest {
  items: Array<{
    productId: string;
    sellerId: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddress: ShippingAddressData;
  paymentMethod: "razorpay" | "upi" | "wallet" | "cod";
  couponCode?: string;
  notes?: string;
}

/**
 * POST: Create a new order
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

    const body: CreateOrderRequest = await request.json();
    const { items, shippingAddress, paymentMethod, couponCode, notes } = body;

    if (!items || items.length === 0 || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate inventory for all items
    for (const item of items) {
      const inventoryDoc = await admin
        .firestore()
        .collection("inventory")
        .doc(item.productId)
        .get();

      if (!inventoryDoc.exists) {
        return NextResponse.json(
          { error: `Inventory not found for product ${item.productId}` },
          { status: 404 },
        );
      }

      const inventory = inventoryDoc.data() as FirestoreInventory;
      if (inventory.availableStock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for product ${item.productId}. Available: ${inventory.availableStock}, Requested: ${item.quantity}`,
          },
          { status: 400 },
        );
      }
    }

    // Create order
    const orderId = admin.firestore().collection("orders").doc().id;
    const now = new Date().toISOString();

    // Calculate totals
    let subtotal = 0;
    const orderItems = items.map((item) => {
      const itemSubtotal = item.unitPrice * item.quantity;
      subtotal += itemSubtotal;
      return {
        productId: item.productId,
        productTitle: "", // Will be populated from product lookup
        sellerId: item.sellerId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: itemSubtotal,
        status: "pending",
      };
    });

    // Apply coupon if provided
    let couponDiscount = 0;
    if (couponCode) {
      const couponSnap = await admin
        .firestore()
        .collection("coupons")
        .where("code", "==", couponCode.toUpperCase())
        .limit(1)
        .get();

      if (!couponSnap.empty) {
        const coupon = couponSnap.docs[0].data();
        if (coupon.active && new Date(coupon.validTo) > new Date()) {
          if (subtotal >= coupon.minOrderValue) {
            couponDiscount =
              coupon.type === "percentage"
                ? (subtotal * coupon.value) / 100
                : Math.min(coupon.value, subtotal);
          }
        }
      }
    }

    const taxRate = 0.05; // 5% tax
    const tax = (subtotal - couponDiscount) * taxRate;
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping on orders > Rs.500
    const total = subtotal - couponDiscount + tax + shipping;

    const orderData: FirestoreOrder = {
      id: orderId,
      userId,
      userEmail: decodedToken.email || "",
      orderDate: now,
      status: "pending",
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping,
      couponDiscount: Math.round(couponDiscount * 100) / 100,
      total: Math.round(total * 100) / 100,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
      returnRequested: false,
      updatedAt: now,
    };

    // Start transaction
    const batch = admin.firestore().batch();

    // Save order
    batch.set(admin.firestore().collection("orders").doc(orderId), orderData);

    // Reserve inventory for each item
    for (const item of items) {
      const inventoryRef = admin
        .firestore()
        .collection("inventory")
        .doc(item.productId);

      batch.update(inventoryRef, {
        availableStock: admin.firestore.FieldValue.increment(-item.quantity),
        reservedStock: admin.firestore.FieldValue.increment(item.quantity),
        lastUpdated: now,
      });

      // Add stock movement log
      const movementId = admin.firestore().collection("moves").doc().id;
      batch.set(
        admin
          .firestore()
          .collection("inventory")
          .doc(item.productId)
          .collection("movements")
          .doc(movementId),
        {
          id: movementId,
          productId: item.productId,
          type: "outbound",
          quantity: item.quantity,
          reason: "order_created",
          orderId,
          reference: orderId,
          movedAt: now,
          movedBy: userId,
          beforeStock:
            (
              await admin
                .firestore()
                .collection("inventory")
                .doc(item.productId)
                .get()
            ).data()?.availableStock || 0,
          afterStock:
            ((
              await admin
                .firestore()
                .collection("inventory")
                .doc(item.productId)
                .get()
            ).data()?.availableStock || 0) - item.quantity,
        },
      );
    }

    await batch.commit();

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        order: orderData,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET: Fetch user's orders with pagination
 * Query parameters:
 * - limit: Number of orders (default 10, max 50)
 * - offset: Pagination offset (default 0)
 * - status: Filter by order status (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status");

    let query: FirebaseFirestore.Query = admin
      .firestore()
      .collection("orders")
      .where("userId", "==", userId);

    if (status) {
      query = query.where("status", "==", status);
    }

    query = query.orderBy("orderDate", "desc");

    // Get total count
    const countSnapshot = await query.get();
    const totalCount = countSnapshot.size;

    // Get paginated results
    const orders = await query.limit(limit).offset(offset).get();

    const ordersData = orders.docs.map((doc) => doc.data());

    return NextResponse.json({
      success: true,
      orders: ordersData,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
