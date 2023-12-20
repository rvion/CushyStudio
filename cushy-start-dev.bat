@REM @echo off
SETLOCAL EnableExtensions
setlocal enabledelayedexpansion

:: Exit with nonzero exit code if anything fails
set errorlevel=
SET CUSHY_RUN_MODE=dev

:: Start Vite using Electron's Node
ECHO Starting Cushy in dev mode...
CALL .\node_modules\.bin\electron --no-sandbox -i src\shell

EXIT /B 0
