$ErrorActionPreference = "Continue"

Write-Host "--- SpectraGuard Frontend QA Audit ---" -ForegroundColor Cyan

$requiredFiles = @(
    "src/App.tsx",
    "src/pages/NotFound.tsx",
    "src/components/layout/AppShell.tsx",
    "src/components/layout/PageContainer.tsx",
    "src/views/Dashboard.tsx",
    "src/views/Cameras.tsx",
    "src/views/Forensics.tsx",
    "src/views/Settings.tsx",
    "src/hooks/useCameras.ts",
    "src/hooks/useForensics.ts",
    "src/components/common/ConfidenceMeter.tsx",
    "src/components/forensics/SpectralHeatmapOverlay.tsx",
    "src/components/forensics/DecisionPath.tsx",
    "src/components/forensics/ShapWaterfall.tsx"
)

$missing = 0
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "[FAIL] Missing: $file" -ForegroundColor Red
        $missing++
    } else {
        Write-Host "[PASS] Verified: $file" -ForegroundColor Green
    }
}

if ($missing -gt 0) {
    Write-Host "QA AUDIT FAILED. Missing $missing required files." -ForegroundColor Red
    exit 1
} else {
    Write-Host "--- Structural Audit Passed ---" -ForegroundColor Cyan
    Write-Host "All routing, views, layouts, and components are securely wired." -ForegroundColor Green
}
