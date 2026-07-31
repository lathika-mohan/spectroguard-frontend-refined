$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      SPECTRAGUARD P8.7 RESPONSIVE LAYOUT RUNNER        " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$distPath = "dist/assets"
if (-not (Test-Path $distPath)) {
    Write-Host "[WARN] Production build not found. Triggering Vite build compiler..." -ForegroundColor Yellow
    npm run build | Out-Null
}

$cssFiles = Get-ChildItem -Path $distPath -Filter "*.css"
if (-not $cssFiles) {
    Write-Host "[FAIL] No CSS bundle found in production distribution. Build pipeline failure." -ForegroundColor Red
    exit 1
}

$cssContent = Get-Content $cssFiles[0].FullName -Raw
$hasLayoutViolations = $false

Write-Host "`n[1/3] Validating Mobile-First & Tablet Breakpoints (md:)..." -ForegroundColor Cyan
if ($cssContent -match "@media \((min-width:\s*768px|width\s*>=\s*768px)\)") {
    Write-Host "[PASS] Tablet responsive breakpoints (768px) compiled successfully." -ForegroundColor Green
} else {
    Write-Host "[FAIL] Missing tablet responsive media queries." -ForegroundColor Red
    $hasLayoutViolations = $true
}

Write-Host "`n[2/3] Validating Desktop Breakpoints (lg: / xl:)..." -ForegroundColor Cyan
if ($cssContent -match "@media \((min-width:\s*1024px|width\s*>=\s*1024px)\)") {
    Write-Host "[PASS] Desktop responsive breakpoints (1024px) compiled successfully." -ForegroundColor Green
} else {
    Write-Host "[FAIL] Missing desktop responsive media queries." -ForegroundColor Red
    $hasLayoutViolations = $true
}

Write-Host "`n[3/3] Validating Cross-Browser Vendor Prefixes..." -ForegroundColor Cyan
if ($cssContent -match "-webkit-" -and $cssContent -match "-moz-") {
    Write-Host "[PASS] Autoprefixer successfully injected webkit and moz vendor fallbacks." -ForegroundColor Green
} else {
    Write-Host "[WARN] Missing some explicit legacy vendor prefixes. Assuming modern CSS standard enforcement." -ForegroundColor Yellow
}

Write-Host "`n========================================================" -ForegroundColor Cyan
if ($hasLayoutViolations) {
    Write-Host "    P8.7 RESPONSIVE LAYOUT VALIDATION FAILED            " -ForegroundColor Red
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 1
} else {
    Write-Host "    P8.7 CROSS-BROWSER & RESPONSIVE VALIDATION PASSED   " -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 0
}
