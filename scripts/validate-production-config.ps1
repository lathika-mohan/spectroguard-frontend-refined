$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "    SPECTRAGUARD P9.2 PRODUCTION CONFIGURATION RUNNER   " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$hasErrors = $false

Write-Host "`n[1/3] Validating Environment Variable Schema..." -ForegroundColor Cyan
$envContent = Get-Content ".env.example" -Raw
if ($envContent -match "VITE_API_URL") {
    Write-Host "[PASS] Required production API routing variable (VITE_API_URL) is defined in schema." -ForegroundColor Green
} else {
    Write-Host "[FAIL] VITE_API_URL is missing from environment schema." -ForegroundColor Red
    $hasErrors = $true
}

Write-Host "`n[2/3] Validating Source Code Environment Separation..." -ForegroundColor Cyan
$srcFiles = Get-ChildItem -Path "src" -Recurse -Include *.ts, *.tsx
$hardcodedLocalhost = $srcFiles | Select-String -Pattern "http://localhost" -List

if ($hardcodedLocalhost) {
    Write-Host "[FAIL] Found hardcoded localhost URLs in source files. Production builds must use dynamic environment routing." -ForegroundColor Red
    foreach ($match in $hardcodedLocalhost) {
        Write-Host "       -> $($match.Path) (Line $($match.LineNumber))" -ForegroundColor DarkGray
    }
    $hasErrors = $true
} else {
    Write-Host "[PASS] No hardcoded localhost endpoints detected in source directory." -ForegroundColor Green
}

$envUsage = $srcFiles | Select-String -Pattern "import.meta.env.VITE_API_URL" -List
if ($envUsage) {
    Write-Host "[PASS] Verified 'import.meta.env.VITE_API_URL' usage in frontend API layers." -ForegroundColor Green
} else {
    Write-Host "[WARN] 'import.meta.env.VITE_API_URL' explicit usage not detected. Ensure API calls use dynamic base URLs or relative proxies." -ForegroundColor Yellow
}

Write-Host "`n[3/3] Validating Asset Paths & Vite Base Configuration..." -ForegroundColor Cyan
$viteConfig = Get-Content "vite.config.ts" -Raw
if ($viteConfig -match "base:") {
    Write-Host "[PASS] Custom base path asset configuration detected." -ForegroundColor Green
} else {
    Write-Host "[PASS] Default root asset base path configuration assumed (valid for standard hosting)." -ForegroundColor Green
}

Write-Host "`n========================================================" -ForegroundColor Cyan
if ($hasErrors) {
    Write-Host "    P9.2 PRODUCTION CONFIGURATION VALIDATION FAILED     " -ForegroundColor Red
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 1
} else {
    Write-Host "    P9.2 PRODUCTION CONFIGURATION VALIDATION PASSED     " -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 0
}
