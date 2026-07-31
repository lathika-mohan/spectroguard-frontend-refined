$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       SPECTRAGUARD P8.8 PRODUCTION BUILD RUNNER        " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$distPath = "dist"
$assetsPath = "dist/assets"

# 1. Distribution Directory Verification
Write-Host "`n[1/3] Validating Production Distribution Directory..." -ForegroundColor Cyan
if (-not (Test-Path $distPath) -or -not (Test-Path "$distPath/index.html")) {
    Write-Host "[FAIL] Production build missing. Run 'npm run build' to generate the distribution artifact." -ForegroundColor Red
    exit 1
}
Write-Host "[PASS] Production build directory structure and HTML entrypoint verified." -ForegroundColor Green

# 2. Asset Compilation Verification
Write-Host "`n[2/3] Validating Static Asset Generation..." -ForegroundColor Cyan
$jsFiles = Get-ChildItem -Path $assetsPath -Filter "*.js"
$cssFiles = Get-ChildItem -Path $assetsPath -Filter "*.css"

if ($jsFiles.Count -eq 0 -or $cssFiles.Count -eq 0) {
    Write-Host "[FAIL] Missing core JS or CSS assets in production build." -ForegroundColor Red
    exit 1
}
Write-Host "[PASS] Core application assets compiled successfully (JS Chunks: $($jsFiles.Count), CSS Chunks: $($cssFiles.Count))." -ForegroundColor Green

# 3. Bundle Optimization Benchmarking
Write-Host "`n[3/3] Validating Asset Bundle Optimization..." -ForegroundColor Cyan
$hasLargeBundles = $false
foreach ($file in $jsFiles) {
    $sizeMB = [math]::Round($file.Length / 1MB, 2)
    if ($sizeMB -gt 2) {
        Write-Host "[WARN] Bundle $($file.Name) exceeds optimization limits ($sizeMB MB). Consider route-level code-splitting." -ForegroundColor Yellow
        $hasLargeBundles = $true
    }
}
if (-not $hasLargeBundles) {
    Write-Host "[PASS] Asset bundle sizes are within highly optimized payload limits." -ForegroundColor Green
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "    P8.8 PRODUCTION BUILD VALIDATION PASSED             " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
exit 0
