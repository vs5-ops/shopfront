# Production Deployment Checklist

## ✅ Pre-Deployment Tasks

### 1. Firebase Configuration
- [x] Firebase config moved to separate `firebase.config.js` file
- [x] Config file referenced in all HTML pages
- [ ] Domain restrictions configured in Firebase Console
- [ ] Firebase Authentication email templates customized
- [ ] Firestore security rules deployed: `firebase deploy --only firestore:rules`
- [ ] Storage security rules deployed: `firebase deploy --only storage`
- [ ] Firestore indexes created: `firebase deploy --only firestore:indexes`

### 2. Payment Gateway Setup
- [ ] Razorpay production keys obtained from dashboard
- [ ] Update `config.js`: Set `razorpay.keyId` to live key (starts with `rzp_live_`)
- [ ] Update `config.js`: Set `razorpay.testMode: false`
- [ ] Verify webhook configuration in Razorpay dashboard
- [ ] Test payment flow with real card in test mode first
- [ ] Configure payment failure notifications

### 3. Analytics & Tracking
- [x] Google Analytics measurement ID updated (`G-ST325BT70H`)
- [x] Google Tag Manager container ID configured (`GTM-TRCN33MF`)
- [ ] GTM tags configured for:
  - [ ] Page views
  - [ ] Add to cart events
  - [ ] Purchase conversions
  - [ ] Product impressions
- [ ] Facebook Pixel added (if using Facebook ads)
- [ ] Google Ads conversion tracking (if applicable)

### 4. Email & Communication
- [x] Support email updated to `info@azcoglobal.com`
- [x] WhatsApp number updated to `919870456342`
- [ ] Email verification template customized in Firebase
- [ ] Order confirmation email template created
- [ ] Contact form tested and working
- [ ] SMTP configuration verified in `env.local.php`

### 5. SEO & Content
- [ ] All page titles and meta descriptions reviewed
- [ ] Open Graph images created and uploaded
- [ ] Twitter Card images created and uploaded
- [ ] `robots.txt` configured correctly
- [ ] `sitemap.xml` generated and submitted to Google Search Console
- [ ] Google Search Console verified
- [ ] Schema markup validated
- [ ] All placeholder content replaced

### 6. Security
- [x] Debug `alert()` statements removed
- [x] `.gitignore` file created
- [ ] Sensitive files excluded from version control:
  - [ ] `env.local.php`
  - [ ] `mail.config.php`
  - [ ] Any API keys or secrets
- [ ] HTTPS enabled on hosting
- [ ] SSL certificate valid and not expired
- [ ] Security headers configured:
  - [ ] Content-Security-Policy
  - [ ] X-Frame-Options
  - [ ] X-Content-Type-Options
- [ ] Firebase API key restrictions set in Google Cloud Console
- [ ] Rate limiting configured for sensitive operations

### 7. Performance
- [ ] Images optimized (compressed, proper formats)
- [ ] Product images uploaded to correct paths (`images/products/[SKU]-[number].jpg`)
- [ ] CDN configured for static assets (if applicable)
- [ ] Browser caching configured
- [ ] Lighthouse audit score > 90
- [ ] Core Web Vitals optimized

### 8. Testing
- [ ] All pages load correctly
- [ ] User registration flow tested
- [ ] Email verification flow tested
- [ ] Password reset flow tested
- [ ] Add to cart functionality tested
- [ ] Checkout process completed successfully
- [ ] Admin panel access verified
- [ ] Product creation tested
- [ ] Order management tested
- [ ] Cross-browser testing completed:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge
- [ ] Mobile responsiveness verified
- [ ] Payment gateway integration tested

### 9. Backup & Recovery
- [ ] Firestore backup strategy implemented
- [ ] Database export script tested: `npm run backup`
- [ ] Backup schedule automated
- [ ] Recovery procedure documented
- [ ] Code repository backed up

### 10. Legal & Compliance
- [ ] Privacy Policy page completed
- [ ] Terms & Conditions page completed
- [ ] Refund Policy page completed
- [ ] Shipping Policy page completed
- [ ] Cookie consent implemented (if required by region)
- [ ] GDPR compliance verified (if serving EU customers)
- [ ] Data retention policies defined

### 11. Monitoring & Logging
- [ ] Error logging service configured (e.g., Sentry)
- [ ] Uptime monitoring set up (e.g., UptimeRobot)
- [ ] Firebase Analytics events tracking
- [ ] Order notification system tested
- [ ] Admin notification emails working

## 🚀 Deployment Steps

1. **Final Code Review**
   ```bash
   # Check for console.log statements
   grep -r "console.log" *.js
   
   # Check for alert statements
   grep -r "alert(" *.js *.html
   
   # Check for TODO comments
   grep -r "TODO" *.js *.html
   ```

2. **Build & Minify (if applicable)**
   ```bash
   npm run build:minify-all
   ```

3. **Deploy to Firebase Hosting**
   ```bash
   # Test locally first
   firebase serve
   
   # Deploy to production
   firebase deploy
   ```

4. **Post-Deployment Verification**
   - [ ] Visit production URL and verify homepage loads
   - [ ] Test user registration
   - [ ] Test product browsing
   - [ ] Complete a test order
   - [ ] Verify admin panel access
   - [ ] Check analytics tracking
   - [ ] Verify all external links work

## 📊 Post-Launch Monitoring (First 24 Hours)

- [ ] Monitor error rates in console
- [ ] Check payment success rate
- [ ] Verify order notifications working
- [ ] Monitor page load times
- [ ] Check for broken images
- [ ] Review user feedback/complaints
- [ ] Monitor server/hosting performance

## 🔄 Ongoing Maintenance

- Weekly: Review analytics and error logs
- Weekly: Check for failed payments or orders
- Monthly: Update dependencies and security patches
- Monthly: Review and optimize performance
- Quarterly: Backup verification and disaster recovery drill

## 📞 Emergency Contacts

- Firebase Support: https://firebase.google.com/support
- Razorpay Support: https://razorpay.com/support
- Hosting Provider Support: [Add contact]
- Developer Contact: info@azcoglobal.com

---

**Last Updated:** December 1, 2025
**Deployment Status:** Pre-Production
