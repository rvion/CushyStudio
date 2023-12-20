@echo off
SETLOCAL EnableExtensions
setlocal enabledelayedexpansion

:: Exit with nonzero exit code if anything fails
set errorlevel=

SET CUSHY_RUN_MODE=dist

:: Start Vite using Electron's Node
ECHO Starting Vite with Electron's Node...
CALL .\node_modules\.bin\electron --no-sandbox -i src\shell

EXIT /B 0
