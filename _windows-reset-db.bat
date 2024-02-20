@echo off

rem set current working directory to the directory of this script
pushd "%~dp0"

rem setlocal: Ensures that the environment changes are local to the script.
setlocal

rem remove src\db\cushy-1.db
del src\db\cushy-1.db
if ! %ERRORLEVEL% == 0 (
    echo removing src\db\cushy-1.db failed
    pause
    popd
    endlocal
    exit /B 1
)

rem SUCCESS
echo ""
echo SUCCESS
pause
popd
endlocal