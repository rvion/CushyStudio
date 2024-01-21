@echo off

cd /d %~dp0

@REM TODO: close cushy first

ECHO [===================================================]
ECHO Checkout master...

git checkout master
IF %ERRORLEVEL% NEQ 0 (
    ECHO "git checkout master failed"
    pause
    EXIT /B 1
)

ECHO [===================================================]
ECHO pull latest changes...

git pull origin master
IF %ERRORLEVEL% NEQ 0 (
    ECHO "git pull origin master failed"
    pause
    EXIT /B 1
)

CALL _windows-install.bat
