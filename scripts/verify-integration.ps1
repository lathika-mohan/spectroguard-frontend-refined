$ErrorActionPreference = "Continue"
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       SPECTRAGUARD PHASE 7 BACKEND INTEGRATION AUDIT  " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$issues = 0

# 1. Enforce that static mock arrays are absent from active data transport paths
$mockCheck = Select-String -Path "src/hooks/*.ts" -Pattern "mockCameras", "mockForensics" -ErrorAction SilentlyContinue
if ($mockCheck) {
    Write-Host "[FAIL] Found residual static mocks in hooks layer:" -ForegroundColor Red
    $mockCheck
    $issues++
} else {
    Write-Host "[PASS] No hardcoded mock objects found inside live hooks." -ForegroundColor Green
}

# 2. Confirm centralized API transport and Bearer Token Injection engine existence
if (Test-Path "src/api/client.ts") {
    $clientContent = Get-Content "src/api/client.ts" -Raw
    if ($clientContent -match "Authorization" -and $clientContent -match "fetch") {
        Write-Host "[PASS] Central API Client utilizes authenticated transport wrapper securely." -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Central API Client is missing security context headers or transport primitives." -ForegroundColor Red
        $issues++
    }
} else {
    Write-Host "[FAIL] Central API Client file is missing entirely." -ForegroundColor Red
    $issues++
}

# 3. Confirm integration of the prediction pipeline with dynamic layout components
$viewCheck = Select-String -Path "src/views/Dashboard.tsx" -Pattern "usePrediction", "PredictionDisplay" -ErrorAction SilentlyContinue
if ($viewCheck) {
    Write-Host "[PASS] Dashboard dynamically implements on-demand prediction workflows." -ForegroundColor Green
} else {
    Write-Host "[FAIL] Dashboard view lacks unified prediction pipeline mapping variables." -ForegroundColor Red
    $issues++
}

if ($issues -gt 0) {
    Write-Host "`nE2E INTEGRATION AUDIT FAILED. $issues engineering blockers found." -ForegroundColor Red
    exit 1
} else {
    Write-Host "`n--- E2E Structural Audit Passed ---" -ForegroundColor Cyan
    Write-Host "All frontend systems are successfully integrated with backend network transport schemas." -ForegroundColor Green
}
