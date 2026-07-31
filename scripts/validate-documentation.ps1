$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "     SPECTRAGUARD P9.7 DOCUMENTATION VALIDATION RUNNER  " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$hasErrors = $false

Write-Host "`n[1/2] Verifying Deployment Guide Existence..." -ForegroundColor Cyan
if (Test-Path "docs/DEPLOYMENT.md") {
    $content = Get-Content "docs/DEPLOYMENT.md" -Raw
    if ($content.Length -gt 500) {
        Write-Host "[PASS] Deployment Guide found and contains detailed operational sections." -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Deployment Guide content is incomplete or too short." -ForegroundColor Red
        $hasErrors = $true
    }
} else {
    Write-Host "[FAIL] docs/DEPLOYMENT.md missing." -ForegroundColor Red
    $hasErrors = $true
}

Write-Host "`n[2/2] Verifying Documentation Sections (Rollback & Checklist)..." -ForegroundColor Cyan
if ($content -match "Rollback Procedure" -and $content -match "Production Checklist") {
    Write-Host "[PASS] Required operational sections (Checklist, Rollback) verified." -ForegroundColor Green
} else {
    Write-Host "[FAIL] Missing essential operational headings." -ForegroundColor Red
    $hasErrors = $true
}

Write-Host "`n========================================================" -ForegroundColor Cyan
if ($hasErrors) {
    Write-Host "    P9.7 DOCUMENTATION VALIDATION FAILED                " -ForegroundColor Red
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 1
} else {
    Write-Host "    P9.7 DOCUMENTATION VALIDATION PASSED                " -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 0
}
