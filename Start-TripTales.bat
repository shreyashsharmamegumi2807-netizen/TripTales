@echo off
title TripTales — AI-Powered Travel Companion
echo ========================================================
echo   TripTales - Your AI-Powered Travel Companion
echo ========================================================
echo.
echo Starting backend and frontend server on http://localhost:5000 ...
echo.

cd /d "%~dp0"

:: Wait 1.5 seconds then launch default browser
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5000"

:: Start Node server
node server/index.js

pause
