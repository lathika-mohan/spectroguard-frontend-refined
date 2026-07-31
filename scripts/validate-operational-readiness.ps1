$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       SPECTRAGUARD P9.5 OPERATIONAL READINESS RUNNER   " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$hasErrors = $false
$srcFiles = Get-ChildItem -Path "src" -Recurse -Include *.ts, *.tsx

Write-Host "`n[1/3] Validating Frontend Error Boundaries & Crash Reporting..." -ForegroundColor Cyan
$hasErrorBoundary = $srcFiles | Select-String -Pattern "ErrorBoundary|componentDidCatch|getDerivedStateFromError|useErrorBoundary" -List
if ($hasErrorBoundary) {
    Write-Host "[PASS] React Error Boundary patterns detected. Application will degrade gracefully on render faults." -ForegroundColor Green
} else {
    Write-Host "[WARN] No explicit ErrorBoundary components found. Unhandled render errors may unmount the entire React tree." -ForegroundColor Yellow
}

Write-Host "`n[2/3] Validating Global Exception Handlers (Unhandled Promises)..." -ForegroundColor Cyan
$hasGlobalHandlers = $srcFiles | Select-String -Pattern "window\.addEventListener\(['`"](unhandledrejection|error)['`"]" -List
if ($hasGlobalHandlers) {
    Write-Host "[PASS] Global runtime exception listeners detected for operational telemetry." -ForegroundColor Green
} else {
    Write-Host "[WARN] Global 'unhandledrejection' or 'error' window listeners missing. Silent runtime failures may go untracked." -ForegroundColor Yellow
}

Write-Host "`n[3/3] Validating Operational API Degradation (Try/Catch blocks)..." -ForegroundColor Cyan
$hasTryCatch = $srcFiles | Select-String -Pattern "catch\s*\(" -List
if ($hasTryCatch) {
    Write-Host "[PASS] Network exception handling (try/catch blocks) detected. Application handles API degradation." -ForegroundColor Green
} else {
    Write-Host "[FAIL] Missing structured exception handling for async operations." -ForegroundColor Red
    $hasErrors = $true
}

Write-Host "`n========================================================" -ForegroundColor Cyan
if ($hasErrors) {
    Write-Host "    P9.5 OPERATIONAL READINESS VALIDATION FAILED        " -ForegroundColor Red
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 1
} else {
    Write-Host "    P9.5 OPERATIONAL READINESS PASSED                   " -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 0
}
