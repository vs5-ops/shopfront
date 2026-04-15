# Firebase Deployment Script
# Run this after installing Node.js from https://nodejs.org

Write-Host "=== Firebase Firestore Rules Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/en/download" -ForegroundColor Yellow
    Write-Host "After installation, close and reopen PowerShell, then run this script again." -ForegroundColor Yellow
    pause
    exit 1
}

# Check if npm is available
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm $npmVersion installed" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found!" -ForegroundColor Red
    pause
    exit 1
}

# Install Firebase CLI if not present
Write-Host ""
Write-Host "Checking Firebase CLI installation..." -ForegroundColor Yellow
try {
    $firebaseVersion = firebase --version 2>$null
    Write-Host "✓ Firebase CLI installed: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "Firebase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g firebase-tools
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Firebase CLI installed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install Firebase CLI" -ForegroundColor Red
        pause
        exit 1
    }
}

# Navigate to project directory
Write-Host ""
Write-Host "Navigating to project directory..." -ForegroundColor Yellow
$projectPath = "c:\Users\NBTC-SYSID-0013\Documents\Development\new Web store\new Web store"
Set-Location $projectPath
Write-Host "✓ Working directory: $projectPath" -ForegroundColor Green

# Check if firestore.rules exists
Write-Host ""
Write-Host "Checking for firestore.rules file..." -ForegroundColor Yellow
if (Test-Path "firestore.rules") {
    Write-Host "✓ firestore.rules found" -ForegroundColor Green
} else {
    Write-Host "✗ firestore.rules not found!" -ForegroundColor Red
    pause
    exit 1
}

# Login to Firebase
Write-Host ""
Write-Host "Checking Firebase authentication..." -ForegroundColor Yellow
Write-Host "If not logged in, a browser window will open for authentication." -ForegroundColor Cyan
firebase login --reauth

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Firebase login failed" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "✓ Firebase authentication successful" -ForegroundColor Green

# Select Firebase project
Write-Host ""
Write-Host "Setting active Firebase project..." -ForegroundColor Yellow
firebase use shopfront-e496f

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to select project" -ForegroundColor Red
    Write-Host "Available projects:" -ForegroundColor Yellow
    firebase projects:list
    pause
    exit 1
}

Write-Host "✓ Project 'shopfront-e496f' selected" -ForegroundColor Green

# Deploy Firestore rules
Write-Host ""
Write-Host "Deploying Firestore rules..." -ForegroundColor Yellow
Write-Host "This may take a few moments..." -ForegroundColor Cyan
firebase deploy --only firestore:rules

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ FIRESTORE RULES DEPLOYED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Verify rules in Firebase Console:" -ForegroundColor White
    Write-Host "   https://console.firebase.google.com/project/shopfront-e496f/firestore/rules" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "2. Configure API key restrictions:" -ForegroundColor White
    Write-Host "   https://console.cloud.google.com/apis/credentials" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "3. Test checkout flow at:" -ForegroundColor White
    Write-Host "   https://azcoglobal.com" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "✗ Deployment failed!" -ForegroundColor Red
    Write-Host "Check the error messages above for details." -ForegroundColor Yellow
    Write-Host ""
}

pause
