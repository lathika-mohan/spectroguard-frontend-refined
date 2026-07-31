$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       SPECTRAGUARD P8.6 PERFORMANCE BENCHMARK RUNNER   " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8000/api/v1"
$hasPerformanceViolations = $false

# Define performance SLA thresholds (milliseconds)
$SLA_API = 500
$SLA_INFERENCE = 2000

# Warm up networking stack to prevent cold-start JIT/proxy latency skewing the auth benchmark
$null = Invoke-WebRequest -Uri "$baseUrl/system/health" -Method GET -UseBasicParsing -ErrorAction SilentlyContinue

# 1. Base Authentication
Write-Host "`n[1/3] Establishing Baseline Auth & Measuring Latency..." -ForegroundColor Cyan
$authSw = [System.Diagnostics.Stopwatch]::StartNew()
$loginBody = @{ username = "admin"; password = "password" } | ConvertTo-Json
$loginRes = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing
$authSw.Stop()
$token = ($loginRes.Content | ConvertFrom-Json).token
$headers = @{ Authorization = "Bearer $token" }

Write-Host " -> Auth Response Time: $($authSw.ElapsedMilliseconds)ms (SLA: ${SLA_API}ms)" -ForegroundColor DarkGray
if ($authSw.ElapsedMilliseconds -gt $SLA_API) { $hasPerformanceViolations = $true; Write-Host "[FAIL] Auth SLA Violated" -ForegroundColor Red } else { Write-Host "[PASS] Auth latency within acceptable limits." -ForegroundColor Green }

# 2. Dashboard Load Time (Cameras)
Write-Host "`n[2/3] Measuring Dashboard Telemetry Latency (GET /cameras)..." -ForegroundColor Cyan
$camSw = [System.Diagnostics.Stopwatch]::StartNew()
$camRes = Invoke-WebRequest -Uri "$baseUrl/cameras" -Method GET -Headers $headers -UseBasicParsing
$camSw.Stop()

Write-Host " -> Telemetry Response Time: $($camSw.ElapsedMilliseconds)ms (SLA: ${SLA_API}ms)" -ForegroundColor DarkGray
if ($camSw.ElapsedMilliseconds -gt $SLA_API) { $hasPerformanceViolations = $true; Write-Host "[FAIL] Telemetry SLA Violated" -ForegroundColor Red } else { Write-Host "[PASS] Dashboard loads dynamically without UI blocking." -ForegroundColor Green }

# 3. Sequential Inference Execution
Write-Host "`n[3/3] Executing Multiple Sequential Predictions (Stress Test)..." -ForegroundColor Cyan

$boundary = "----SpectraGuardFormBoundary$([System.Guid]::NewGuid().ToString('N'))"
$bodyLines = (
    "--$boundary",
    'Content-Disposition: form-data; name="file"; filename="test_spectra_perf.jpg"',
    'Content-Type: image/jpeg',
    '',
    'dummy_spectral_image_byte_data_perf',
    "--$boundary--"
)
$body = $bodyLines -join "`r`n"
$contentType = "multipart/form-data; boundary=$boundary"

$predictionTimes = @()
for ($i = 1; $i -le 5; $i++) {
    $predSw = [System.Diagnostics.Stopwatch]::StartNew()
    $predictRes = Invoke-WebRequest -Uri "$baseUrl/predict" -Method POST -Headers $headers -ContentType $contentType -Body $body -UseBasicParsing
    $predSw.Stop()
    $predictionTimes += $predSw.ElapsedMilliseconds
    # Wrapped using curly braces to avoid drive character delimiter parse error
    Write-Host " -> Inference Cycle ${i}: $($predSw.ElapsedMilliseconds)ms" -ForegroundColor DarkGray
}

$avgInference = ($predictionTimes | Measure-Object -Average).Average
Write-Host " -> Average Inference Latency: $([math]::Round($avgInference))ms (SLA: ${SLA_INFERENCE}ms)" -ForegroundColor DarkGray

if ($avgInference -gt $SLA_INFERENCE) { 
    $hasPerformanceViolations = $true
    Write-Host "[FAIL] Inference engine exceeded pipeline latency SLA." -ForegroundColor Red 
} else { 
    Write-Host "[PASS] AI pipeline sustained sequential load smoothly." -ForegroundColor Green 
}

Write-Host "`n========================================================" -ForegroundColor Cyan
if ($hasPerformanceViolations) {
    Write-Host "    P8.6 PERFORMANCE BENCHMARK FAILED SLAs              " -ForegroundColor Red
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 1
} else {
    Write-Host "    P8.6 PERFORMANCE BENCHMARK PASSED SUCCESSFULLY      " -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 0
}
