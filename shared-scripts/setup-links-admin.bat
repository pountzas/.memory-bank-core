@echo off
REM Create symbolic links to shared memory bank core - RUN AS ADMINISTRATOR
REM This script must be run with Administrator privileges

echo 🚀 Setting up Memory Bank symbolic links...
echo.

REM Verify we're running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running as Administrator
) else (
    echo ❌ This script must be run as Administrator!
    echo Right-click the batch file and select "Run as administrator"
    pause
    exit /b 1
)

echo.
echo 📂 Working directory: %~dp0
echo 🎯 Core location: C:\Users\mik\.memory-bank-core
echo.

REM Create mechanisms link
echo 🔗 Creating mechanisms symbolic link...
if exist "mechanisms" (
    echo   Removing existing mechanisms...
    rmdir /s /q mechanisms
)
mklink /D mechanisms "C:\Users\mik\.memory-bank-core\mechanisms"
if %errorLevel% neq 0 (
    echo ❌ Failed to create mechanisms link
    goto :error
)

REM Create rules link
echo 🔗 Creating rules symbolic link...
if exist "rules" (
    echo   Removing existing rules...
    rmdir /s /q rules
)
mklink /D rules "C:\Users\mik\.memory-bank-core\rules"
if %errorLevel% neq 0 (
    echo ❌ Failed to create rules link
    goto :error
)

REM Create templates link
echo 🔗 Creating templates symbolic link...
if exist "templates" (
    echo   Removing existing templates...
    rmdir /s /q templates
)
mklink /D templates "C:\Users\mik\.memory-bank-core\templates"
if %errorLevel% neq 0 (
    echo ❌ Failed to create templates link
    goto :error
)

echo.
echo ✅ SUCCESS! All symbolic links created.
echo.
echo 🔍 To verify the links work, run:
echo    .\verify-links.ps1
echo.
echo 📁 Directory listing should show <SYMLINKD> for each folder.
echo.
pause
exit /b 0

:error
echo.
echo ❌ ERROR: Failed to create symbolic links.
echo Make sure you're running as Administrator and try again.
echo.
pause
exit /b 1