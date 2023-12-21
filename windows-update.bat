@echo off

@REM TODO: close cushy first

git checkout master
IF %ERRORLEVEL% NEQ 0 (
    ECHO "git checkout master failed"
    pause
    EXIT /B 1
)

git pull origin master
IF %ERRORLEVEL% NEQ 0 (
    ECHO "git pull origin master failed"
    pause
    EXIT /B 1
)

CALL windows-install.bat
