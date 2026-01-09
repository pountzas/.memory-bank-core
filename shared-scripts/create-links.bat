@echo off
REM Create symbolic links to shared memory bank core
REM Run this as Administrator

echo Creating symbolic links to shared memory bank core...

REM Create mechanisms link
if exist "mechanisms" (
    echo Removing existing mechanisms directory...
    rmdir /s /q mechanisms
)
echo Creating mechanisms symbolic link...
mklink /D mechanisms "C:\Users\mik\.memory-bank-core\mechanisms"

REM Create rules link
if exist "rules" (
    echo Removing existing rules directory...
    rmdir /s /q rules
)
echo Creating rules symbolic link...
mklink /D rules "C:\Users\mik\.memory-bank-core\rules"

REM Create templates link
if exist "templates" (
    echo Removing existing templates directory...
    rmdir /s /q templates
)
echo Creating templates symbolic link...
mklink /D templates "C:\Users\mik\.memory-bank-core\templates"

echo.
echo Symbolic links created successfully!
echo.
echo To verify the links work, check that the directories show as SYMLINKD in dir output.
pause