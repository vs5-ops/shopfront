/**
 * Firestore Collection: products
 * Document structure for product items
 */

export interface FirestoreProduct {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: "electronics" | "fashion" | "home" | "sports" | "books";
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  stock: number;
  image: string;
  delivery: string;
  highlights: string[];
  description: string;
  specifications: Record<string, string>;
  materials?: string;
  dimensions?: string;
  weight?: string;
  warranty?: string;
  seller?: string;
  returnPolicy?: string;
  returnDays?: number;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

/**
 * Firestore Collection Setup Instructions:
 * 
 * 1. Go to Firebase Console → Your Project → Firestore Database
 * 2. Create a new collection called "products"
 * 3. Set security rules to:
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Allow anyone to read products
 *     match /products/{product} {
 *       allow read: if true;
 *       allow write: if request.auth.uid != null && request.auth.token.admin == true;
 *     }
 *   }
 * }
 * 
 * 4. Set custom claims for admin users via Firebase CLI or Cloud Functions:
 *    firebase auth:import user-data.json --hash-algo=bcrypt
 *    OR use Firebase Admin SDK to set custom claims
 */
