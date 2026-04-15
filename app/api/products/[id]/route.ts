import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "@/lib/server/firebase-admin";
import { verifyAdminToken } from "@/lib/server/verify-token";

/**
 * PUT /api/products/[id]
 * Update product (admin only, requires valid Firebase ID token with admin claim)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Verify admin token
    const authorization = request.headers.get("authorization");
    await verifyAdminToken(authorization);

    const body = await request.json();
    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    const db = getFirestore();
    await db.collection("products").doc(id).update(updateData);

    return NextResponse.json(
      { 
        id,
        ...updateData,
        message: "Product updated successfully" 
      }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    const errorMessage = (error as Error).message;
    
    if (errorMessage.includes("Unauthorized") || errorMessage.includes("Invalid") || errorMessage.includes("admin")) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Delete product (admin only) - soft delete by setting active to false
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Verify admin token
    const authorization = request.headers.get("authorization");
    await verifyAdminToken(authorization);

    const db = getFirestore();
    // Soft delete - mark as inactive
    await db.collection("products").doc(id).update({
      active: false,
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { 
        id,
        message: "Product deleted successfully" 
      }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    const errorMessage = (error as Error).message;
    
    if (errorMessage.includes("Unauthorized") || errorMessage.includes("Invalid") || errorMessage.includes("admin")) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/products/[id]
 * Fetch single product by ID (public endpoint)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const db = getFirestore();
    const doc = await db.collection("products").doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const data = doc.data();
    return NextResponse.json({
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.() || new Date(),
      updatedAt: data?.updatedAt?.toDate?.() || new Date(),
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
