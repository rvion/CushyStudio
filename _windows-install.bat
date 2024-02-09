@echo off
SETLOCAL EnableExtensions
setlocal enabledelayedexpansion

:: Exit with nonzero exit code if anything fails
set errorlevel=

cd /d %~dp0

net session >nul 2>&1
if %errorlevel% == 0 (
    echo This script is running with administrative privileges.
    echo It is recommended to run this script without such privileges.
    echo Press Ctrl+C to abort or any other key to continue.
    pause >nul
)


ECHO [===================================================]
ECHO Ensuring Node version...

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

ECHO Node.js architecture: %NODE_ARCH%
ECHO Download URL: %URL%
ECHO Current working directory: %CWD%
ECHO Extraction directory: %EXTRACT_DIR%

:: Create the directory if it doesn't exist
IF NOT EXIST "%EXTRACT_DIR%" (
    MKDIR "%EXTRACT_DIR%"
)

:: Install Node.js if necessary
ECHO Checking for existing Node.js installation at "%NODE_INSTALL_DIR%\node.exe" ...
IF EXIST "%NODE_INSTALL_DIR%\node.exe" (
    ECHO Node.js %NODE_VERSION% is already installed in %NODE_INSTALL_DIR%
) ELSE (
    ECHO No existing Node.js installation found in %NODE_INSTALL_DIR%. Proceeding with installation.
    CALL :download_and_extract
)

ECHO [===================================================]
ECHO Installing dependencies

ECHO NPM binary path: %NPM_BIN_PATH%
ECHO Node binary path: %NODE_BIN_PATH%

:: Install dependencies with npm
ECHO Installing dependencies...
CALL "%NPM_BIN_PATH%" install --legacy-peer-deps=false

ECHO [===================================================]
ECHO ensuring binary dependencies are correctly linked...

CALL .\node_modules\.bin\electron-builder install-app-deps
IF %ERRORLEVEL% NEQ 0 (
    ECHO "binary dependencies linking failed"
    pause
    EXIT /B 1
)

ECHO [===================================================]
ECHO Fixing tsconfig.custom.json...

:: Define the path to tsconfig.custom.json
SET tsconfigPath=.\tsconfig.custom.json

:: JSON content to write if the file does not exist
SET defaultTsconfigJSON={ "include": ["src", "schema/global.d.ts"], "exclude": [] }

:: Check if the file exists
IF NOT EXIST "%tsconfigPath%" (
    ECHO %defaultTsconfigJSON% > "%tsconfigPath%"
)

ECHO [===================================================]
ECHO PATCHING electron binary with cushy icon...

node_modules\rcedit\bin\rcedit.exe "node_modules\electron\dist\electron.exe" --set-icon "library\CushyStudio\_public\CushyLogo.ico"

ECHO [===================================================]
ECHO build the release folder...

CALL .\node_modules\.bin\electron --no-sandbox -i src\shell\build.js js css

ECHO ""
ECHO SUCCESS
pause
EXIT /B 0

:download_and_extract
    ECHO Downloading Node.js %NODE_VERSION% for %NODE_ARCH% FROM %URL%...
    PowerShell -Command "$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri '%URL%' -OutFile 'node.zip'; Expand-Archive -LiteralPath 'node.zip' -DestinationPath '%EXTRACT_DIR%' -Force; Remove-Item 'node.zip'"
