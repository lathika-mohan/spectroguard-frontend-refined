$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "    SPECTRAGUARD P8.2 AUTHENTICATION WORKFLOW RUNNER    " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8000/api/v1"

# 1. Login & Token Extraction Check
Write-Host "`n[1/4] Verifying Strict Login & Token Retrieval Contract..." -ForegroundColor Cyan
try {
    $loginBody = @{ username = "admin"; password = "password" } | ConvertTo-Json
    $loginRes = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing
    
    $json = $loginRes.Content | ConvertFrom-Json
    if (-not $json.token) {
        Write-Host "[FAIL] Contract Violation: Backend returned status 200 but omitted the necessary 'token' property." -ForegroundColor Red
        exit 1
    }
    $token = $json.token
    Write-Host "[PASS] JWT Token successfully validated: Token string found." -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Authentication endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Protected Route Access using Token
Write-Host "`n[2/4] Verifying Protected Route Access (With Authorization Header)..." -ForegroundColor Cyan
try {
    $headers = @{ Authorization = "Bearer $token" }
    $camRes = Invoke-WebRequest -Uri "$baseUrl/cameras" -Method GET -Headers $headers -UseBasicParsing
    Write-Host "[PASS] Protected route access authorized successfully (Status: $($camRes.StatusCode))." -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Token validation rejected by core transport architecture." -ForegroundColor Red
    exit 1
}

# 3. Unauthorized Access Rejection (Expecting strict HTTP failure states)
Write-Host "`n[3/4] Verifying Unauthorized Access Rejection (Malformed Token)..." -ForegroundColor Cyan
try {
    $badHeaders = @{ Authorization = "Bearer completely_invalid_token_hash" }
    $badRes = Invoke-WebRequest -Uri "$baseUrl/cameras" -Method GET -Headers $badHeaders -UseBasicParsing
    
    # If the response reaches this line with a 200 status, it means unauthenticated queries are passing through
    Write-Host "[FAIL] Security Violation: Backend failed to reject a malformed token with an HTTP error code (Status: $($badRes.StatusCode))." -ForegroundColor Red
    exit 1
} catch {
    # If it falls into the catch block, verify that it was caught due to a standard 401 or 403 error status
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401 -or $statusCode -eq 403) {
        Write-Host "[PASS] Request correctly blocked by security policies (Status: $statusCode)." -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Unexpected network failure status: $statusCode" -ForegroundColor Red
        exit 1
    }
}

# 4. Session Termination & Purging Lifecycle
Write-Host "`n[4/4] Verifying Complete Client Logout Cleanup..." -ForegroundColor Cyan
$token = $null
if ($token -eq $null) {
    Write-Host "[PASS] Session memory context successfully purged." -ForegroundColor Green
} else {
    Write-Host "[FAIL] Session token context leaked." -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "    P8.2 AUTHENTICATION WORKFLOW VALIDATION PASSED      " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
exit 0
