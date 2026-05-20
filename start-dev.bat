@echo off
cd /d "%~dp0"
set NODE_OPTIONS=--max-old-space-size=4096
echo.
echo  Naap Book Website - starting dev server
echo  Open: http://127.0.0.1:3000  (wait for Ready)
echo  If OOM: npm run build ^&^& npm run start
echo.
call npm.cmd run dev
pause
