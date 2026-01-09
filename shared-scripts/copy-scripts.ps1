#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Copies shared scripts to target projects
.DESCRIPTION
    This script copies reusable scripts from the shared-scripts folder to specified project directories.
    Useful for distributing utility scripts across multiple projects.
.PARAMETER TargetPath
    The target project directory where scripts should be copied
.PARAMETER Category
    The category of scripts to copy (link_management, project_setup, synchronization, all)
.PARAMETER Platform
    The platform type (windows, unix, all) - defaults to current platform
.EXAMPLE
    .\copy-scripts.ps1 -TargetPath "C:\Projects\MyProject" -Category "project_setup"
.EXAMPLE
    .\copy-scripts.ps1 -TargetPath "../other-project" -Category "all" -Platform "windows"
#>

param(
    [Parameter(Mandatory=$true)]
    [string]$TargetPath,

    [Parameter(Mandatory=$false)]
    [ValidateSet("link_management", "project_setup", "synchronization", "all")]
    [string]$Category = "all",

    [Parameter(Mandatory=$false)]
    [ValidateSet("windows", "unix", "all")]
    [string]$Platform = "all"
)

# Configuration - should match config.json
$ScriptCategories = @{
    "link_management" = @("create-links.bat", "create-links.ps1", "setup-links-admin.bat", "setup-links-admin.ps1", "verify-links.ps1")
    "project_setup" = @("setup-new-project.bat", "setup-new-project.sh", "setup-status.ps1")
    "synchronization" = @("sync-from-core.ps1")
}

$PlatformExtensions = @{
    "windows" = @(".bat", ".ps1")
    "unix" = @(".sh")
}

function Get-ScriptPath {
    # Get the directory where this script is located
    $scriptDir = Split-Path -Parent $PSCommandPath
    return $scriptDir
}

function Get-TargetScripts {
    param(
        [string]$Category,
        [string]$Platform
    )

    $scripts = @()

    if ($Category -eq "all") {
        $categories = $ScriptCategories.Keys
    } else {
        $categories = @($Category)
    }

    foreach ($cat in $categories) {
        if ($ScriptCategories.ContainsKey($cat)) {
            $scripts += $ScriptCategories[$cat]
        }
    }

    # Filter by platform if specified
    if ($Platform -ne "all") {
        $extensions = $PlatformExtensions[$Platform]
        $scripts = $scripts | Where-Object {
            $ext = [System.IO.Path]::GetExtension($_)
            $extensions -contains $ext
        }
    }

    return $scripts
}

function Copy-Scripts {
    param(
        [string]$SourceDir,
        [string]$TargetDir,
        [string[]]$Scripts
    )

    $copiedCount = 0

    foreach ($script in $Scripts) {
        $sourcePath = Join-Path $SourceDir $script
        $targetPath = Join-Path $TargetDir $script

        if (Test-Path $sourcePath) {
            try {
                Copy-Item -Path $sourcePath -Destination $targetPath -Force
                Write-Host "✓ Copied: $script" -ForegroundColor Green
                $copiedCount++
            }
            catch {
                Write-Host "✗ Failed to copy: $script - $($_.Exception.Message)" -ForegroundColor Red
            }
        } else {
            Write-Host "⚠ Source not found: $script" -ForegroundColor Yellow
        }
    }

    return $copiedCount
}

# Main execution
try {
    # Resolve target path
    $resolvedTargetPath = Resolve-Path $TargetPath -ErrorAction Stop
    Write-Host "Target directory: $resolvedTargetPath" -ForegroundColor Cyan

    # Get script directory
    $scriptDir = Get-ScriptPath
    Write-Host "Source directory: $scriptDir" -ForegroundColor Cyan

    # Determine platform if set to "all"
    if ($Platform -eq "all") {
        if ($PSVersionTable.Platform -eq "Unix" -or $PSVersionTable.OS -match "Linux|macOS") {
            $Platform = "unix"
        } else {
            $Platform = "windows"
        }
    }
    Write-Host "Platform: $Platform" -ForegroundColor Cyan

    # Get scripts to copy
    $scriptsToCopy = Get-TargetScripts -Category $Category -Platform $Platform
    Write-Host "Scripts to copy: $($scriptsToCopy.Count)" -ForegroundColor Cyan
    $scriptsToCopy | ForEach-Object { Write-Host "  - $_" }

    # Copy scripts
    $copiedCount = Copy-Scripts -SourceDir $scriptDir -TargetDir $resolvedTargetPath -Scripts $scriptsToCopy

    Write-Host "`nCopy operation completed!" -ForegroundColor Green
    Write-Host "Successfully copied: $copiedCount scripts" -ForegroundColor Green

} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}