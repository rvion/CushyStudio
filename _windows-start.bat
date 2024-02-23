@echo off
setlocal EnableExtensions
setlocal enabledelayedexpansion

rem set current working directory to the directory of this script
pushd %~dp0

rem This trick triggers an elevation of privileges. We want it to fail, but if it succeeds tell the user not to do so.
net session >nul 2>&1
if %errorlevel% == 0 (
    echo This script is running with administrative privileges.
    echo It is recommended to run this script without such privileges.
    echo Press Ctrl+C to abort or any other key to continue.
    pause >nul
)

rem Exit with nonzero exit code if anything fails
set "errorlevel="
set "CUSHY_RUN_MODE=dist"

rem --------------------------------------------------------------------------------
set "NODE_VERSION=v18.19.0"
set "NODE_ARCH=win-x64"
set "CWD=%CD%"
set "EXTRACT_DIR=%CWD%\.cushy\node\%NODE_VERSION%-%NODE_ARCH%"
set "NODE_INSTALL_DIR=%EXTRACT_DIR%\node-%NODE_VERSION%-%NODE_ARCH%"
set "URL=https://nodejs.org/dist/%NODE_VERSION%/node-%NODE_VERSION%-%NODE_ARCH%.zip"
set "PATH=%NODE_INSTALL_DIR%;%PATH%"
set "NPM_BIN_PATH=%NODE_INSTALL_DIR%\npm"
set "NODE_BIN_PATH=%NODE_INSTALL_DIR%\node"
rem ------------------------------------------------------------------------------

echo Starting Vite with Electron's Node...
set "PATH=%NODE_INSTALL_DIR%;%PATH%"
call .\node_modules\.bin\electron --no-sandbox -i src\shell
if not "%ERRORLEVEL%" == "0" (
    echo Starting failed. Did you call install first ?
    pause
    popd
    exit /B 1
)

popd
exit /B 0
