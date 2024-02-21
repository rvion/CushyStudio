@echo off
setlocal EnableExtensions
setlocal enabledelayedexpansion

rem set current working directory to the directory of this script
pushd %~dp0

:: Exit with nonzero exit code if anything fails
set "errorlevel="
set "CUSHY_RUN_MODE=dev"

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
rem --------------------------------------------------------------------------------

:: Start Vite using Electron's Node
echo Starting Cushy in dev mode...
call .\node_modules\.bin\electron --no-sandbox -i src\shell
if not "%ERRORLEVEL%" == "0" (
    echo Starting failed. Did you call install first ?
    pause
    popd
    exit /B 1
)

popd
exit /B 0
