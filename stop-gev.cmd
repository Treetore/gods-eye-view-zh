@echo off
REM Stop God's Eye View (kills whatever holds port 4173).
setlocal
set "PORT=4173"
echo Stopping God's Eye View on port %PORT% ...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /r /c:"LISTENING" ^| findstr /c:":%PORT% "') do (
    echo   killing PID %%p
    taskkill /PID %%p /F >nul 2>&1
)
echo Done.
