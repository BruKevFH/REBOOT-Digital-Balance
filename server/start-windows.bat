@echo off
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js wurde nicht gefunden. Fuer die reine Web-App ist der Server NICHT noetig.
  echo Oeffne ../index.html oder deploye den Hauptordner auf einen statischen Host.
  pause
  exit /b 1
)
node server.mjs
pause
