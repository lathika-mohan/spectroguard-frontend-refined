$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       SPECTRAGUARD P8.1 ENDPOINT CONNECTIVITY RUNNER   " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

Write-Host "Checking local port 8000 status..." -ForegroundColor Cyan
$portCheck = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue

if (-not $portCheck) {
    Write-Host "`n[FAIL] Port 8000 is not listening! The FastAPI backend engine is offline." -ForegroundColor Red
    return
}

$baseUrl = "http://localhost:8000/api/v1"

Write-Host "`n[1/4] Probing Authentication Endpoint..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body (@{username="test"; password="test"} | ConvertTo-Json) -ContentType "application/json" -TimeoutSec 3 -UseBasicParsing
    Write-Host "[PASS] Authentication endpoint responded successfully (Status: $($response.StatusCode))." -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Failed to communicate with Auth endpoint." -ForegroundColor Red
    return
}

Write-Host "`n[2/4] Probing Camera Stream Subsystem..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/cameras" -Method GET -TimeoutSec 3 -UseBasicParsing
    Write-Host "[PASS] Camera subsystem responded successfully (Status: $($response.StatusCode))." -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Failed to communicate with Cameras endpoint." -ForegroundColor Red
    return
}

Write-Host "`n[3/4] Probing Forensic Registry..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/forensics/CAM-01" -Method GET -TimeoutSec 3 -UseBasicParsing
    Write-Host "[PASS] Forensic subsystem responded successfully (Status: $($response.StatusCode))." -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Failed to communicate with Forensics endpoint." -ForegroundColor Red
    return
}

Write-Host "`n[4/4] Probing Inference Upload Target..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/predict" -Method POST -TimeoutSec 3 -UseBasicParsing
    Write-Host "[PASS] Inference subsystem responded successfully (Status: $($response.StatusCode))." -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Failed to communicate with Predict endpoint." -ForegroundColor Red
    return
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "    P8.1 CONNECTIVITY MATRIX SANITY CHECK PASSED        " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
