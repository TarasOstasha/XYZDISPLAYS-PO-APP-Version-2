@echo off
title XYZ Outlook Helper
cd /d "%~dp0"
echo Starting XYZ Outlook Helper...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0OutlookEmailHelper.ps1"
pause
