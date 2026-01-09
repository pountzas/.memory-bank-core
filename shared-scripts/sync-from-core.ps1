# Memory Bank Core Sync Script
# Syncs mechanisms, rules, and templates from the shared core location

param(
    [switch]$Force,
    [string]$CorePath = "C:\Users\mik\.memory-bank-core"
)

Write-Host "Syncing Memory Bank from shared core: $CorePath" -ForegroundColor Green

# Verify core path exists
if (!(Test-Path $CorePath)) {
    Write-Error "Core path not found: $CorePath"
    exit 1
}

# Sync mechanisms
Write-Host "Syncing mechanisms..." -ForegroundColor Yellow
if (Test-Path "$PSScriptRoot\mechanisms") {
    Remove-Item "$PSScriptRoot\mechanisms" -Recurse -Force
}
Copy-Item "$CorePath\mechanisms" "$PSScriptRoot\mechanisms" -Recurse -Force

# Sync rules
Write-Host "Syncing rules..." -ForegroundColor Yellow
if (Test-Path "$PSScriptRoot\rules") {
    Remove-Item "$PSScriptRoot\rules" -Recurse -Force
}
Copy-Item "$CorePath\rules" "$PSScriptRoot\rules" -Recurse -Force

# Sync templates
Write-Host "Syncing templates..." -ForegroundColor Yellow
if (Test-Path "$PSScriptRoot\templates") {
    Remove-Item "$PSScriptRoot\templates" -Recurse -Force
}
Copy-Item "$CorePath\templates" "$PSScriptRoot\templates" -Recurse -Force

# Sync shared scripts
Write-Host "Syncing shared scripts..." -ForegroundColor Yellow
$projectSharedScriptsPath = Split-Path $PSScriptRoot -Parent
if (Test-Path "$projectSharedScriptsPath\shared-scripts") {
    Remove-Item "$projectSharedScriptsPath\shared-scripts" -Recurse -Force
}
Copy-Item "$CorePath\shared-scripts" "$projectSharedScriptsPath\shared-scripts" -Recurse -Force

Write-Host "Sync complete!" -ForegroundColor Green