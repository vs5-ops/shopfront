import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "@/lib/server/firebase-admin";
import { verifyAdminToken } from "@/lib/server/verify-token";
import { FirestoreProduct } from "@/lib/firestore-schema";

/**
 * GET /api/products
 * Fetch all active products from Firestore (public endpoint)
 */
export async function GET() {
  try {
    const db = getFirestore();
    const snapshot = await db.collection("products").where("active", "==", true).get();
    const products: (FirestoreProduct & { id: string })[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      } as FirestoreProduct & { id: string });
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Create new product (admin only, requires valid Firebase ID token)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin token
    const authorization = request.headers.get("authorization");
    await verifyAdminToken(authorization);

    const body = await request.json();
    const {
      slug,
      title,
      brand,
      category,
      price,
      mrp,
      rating,
      reviews,
      stock,
      image,
      delivery,
      highlights,
      description,
      specifications,
      materials,
      dimensions,
      weight,
      warranty,
      seller,
      returnPolicy,
      returnDays,
    } = body;

    // Validation
    if (!slug || !title || !brand || !price || !mrp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct = {
      slug,
      title,
      brand,
      category,
      price,
      mrp,
      rating: rating || 0,
      reviews: reviews || 0,
      stock,
      image,
      delivery,
      highlights: highlights || [],
      description,
      specifications: specifications || {},
      materials,
      dimensions,
      weight,
      warranty,
      seller,
      returnPolicy,
      returnDays,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const db = getFirestore();
    const docRef = await db.collection("products").add(newProduct);

    return NextResponse.json(
      { 
        id: docRef.id, 
        ...newProduct,
        message: "Product created successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    const errorMessage = (error as Error).message;
    
    if (errorMessage.includes("Unauthorized") || errorMessage.includes("Invalid") || errorMessage.includes("admin")) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
