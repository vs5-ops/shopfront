# Quick Reference: Firebase Commands

## 🚀 Essential Commands

### Initial Setup
```powershell
# Install Firebase CLI globally
npm install -g firebase-tools

# Check version
firebase --version

# Login to Firebase
firebase login

# Initialize project
firebase init
```

### Deploy Commands
```powershell
# Navigate to project directory
cd "c:\Users\NBTC-SYSID-0013\Documents\Development\new Web store\new Web store"

# Deploy everything
firebase deploy

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Firestore indexes
firebase deploy --only firestore:indexes

# Deploy only hosting
firebase deploy --only hosting

# Deploy only storage rules
firebase deploy --only storage
```

### Project Management
```powershell
# List all Firebase projects
firebase projects:list

# Select a project
firebase use shopfront-e496f

# Show current project
firebase use
```

### Local Testing
```powershell
# Start local server (emulator)
firebase serve

# Start Firestore emulator
firebase emulators:start --only firestore

# Start all emulators
firebase emulators:start
```

### Hosting
```powershell
# Deploy to hosting
firebase deploy --only hosting

# Create a preview channel (staging)
firebase hosting:channel:deploy staging

# Open hosting URL
firebase open hosting:site
```

### Logs & Debugging
```powershell
# View hosting logs
firebase hosting:logs

# View function logs (if using functions)
firebase functions:log

# Check deployment status
firebase deploy:status
```

## 🔐 Google Cloud Console Tasks

### Access URLs
- **Google Cloud Console:** https://console.cloud.google.com
- **Firebase Console:** https://console.firebase.google.com
- **API Credentials:** https://console.cloud.google.com/apis/credentials

### API Key Restriction Steps
1. Go to: https://console.cloud.google.com/apis/credentials
2. Select project: **shopfront-e496f**
3. Click "Browser key (auto created by Firebase)"
4. Under Application restrictions → Select "HTTP referrers"
5. Add referrers:
   - `https://azcoglobal.com/*`
   - `https://*.azcoglobal.com/*`
   - `http://localhost:*`
   - `http://127.0.0.1:*`
6. Under API restrictions → Select "Restrict key"
7. Enable these APIs:
   - Identity Toolkit API
   - Token Service API
   - Cloud Firestore API
   - Firebase Installations API
   - Firebase Storage API
8. Click SAVE

## 🧪 Testing Commands

### Local Testing
```powershell
# Test with Python
python -m http.server 8000

# Test with Node.js http-server
npx http-server -p 8000

# Test with Firebase emulator
firebase serve --port 5000
```

### Browser Testing
```powershell
# Open in default browser
start http://localhost:5000

# Open in Chrome specifically
start chrome http://localhost:5000

# Open in Edge
start msedge http://localhost:5000
```

## 📊 Verification Commands

### Check Firebase Status
```powershell
# Check if logged in
firebase login:list

# Show current project
firebase use

# List all projects
firebase projects:list

# Open Firebase Console
firebase open
```

### Check Project Configuration
```powershell
# View firebase.json
Get-Content firebase.json

# View firestore.rules
Get-Content firestore.rules

# View package.json
Get-Content package.json
```

## 🔄 Update & Maintenance

### Update Firebase CLI
```powershell
npm update -g firebase-tools
```

### Backup Firestore Data
```powershell
# Using gcloud (requires Google Cloud SDK)
gcloud firestore export gs://shopfront-e496f.appspot.com/backups/$(Get-Date -Format 'yyyy-MM-dd')

# Or use your custom backup script
node scripts/backup-firestore.js
```

### Deploy with Message
```powershell
firebase deploy -m "Deployment message here"
```

## ⚠️ Emergency Commands

### Rollback Deployment
```powershell
# Rollback hosting
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID DEST_SITE_ID:live

# View previous versions
firebase hosting:versions:list
```

### Quick Disable
```powershell
# Take site offline (replace / with maintenance page)
# Then deploy
firebase deploy --only hosting
```

## 💡 Pro Tips

### Create Aliases
Add to your PowerShell profile:
```powershell
# Open profile
notepad $PROFILE

# Add these aliases
function fd { firebase deploy }
function fs { firebase serve }
function fdr { firebase deploy --only firestore:rules }
function fdh { firebase deploy --only hosting }
```

### Quick Navigation
```powershell
# Create shortcut variable
$shop = "c:\Users\NBTC-SYSID-0013\Documents\Development\new Web store\new Web store"

# Use it
cd $shop
```

### Watch for Changes
```powershell
# Auto-deploy on file changes (requires watch tool)
npm install -g watch

# Watch and deploy rules
watch "firebase deploy --only firestore:rules" firestore.rules
```

## 📝 Common Issues & Fixes

### "Command not found"
```powershell
npm install -g firebase-tools
```

### "Not authorized"
```powershell
firebase logout
firebase login
```

### "No project active"
```powershell
firebase use shopfront-e496f
```

### "Permission denied"
```powershell
# Run as administrator or check Firebase Console permissions
```

### "Port already in use"
```powershell
# Use different port
firebase serve --port 5001
```

## 🎯 Your Specific Project

### Project Details
- **Project ID:** shopfront-e496f
- **Project Directory:** `c:\Users\NBTC-SYSID-0013\Documents\Development\new Web store\new Web store`
- **Admin Email:** info@azcoglobal.com
- **Production URL:** https://azcoglobal.com

### Quick Deploy (Copy-Paste Ready)
```powershell
cd "c:\Users\NBTC-SYSID-0013\Documents\Development\new Web store\new Web store"; firebase deploy --only firestore:rules
```

### Quick Test (Copy-Paste Ready)
```powershell
cd "c:\Users\NBTC-SYSID-0013\Documents\Development\new Web store\new Web store"; firebase serve
```

---

**Last Updated:** December 1, 2025
