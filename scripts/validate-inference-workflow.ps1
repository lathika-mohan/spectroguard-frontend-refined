$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      SPECTRAGUARD P8.4 INFERENCE WORKFLOW RUNNER       " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8000/api/v1"

# 1. Authenticate and extract session token
Write-Host "`n[1/3] Establishing Authenticated Session Context..." -ForegroundColor Cyan
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

# 2. Trigger Prediction Upload Request (Simulate multipart/form-data)
Write-Host "`n[2/3] Simulating Inference Image Upload Request..." -ForegroundColor Cyan
try {
    # Construct a raw multipart/form-data payload compatible with native PowerShell 5.1 constraints
    $boundary = "----SpectraGuardFormBoundary$([System.Guid]::NewGuid().ToString('N'))"
    $bodyLines = (
        "--$boundary",
        'Content-Disposition: form-data; name="file"; filename="test_spectra.jpg"',
        'Content-Type: image/jpeg',
        '',
        'dummy_spectral_image_byte_data',
        "--$boundary--"
    )
    $body = $bodyLines -join "`r`n"
    $contentType = "multipart/form-data; boundary=$boundary"

    $predictRes = Invoke-WebRequest -Uri "$baseUrl/predict" -Method POST -Headers $headers -ContentType $contentType -Body $body -UseBasicParsing
    $prediction = $predictRes.Content | ConvertFrom-Json
    Write-Host "[PASS] Inference endpoint accepted multipart upload successfully." -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Prediction endpoint rejected the upload payload (Status: $($_.Exception.Response.StatusCode.value__))." -ForegroundColor Red
    exit 1
}

# 3. Validate Inference Schema Structure
Write-Host "`n[3/3] Validating Inference Data Payload Schema..." -ForegroundColor Cyan
if ($null -ne $prediction.confidence -and $null -ne $prediction.prediction) {
    Write-Host "[PASS] Core inference metrics (confidence, prediction) successfully resolved." -ForegroundColor Green
    Write-Host "       -> Result: $($prediction.prediction) (Confidence: $($prediction.confidence))" -ForegroundColor DarkGray
} else {
    Write-Host "[FAIL] Contract Violation: Inference payload is missing core 'prediction' or 'confidence' structural keys." -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "    P8.4 INFERENCE WORKFLOW VALIDATION PASSED           " -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
exit 0
