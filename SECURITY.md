# Security Best Practices Guide

## 🔒 Security Overview

This document outlines security best practices implemented in the Shopfront e-commerce platform and additional recommendations for production deployment.

## ✅ Current Security Measures

### 1. Firebase Security Rules

**Firestore Rules** (`firestore.rules`):
- ✅ Users can only read/write their own data
- ✅ Orders restricted to owner's UID
- ✅ Cart and wishlist isolated per user
- ✅ Admin role verification for management operations
- ✅ Super admin email protection (`info@azcoglobal.com`)
- ✅ Public read for products, authenticated write only

**Storage Rules** (`storage.rules`):
- ✅ Public read for product images
- ✅ Authenticated write with file size limits
- ✅ File type restrictions (images only)

### 2. Authentication Security

- ✅ Email verification required before orders
- ✅ Firebase Auth handles password hashing
- ✅ Session persistence set to LOCAL
- ✅ Password reset via Firebase Auth

### 3. Frontend Security

- ✅ Firebase API keys safe in frontend (restricted by rules)
- ✅ Sensitive config moved to `firebase.config.js`
- ✅ `.gitignore` created for sensitive files
- ✅ No payment secrets exposed in frontend

## 🚨 Critical Security Tasks

### Before Going Live:

#### 1. Firebase Console Configuration

**API Key Restrictions:**
```
1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your project
3. Click on "Browser key (auto created by Firebase)"
4. Under "Application restrictions" select "HTTP referrers"
5. Add your domains:
   - https://azcoglobal.com/*
   - https://*.azcoglobal.com/*
6. Under "API restrictions" select "Restrict key"
7. Only enable required APIs:
   - Firebase Authentication API
   - Cloud Firestore API
   - Firebase Storage API
   - Identity Toolkit API
```

**Authentication Settings:**
```
1. Go to: Firebase Console → Authentication → Settings
2. Enable email verification requirement
3. Configure authorized domains
4. Customize email templates
5. Enable account protection features
```

#### 2. Payment Security

**Razorpay:**
- ⚠️ **NEVER** expose `keySecret` in frontend code
- ✅ Only use `keyId` in client-side code
- ✅ Webhook signature verification (if using webhooks)
- ✅ Use HTTPS for all payment pages
- ✅ Implement 3D Secure authentication

**Configuration:**
```javascript
// ✅ CORRECT - Frontend (config.js or /checkout)
razorpay: {
    keyId: 'rzp_live_XXXXX', // Safe to expose
    testMode: false
}

// ❌ WRONG - Never do this in frontend!
razorpay: {
    keySecret: 'XXXXX' // Backend only!
}
```

#### 3. Environment Variables

**Sensitive Files to Protect:**

Create `.env` file (add to `.gitignore`):
```env
# Payment Gateway
RAZORPAY_KEY_SECRET=your_secret_here

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_USER=your_email@example.com
SMTP_PASS=your_password

# API Keys
ANALYTICS_SECRET=your_secret
```

**PHP Configuration:**
```php
// env.local.php (already in .gitignore)
<?php
define('SMTP_HOST', getenv('SMTP_HOST'));
define('SMTP_USER', getenv('SMTP_USER'));
define('SMTP_PASS', getenv('SMTP_PASS'));
?>
```

#### 4. HTTPS Configuration

**Requirements:**
- ✅ SSL certificate installed and valid
- ✅ Force HTTPS redirect
- ✅ HSTS header enabled
- ✅ Secure cookies only

**Firebase Hosting Auto-includes:**
- Automatic SSL certificates
- HTTP to HTTPS redirect
- CDN with DDoS protection

#### 5. Security Headers

**Add to `firebase.json`:**
```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "SAMEORIGIN"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          },
          {
            "key": "Permissions-Policy",
            "value": "geolocation=(), microphone=(), camera=()"
          }
        ]
      }
    ]
  }
}
```

## 🛡️ Additional Security Recommendations

### 1. Rate Limiting

Implement rate limiting for:
- Login attempts (prevent brute force)
- Password reset requests
- Order submissions
- Contact form submissions

**Firebase Solution:**
Use Firebase App Check:
```javascript
// Add to common.js
const appCheck = firebase.appCheck();
appCheck.activate('site-key-here', true);
```

### 2. Input Validation

**Frontend Validation:**
```javascript
// Sanitize user inputs
function sanitizeInput(input) {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove HTML tags
        .substring(0, 500); // Limit length
}
```

**Backend Validation:**
- Validate all Firestore writes
- Use Firebase Security Rules for schema validation
- Implement server-side email validation

### 3. Content Security Policy (CSP)

**Add to HTML files:**
```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://www.gstatic.com https://checkout.razorpay.com https://js.stripe.com https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com;
    frame-src https://www.youtube.com;
">
```

### 4. Session Management

- ✅ Sessions expire after inactivity
- ✅ Logout clears all local data
- ✅ Concurrent session detection (optional)

### 5. Error Handling

**Don't expose sensitive errors:**
```javascript
// ❌ BAD
catch (error) {
    alert(error.message); // May expose system info
}

// ✅ GOOD
catch (error) {
    console.error('Internal error:', error);
    showToast('An error occurred. Please try again.');
}
```

## 🔍 Security Auditing

### Regular Security Checks:

**Weekly:**
- [ ] Review Firebase Authentication logs
- [ ] Check for failed payment attempts
- [ ] Monitor suspicious order patterns

**Monthly:**
- [ ] Review Firestore security rules
- [ ] Update dependencies: `npm audit fix`
- [ ] Check for outdated Firebase SDK versions
- [ ] Review user account activity

**Quarterly:**
- [ ] Full security audit
- [ ] Penetration testing
- [ ] Review access logs
- [ ] Update security documentation

### Security Tools:

1. **Firebase Security Rules Testing:**
   ```bash
   firebase emulators:start --only firestore
   ```

2. **Dependency Scanning:**
   ```bash
   npm audit
   npm audit fix
   ```

3. **SSL Testing:**
   - https://www.ssllabs.com/ssltest/

4. **Security Headers:**
   - https://securityheaders.com/

## 🚨 Incident Response

### If Security Breach Detected:

1. **Immediate Actions:**
   - Disable affected systems
   - Revoke compromised credentials
   - Change all API keys
   - Notify affected users

2. **Investigation:**
   - Review Firebase logs
   - Check Firestore access patterns
   - Identify breach source
   - Document timeline

3. **Recovery:**
   - Deploy security patches
   - Restore from backup if needed
   - Implement additional controls
   - Monitor for recurring issues

4. **Post-Incident:**
   - Update security procedures
   - Conduct root cause analysis
   - Train team on prevention
   - Notify authorities if required

## 📞 Security Contacts

- Firebase Security: https://firebase.google.com/support/guides/security
- Razorpay Security: security@razorpay.com
- Report Vulnerabilities: info@azcoglobal.com

## 📚 Additional Resources

- [Firebase Security Checklist](https://firebase.google.com/support/guides/security-checklist)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Guidelines](https://developer.mozilla.org/en-US/docs/Web/Security)
- [PCI DSS Compliance](https://www.pcisecuritystandards.org/) (for payment handling)

---

**Last Updated:** December 1, 2025
**Security Level:** Production-Ready (pending final configurations)
