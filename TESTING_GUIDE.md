# Step-by-Step Guide: Deploy Security Rules & Configure API Keys

## Task 1: Deploy Firestore Security Rules ✅

### Prerequisites Check
1. **Install Firebase CLI** (if not already installed):
   ```powershell
   npm install -g firebase-tools
   ```

2. **Verify installation**:
   ```powershell
   firebase --version
   ```

### Step-by-Step Deployment

#### Step 1: Login to Firebase
```powershell
firebase login
```
- This will open a browser window
- Sign in with your Google account that has access to the Firebase project
- Grant permissions when prompted

#### Step 2: Initialize Firebase (if not done yet)
```powershell
cd "c:\Users\NBTC-SYSID-0013\Documents\Development\new Web store\new Web store"
firebase init
```
- Select: **Firestore** (use spacebar to select)
- Choose: **Use an existing project**
- Select your project: **shopfront-e496f**
- Accept default for rules file: **firestore.rules** (press Enter)
- Accept default for indexes: **firestore.indexes.json** (press Enter)

#### Step 3: Deploy Security Rules
```powershell
firebase deploy --only firestore:rules
```

**Expected Output:**
```
=== Deploying to 'shopfront-e496f'...

i  deploying firestore
i  firestore: checking firestore.rules for compilation errors...
✔  firestore: rules file firestore.rules compiled successfully
i  firestore: uploading rules firestore.rules...
✔  firestore: released rules firestore.rules to cloud.firestore

✔  Deploy complete!
```

#### Step 4: Verify Rules Deployed
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **shopfront-e496f**
3. Go to **Firestore Database** → **Rules** tab
4. You should see your rules with a timestamp showing when they were last deployed

### Troubleshooting

**Error: "No project active"**
```powershell
firebase use shopfront-e496f
```

**Error: "Not logged in"**
```powershell
firebase logout
firebase login
```

**Error: "Permission denied"**
- Ensure you're logged in with the correct Google account
- Check that your account has Owner/Editor role in the Firebase project

---

## Task 2: Configure API Key Restrictions in Google Cloud Console 🔐

### Why This Is Important
Firebase API keys are safe to expose in frontend code, but adding restrictions provides an extra layer of security by limiting which domains can use your API key.

### Step-by-Step Configuration

#### Step 1: Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project: **shopfront-e496f**
3. If prompted, agree to terms of service

#### Step 2: Navigate to API Credentials
1. Click the hamburger menu (☰) in top-left
2. Go to **APIs & Services** → **Credentials**
3. Find "Browser key (auto created by Firebase)" in the API keys list
4. Click the key name or the edit icon (pencil)

#### Step 3: Set Application Restrictions
1. Under **Application restrictions**, select **HTTP referrers (web sites)**
2. Click **+ ADD AN ITEM**
3. Add these referrers (one at a time):

   ```
   https://azcoglobal.com/*
   https://*.azcoglobal.com/*
   http://localhost:*
   http://127.0.0.1:*
   ```

   **Note:** The localhost entries allow local development

4. Click **DONE** after adding each referrer

#### Step 4: Set API Restrictions
1. Scroll down to **API restrictions**
2. Select **Restrict key**
3. Click **Select APIs** dropdown
4. Search for and enable these APIs (check the boxes):
   - ✅ **Identity Toolkit API**
   - ✅ **Token Service API**
   - ✅ **Cloud Firestore API**
   - ✅ **Firebase Installations API**
   - ✅ **Firebase Storage API**
   
5. Click **OK**

#### Step 5: Save Changes
1. Scroll to bottom
2. Click **SAVE**
3. Wait for confirmation message

#### Step 6: Enable Required APIs (if not already enabled)
1. Go back to **APIs & Services** → **Library**
2. Search for and enable these if not already enabled:
   - Identity Toolkit API
   - Cloud Firestore API
   - Firebase Storage API
   - Firebase Authentication API

### Verification
1. Open your website in a browser
2. Open Developer Console (F12)
3. Try logging in or accessing Firestore
4. If everything works, restrictions are configured correctly!
5. Try accessing from a different domain - should be blocked

### Important Notes
- ⚠️ API restrictions may take 5-10 minutes to propagate
- ⚠️ If you change your domain, update the referrers list
- ⚠️ Always include localhost referrers for development
- ✅ These restrictions don't affect security rules (which are the main security layer)

---

## Task 3: Test Complete Checkout Flow 🛒

### Pre-Testing Checklist
- [x] Razorpay live keys configured: `rzp_live_RfZZqIrL7mkHfZ`
- [x] Test mode disabled: `testMode: false`
- [ ] Firestore rules deployed
- [ ] API keys restricted
- [ ] Website accessible

### Complete Checkout Test Procedure

#### Phase 1: User Registration & Authentication (5 minutes)

1. **Register New User**
   - Go to your website: https://azcoglobal.com
   - Click "Sign In/Register"
   - Create a new test account:
     - Email: `test@example.com`
     - Password: `TestPassword123!`
   - Click "Register"

2. **Verify Email**
   - Check your test email inbox
   - Click the verification link from Firebase
   - Return to the website
   - You should be logged in

3. **Verify Authentication**
   - Check that your name/email appears in the header
   - Navigate to `//orders` - should load without errors
   - Navigate to `//cart` - should load without errors

#### Phase 2: Product Browsing & Cart (5 minutes)

1. **Browse Products**
   - Go to homepage (`/`)
   - Products should load and display
   - Try filtering by category
   - Try searching for products

2. **Add to Cart**
   - Click on a product
   - Modal should open with product details
   - Set quantity (try 2)
   - Click "Add to Cart"
   - Toast notification should appear
   - Cart icon should show item count

3. **Verify Cart**
   - Navigate to `//cart`
   - Products should be listed
   - Try updating quantity
   - Try removing an item
   - Add item back
   - Verify total price calculation

#### Phase 3: Checkout Process (10 minutes)

1. **Initiate Checkout**
   - From cart page, click "Proceed to Checkout"
   - Should redirect to `//checkout`
   - Order summary should display on right side

2. **Fill Shipping Address**
   ```
   Full Name: Test User
   Phone: 9876543210
   Address: 123 Test Street
   City: Mumbai
   State: Maharashtra
   PIN: 400001
   ```
   - Click "Continue to Payment"

3. **Test Razorpay Payment**

   **Option A: Test with Real Card (⚠️ LIVE MODE - REAL CHARGES)**
   - Use a real card (will charge actual money!)
   - Complete the payment
   - **IMPORTANT:** Only do this if you're ready for live transactions

   **Option B: Cancel Payment (Recommended for testing)**
   - Click "Pay Now"
   - Razorpay modal should open
   - Check that your business name appears
   - Click "X" to cancel
   - Test the failure flow

4. **Verify Order Creation**
   - After successful payment (or cancellation)
   - Go to `//orders`
   - Your order should appear
   - Click "View Details"
   - Verify order information

#### Phase 4: Admin Panel Verification (5 minutes)

1. **Access Admin Panel**
   - Sign in with admin account: `info@azcoglobal.com`
   - Go to `//admin`
   - Should load without errors

2. **Check Order Management**
   - Click "Orders" tab
   - Your test order should appear
   - Click "View Details"
   - Try changing order status
   - Verify it saves

3. **Test Product Management**
   - Click "Add Product" tab
   - Try adding a test product
   - Verify it appears in product list
   - Try editing the product
   - Try deleting the product

#### Phase 5: Edge Cases & Error Handling (5 minutes)

1. **Test Without Email Verification**
   - Sign out
   - Register a new user
   - DON'T verify email
   - Try to place an order
   - Should see error: "Please verify your email"

2. **Test Payment Failure**
   - Use a valid test account
   - Add items to cart
   - Proceed to checkout
   - Cancel payment in Razorpay modal
   - Verify error handling

3. **Test Stock Validation**
   - In admin panel, set a product stock to 0
   - Try adding it to cart
   - Should show "Out of stock" error

4. **Test Session Persistence**
   - Add items to cart
   - Close browser
   - Reopen and go to cart
   - Items should still be there

### Testing Checklist

#### Authentication ✅
- [ ] User registration works
- [ ] Email verification required
- [ ] Login/logout works
- [ ] Password reset works
- [ ] Session persists across page reloads

#### Shopping Experience ✅
- [ ] Products display correctly
- [ ] Search works
- [ ] Category filtering works
- [ ] Product details modal opens
- [ ] Add to cart works
- [ ] Cart updates correctly
- [ ] Remove from cart works
- [ ] Quantity changes work

#### Checkout Process ✅
- [ ] Cart calculates totals correctly
- [ ] Checkout page loads
- [ ] Address form validation works
- [ ] Razorpay modal opens
- [ ] Payment can be completed
- [ ] Payment failure handled gracefully
- [ ] Order created in Firestore
- [ ] Order appears in orders page

#### Admin Functions ✅
- [ ] Admin can access admin panel
- [ ] Non-admins cannot access admin panel
- [ ] Products can be added
- [ ] Products can be edited
- [ ] Products can be deleted
- [ ] Orders can be viewed
- [ ] Order status can be updated
- [ ] Users can be viewed
- [ ] Slides can be managed

#### Security ✅
- [ ] Firestore rules prevent unauthorized access
- [ ] Users can only see their own orders
- [ ] Users can only modify their own cart
- [ ] Email verification enforced for orders
- [ ] Admin role required for admin operations
- [ ] API keys restricted to your domain

### Common Issues & Solutions

**Issue: "Permission denied" in Firestore**
- **Solution:** Deploy security rules (Task 1)

**Issue: Razorpay modal doesn't open**
- **Solution:** Check browser console for errors, verify key in config.js

**Issue: Payment successful but order not created**
- **Solution:** Check Firestore rules, check browser console for errors

**Issue: Can't access admin panel**
- **Solution:** Verify your user has `role: "admin"` in Firestore users collection

**Issue: Products not loading**
- **Solution:** Check Firestore has products collection with data

**Issue: Email verification not sending**
- **Solution:** Configure email templates in Firebase Console → Authentication → Templates

---

## Post-Testing Actions

### If All Tests Pass ✅
1. **Document Test Results**
   - Note the date and time
   - Save screenshots of successful transactions
   - Document any issues found

2. **Monitor Initial Traffic**
   - Check Firebase Console → Analytics
   - Monitor error logs
   - Check payment success rate

3. **Set Up Alerts**
   - Enable Firebase Cloud Messaging for order notifications
   - Set up uptime monitoring
   - Configure error alerting

### If Tests Fail ❌
1. **Check Browser Console**
   - Look for JavaScript errors
   - Check Network tab for failed requests

2. **Verify Configuration**
   - Double-check `config.js` settings
   - Verify `firebase.config.js` credentials
   - Check Firestore rules syntax

3. **Test Individual Components**
   - Test authentication separately
   - Test Firestore access separately
   - Test payment gateway separately

---

## Support Contacts

- **Firebase Support:** https://firebase.google.com/support
- **Razorpay Support:** https://razorpay.com/support / support@razorpay.com
- **Technical Issues:** info@azcoglobal.com

---

## Success Criteria

Your platform is fully production-ready when:
- ✅ All authentication flows work
- ✅ Users can browse and add products to cart
- ✅ Checkout process completes without errors
- ✅ Payments process successfully (real charges)
- ✅ Orders are created and visible
- ✅ Admin panel functions correctly
- ✅ Security rules prevent unauthorized access
- ✅ No console errors during normal operation

---

**Testing Completed By:** _________________  
**Date:** _________________  
**Result:** ⭕ PASS / ⭕ FAIL  
**Notes:** _________________
