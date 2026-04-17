@echo off
title Quotex Antigravity AI - OTC Terminal
color 0A
echo.
echo  ╔══════════════════════════════════════════╗
echo  ║    QUOTEX ANTIGRAVITY AI - OTC TERMINAL  ║
echo  ║         Starting Dashboard...            ║
echo  ╚══════════════════════════════════════════╝
echo.
cd /d "d:\Quotex Bot"
echo [*] Clearing cache...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"
echo [*] Starting dev server on port 5174...
echo [*] Dashboard will open in your browser automatically.
echo.
echo    Press Ctrl+C to stop the server.
echo.
timeout /t 2 /nobreak >nul
start "" "http://localhost:5174"
npm run dev -- --port 5174
