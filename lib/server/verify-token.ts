import { admin } from "@/lib/server/firebase-admin";

/**
 * Verify Firebase ID token from Authorization header
 * Returns user ID if valid, throws error if invalid
 */
export async function verifyAdminToken(authHeader: string | null): Promise<string> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Check for admin claim
    if (!decodedToken.admin) {
      throw new Error("User does not have admin privileges");
    }

    return decodedToken.uid;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid or expired token");
  }
}

/**
 * Verify token without requiring admin claim
 * Used for operations that don't require admin access
 */
export async function verifyToken(authHeader: string | null): Promise<string> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }

  const token = authHeader.substring(7);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid or expired token");
  }
}
