@echo off
REM Stops the background Outlook helper (frees port 17890).
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$stopped = $false; Get-NetTCPConnection -LocalPort 17890 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue; $stopped = $true }; Get-CimInstance Win32_Process -Filter \"name='powershell.exe'\" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*OutlookEmailHelper.ps1*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue; $stopped = $true }; if ($stopped) { 'Outlook helper stopped.' } else { 'Outlook helper was not running.' }"
pause
