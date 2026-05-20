@echo off
cd /d "%~dp0"
echo Stopping old Node servers on ports 3000-3003...
for %%P in (3000 3001 3002 3003) do (
  for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%%P " ^| findstr LISTENING') do (
    taskkill /PID %%a /F >nul 2>&1
  )
)
set NODE_OPTIONS=--max-old-space-size=4096
echo.
echo  Naap Book Website
echo  Open: http://127.0.0.1:3000  (wait for Ready)
echo  If dev OOM: npm run build ^&^& npm run start
echo.
call npm.cmd run dev
pause
