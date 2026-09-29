@echo off
REM Starts the helper fully hidden (no terminal window).
cd /d "%~dp0"
cscript //nologo "%~dp0Start-OutlookHelper-Hidden.vbs"
timeout /t 2 /nobreak >nul
powershell.exe -NoProfile -Command "try { (Invoke-WebRequest -Uri 'http://127.0.0.1:17890/health' -UseBasicParsing -TimeoutSec 3).Content; exit 0 } catch { Write-Host 'Helper may still be starting. Check http://127.0.0.1:17890/health'; exit 1 }"
if errorlevel 1 (
  echo.
  echo If it failed, open helper.log in this folder for details.
  pause
)
