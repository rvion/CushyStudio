@echo off

rem set current working directory to the directory of this script
pushd %~dp0

rem TODO: close cushy first

echo [===================================================]
echo Checkout master...

call git checkout master
if not "%ERRORLEVEL%" == "0" (
    echo git checkout master failed
    pause
    popd
    exit /B 1
)

echo [===================================================]
echo pull latest changes...

call git pull origin master
if not "%ERRORLEVEL%" == "0" (
    echo git pull origin master failed
    pause
    popd
    exit /B 1
)

call _windows-install.bat
popd
