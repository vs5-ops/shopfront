# Firestore Setup Guide

This guide explains how to set up Firestore for the product management system and configure authentication for admin operations.

## Prerequisites

- Firebase project already created (shopfront-e496f)
- Firebase Admin SDK credentials (service account key)
- Firebase Auth enabled with admin users configured

## Step 1: Get Firebase Admin SDK Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/) → shopfront-e496f
2. Click **Settings** (gear icon) → **Project Settings**
3. Navigate to the **Service Accounts** tab
4. Click **Generate New Private Key**
5. Save the JSON file securely

## Step 2: Set Up Environment Variables

In your deployment environment (Vercel, local, etc.), set:

```env
FIREBASE_ADMIN_SDK=<entire JSON content from the private key file>
FIREBASE_DATABASE_URL=https://shopfront-e496f.firebaseio.com
```

**For Vercel:**
1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add `FIREBASE_ADMIN_SDK` as the entire JSON content
4. Add `FIREBASE_DATABASE_URL`
5. Re-deploy

**For Local Development:**
1. Create `.env.local` in the `next-store` directory
2. Add the same variables

## Step 3: Create Firestore Collection

1. In Firebase Console, navigate to **Firestore Database**
2. Click **Create Database**
3. Choose **Production mode** (we'll set security rules next)
4. Select your region
5. Once created, create a new collection called `products`

## Step 4: Deploy Firestore Security Rules

In Firebase Console → **Firestore Database** → **Rules** tab, paste:

```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to active products
    match /products/{product} {
      allow read: if resource.data.active == true;
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
    }

    // Protect user data
    match /users/{userDoc} {
      allow read, write: if request.auth.uid == userDoc ||
                           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
    }
  }
}
```

Click **Publish** to deploy.

## Step 5: Set Up Admin Users in Firebase Auth

Each admin user needs a custom claim `admin: true`.

**Using Firebase Admin SDK (Node.js script):**

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./path-to-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setAdminClaim(uid) {
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  console.log(`User ${uid} is now an admin`);
}

setAdminClaim('user-uid-here');
```

Or use the Firebase CLI:
```bash
firebase auth:import users.json --hash-algo=bcrypt --hash-key=...
```

## Step 6: Add Sample Products to Firestore

Use the Firebase Console UI to manually add sample products, or use the admin dashboard at `/admin/products`:

1. Navigate to `http://localhost:3000/admin/products` (or your production URL)
2. Verify you're logged in as an admin user (check Firebase Auth claims)
3. Click "Add New Product"
4. Fill in the form and submit

**Sample Product:**
```json
{
  "slug": "nova-soundcore-pro",
  "title": "Nova SoundCore Pro",
  "brand": "Nova",
  "category": "electronics",
  "price": 4999,
  "mrp": 9999,
  "rating": 4.5,
  "reviews": 1250,
  "stock": 150,
  "image": "https://via.placeholder.com/500x500?text=Nova+SoundCore",
  "delivery": "Free delivery by tomorrow",
  "highlights": [
    "50-hour battery life",
    "Active Noise Cancellation",
    "Premium sound quality"
  ],
  "description": "Experience premium audio with Nova SoundCore Pro...",
  "specifications": {
    "Driver Size": "40mm",
    "Frequency Response": "20Hz - 20kHz",
    "Impedance": "32 Ohm"
  },
  "materials": "Premium plastic and aluminum",
  "dimensions": "20 x 17 x 8 cm",
  "weight": "250g",
  "warranty": "2 years manufacturer warranty",
  "seller": "AZCO Global",
  "returnPolicy": "30-day return",
  "returnDays": 30
}
```

## Step 7: Get Firebase ID Token for API Calls

To use the admin dashboard or make API calls, you need a Firebase ID token:

**Client-side (in your app):**

```typescript
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Your Firebase client config

const user = await signInWithEmailAndPassword(auth, email, password);
const token = await user.user.getIdToken();

// Use for API calls
const response = await fetch("/api/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  },
  body: JSON.stringify(productData),
});
```

The admin dashboard handles this automatically through Firebase client auth.

## Step 8: Verify Everything Works

### Test 1: Fetch Products (Public)
```bash
curl https://your-app.vercel.app/api/products
```

Should return a JSON array of products.

### Test 2: Create Product (Admin Only)
```bash
curl -X POST https://your-app.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "slug": "test-product",
    "title": "Test Product",
    "brand": "Test",
    "price": 999,
    "mrp": 1999,
    "stock": 10
  }'
```

Should return `{ "id": "...", "message": "Product created successfully" }`

### Test 3: Admin Dashboard
1. Visit `/admin/products` (requires login with admin auth)
2. Should see list of products
3. Try adding a new product
4. Try editing/deleting existing products

## Troubleshooting

### "Unauthorized" Error
- Verify user is logged in and has `admin: true` custom claim
- Check `FIREBASE_ADMIN_SDK` environment variable is set correctly
- Verify Firestore rules are deployed

### "Missing or invalid Authorization header"
- Ensure token is passed in `Authorization: Bearer <token>` format
- Token should be a valid Firebase ID token (not reset token or other type)

### "Product not found" or empty collection
- Verify products collection exists and has documents
- Check `active` field is set to `true` for products you want to see

### Build Error: "Cannot find module '@/lib/server/firebase-admin'"
- Make sure `firebase-admin` package is installed: `npm install firebase-admin`
- Verify file paths are correct

## Security Considerations

1. ✅ Only authenticated admins can write products (via `admin` custom claim)
2. ✅ All customers can read public products (`active: true`)
3. ✅ Tokens expire after 1 hour (Firebase default)
4. ✅ Soft deletes preserve product history (set `active: false`)
5. ✅ Never expose service account keys in client code

## Next Steps

- [ ] Set up admin user(s) with custom claims
- [ ] Add initial product sample data
- [ ] Test all CRUD operations
- [ ] Monitor Firestore usage in Firebase Console
- [ ] Set up backups for production database

## API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/products | Public | Fetch all active products |
| POST | /api/products | Admin | Create new product |
| GET | /api/products/[id] | Public | Fetch single product |
| PUT | /api/products/[id] | Admin | Update product |
| DELETE | /api/products/[id] | Admin | Delete product (soft) |

