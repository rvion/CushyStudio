@echo off

rem set current working directory to the directory of this script
pushd %~dp0

rem TODO: close cushy first

echo [===================================================]
echo Checkout dev...

call git checkout dev
if not "%ERRORLEVEL%" == "0" (
    echo git checkout dev failed
    pause
    popd
    exit /B 1
)

echo [===================================================]
echo pull latest changes...

call git pull origin dev
if not "%ERRORLEVEL%" == "0" (
    echo git pull origin dev failed
    pause
    popd
    exit /B 1
)

call _windows-install.bat
popd
