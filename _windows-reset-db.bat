@echo off

rem set current working directory to the directory of this script
pushd "%~dp0"

rem setlocal: Ensures that the environment changes are local to the script.
setlocal

rem remove src\db\cushy-1.db
if exist ".\src\db\cushy-1.db" (
    echo Found DB. Deleting.
    del .\src\db\cushy-1.db
    if not "%ERRORLEVEL%" == "0" (
        echo removing src\db\cushy-1.db failed
        pause
        popd
        endlocal
        exit /B 1
    )   
) else (
    echo Cushy DB does not exist.
)

rem SUCCESS
echo SUCCESS
pause
popd
endlocal