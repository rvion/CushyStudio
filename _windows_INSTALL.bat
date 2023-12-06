@echo off
SETLOCAL EnableExtensions
setlocal enabledelayedexpansion

:: Exit with nonzero exit code if anything fails
set errorlevel=

:: Define variables
SET PNPM_VERSION=8.11.0
SET PNPM_HOME=%CD%\.cushy
SET PNPM_BIN_PATH=%CD%\.cushy\pnpm.exe

:: Check if pnpm is already installed
IF EXIST "%PNPM_HOME%\pnpm.exe" (
    FOR /F "tokens=*" %%i IN ('"%PNPM_BIN_PATH%" --version') DO (
        SET INSTALLED_PNPM_VERSION=%%i
    )
    IF NOT "!INSTALLED_PNPM_VERSION!"=="%PNPM_VERSION%" (
        ECHO Updating pnpm from version %INSTALLED_PNPM_VERSION% to %PNPM_VERSION%...
        CALL :install_with_powershell
    ) ELSE (
        ECHO pnpm is already installed and up to date.
    )
) ELSE (
    ECHO pnpm is not installed, proceeding with installation...
    CALL :install_with_powershell
)

:: Verify pnpm installation
IF NOT EXIST "%PNPM_BIN_PATH%" (
    ECHO Failed to install or update pnpm.
    EXIT /B 1
)

:: Install dependencies using pnpm
ECHO Installing dependencies...
CALL %PNPM_BIN_PATH% install 
IF ERRORLEVEL 1 (
    ECHO Installing dependencies: node-gyp first...
    CALL %PNPM_BIN_PATH% remove better-sqlite3
    CALL %PNPM_BIN_PATH% install node-gyp
    CALL %PNPM_BIN_PATH% install better-sqlite3
    CALL %PNPM_BIN_PATH% install
)

:: ensuring binary dependencies are correctly linked across installed
CALL .\node_modules\.bin\electron-builder install-app-deps

:: Define the path to tsconfig.custom.json
SET tsconfigPath=.\tsconfig.custom.json

:: JSON content to write if the file does not exist
SET defaultTsconfigJSON={ "include": ["src", "schema/global.d.ts"], "exclude": [] }

:: Check if the file exists
IF NOT EXIST "%tsconfigPath%" (
    ECHO %defaultTsconfigJSON% > "%tsconfigPath%"
)

node_modules\rcedit\bin\rcedit.exe "node_modules\electron\dist\electron.exe" --set-icon "library\CushyStudio\_public\CushyLogo.ico"

:: Start Vite using Electron's Node
ECHO Starting Vite with Electron's Node...
CALL .\node_modules\.bin\electron --no-sandbox -i src\shell

EXIT /B 0

:install_with_powershell
    ECHO Installing pnpm with PowerShell...
    PowerShell -Command "iwr https://get.pnpm.io/install.ps1 -useb | iex"
    EXIT /B 0
