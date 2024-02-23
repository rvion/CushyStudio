@echo off
setlocal 
setlocal EnableExtensions
setlocal EnableDelayedExpansion

rem exit with nonzero exit code if anything fails
set errorlevel=

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


echo [===================================================]
echo Ensuring Node version...

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

echo Node.js architecture: %NODE_ARCH%
echo Download URL: %URL%
echo Current working directory: %CWD%
echo Extraction directory: %EXTRACT_DIR%

rem Create the directory if it doesn't exist
if not exist "%EXTRACT_DIR%" (
    mkdir "%EXTRACT_DIR%"
)

rem Install Node.js if necessary
echo Checking for existing Node.js installation at "%NODE_INSTALL_DIR%\node.exe" ...
if exist "%NODE_INSTALL_DIR%\node.exe" (
    echo Node.js %NODE_VERSION% is already installed in %NODE_INSTALL_DIR%
) else (
    echo No existing Node.js installation found in %NODE_INSTALL_DIR%. Proceeding with installation.
    call :download_and_extract
)

echo [===================================================]
echo Installing dependencies

echo NPM binary path: %NPM_BIN_PATH%
echo Node binary path: %NODE_BIN_PATH%

rem Install dependencies with npm
echo Installing dependencies...
call "%NPM_BIN_PATH%" install --legacy-peer-deps=false

echo [===================================================]
echo ensuring binary dependencies are correctly linked...

call .\node_modules\.bin\electron-builder install-app-deps
if not "%ERRORLEVEL%" == "0" (
    echo binary dependencies linking failed
    pause
    endlocal
    popd
    exit /B 1
)

echo [===================================================]
echo Fixing tsconfig.custom.json...

rem Define the path to tsconfig.custom.json
set "tsconfigPath=.\tsconfig.custom.json"

rem JSON content to write if the file does not exist.
set defaultTsconfigJSON={ "include": ["src", "schema/global.d.ts"], "exclude": [] }

rem Check if the file exists
if not exist "%tsconfigPath%" (
    echo %defaultTsconfigJSON%" > "%tsconfigPath%
)

echo [===================================================]
echo PATCHING electron binary with cushy icon...

call .\node_modules\rcedit\bin\rcedit.exe "node_modules\electron\dist\electron.exe" --set-icon "%cd%\public\CushyLogo.ico"

echo [===================================================]
echo build the release folder...

call .\node_modules\.bin\electron --no-sandbox -i src\shell\build.js js css
echo SUCCESS

pause
endlocal
popd
exit /B 0

:download_and_extract
    echo Downloading Node.js %NODE_VERSION% for %NODE_ARCH% FROM %URL%...
    PowerShell -Command "$ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri '%URL%' -OutFile 'node.zip'; Expand-Archive -LiteralPath 'node.zip' -DestinationPath '%EXTRACT_DIR%' -Force; Remove-Item 'node.zip'"

endlocal
popd