@echo off
SETLOCAL EnableExtensions
setlocal enabledelayedexpansion

:: Exit with nonzero exit code if anything fails
set errorlevel=

:: Define variables
SET PNPM_VERSION=8.11.0
SET PNPM_HOME=%CD%\.cushy
SET PNPM_BIN_PATH=%CD%\.cushy\pnpm.exe

@REM :: Check if pnpm is already installed
@REM IF EXIST "%PNPM_HOME%\pnpm.exe" (
@REM     FOR /F "tokens=*" %%i IN ('"%PNPM_BIN_PATH%" --version') DO (
@REM         SET INSTALLED_PNPM_VERSION=%%i
@REM     )
@REM     IF NOT "!INSTALLED_PNPM_VERSION!"=="%PNPM_VERSION%" (
@REM         ECHO Updating pnpm from version %INSTALLED_PNPM_VERSION% to %PNPM_VERSION%...
@REM         CALL :install_with_powershell
@REM     ) ELSE (
@REM         ECHO pnpm is already installed and up to date.
@REM     )
@REM ) ELSE (
@REM     ECHO pnpm is not installed, proceeding with installation...
@REM     CALL :install_with_powershell
@REM )

@REM :: Verify pnpm installation
@REM IF NOT EXIST "%PNPM_BIN_PATH%" (
@REM     ECHO Failed to install or update pnpm.
@REM     EXIT /B 1
@REM )

@REM :: Install dependencies using pnpm
@REM ECHO Installing dependencies...
@REM CALL "%PNPM_BIN_PATH%" install
@REM IF ERRORLEVEL 1 (
@REM     ECHO Installing dependencies: node-gyp first...
@REM     CALL "%PNPM_BIN_PATH%" remove better-sqlite3
@REM     CALL "%PNPM_BIN_PATH%" install node-gyp
@REM     CALL "%PNPM_BIN_PATH%" install better-sqlite3
@REM     CALL "%PNPM_BIN_PATH%" install
@REM )

@REM :: ensuring binary dependencies are correctly linked across installed
@REM CALL .\node_modules\.bin\electron-builder install-app-deps

@REM :: Define the path to tsconfig.custom.json
@REM SET tsconfigPath=.\tsconfig.custom.json

@REM :: JSON content to write if the file does not exist
@REM SET defaultTsconfigJSON={ "include": ["src", "schema/global.d.ts"], "exclude": [] }

@REM :: Check if the file exists
@REM IF NOT EXIST "%tsconfigPath%" (
@REM     ECHO %defaultTsconfigJSON% > "%tsconfigPath%"
@REM )

node_modules\rcedit\bin\rcedit.exe "node_modules\electron\dist\electron.exe" --set-icon "library\CushyStudio\_public\CushyLogo.ico"

:: Start Vite using Electron's Node
ECHO Starting Vite with Electron's Node...
CALL .\node_modules\.bin\electron --no-sandbox -i src\shell

EXIT /B 0

@REM :install_with_powershell
@REM     ECHO Installing pnpm with PowerShell...
@REM     PowerShell -Command "iwr https://get.pnpm.io/install.ps1 -useb | iex"
@REM     EXIT /B 0
