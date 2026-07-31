$ErrorActionPreference = "Continue"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      SPECTRAGUARD RELEASE CERTIFICATION ENGINE v3.1    " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$hasBlockers = $false

# 1. Enforce strict repository tracking boundaries
Write-Host "[1/6] Verifying Git Slate Cleanliness..." -ForegroundColor Cyan
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "[FAIL] Uncommitted workspace debris detected!" -ForegroundColor Red
    $gitStatus
    $hasBlockers = $true
} else {
    Write-Host "[PASS] Git working tree is perfectly clean." -ForegroundColor Green
}

# 2. Inspect active runtime hooks layer for leaked static data anchors
Write-Host "`n[2/6] Auditing Production Runtime Paths for Mocks..." -ForegroundColor Cyan
$mockLeaks = Select-String -Path "src/hooks/*.ts", "src/api/*.ts" -Pattern "mockCameras", "mockForensics" -ErrorAction SilentlyContinue
if ($mockLeaks) {
    Write-Host "[FAIL] Found unauthorized static mock leaks inside production code paths:" -ForegroundColor Red
    $mockLeaks
    $hasBlockers = $true
} else {
    Write-Host "[PASS] Zero static production mock dependencies isolated in active runtime transport." -ForegroundColor Green
}

# 3. Trigger strict Oxlint rules checking engine
Write-Host "`n[3/6] Executing Static Application Linter Check..." -ForegroundColor Cyan
$null = npm run lint 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] Linter reports errors or critical rules configuration failure." -ForegroundColor Red
    $hasBlockers = $true
} else {
    Write-Host "[PASS] Linter checks completed with zero structural violations." -ForegroundColor Green
}

# 4. Trigger strict TypeScript emit baseline compilation verification
Write-Host "`n[4/6] Executing Strict TypeScript Type-Check Validation..." -ForegroundColor Cyan
$null = npx tsc --noEmit 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] TypeScript compilation failed with diagnostic errors." -ForegroundColor Red
    $hasBlockers = $true
} else {
    Write-Host "[PASS] TypeScript compilation contains zero type safety boundaries leaks." -ForegroundColor Green
}

# 5. Execute Minified Client Environment Bundle Build
Write-Host "`n[5/6] Validating Client Environment Production Compilation Build..." -ForegroundColor Cyan
$null = npm run build 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] Bundle generation pipeline thrown a fatal compilation exception." -ForegroundColor Red
    $hasBlockers = $true
} else {
    Write-Host "[PASS] Vite environmental client successfully compiled and minified bundle layout." -ForegroundColor Green
}

# 6. Execute Vitest core layout suite components checks
Write-Host "`n[6/6] Running System Regression Test Suites Suite..." -ForegroundColor Cyan
$null = npm run test -- --run 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] Regression matrix verification runner threw breaking exceptions." -ForegroundColor Red
    $hasBlockers = $true
} else {
    Write-Host "[PASS] Continuous Integration regressions test runners reporting 100% passes." -ForegroundColor Green
}

# Final Sign-Off Determinist Gate
Write-Host "`n========================================================" -ForegroundColor Cyan
if ($hasBlockers) {
    Write-Host "   CRITICAL FAIL: REPOSITORY CERTIFICATION REJECTED.    " -ForegroundColor Red
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 1
} else {
    Write-Host "    SUCCESS STATUS: REPOSITORY OFFICIALLY RELEASE CERTIFIED    " -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 0
}
