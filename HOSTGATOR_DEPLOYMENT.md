# HOSTGATOR DEPLOYMENT GUIDE
## AZCO VENTURES Web Store

### Prerequisites
- Hostgator shared/VPS hosting account
- cPanel access
- Domain name configured
- SSL certificate (free with Hostgator via AutoSSL or Let's Encrypt)

---

## DEPLOYMENT STEPS

### Step 1: Prepare Files Locally
Before uploading, ensure these files are ready:

**✅ MUST UPLOAD:**
- All HTML files (/, /checkout, /cart, etc.)
- All JavaScript files (common.js, config.js, firebase.config.js, etc.)
- All PHP files (contact_send.php, upload.php)
- .htaccess (already configured)
- robots.txt, sitemap.xml
- /libs/ folder (lucide.min.js)
- /images/ folder (with product images)

**❌ DO NOT UPLOAD:**
- _full_backup/ folder
- cleaned_backup/ folder
- node_modules/ folder (if exists)
- .git/ folder
- *.md files (README, DEPLOYMENT_CHECKLIST, etc.)
- firebase.json (Firebase hosting config, not needed)
- firestore.rules, firestore.indexes.json, storage.rules
- package.json, package-lock.json
- Any .gitignore files

---

### Step 2: Configure Sensitive Files

#### A. Create env.local.php (for email configuration)
Create this file in your project root with your SMTP credentials:

```php
<?php
// env.local.php - DO NOT COMMIT TO VERSION CONTROL
// Email configuration for contact form

putenv('SHOPFRONT_SMTP_HOST=mail.yourdomain.com');
putenv('SHOPFRONT_SMTP_USER=noreply@yourdomain.com');
putenv('SHOPFRONT_SMTP_PASS=your_email_password');
putenv('SHOPFRONT_SMTP_PORT=587');
putenv('SHOPFRONT_SMTP_FROM_EMAIL=noreply@yourdomain.com');
putenv('SHOPFRONT_SMTP_FROM_NAME=AZCO VENTURES');
putenv('SHOPFRONT_ADMIN_EMAIL=admin@yourdomain.com');
?>
```

#### B. Verify firebase.config.js
Ensure your Firebase API key and project details are correct. This file is already configured but double-check:
- API key restrictions are set in Google Cloud Console
- Domain is added to Firebase authorized domains

#### C. Verify config.js
Check all configuration values:
- Razorpay key (only public keyId, NO secret)
- Google Analytics ID
- WhatsApp number
- Site metadata

---

### Step 3: Upload Files to Hostgator

#### Option A: Using cPanel File Manager (Recommended for beginners)

1. **Login to cPanel**
   - Go to: https://yourdomain.com:2083
   - Enter your cPanel username and password

2. **Navigate to File Manager**
   - In cPanel, click "File Manager"
   - Navigate to `public_html/` (or your domain's root folder)

3. **Upload Files**
   - Click "Upload" button
   - Drag and drop all files and folders
   - OR use "Select File" to choose files
   - Wait for upload to complete

4. **Extract (if you uploaded a ZIP)**
   - Right-click the ZIP file
   - Select "Extract"
   - Delete the ZIP after extraction

#### Option B: Using FTP/SFTP (For large files or bulk uploads)

1. **Get FTP Credentials from cPanel**
   - In cPanel, go to "FTP Accounts"
   - Note down: FTP server, username, password

2. **Use FTP Client (FileZilla recommended)**
   ```
   Host: ftp.yourdomain.com (or your server IP)
   Username: your_cpanel_username@yourdomain.com
   Password: your_cpanel_password
   Port: 21 (FTP) or 22 (SFTP)
   ```

3. **Upload Files**
   - Connect to server
   - Navigate to `/public_html/` on remote side
   - Drag files from local to remote
   - Wait for transfer to complete

---

### Step 4: Set File Permissions

In cPanel File Manager, set these permissions:

**Directories:** 755
- public_html/
- public_html/images/
- public_html/libs/

**Files:** 644
- All .html files
- All .js files
- All .css files
- .htaccess
- robots.txt, sitemap.xml

**PHP Files:** 644 (or 600 for extra security)
- contact_send.php
- upload.php
- env.local.php (if created)
- mail.config.php (if exists)

**Writable Directories:** 755 or 775
- public_html/uploads/ (create if needed)

---

### Step 5: Configure PHP Settings

1. **In cPanel, go to "Select PHP Version"**
   - Choose PHP 7.4 or 8.0+
   - Enable these extensions:
     - mysqli (for database if used)
     - mbstring (for email handling)
     - gd (for image processing)
     - curl (for API calls)

2. **Check PHP.ini settings**
   - upload_max_filesize: 10M
   - post_max_size: 10M
   - max_execution_time: 300
   - These are already set in .htaccess but verify

---

### Step 6: Configure SSL Certificate

1. **Enable AutoSSL in cPanel**
   - Go to "SSL/TLS Status"
   - Click "Run AutoSSL"
   - Wait 10-15 minutes

2. **Force HTTPS in .htaccess**
   After SSL is active, uncomment these lines in .htaccess:
   ```apache
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

---

### Step 7: Configure Firebase Authorized Domains

1. **Go to Firebase Console**
   - https://console.firebase.google.com
   - Select project: shopfront-e496f

2. **Add your Hostgator domain**
   - Go to Authentication → Settings → Authorized domains
   - Click "Add domain"
   - Enter: yourdomain.com
   - Click "Add"

---

### Step 8: Configure Google Cloud API Key Restrictions

1. **Go to Google Cloud Console**
   - https://console.cloud.google.com/apis/credentials
   - Select project: shopfront-e496f

2. **Edit API Key**
   - Find: "AIzaSyBoFHPvq7uL3N3S5YXneUTIsVMs9CxbMys"
   - Click "Edit"

3. **Set Application Restrictions**
   - Choose "HTTP referrers"
   - Add:
     - https://yourdomain.com/*
     - http://yourdomain.com/* (temporary, remove after SSL)
     - http://localhost:* (for local testing, optional)

4. **Set API Restrictions**
   - Restrict to these APIs:
     - Cloud Firestore API
     - Firebase Authentication
     - Cloud Storage
     - Identity Toolkit API

5. **Save**

---

### Step 9: Test Your Deployment

#### A. Test Homepage
1. Visit: https://yourdomain.com
2. Check:
   - Page loads correctly
   - Images display
   - Navigation works
   - Console has no errors

#### B. Test Authentication
1. Go to login/signup
2. Create test account
3. Login and logout
4. Verify Firebase authentication works

#### C. Test Product Pages
1. Browse products
2. Add to cart
3. View cart
4. Verify cart persistence

#### D. Test Checkout
1. Proceed to checkout
2. Fill address form
3. Test Razorpay (will open modal in test/live mode)
4. Cancel payment
5. Verify order NOT created

#### E. Test Contact Form
1. Go to contact page
2. Fill form
3. Submit
4. Check if email is received at admin email
5. Verify rate limiting (try 6 submissions in 1 hour)

#### F. Test Admin Panel
1. Login as admin
2. Go to //admin
3. Verify Firestore access
4. Test product management (if implemented)

---

### Step 10: Performance Optimization

#### A. Enable Gzip Compression
Already configured in .htaccess, but verify:
- In cPanel → "Optimize Website"
- Select "Compress All Content"

#### B. Enable Browser Caching
Already configured in .htaccess with:
- HTML: 1 hour
- CSS/JS: 1 month
- Images: 1 year

#### C. Image Optimization
- Use WebP format where possible
- Compress images before upload
- Recommended tools:
  - TinyPNG.com
  - Squoosh.app
  - ImageOptim (Mac)

#### D. CDN (Optional but recommended)
- Consider Cloudflare (free plan available)
- Improves global load times
- Provides additional DDoS protection

---

## POST-DEPLOYMENT CHECKLIST

### Security ✅
- [ ] SSL certificate active and HTTPS forced
- [ ] Firebase authorized domains configured
- [ ] Google API key restrictions applied
- [ ] env.local.php has secure SMTP credentials
- [ ] File permissions set correctly
- [ ] .htaccess security headers active
- [ ] Sensitive files blocked in .htaccess

### Functionality ✅
- [ ] Homepage loads correctly
- [ ] User registration/login works
- [ ] Product pages display correctly
- [ ] Cart functionality works
- [ ] Checkout flow completes
- [ ] Contact form sends emails
- [ ] Admin panel accessible (if applicable)
- [ ] Analytics tracking active (check GTM/GA4)

### Performance ✅
- [ ] Page load time < 3 seconds
- [ ] Images optimized and loading
- [ ] Gzip compression enabled
- [ ] Browser caching working
- [ ] No console errors
- [ ] Mobile responsive design verified

### SEO ✅
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] Meta tags present on all pages
- [ ] Google Search Console configured
- [ ] Google Analytics tracking verified

---

## TROUBLESHOOTING

### Issue: 500 Internal Server Error
**Solution:**
- Check .htaccess syntax
- Verify PHP version (should be 7.4+)
- Check file permissions (644 for files, 755 for directories)
- Check error_log in cPanel

### Issue: PHP mail() not working
**Solution:**
- Configure SMTP in env.local.php
- Verify mail.config.php exists and is configured
- Check if Hostgator blocks mail() function
- Use alternative: PHPMailer or SendGrid API

### Issue: Firebase authentication not working
**Solution:**
- Verify domain is added to Firebase authorized domains
- Check API key restrictions in Google Cloud Console
- Verify firebase.config.js is loaded before common.js
- Check browser console for errors

### Issue: Images not loading
**Solution:**
- Verify images uploaded to correct folder
- Check file paths in HTML (should be relative: images/products/...)
- Verify file permissions (644 for images)
- Check browser console for 404 errors

### Issue: Contact form rate limiting not working
**Solution:**
- Verify contact_send.php has write permissions
- Check if temporary files can be created
- Verify directory is writable for rate limit JSON files

---

## MAINTENANCE

### Regular Tasks
1. **Backup weekly**
   - Use cPanel Backup tool
   - Download full account backup

2. **Monitor error logs**
   - Check cPanel → Error Log
   - Fix any recurring errors

3. **Update PHP version**
   - Keep PHP updated (test first)
   - Monitor deprecation warnings

4. **Review security**
   - Check for unauthorized file changes
   - Monitor access logs for suspicious activity

5. **Performance monitoring**
   - Use Google PageSpeed Insights
   - Monitor GTM/GA4 for user experience

---

## SUPPORT RESOURCES

### Hostgator Support
- Live Chat: 24/7 via cPanel
- Phone: Check your welcome email
- Knowledge Base: support.hostgator.com

### Firebase Support
- Console: console.firebase.google.com
- Documentation: firebase.google.com/docs
- Support: firebase.google.com/support

### Google Cloud Support
- Console: console.cloud.google.com
- Documentation: cloud.google.com/docs

---

## CONTACT

For technical issues with this deployment:
- Email: admin@yourdomain.com
- Review deployment docs in project files

---

**Deployment Date:** December 1, 2025
**Version:** 1.0
**Project:** AZCO VENTURES Web Store
