# Create symbolic links to shared memory bank core - RUN AS ADMINISTRATOR
# This script must be run with Administrator privileges

param(
    [string]$CorePath = "C:\Users\mik\.memory-bank-core"
)

Write-Host "🚀 Setting up Memory Bank symbolic links..." -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as administrator'" -ForegroundColor Red
    Write-Host "Then run: .\setup-links-admin.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green
Write-Host ""

Write-Host "📂 Working directory: $PSScriptRoot" -ForegroundColor Yellow
Write-Host "🎯 Core location: $CorePath" -ForegroundColor Yellow
Write-Host ""

# Verify core path exists
if (!(Test-Path $CorePath)) {
    Write-Host "❌ Core path not found: $CorePath" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Core location verified" -ForegroundColor Green
Write-Host ""

try {
    # Create mechanisms link
    Write-Host "🔗 Creating mechanisms symbolic link..." -ForegroundColor Yellow
    if (Test-Path "mechanisms") {
        Write-Host "  Removing existing mechanisms..." -ForegroundColor Gray
        Remove-Item "mechanisms" -Recurse -Force
    }
    New-Item -ItemType SymbolicLink -Path "mechanisms" -Target "$CorePath\mechanisms" -ErrorAction Stop
    Write-Host "  ✅ mechanisms -> $CorePath\mechanisms" -ForegroundColor Green

    # Create rules link
    Write-Host "🔗 Creating rules symbolic link..." -ForegroundColor Yellow
    if (Test-Path "rules") {
        Write-Host "  Removing existing rules..." -ForegroundColor Gray
        Remove-Item "rules" -Recurse -Force
    }
    New-Item -ItemType SymbolicLink -Path "rules" -Target "$CorePath\rules" -ErrorAction Stop
    Write-Host "  ✅ rules -> $CorePath\rules" -ForegroundColor Green

    # Create templates link
    Write-Host "🔗 Creating templates symbolic link..." -ForegroundColor Yellow
    if (Test-Path "templates") {
        Write-Host "  Removing existing templates..." -ForegroundColor Gray
        Remove-Item "templates" -Recurse -Force
    }
    New-Item -ItemType SymbolicLink -Path "templates" -Target "$CorePath\templates" -ErrorAction Stop
    Write-Host "  ✅ templates -> $CorePath\templates" -ForegroundColor Green

    Write-Host ""
    Write-Host "🎉 SUCCESS! All symbolic links created." -ForegroundColor Green
    Write-Host ""
    Write-Host "🔍 To verify the links work, run:" -ForegroundColor Cyan
    Write-Host "   .\verify-links.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "📁 Directory listing should show <SYMLINKD> for each folder." -ForegroundColor Cyan

} catch {
    Write-Host ""
    Write-Host "❌ ERROR: Failed to create symbolic links." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure you're running as Administrator and try again." -ForegroundColor Yellow
    exit 1
}