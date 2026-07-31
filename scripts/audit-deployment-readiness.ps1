$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       SPECTRAGUARD P9.1 DEPLOYMENT READINESS AUDIT     " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$hasErrors = $false

Write-Host "`n[1/4] Validating Dependency Lock..." -ForegroundColor Cyan
if (Test-Path "package-lock.json") {
    Write-Host "[PASS] package-lock.json exists ensuring deterministic deployments." -ForegroundColor Green
} else {
    Write-Host "[FAIL] package-lock.json missing." -ForegroundColor Red
    $hasErrors = $true
}

Write-Host "`n[2/4] Validating Environment Configuration..." -ForegroundColor Cyan
if (Test-Path ".env.example") {
    Write-Host "[PASS] .env.example deployment template exists." -ForegroundColor Green
} else {
    Write-Host "[FAIL] .env.example missing." -ForegroundColor Red
    $hasErrors = $true
}

Write-Host "`n[3/4] Validating Build Configuration..." -ForegroundColor Cyan
if (Test-Path "vite.config.ts") {
    Write-Host "[PASS] vite.config.ts bundler configuration verified." -ForegroundColor Green
} else {
    Write-Host "[FAIL] vite.config.ts missing." -ForegroundColor Red
    $hasErrors = $true
}

Write-Host "`n[4/4] Validating Production Build Artifact Generation..." -ForegroundColor Cyan
try {
    Write-Host "Executing Vite production build compiler..." -ForegroundColor DarkGray
    $null = npm run build
    if (Test-Path "dist/index.html") {
        Write-Host "[PASS] Production build generated successfully in 'dist/' directory." -ForegroundColor Green
    } else {
        Write-Host "[FAIL] 'dist/' directory or index.html missing after build." -ForegroundColor Red
        $hasErrors = $true
    }
} catch {
    Write-Host "[FAIL] Production build execution failed." -ForegroundColor Red
    $hasErrors = $true
}

Write-Host "`n========================================================" -ForegroundColor Cyan
if ($hasErrors) {
    Write-Host "    P9.1 DEPLOYMENT READINESS AUDIT FAILED              " -ForegroundColor Red
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 1
} else {
    Write-Host "    P9.1 DEPLOYMENT READINESS AUDIT PASSED              " -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 0
}
