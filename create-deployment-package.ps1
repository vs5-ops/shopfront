#!/usr/bin/env pwsh
# create-deployment-package.ps1
# Creates a clean deployment package for Hostgator upload

$sourcePath = "c:\Users\NBTC-SYSID-0013\Documents\Development\new Web store\new Web store"
$deployPath = "c:\Users\NBTC-SYSID-0013\Documents\Development\new Web store\hostgator_deploy"

Write-Host "Creating Hostgator deployment package..." -ForegroundColor Cyan
Write-Host "Source: $sourcePath" -ForegroundColor Yellow
Write-Host "Target: $deployPath" -ForegroundColor Yellow

# Create deploy directory
if (Test-Path $deployPath) {
    Write-Host "Removing existing deployment folder..." -ForegroundColor Yellow
    Remove-Item -Path $deployPath -Recurse -Force
}
New-Item -ItemType Directory -Path $deployPath -Force | Out-Null

# Files to INCLUDE (copy these)
$includePatterns = @(
    "*.html",
    "*.js",
    "*.php",
    ".htaccess",
    "robots.txt",
    "sitemap.xml",
    "libs\*",
    "images\*"
)

# Files/folders to EXCLUDE (skip these)
$excludePatterns = @(
    "_full_backup",
    "cleaned_backup",
    "node_modules",
    ".git",
    "*.md",
    "firebase.json",
    "firestore.rules",
    "firestore.indexes.json",
    "storage.rules",
    "package.json",
    "package-lock.json",
    ".gitignore",
    "*.bat",
    "*.ps1"
)

Write-Host "`nCopying files..." -ForegroundColor Green

# Copy HTML files
Get-ChildItem -Path $sourcePath -Filter "*.html" | ForEach-Object {
    Copy-Item $_.FullName -Destination $deployPath -Force
    Write-Host "  ✓ $($_.Name)" -ForegroundColor Gray
}

# Copy JS files (exclude specific ones if needed)
Get-ChildItem -Path $sourcePath -Filter "*.js" | ForEach-Object {
    Copy-Item $_.FullName -Destination $deployPath -Force
    Write-Host "  ✓ $($_.Name)" -ForegroundColor Gray
}

# Copy PHP files
Get-ChildItem -Path $sourcePath -Filter "*.php" | ForEach-Object {
    Copy-Item $_.FullName -Destination $deployPath -Force
    Write-Host "  ✓ $($_.Name)" -ForegroundColor Gray
}

# Copy .htaccess
if (Test-Path "$sourcePath\.htaccess") {
    Copy-Item "$sourcePath\.htaccess" -Destination $deployPath -Force
    Write-Host "  ✓ .htaccess" -ForegroundColor Gray
}

# Copy robots.txt and sitemap.xml
if (Test-Path "$sourcePath\robots.txt") {
    Copy-Item "$sourcePath\robots.txt" -Destination $deployPath -Force
    Write-Host "  ✓ robots.txt" -ForegroundColor Gray
}
if (Test-Path "$sourcePath\sitemap.xml") {
    Copy-Item "$sourcePath\sitemap.xml" -Destination $deployPath -Force
    Write-Host "  ✓ sitemap.xml" -ForegroundColor Gray
}

# Copy libs folder
if (Test-Path "$sourcePath\libs") {
    Copy-Item -Path "$sourcePath\libs" -Destination $deployPath -Recurse -Force
    Write-Host "  ✓ libs/" -ForegroundColor Gray
}

# Copy images folder
if (Test-Path "$sourcePath\images") {
    Copy-Item -Path "$sourcePath\images" -Destination $deployPath -Recurse -Force
    Write-Host "  ✓ images/" -ForegroundColor Gray
}

# Count files
$fileCount = (Get-ChildItem -Path $deployPath -Recurse -File).Count
$folderCount = (Get-ChildItem -Path $deployPath -Recurse -Directory).Count

Write-Host "`n✅ Deployment package created successfully!" -ForegroundColor Green
Write-Host "   Files: $fileCount" -ForegroundColor Cyan
Write-Host "   Folders: $folderCount" -ForegroundColor Cyan
Write-Host "   Location: $deployPath" -ForegroundColor Cyan

# Create a ZIP file for easy upload
$zipPath = "c:\Users\NBTC-SYSID-0013\Documents\Development\new Web store\hostgator_deploy.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Write-Host "`nCreating ZIP archive..." -ForegroundColor Yellow
Compress-Archive -Path "$deployPath\*" -DestinationPath $zipPath -Force
$zipSize = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host "✅ ZIP created: $zipPath ($zipSize MB)" -ForegroundColor Green

Write-Host ""
Write-Host "DEPLOYMENT PACKAGE READY!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review files in: $deployPath" -ForegroundColor White
Write-Host "  2. Create env.local.php with SMTP credentials" -ForegroundColor White
Write-Host "  3. Upload via cPanel File Manager or FTP" -ForegroundColor White
Write-Host "  4. Upload ZIP file and extract in cPanel, OR" -ForegroundColor White
Write-Host "  5. Upload files from folder directly" -ForegroundColor White
Write-Host ""
Write-Host "Read HOSTGATOR_DEPLOYMENT.md for complete instructions" -ForegroundColor Cyan
Write-Host "Done! Review the files and upload to Hostgator." -ForegroundColor Green
