$ErrorActionPreference = "Stop"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       SPECTRAGUARD P9.3 RELEASE ARTIFACT RUNNER        " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$distPath = "dist"
$hasErrors = $false

Write-Host "`n[1/3] Validating Production Bundles & Entry Points..." -ForegroundColor Cyan
if (-not (Test-Path "$distPath/index.html")) {
    Write-Host "[FAIL] index.html missing from dist/." -ForegroundColor Red
    $hasErrors = $true
} else {
    Write-Host "[PASS] index.html entry point verified." -ForegroundColor Green
}

Write-Host "`n[2/3] Validating Compiled Assets..." -ForegroundColor Cyan
if (Test-Path "$distPath/assets") {
    $jsCount = (Get-ChildItem -Path "$distPath/assets" -Filter "*.js").Count
    $cssCount = (Get-ChildItem -Path "$distPath/assets" -Filter "*.css").Count

    if ($jsCount -eq 0 -or $cssCount -eq 0) {
        Write-Host "[FAIL] Missing JS or CSS artifacts." -ForegroundColor Red
        $hasErrors = $true
    } else {
        Write-Host "[PASS] JS ($jsCount) and CSS ($cssCount) compiled assets verified." -ForegroundColor Green
    }
} else {
    Write-Host "[FAIL] assets directory missing from dist/." -ForegroundColor Red
    $hasErrors = $true
}

Write-Host "`n[3/3] Generating Deployment Package (Release Archive)..." -ForegroundColor Cyan
$releaseName = "spectraguard-frontend-release.zip"
if (Test-Path $releaseName) { Remove-Item $releaseName -Force }

try {
    Write-Host "Compressing artifacts into deployment package..." -ForegroundColor DarkGray
    Compress-Archive -Path "$distPath\*" -DestinationPath $releaseName
    $sizeMB = [math]::Round((Get-Item $releaseName).Length / 1MB, 2)
    Write-Host "[PASS] Deployment package '$releaseName' generated successfully ($sizeMB MB)." -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Failed to generate deployment package archive." -ForegroundColor Red
    $hasErrors = $true
}

Write-Host "`n========================================================" -ForegroundColor Cyan
if ($hasErrors) {
    Write-Host "    P9.3 RELEASE ARTIFACT VALIDATION FAILED             " -ForegroundColor Red
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 1
} else {
    Write-Host "    P9.3 RELEASE ARTIFACT VALIDATION PASSED             " -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Cyan
    exit 0
}
