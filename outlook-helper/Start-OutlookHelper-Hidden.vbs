' Starts XYZ Outlook Helper with no visible window.
Option Explicit
Dim shell, fso, dir, cmd
Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
shell.CurrentDirectory = dir
cmd = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File """ & dir & "\OutlookEmailHelper.ps1"""
' 0 = hidden window, False = do not wait
shell.Run cmd, 0, False
