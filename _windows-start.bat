@REM @echo off
SETLOCAL EnableExtensions
setlocal enabledelayedexpansion

:: Exit with nonzero exit code if anything fails
set errorlevel=
SET CUSHY_RUN_MODE=dist

:: --------------------------------------------------------------------------------
SET NODE_VERSION=v18.19.0
SET NODE_ARCH=win-x64
SET CWD=%CD%
SET EXTRACT_DIR=%CWD%\.cushy\node\%NODE_VERSION%-%NODE_ARCH%
SET NODE_INSTALL_DIR=%EXTRACT_DIR%\node-%NODE_VERSION%-%NODE_ARCH%
SET URL=https://nodejs.org/dist/%NODE_VERSION%/node-%NODE_VERSION%-%NODE_ARCH%.zip
SET "PATH=%NODE_INSTALL_DIR%;%PATH%"
SET NPM_BIN_PATH=%NODE_INSTALL_DIR%\npm
SET NODE_BIN_PATH=%NODE_INSTALL_DIR%\node
:: ------------------------------------------------------------------------------

:: Start Vite using Electron's Node
ECHO Starting Vite with Electron's Node...
SET PATH=%NODE_INSTALL_DIR%;$PATH
CALL .\node_modules\.bin\electron --no-sandbox -i src\shell
IF %ERRORLEVEL% NEQ 0 (
    ECHO "Starting failed. Did you call install first ?"
    pause
    EXIT /B 1
)

EXIT /B 0
