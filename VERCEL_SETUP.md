# VERCEL DEPLOYMENT GUIDE
## Next.js Shopfront Setup

---

## **STEP 1: Install Vercel CLI**

```powershell
npm install -g vercel
```

**Verify installation:**
```powershell
vercel --version
```

---

## **STEP 2: Login to Vercel**

```powershell
vercel login
```

- Opens browser automatically
- Sign up or login with GitHub/GitLab/Bitbucket
- Authorize Vercel

---

## **STEP 3: Deploy from Local**

```powershell
cd "c:\Users\NBTC-SYSID-0013\Documents\Development\new Web store\new Web store\next-store"
vercel
```

**Follow prompts:**
- Set project name: `shopfront` (or your preference)
- Link to existing project? → `No` (first time)
- Modify any settings? → `Y`
- Framework: Next.js (should auto-detect)
- Root directory: `.` (current)
- Build command: `npm run build` (default)
- Output directory: `.next` (default)
- Development settings: Can modify or skip

**Result:**
```
✓ Project created
✓ Deployed to: https://shopfront-xxx.vercel.app
```

---

## **STEP 4: Add Environment Variables**

### **Option A: Via Vercel Dashboard (Easiest)**

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

**Production & Preview:**
```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyBoFHPvq7uL3N3S5YXneUTIsVMs9CxbMys
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = shopfront-e496f.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = shopfront-e496f
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = shopfront-e496f.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 123456789012
NEXT_PUBLIC_FIREBASE_APP_ID = 1:123456789012:web:abcdef1234567890
NEXT_PUBLIC_RAZORPAY_KEY_ID = your_razorpay_public_key
NEXT_PUBLIC_APP_URL = https://yourdomain.vercel.app
```

5. Click "Save"
6. Vercel automatically redeploys

### **Option B: Via CLI**

```powershell
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Paste: AIzaSyBoFHPvq7uL3N3S5YXneUTIsVMs9CxbMys
# Select environment: Production, Preview, Development

# Repeat for each variable...
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
# etc.

vercel deploy --prod  # Force redeploy with new env vars
```

---

## **STEP 5: Configure Firebase**

### **Add Vercel Domain to Firebase Authorized Domains**

1. Go to: https://console.firebase.google.com
2. Select project: `shopfront-e496f`
3. Go to **Authentication** → **Settings**
4. Scroll to **Authorized domains**
5. Click **Add domain**
6. Enter: `shopfront-xxx.vercel.app` (your Vercel URL)
7. Click **Add**

**Also add:**
- Your custom domain (if using one)
- `localhost:3000` (for local testing)

---

## **STEP 6: Configure Google Cloud Console (API Keys)**

1. Go to: https://console.cloud.google.com
2. Select project: `shopfront-e496f`
3. Go to **APIs & Services** → **Credentials**
4. Find: `AIzaSyBoFHPvq7uL3N3S5YXneUTIsVMs9CxbMys`
5. Click **Edit API Key**
6. Under **Application restrictions**, select **HTTP referrers**
7. Add:
   ```
   https://shopfront-xxx.vercel.app/*
   https://yourdomain.com/*
   http://localhost:*
   ```
8. Click **Save**

---

## **STEP 7: Connect Custom Domain (Optional)**

1. In Vercel Dashboard → **Settings** → **Domains**
2. Enter your domain: `yourdomain.com`
3. Vercel shows DNS records
4. Update your domain registrar's DNS:
   - A record: `76.76.19.165`
   - CNAME: Points to vercel
5. Wait 5-60 minutes for DNS propagation

**Verify:**
```powershell
nslookup yourdomain.com
ping yourdomain.com
```

---

## **STEP 8: Enable Automatic SSL**

Vercel includes free SSL automatically! ✅

To verify:
1. Visit: `https://yourdomain.com` (or your Vercel URL)
2. You should see 🔒 lock icon

---

## **STEP 9: Test Your Deployment**

### **Homepage**
- Visit: https://shopfront-xxx.vercel.app
- Check images load
- Check navigation works

### **Products**
- Click products page
- Verify product list loads
- Click on product detail

### **Authentication**
1. Go to `/signup` or `/register`
2. Create test account: `test@example.com` / `Test123!`
3. Verify email confirmation (if enabled)
4. Login

### **Cart & Checkout**
1. Add products to cart
2. Go to `/checkout`
3. Fill address
4. Click **Pay with Razorpay**
5. **DON'T complete** payment (test mode)
6. Verify no errors

### **Check Deployment Logs**
```powershell
vercel logs
vercel logs --follow  # Real-time logs
```

---

## **STEP 10: Auto-Deploy from GitHub (Recommended)**

1. Push code to GitHub:
```powershell
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

2. In Vercel Dashboard:
   - Click **Add Git Integration**
   - Select **GitHub**
   - Authorize Vercel
   - Select repository

3. **Done!** Now every push to `main` auto-deploys

---

## **TROUBLESHOOTING**

### **Issue: "Firebase domain not authorized"**
**Solution:** Add Vercel domain to Firebase authorized domains (Step 5)

### **Issue: 500 errors on deployment**
**Solution:**
```powershell
vercel logs --tail  # Check error logs
```

### **Issue: Environment variables not working**
**Solution:**
1. Make sure variable names start with `NEXT_PUBLIC_` (if client-side)
2. Redeploy after adding env vars: `vercel deploy --prod`
3. Clear browser cache

### **Issue: Images showing broken**
**Solution:**
- Verify images are in `public/` folder
- Check image paths are correct
- Firebase Storage URLs might need CORS config

---

## **POST-DEPLOYMENT CHECKLIST**

- [ ] Site loads on Vercel URL
- [ ] Firebase authentication working
- [ ] Products displaying correctly
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Contact form submits
- [ ] Admin panel accessible (if applicable)
- [ ] SSL certificate active (🔒 in browser)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All images visible

---

## **MONITORING & UPDATES**

### **View Analytics**
- Vercel Dashboard → **Analytics**
- See: Requests, Edge Functions, Bandwidth

### **Update Your App**
```powershell
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Vercel auto-deploys!
```

### **Rollback to Previous Version**
- Vercel Dashboard → **Deployments**
- Find previous deployment
- Click → Click "Promote to Production"

---

## **NEXT STEPS**

1. ✅ Run `vercel` command (Step 3)
2. ✅ Add environment variables (Step 4)
3. ✅ Configure Firebase (Step 5)
4. ✅ Connect custom domain (Step 7, optional)
5. ✅ Test thoroughly (Step 9)

**Need help?** Vercel docs: https://vercel.com/docs
