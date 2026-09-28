@echo off
setlocal
set "HELPER_DIR=%~dp0"
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT=%STARTUP_DIR%\XYZ Outlook Helper.lnk"

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%SHORTCUT%'); $s.TargetPath = '%HELPER_DIR%Start-OutlookHelper.bat'; $s.WorkingDirectory = '%HELPER_DIR%'; $s.WindowStyle = 7; $s.Description = 'XYZ Displays Outlook Helper'; $s.Save()"

if exist "%SHORTCUT%" (
  echo Installed. Helper will start when you log in to Windows.
  echo Shortcut: %SHORTCUT%
) else (
  echo Failed to create Startup shortcut.
)

echo.
echo You can also start it now with Start-OutlookHelper.bat
pause
