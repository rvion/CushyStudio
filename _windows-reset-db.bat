@echo off

cd /d %~dp0

@REM setlocal: Ensures that the environment changes are local to the script.
setlocal

@REM remove src\db\cushy-1.db
rd src\db\cushy-1.db
IF %ERRORLEVEL% NEQ 0 (
    ECHO "removing src\db\cushy-1.db failed"
    pause
    EXIT /B 1
)

@REM SUCCESS
ECHO ""
ECHO SUCCESS
pause