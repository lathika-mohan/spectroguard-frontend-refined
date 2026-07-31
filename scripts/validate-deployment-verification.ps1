$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      SPECTRAGUARD P9.8 DEPLOYMENT VERIFICATION RUNNER  " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8000/api/v1"
$hasErrors = $false

Write-Host "`n[1/4] Verifying Core Backend Health & System Status..." -ForegroundColor Cyan
try {
    $healthRes = Invoke-WebRequest -Uri "$baseUrl/system/health" -Method GET -UseBasicParsing -TimeoutSec 3
    if ($healthRes.StatusCode -eq 200) {
        Write-Host "[PASS] Core backend health endpoint responded with HTTP 200." -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Health endpoint returned non-200 status." -ForegroundColor Red
        $hasErrors = $true
    }
} catch {
    Write-Host "[FAIL] Unable to reach backend health endpoint: $($_.Exception.Message)" -ForegroundColor Red
    $hasErrors = $true
}

Write-Host "`n[2/4] Verifying Authentication & Token Issuance Pipeline..." -ForegroundColor Cyan
try {
    $loginBody = @{ username = "admin"; password = "password" } | ConvertTo-Json
    $loginRes = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing
    $tokenData = $loginRes.Content | ConvertFrom-Json
    if ($null -ne $tokenData.token) {
        Write-Host "[PASS] Authentication pipeline successfully issued production token." -ForegroundColor Green
        $global:token = $tokenData.token
    } else {
        Write-Host "[FAIL] Authentication response missing token property." -ForegroundColor Red
        $hasErrors = $true
    }
} catch {
    Write-Host "[FAIL] Authentication request failed." -ForegroundColor Red
    $hasErrors = $true
}

Write-Host "`n[3/4] Verifying Protected Camera Stream Telemetry Route..." -ForegroundColor Cyan
try {
    $headers = @{ Authorization = "Bearer $global:token" }
    $camRes = Invoke-WebRequest -Uri "$baseUrl/cameras" -Method GET -Headers $headers -UseBasicParsing
    $cameras = $camRes.Content | ConvertFrom-Json
    if ($cameras -is [array] -and $cameras.Length -gt 0) {
        Write-Host "[PASS] Camera telemetry operational (Retrieved $($cameras.Length) active streams)." -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Camera list payload is invalid or empty." -ForegroundColor Red
        $hasErrors = $true
    }
} catch {
    Write-Host "[FAIL] Failed to query protected camera registry." -ForegroundColor Red
    $hasErrors = $true
}

Write-Host "`n[4/4] Verifying Frontend Static Distribution Integrity..." -ForegroundColor Cyan
if ((Test-Path "dist/index.html") -and (Test-Path "spectraguard-frontend-release.zip")) {
    Write-Host "[PASS] Production build assets and release deployment archive verified." -ForegroundColor Green
} else {
    Write-Host "[FAIL] Missing distribution files or release zip archive." -ForegroundColor Red
    $hasErrors = $true
}

Write-Host "`n========================================================" -ForegroundColor Cyan
if ($hasErrors) {
    Write-Host "    P9.8 DEPLOYMENT VERIFICATION FAILED                 " -ForegroundColor Red
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 1
} else {
    Write-Host "    P9.8 DEPLOYMENT VERIFICATION PASSED SUCCESSFULLY    " -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 0
}
