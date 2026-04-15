import * as admin from "firebase-admin";

/**
 * Initialize Firebase Admin SDK
 * Uses the FIREBASE_ADMIN_SDK environment variable (JSON key)
 */
let adminInstance: admin.app.App | null = null;

export function initializeAdmin() {
  if (adminInstance) {
    return adminInstance;
  }

  try {
    const serviceAccountJson = process.env.FIREBASE_ADMIN_SDK;
    if (!serviceAccountJson) {
      throw new Error("FIREBASE_ADMIN_SDK environment variable not set");
    }

    const serviceAccount = JSON.parse(serviceAccountJson);

    adminInstance = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    return adminInstance;
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
    throw error;
  }
}

// Initialize on module load
if (!adminInstance) {
  try {
    initializeAdmin();
  } catch (error) {
    console.error("Firebase Admin SDK initialization error:", error);
  }
}

export const admin_sdk = admin;

/**
 * Get Firestore database instance
 */
export function getFirestore() {
  if (!adminInstance) {
    throw new Error("Firebase Admin SDK not initialized");
  }
  return admin.firestore();
}

/**
 * Export commonly used services
 */
export { admin };
