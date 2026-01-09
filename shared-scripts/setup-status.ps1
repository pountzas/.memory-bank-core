# Memory Bank Setup Status and Instructions

Write-Host "🔍 MEMORY BANK CORE LINK STATUS" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check current directory
Write-Host "📂 Current Project Directory:" -ForegroundColor Yellow
Write-Host "   $PSScriptRoot" -ForegroundColor White
Write-Host ""

# Check core path
$corePath = "C:\Users\mik\.memory-bank-core"
Write-Host "🎯 Shared Core Location:" -ForegroundColor Yellow
if (Test-Path $corePath) {
    Write-Host "   ✅ $corePath (exists)" -ForegroundColor Green
} else {
    Write-Host "   ❌ $corePath (not found)" -ForegroundColor Red
}
Write-Host ""

# Check current link status
Write-Host "🔗 Current Link Status:" -ForegroundColor Yellow
$folders = @('mechanisms', 'rules', 'templates')
foreach ($folder in $folders) {
    $path = Join-Path $PSScriptRoot $folder
    if (Test-Path $path) {
        $item = Get-Item $path
        if ($item.LinkType -eq "SymbolicLink") {
            Write-Host "   ✅ $folder -> $($item.Target)" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  $folder (regular directory, not linked)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ❌ $folder (missing)" -ForegroundColor Red
    }
}
Write-Host ""

# Instructions
Write-Host "🛠️  SETUP INSTRUCTIONS" -ForegroundColor Cyan
Write-Host "--------------------" -ForegroundColor Cyan
Write-Host ""
Write-Host "To create symbolic links (requires Administrator):" -ForegroundColor White
Write-Host ""
Write-Host "1. Open PowerShell as Administrator" -ForegroundColor Cyan
Write-Host "2. Navigate to project directory:" -ForegroundColor Cyan
Write-Host "   cd 'D:\c backup 4 10 25\code\4.Next\portfolio-next-react\memory-bank'" -ForegroundColor White
Write-Host "3. Run the link creation script:" -ForegroundColor Cyan
Write-Host "   .\create-links.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Alternative - Command Prompt as Administrator:" -ForegroundColor Cyan
Write-Host "   .\create-links.bat" -ForegroundColor White
Write-Host ""
Write-Host "4. Verify links work:" -ForegroundColor Cyan
Write-Host "   .\verify-links.ps1" -ForegroundColor White
Write-Host ""

Write-Host "📋 ALTERNATIVE (if links fail):" -ForegroundColor Yellow
Write-Host "   .\sync-from-core.ps1  # Manual sync (not automatic)" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  IMPORTANT:" -ForegroundColor Red
Write-Host "   - Symbolic links require Administrator privileges" -ForegroundColor Red
Write-Host "   - Links provide automatic updates from core" -ForegroundColor Red
Write-Host "   - Manual sync requires running the script each time" -ForegroundColor Red