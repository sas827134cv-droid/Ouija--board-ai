@echo off
echo Starting SpiritBoard AI...
echo.
echo Starting Backend Server...
start cmd /k "cd backend && powershell -ExecutionPolicy Bypass -Command npm run dev"
timeout /t 2 /nobreak >nul
echo Starting Frontend Server...
start cmd /k "cd frontend && powershell -ExecutionPolicy Bypass -Command npm run dev"
echo.
echo Both servers are starting!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
pause
