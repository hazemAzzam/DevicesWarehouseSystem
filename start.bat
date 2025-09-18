@echo off
echo Starting Device Inventory System...
echo.

echo Installing main dependencies...
call npm install

echo.
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo Starting the application...
call npm run dev

pause
