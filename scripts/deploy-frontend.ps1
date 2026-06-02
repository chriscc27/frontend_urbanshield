<#
.SYNOPSIS
  Deploy UrbanShield frontend to S3 as a static website.
.DESCRIPTION
  Builds the Vite React app and uploads it to the S3 frontend bucket.
  Reads the API Gateway URL from the backend deploy output.
#>
param(
  [string]$Stage = "dev",
  [string]$Region = "us-east-1",
  [string]$ApiUrl = ""
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  UrbanShield Frontend Deploy" -ForegroundColor Cyan
Write-Host "  Stage: $Stage | Region: $Region" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Resolve API URL
Write-Host "[1/5] Resolving API Gateway URL..." -ForegroundColor Yellow
if (-not $ApiUrl) {
  $apiUrlFile = "$PSScriptRoot\..\..\backend_urbanshield\scripts\.api-url"
  if (Test-Path $apiUrlFile) {
    $ApiUrl = (Get-Content $apiUrlFile -Raw).Trim()
    Write-Host "  Read from .api-url: $ApiUrl" -ForegroundColor Green
  } else {
    Write-Host "  ERROR: No API URL provided and .api-url file not found." -ForegroundColor Red
    Write-Host "  Run deploy-backend.ps1 first or pass -ApiUrl parameter." -ForegroundColor Red
    exit 1
  }
}

# 2. Update .env.production
Write-Host "[2/5] Updating .env.production..." -ForegroundColor Yellow
$envFile = ".env.production"
$envContent = Get-Content $envFile -Raw
$envContent = $envContent -replace "__API_GATEWAY_URL__", $ApiUrl
$envContent = $envContent -replace "https://[a-z0-9]+\.execute-api\.[a-z0-9-]+\.amazonaws\.com/api", "$ApiUrl/api"
Set-Content $envFile -Value $envContent -NoNewline
Write-Host "  VITE_API_URL = $ApiUrl/api" -ForegroundColor Green

# 3. Install dependencies
Write-Host "[3/5] Installing dependencies..." -ForegroundColor Yellow
npm ci 2>&1 | Out-Null
Write-Host "  Dependencies installed" -ForegroundColor Green

# 4. Build
Write-Host "[4/5] Building production bundle..." -ForegroundColor Yellow
npm run build 2>&1 | Tee-Object -Variable buildLog
if (-not (Test-Path "dist\index.html")) {
  Write-Host "  ERROR: Build failed — dist/index.html not found." -ForegroundColor Red
  exit 1
}
$distSize = (Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "  Build complete — $([math]::Round($distSize, 2)) MB" -ForegroundColor Green

# 5. Upload to S3
$bucketName = "urbanshield-frontend-$Stage"
Write-Host "[5/5] Uploading to s3://$bucketName/ ..." -ForegroundColor Yellow

# Sync with appropriate content types
aws s3 sync dist/ "s3://$bucketName/" `
  --delete `
  --region $Region `
  --cache-control "public, max-age=31536000, immutable" `
  --exclude "index.html" `
  --exclude "*.html"

# Upload HTML files with no-cache
aws s3 sync dist/ "s3://$bucketName/" `
  --region $Region `
  --exclude "*" `
  --include "*.html" `
  --cache-control "no-cache, no-store, must-revalidate" `
  --content-type "text/html"

$websiteUrl = "http://$bucketName.s3-website-$Region.amazonaws.com"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  FRONTEND DEPLOY SUCCESSFUL!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Website URL: $websiteUrl" -ForegroundColor White
Write-Host "  API URL:     $ApiUrl/api" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Green

# Save frontend URL
$websiteUrl | Out-File -FilePath "$PSScriptRoot\.frontend-url" -Encoding UTF8 -NoNewline
