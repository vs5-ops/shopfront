# Firebase Setup & Online Mode Configuration

## Overview

The application now supports both **local** (JSON-based) and **Firebase** (Firestore-based) data persistence. Both repositories are fully implemented and wired in the server-side logic.

### Current Status

- ✅ User repository (auth, registration, password reset, etc.) — fully implemented for both local and Firebase modes
- ✅ Order repository (create orders, list by email) — fully implemented for both local and Firebase modes
- ✅ Firebase Admin SDK initialization — supports both JSON string and individual env variables

## Switching to Firebase Mode

### Step 1: Configure Environment Variables

Create or update `.env.local` with Firebase credentials:

```bash
# Data mode: local | firebase
DATA_MODE=firebase

# Firebase Public Config (from Firebase Console → Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com

# Firebase Admin SDK (Option A: Individual variables)
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@YOUR_PROJECT_ID.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# OR Option B: Use FIREBASE_ADMIN_SDK with complete JSON
# FIREBASE_ADMIN_SDK={"type":"service_account","project_id":"...","..."}

# Session & Auth
AUTH_SECRET=your-random-secret-string
ADMIN_BOOTSTRAP_PASSWORD=Admin@12345

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
```

### Step 2: Obtain Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Settings** (gear icon) → **Service Accounts**
4. Click **Generate New Private Key**
5. Copy the JSON content or extract individual fields:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep `\n` for line breaks)

### Step 3: Configure Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click **Create Database**
3. Choose **Production mode** (or **Test mode** for development)
4. Select your region
5. Create collection structure:

```
users/
├── {userId}
│   ├── id: string
│   ├── email: string
│   ├── passwordHash: string
│   ├── salt: string
│   ├── role: "admin" | "user"
│   ├── failedLoginAttempts: number
│   ├── lockUntil: string | null
│   ├── resetTokenHash: string | null
│   ├── resetTokenExpiresAt: string | null
│   ├── createdAt: string (ISO 8601)
│   └── updatedAt: string (ISO 8601)

orders/
├── {orderId}
│   ├── id: string
│   ├── email: string
│   ├── userId: string
│   ├── status: "pending_payment" | "paid" | "processing" | "shipped" | "delivered" | "cancelled"
│   ├── createdAt: string (ISO 8601)
│   ├── updatedAt: string (ISO 8601)
│   ├── pricing: { subtotal, tax, shipping, couponDiscount, total }
│   └── payload: { ...checkoutData }
```

### Step 4: Set Firestore Security Rules

In **Firestore Database** → **Rules**, use:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId || isAdmin();
    }
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if isAdmin();
    }
  }

  function isAdmin() {
    return request.auth.token.email == "info@azcoglobal.com";
  }
}
```

### Step 5: Test Connection

```bash
cd next-store
npm run dev
```

Visit `http://localhost:3000` and test:

- Register a new user → Should create user in Firestore
- Login → Should read user from Firestore
- Create order → Should persist in Firestore orders collection

## Troubleshooting

### "Firebase Admin SDK not initialized"

- Ensure `DATA_MODE=firebase` in `.env.local`
- Verify `FIREBASE_ADMIN_SDK` or all three individual variables are set
- Check private key format (should include `\n` for line breaks)

### "Failed to parse private key"

- Ensure the private key includes proper newlines: `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----`
- Do NOT escape quotes in private key
- Test parsing with: `node -e "console.log(JSON.parse(process.env.FIREBASE_PRIVATE_KEY))"`

### "Permission denied" errors in Firestore

- Check security rules allow your admin email
- Ensure Firebase Admin SDK is using correct service account
- Verify `FIREBASE_PROJECT_ID` matches your Firebase project

### Switching Back to Local Mode

Simply set:

```bash
DATA_MODE=local
```

All local JSON files are stored in `.localdb/` (created automatically).

## Implementation Details

### User Repository (Firestore)

- **Collection**: `users`
- **Read**: Query by normalized email
- **Write**: Direct document operations
- **Admin**: Auto-created with `ADMIN_BOOTSTRAP_PASSWORD`

### Order Repository (Firestore)

- **Collection**: `orders`
- **Create**: New document with `ord_${uuid}` ID
- **List**: Query by customer email

### Key Features

- ✅ Email normalization (lowercase, trimmed)
- ✅ Password hashing with salt (scrypt)
- ✅ Failed login attempt tracking
- ✅ Account lockout (15 min after 5 failed attempts)
- ✅ Password reset tokens (15 min expiry)
- ✅ Primary admin protection
- ✅ Timestamp tracking (ISO 8601)

## Migration from Local to Firebase

To migrate existing local data to Firebase:

```bash
# Export local JSON
cat .localdb/users.json
cat .localdb/orders.json

# Manually insert records into Firestore, or write a migration script
```

## Support

For issues, check:

- Firebase Console → Firestore → Data
- Firebase Console → Logs
- `.env.local` variables match exactly
- Private key has proper `\n` line breaks

---

**Last Updated**: April 2026
**Status**: Both local and Firebase modes fully implemented and tested
