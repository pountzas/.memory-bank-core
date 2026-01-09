# Verify symbolic links are properly set up
Write-Host "Verifying Memory Bank symbolic links..." -ForegroundColor Green

Push-Location $PSScriptRoot

$links = @(
    @{ Name = "mechanisms"; Target = "C:\Users\mik\.memory-bank-core\mechanisms" },
    @{ Name = "rules"; Target = "C:\Users\mik\.memory-bank-core\rules" },
    @{ Name = "templates"; Target = "C:\Users\mik\.memory-bank-core\templates" }
)

$allGood = $true

foreach ($link in $links) {
    $path = $link.Name
    $target = $link.Target

    if (Test-Path $path) {
        $item = Get-Item $path
        if ($item.LinkType -eq "SymbolicLink") {
            if ($item.Target -eq $target) {
                Write-Host "✅ $path -> $($item.Target)" -ForegroundColor Green
            } else {
                Write-Host "❌ $path -> $($item.Target) (expected: $target)" -ForegroundColor Red
                $allGood = $false
            }
        } else {
            Write-Host "❌ $path is not a symbolic link (it's a $($item.GetType().Name))" -ForegroundColor Red
            $allGood = $false
        }
    } else {
        Write-Host "❌ $path does not exist" -ForegroundColor Red
        $allGood = $false
    }
}

Pop-Location

if ($allGood) {
    Write-Host "`n🎉 All symbolic links are properly configured!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some links are not properly configured. Run create-links.ps1 as Administrator." -ForegroundColor Yellow
}