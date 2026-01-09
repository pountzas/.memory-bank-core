# Create symbolic links to shared memory bank core
# Run this script as Administrator

param(
    [string]$CorePath = "C:\Users\mik\.memory-bank-core"
)

Write-Host "Creating symbolic links to shared memory bank core: $CorePath" -ForegroundColor Green

# Verify core path exists
if (!(Test-Path $CorePath)) {
    Write-Error "Core path not found: $CorePath"
    exit 1
}

# Change to memory-bank directory
Push-Location $PSScriptRoot

try {
    # Create mechanisms link
    if (Test-Path "mechanisms") {
        Write-Host "Removing existing mechanisms directory..." -ForegroundColor Yellow
        Remove-Item "mechanisms" -Recurse -Force
    }
    Write-Host "Creating mechanisms symbolic link..." -ForegroundColor Yellow
    New-Item -ItemType SymbolicLink -Path "mechanisms" -Target "$CorePath\mechanisms"

    # Create rules link
    if (Test-Path "rules") {
        Write-Host "Removing existing rules directory..." -ForegroundColor Yellow
        Remove-Item "rules" -Recurse -Force
    }
    Write-Host "Creating rules symbolic link..." -ForegroundColor Yellow
    New-Item -ItemType SymbolicLink -Path "rules" -Target "$CorePath\rules"

    # Create templates link
    if (Test-Path "templates") {
        Write-Host "Removing existing templates directory..." -ForegroundColor Yellow
        Remove-Item "templates" -Recurse -Force
    }
    Write-Host "Creating templates symbolic link..." -ForegroundColor Yellow
    New-Item -ItemType SymbolicLink -Path "templates" -Target "$CorePath\templates"

    Write-Host "Symbolic links created successfully!" -ForegroundColor Green
    Write-Host "To verify the links work, check that the directories show as <SYMLINKD> in directory listings." -ForegroundColor Cyan

} finally {
    Pop-Location
}