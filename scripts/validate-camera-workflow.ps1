$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      SPECTRAGUARD P8.3 CAMERA WORKFLOW RUNNER          " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8000/api/v1"

# 1. Authenticate and extract session token
Write-Host "[1/4] Establishing Authenticated Session Context..." -ForegroundColor Cyan
try {
    $loginBody = @{ username = "admin"; password = "password" } | ConvertTo-Json
    $loginRes = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing
    $token = ($loginRes.Content | ConvertFrom-Json).token
    $headers = @{ Authorization = "Bearer $token" }
    Write-Host "[PASS] Authentication established. Token captured." -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Failed to establish authentication." -ForegroundColor Red
    exit 1
}

# 2. Dashboard to Camera List Transition (GET /cameras)
Write-Host "`n[2/4] Validating Camera List (Dashboard) Payload Structure..." -ForegroundColor Cyan
try {
    $camRes = Invoke-WebRequest -Uri "$baseUrl/cameras" -Method GET -Headers $headers -UseBasicParsing
    $cameras = $camRes.Content | ConvertFrom-Json
    
    # Enforce strict array compliance for frontend map() grid structures
    if ($cameras -isnot [array]) {
        Write-Host "[FAIL] Contract Violation: Camera list payload is NOT an array. This will cause a UI crash." -ForegroundColor Red
        exit 1
    }
    Write-Host "[PASS] Camera list payload is a valid iteratable array (Count: $($cameras.Length))." -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Camera list endpoint failed or rejected request." -ForegroundColor Red
    exit 1
}

# 3. Target Specific Camera (Navigation State Selection)
Write-Host "`n[3/4] Validating Target Camera Selection Integrity..." -ForegroundColor Cyan
if ($cameras.Length -gt 0 -and $cameras[0].id) {
    $targetCamId = $cameras[0].id
    Write-Host "[PASS] Successfully extracted valid Camera ID ($targetCamId) for detailed inspection." -ForegroundColor Green
} else {
    Write-Host "[FAIL] Camera list array is empty. Cannot resolve validation target." -ForegroundColor Red
    exit 1
}

# 4. Camera Details to Forensics Transition (GET /forensics/:id)
Write-Host "`n[4/4] Validating Spectral Forensics Detail Payload Structure..." -ForegroundColor Cyan
try {
    $forensicRes = Invoke-WebRequest -Uri "$baseUrl/forensics/$targetCamId" -Method GET -Headers $headers -UseBasicParsing
    if ($forensicRes.StatusCode -eq 200) {
        Write-Host "[PASS] Forensic details retrieved successfully for $targetCamId." -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Forensic endpoint failed to resolve detailed analysis payload." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "[FAIL] Failed to execute Forensics state transition network request." -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "    P8.3 CAMERA WORKFLOW VALIDATION PASSED              " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
exit 0
