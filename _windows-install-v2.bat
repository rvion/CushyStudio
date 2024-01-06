@echo off
SETLOCAL EnableExtensions
setlocal enabledelayedexpansion

:: Exit with nonzero exit code if anything fails
set errorlevel=

ECHO [===================================================]
ECHO Ensuring Node version...

:: Detect the operating system and architecture
FOR /F "tokens=*" %%a IN ('wmic os get osarchitecture ^| findstr /r /c:"[0-9][0-9]-bit"') DO SET OS_ARCH=%%a
ECHO Operating system: Windows
ECHO Architecture: %OS_ARCH%

:: Set the Node.js version and architecture based on OS and CPU architecture
SET NODE_VERSION=v18.19.0
IF "%OS_ARCH%"=="64-bit" (
    SET NODE_ARCH=win-x64
) ELSE (
    SET NODE_ARCH=win-x86
)
ECHO Node.js architecture: %NODE_ARCH%

:: Define the download URL
SET URL=https://nodejs.org/dist/%NODE_VERSION%/node-%NODE_VERSION%-%NODE_ARCH%.zip
ECHO Download URL: %URL%

:: Define directories
SET CWD=%CD%
SET EXTRACT_DIR=%CWD%\.cushy\node\%NODE_VERSION%-%NODE_ARCH%
ECHO Current working directory: %CWD%
ECHO Extraction directory: %EXTRACT_DIR%

:: Create the directory if it doesn't exist
IF NOT EXIST "%EXTRACT_DIR%" (
    MKDIR "%EXTRACT_DIR%"
)

:: Install Node.js if necessary
IF EXIST "%EXTRACT_DIR%\bin\node.exe" (
    ECHO Node.js %NODE_VERSION% is already installed in %EXTRACT_DIR%
) ELSE (
    ECHO No existing Node.js installation found in %EXTRACT_DIR%. Proceeding with installation.
    CALL :download_and_extract
)

ECHO [===================================================]
ECHO Installing dependencies

SET NPM_BIN_PATH=%EXTRACT_DIR%\bin\npm
SET NODE_BIN_PATH=%EXTRACT_DIR%\bin\node
ECHO NPM binary path: %NPM_BIN_PATH%
ECHO Node binary path: %NODE_BIN_PATH%

:: Install dependencies with npm
ECHO Installing dependencies...
CALL "%NPM_BIN_PATH%" install

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
