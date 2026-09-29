@echo off
setlocal
set "HELPER_DIR=%~dp0"
set "VBS=%HELPER_DIR%Start-OutlookHelper-Hidden.vbs"
set "TASK_NAME=XYZ Outlook Helper"
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT=%STARTUP_DIR%\XYZ Outlook Helper.lnk"

echo Installing XYZ Outlook Helper to run hidden at Windows logon...
echo.

REM Prefer a Scheduled Task (hidden, reliable). Falls back to Startup shortcut.
schtasks /Create /TN "%TASK_NAME%" /TR "wscript.exe \"%VBS%\"" /SC ONLOGON /RL LIMITED /F >nul 2>&1
if errorlevel 1 (
  echo Scheduled Task failed - creating Startup folder shortcut instead...
  powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT%'); $s.TargetPath = 'wscript.exe'; $s.Arguments = '\"%VBS%\"'; $s.WorkingDirectory = '%HELPER_DIR%'; $s.WindowStyle = 7; $s.Description = 'XYZ Displays Outlook Helper (hidden)'; $s.Save()"
) else (
  echo Scheduled Task created: %TASK_NAME%
  REM Remove old visible Startup shortcut if present
  if exist "%SHORTCUT%" del "%SHORTCUT%" >nul 2>&1
)

echo.
echo Starting helper now in the background...
cscript //nologo "%VBS%"
timeout /t 2 /nobreak >nul

powershell.exe -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:17890/health' -UseBasicParsing -TimeoutSec 3; Write-Host 'OK - helper is running hidden on port 17890'; Write-Host $r.Content } catch { Write-Host 'Started, but health check failed yet. Wait a few seconds and open http://127.0.0.1:17890/health' }"

echo.
echo Done. No terminal window stays open.
echo Use Stop-OutlookHelper.bat if you need to stop it.
echo.
pause
