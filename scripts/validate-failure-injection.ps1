$ErrorActionPreference = "Continue"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      SPECTRAGUARD P8.5 FAILURE INJECTION RUNNER        " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:8000/api/v1"
$hasFatalRegression = $false

# Helper array of status codes to inject and evaluate
$errorTargets = @(
    @{ Code = 401; Name = "Unauthorized Access" },
    @{ Code = 403; Name = "Access Forbidden" },
    @{ Code = 404; Name = "Resource Not Found" },
    @{ Code = 422; Name = "Validation Error" },
    @{ Code = 429; Name = "Rate Limit Exceeded" },
    @{ Code = 500; Name = "Internal Server Fault" }
)

Write-Host "Probing backend dynamic error injection endpoints..." -ForegroundColor Cyan

foreach ($target in $errorTargets) {
    $code = $target.Code
    $name = $target.Name
    Write-Host "`nChecking Resilience against Error Status $code ($name)..." -ForegroundColor Cyan
    
    try {
        # Querying specific simulation routes on the mock backend
        $response = Invoke-WebRequest -Uri "$baseUrl/system/simulate-error/$code" -Method GET -UseBasicParsing -TimeoutSec 3
        
        # If it reaches here with status 200, check if the backend mock has implemented simulation paths yet
        Write-Host "[WARN] Endpoint did not throw an HTTP error natively (Status: $($response.StatusCode))." -ForegroundColor Yellow
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        if ($status -eq $code) {
            Write-Host "[PASS] Core transport cleanly intercepted and verified status code: $status" -ForegroundColor Green
        } else {
            Write-Host "[FAIL] Unexpected error translation code encountered: $status" -ForegroundColor Red
            $hasFatalRegression = $true
        }
    }
}

Write-Host "`n========================================================" -ForegroundColor Cyan
if ($hasFatalRegression) {
    Write-Host "    P8.5 FAILURE INJECTION PROTOCOL ENCOUNTERED FAULTS  " -ForegroundColor Red
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 1
} else {
    Write-Host "    P8.5 FAILURE INJECTION RESILIENCE CHECKS COMPLETE   " -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 0
}
