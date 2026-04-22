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
    let serviceAccount: any;

    // Try to use FIREBASE_ADMIN_SDK first (JSON string)
    const serviceAccountJson = process.env.FIREBASE_ADMIN_SDK;
    if (serviceAccountJson) {
      serviceAccount = JSON.parse(serviceAccountJson);
    } else {
      // Fall back to individual env variables
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY;

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
          "FIREBASE_ADMIN_SDK or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY must be set",
        );
      }

      serviceAccount = {
        type: "service_account",
        project_id: projectId,
        private_key_id: "",
        private_key: privateKey.replace(/\\n/g, "\n"),
        client_email: clientEmail,
        client_id: "",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:
          "https://www.googleapis.com/oauth2/v1/certs",
      };
    }

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
