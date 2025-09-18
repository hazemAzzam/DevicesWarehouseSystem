@echo off
echo Building Device Inventory System...
echo.

echo Step 1: Building React frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Error building React frontend!
    pause
    exit /b 1
)
cd ..

echo.
echo Step 2: Building Electron app...
call npm run build:electron
if %errorlevel% neq 0 (
    echo Error building Electron app!
    pause
    exit /b 1
)

echo.
echo Build completed successfully!
echo Check the 'dist' folder for the installer.
echo.
pause
