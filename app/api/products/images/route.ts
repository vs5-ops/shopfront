/**
 * Product Image Upload API
 * Handles uploading images to Firebase Storage and updating product records
 */

import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/server/firebase-admin";

interface ImageUploadRequest {
  productId: string;
  fileName: string;
  base64Image: string;
  isMainImage?: boolean;
}

/**
 * POST: Upload image to Firebase Storage
 * Expects multipart/form-data with file
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await admin.auth().verifyIdToken(token);

    const formData = await request.formData();
    const productId = formData.get("productId") as string;
    const file = formData.get("file") as File;
    const isMainImage = formData.get("isMainImage") === "true";

    if (!productId || !file) {
      return NextResponse.json(
        { error: "Missing productId or file" },
        { status: 400 },
      );
    }

    // Verify product exists and user is seller
    const productDoc = await admin
      .firestore()
      .collection("products")
      .doc(productId)
      .get();

    if (!productDoc.exists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = productDoc.data();
    if (product?.sellerId !== decodedToken.uid) {
      return NextResponse.json(
        { error: "Unauthorized: Not the product owner" },
        { status: 403 },
      );
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}-${randomId}-${file.name}`;
    const storagePath = `products/${productId}/images/${fileName}`;

    // Create bucket reference
    const bucket = admin.storage().bucket();
    const file_ref = bucket.file(storagePath);

    // Upload to Firebase Storage
    await file_ref.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          productId,
          uploadedAt: new Date().toISOString(),
          uploadedBy: decodedToken.uid,
        },
      },
    });

    // Generate public URL
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(storagePath)}?alt=media`;

    // Update product document
    if (isMainImage) {
      // Set as first image
      const currentImages = product?.images || [];
      const updatedImages = [
        publicUrl,
        ...currentImages.filter((url: string) => url !== publicUrl),
      ];

      await admin
        .firestore()
        .collection("products")
        .doc(productId)
        .update({
          images: updatedImages.slice(0, 10), // Max 10 images
          image: publicUrl, // Legacy field for compatibility
          updatedAt: new Date().toISOString(),
        });
    } else {
      // Add to additional images
      const currentImages = product?.images || [];
      if (!currentImages.includes(publicUrl)) {
        const updatedImages = [...currentImages, publicUrl];
        await admin
          .firestore()
          .collection("products")
          .doc(productId)
          .update({
            images: updatedImages.slice(0, 10),
            updatedAt: new Date().toISOString(),
          });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      image: {
        url: publicUrl,
        storagePath,
        fileName,
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE: Remove image from product
 */
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await admin.auth().verifyIdToken(token);

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const imageUrl = searchParams.get("imageUrl");

    if (!productId || !imageUrl) {
      return NextResponse.json(
        { error: "Missing productId or imageUrl" },
        { status: 400 },
      );
    }

    // Verify product exists and user is seller
    const productDoc = await admin
      .firestore()
      .collection("products")
      .doc(productId)
      .get();

    if (!productDoc.exists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = productDoc.data();
    if (product?.sellerId !== decodedToken.uid) {
      return NextResponse.json(
        { error: "Unauthorized: Not the product owner" },
        { status: 403 },
      );
    }

    // Extract storage path from URL
    const urlParts = imageUrl.split("/o/")[1];
    if (!urlParts) {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }

    const storagePath = decodeURIComponent(urlParts.split("?")[0]);

    // Delete from Firebase Storage
    const bucket = admin.storage().bucket();
    await bucket.file(storagePath).delete();

    // Update product document
    const currentImages = product?.images || [];
    const updatedImages = currentImages.filter(
      (url: string) => url !== imageUrl,
    );

    await admin.firestore().collection("products").doc(productId).update({
      images: updatedImages,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
