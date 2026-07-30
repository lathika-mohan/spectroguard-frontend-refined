$ErrorActionPreference = "Continue"

Write-Host "--- SpectraGuard Frontend QA Audit v2.0 ---" -ForegroundColor Cyan

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
    "src/hooks/useForensics.ts"
)

$errors = 0
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "[FAIL] Missing: $file" -ForegroundColor Red
        $errors++
    } else {
        Write-Host "[PASS] Verified: $file" -ForegroundColor Green
    }
}

# Verify App.tsx routing architecture
$appContent = Get-Content "src/App.tsx" -Raw
if ($appContent -match "<Route element=\{<AppShell />\}|element=\{<AppShell") {
    Write-Host "[PASS] Verified: App.tsx wraps routes with <AppShell>" -ForegroundColor Green
} else {
    Write-Host "[FAIL] App.tsx does not contain <AppShell> route wrapper" -ForegroundColor Red
    $errors++
}

# Verify Views do NOT contain AppShell (Enforce nested routing)
$viewsWithAppShell = Select-String -Path "src/views/*.tsx" -Pattern "<AppShell" -ErrorAction SilentlyContinue
if ($viewsWithAppShell) {
    Write-Host "[FAIL] Operational views should not contain <AppShell> directly. Use nested routing in App.tsx." -ForegroundColor Red
    $errors++
} else {
    Write-Host "[PASS] Verified: Operational views properly rely on nested routing." -ForegroundColor Green
}

if ($errors -gt 0) {
    Write-Host "QA AUDIT FAILED. $errors architecture violations found." -ForegroundColor Red
    exit 1
} else {
    Write-Host "--- Structural Audit Passed ---" -ForegroundColor Cyan
    Write-Host "Routing architecture securely validated." -ForegroundColor Green
}
