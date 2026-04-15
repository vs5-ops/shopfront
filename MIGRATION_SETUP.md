# Firestore Migration Setup Guide

**Status**: ✅ Migration script ready
**Script Location**: `next-store/migrate.js`
**Database**: shopfront-e496f
**Current Status**: Waiting for Firebase Admin SDK credentials

---

## What Happened

The migration script has been created and executed. It detected that the **FIREBASE_ADMIN_SDK** environment variable is not set, which is required to authenticate with Firebase and perform the database migration.

---

## How to Complete the Migration

### Step 1: Get Firebase Service Account Credentials

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com/
   - Login with your account

2. **Select Your Project**
   - Find and click: `shopfront-e496f`

3. **Access Service Accounts**
   - Click ⚙️ **Settings** (gear icon in top-left)
   - Select **Project Settings**
   - Navigate to the **Service Accounts** tab

4. **Generate Private Key**
   - Click: **"Generate New Private Key"**
   - A JSON file will download automatically
   - **Keep this file secure** - it contains sensitive credentials
   - Save it temporarily (you'll copy its contents)

### Step 2: Set Environment Variables

**Open PowerShell and run these commands:**

```powershell
# Navigate to project directory
cd "C:\Users\NBTC-SYSID-0013\Documents\Development\new Web store\new Web store\next-store"

# Copy the entire JSON file contents from the downloaded file
# Then set the environment variable (this is one command - copy the entire JSON):
$env:FIREBASE_ADMIN_SDK = @'
{
  "type": "service_account",
  "project_id": "shopfront-e496f",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
'@

# Set the database URL
$env:FIREBASE_DATABASE_URL = "https://shopfront-e496f.firebaseio.com"

# Verify they're set
echo "FIREBASE_ADMIN_SDK set: $($env:FIREBASE_ADMIN_SDK -ne $null)"
echo "FIREBASE_DATABASE_URL: $env:FIREBASE_DATABASE_URL"
```

### Step 3: Run the Migration

```powershell
# From the next-store directory, run:
node migrate.js
```

**Expected Output:**

```
🚀 Starting Firestore Migration

================================

📝 Creating default seller...
✓ Default seller created

📦 Migrating products to Firestore...
  ✓ Committed batch: 5/5
✓ Successfully migrated 5 products

🎟️  Creating sample coupons...
✓ Created 2 sample coupons

================================
✅ Migration completed successfully!

📊 Summary:
   • Products: 5
   • Seller: AZCO Global
   • Inventory records: 5
   • Coupons: 2
   • Database: shopfront-e496f
   • Collections created/populated:
     - products (5 docs)
     - inventory (5 docs)
     - sellers (1 doc)
     - coupons (2 docs)
```

---

## What Gets Migrated

### Collections Created/Populated:

#### 1. **products** (5 documents)

```javascript
{
  id: "p1",
  title: "Nova SoundCore Pro Earbuds",
  slug: "p1",
  brand: "Nova",
  category: "electronics",
  price: 2999,
  mrp: 4999,
  rating: 4.4,
  reviewCount: 3241,
  images: ["https://images.unsplash.com/..."],
  sellerId: "seller_azco_global",
  sellerName: "AZCO Global",
  // ... more fields
}
```

#### 2. **inventory** (5 documents, one per product)

```javascript
{
  productId: "p1",
  availableStock: 94,
  reservedStock: 0,
  totalStock: 94,
  reorderLevel: 20,
  warehouseLocation: "WH-001",
  // ... more fields
}
```

#### 3. **sellers** (1 document)

```javascript
{
  id: "seller_azco_global",
  name: "AZCO Global",
  email: "support@azcoglobal.com",
  verificationStatus: "verified",
  rating: 4.5,
  // ... more fields
}
```

#### 4. **coupons** (2 documents)

```javascript
{
  code: "NEWUSER20",
  description: "20% off for new users",
  type: "percentage",
  value: 20,
  active: true,
  // ... more fields
}
```

---

## Verify Migration Success

### Option 1: Firebase Console

1. Go to https://console.firebase.google.com/
2. Select `shopfront-e496f` project
3. Go to **Firestore Database**
4. Check these collections appear:
   - ✅ products (5 docs)
   - ✅ inventory (5 docs)
   - ✅ sellers (1 doc)
   - ✅ coupons (2 docs)

### Option 2: Command Line

```powershell
# Get summary of collections
firebase firestore:list-collections
```

---

## Next Steps After Migration

### 1. **Test the APIs Locally**

```bash
npm run dev
# Server runs on http://localhost:3000
```

### 2. **Test Review API**

```powershell
# Create a test review
curl -X POST http://localhost:3000/api/products/reviews `
  -H "Authorization: Bearer YOUR_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{
    "productId": "p1",
    "rating": 5,
    "title": "Excellent product!",
    "content": "Very satisfied with this purchase."
  }'
```

### 3. **Deploy to Vercel**

```bash
git add .
git commit -m "migration: Add migration script and run migration"
git push origin master
# Vercel auto-deploys
```

### 4. **Integrate Components**

- Add `<ProductReviews>` component to product detail pages
- Add `<ReviewSubmitForm>` component below reviews
- See: `PHASE1_COMPLETE.md` for integration guide

---

## Troubleshooting

### ❌ Error: "FIREBASE_ADMIN_SDK credentials not configured"

- **Solution**: Make sure you copied the entire JSON file and set the environment variable

### ❌ Error: "Firebase Admin SDK initialization failed"

- **Solution**: Verify your service account JSON is valid (no syntax errors)
- Check that the `project_id` matches `shopfront-e496f`

### ❌ Error: "Permission denied in Firestore rules"

- **Solution**: Update Firestore security rules to allow writes
- Go to Firestore → Rules tab and deploy:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if request.auth != null;
      }
    }
  }
  ```

### ❌ Error: "Connection timeout"

- **Solution**: Verify you set `FIREBASE_DATABASE_URL` correctly
- Should be: `https://shopfront-e496f.firebaseio.com`

---

## Security Notes

⚠️ **Important:**

- The service account JSON contains sensitive credentials
- Never commit this file to git
- Never share this JSON with anyone
- Delete the temporary downloaded JSON file after setting the environment variable
- Consider rotating/deleting the key after migration if not needed for production

---

## Optional: Verify Data in Firestore

After successful migration, you can query your data:

```javascript
// In browser console or API route:
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const products = await getDocs(collection(db, "products"));
products.forEach((doc) => console.log(doc.id, doc.data()));
```

---

## Command Reference

```bash
# Navigate to correct directory
cd "C:\Users\NBTC-SYSID-0013\Documents\Development\new Web store\new Web store\next-store"

# Run migration
node migrate.js

# If successful, proceed to deployment:
git add .
git commit -m "migration: Initial Firestore data migration"
git push origin master
```

---

✅ **Once migration is complete**, let me know and I can:

1. Deploy to Vercel
2. Run API endpoint tests
3. Integrate React components into product pages
4.