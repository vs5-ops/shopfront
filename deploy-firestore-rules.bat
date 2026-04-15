@echo off
echo ===================================
echo Firebase Deployment Launcher
echo ===================================
echo.
echo Opening PowerShell with deployment commands...
echo.
powershell -NoExit -Command "cd 'c:\Users\NBTC-SYSID-0013\Documents\Development\new Web store\new Web store'; Write-Host 'Verifying Node.js installation...' -ForegroundColor Cyan; node --version; npm --version; Write-Host ''; Write-Host 'Installing Firebase CLI...' -ForegroundColor Cyan; npm install -g firebase-tools; Write-Host ''; Write-Host 'Logging in to Firebase...' -ForegroundColor Cyan; firebase login; Write-Host ''; Write-Host 'Selecting Firebase project...' -ForegroundColor Cyan; firebase use shopfront-e496f; Write-Host ''; Write-Host 'Deploying Firestore rules...' -ForegroundColor Cyan; firebase deploy --only firestore:rules; Write-Host ''; Write-Host '========================================' -ForegroundColor Green; Write-Host 'DEPLOYMENT COMPLETE!' -ForegroundColor Green; Write-Host '========================================' -ForegroundColor Green"
