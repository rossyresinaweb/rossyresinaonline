@echo off
setlocal
set SCRIPT=%~dp0scripts\start-backend.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%" -Port 8081
