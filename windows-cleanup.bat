@REM @echo off: This turns off the command echoing, which makes the script output cleaner.
@echo off

@REM setlocal: Ensures that the environment changes are local to the script.
setlocal

ECHO [===================================================]
ECHO deleting node_modules folder...

@REM rd /s /q node_modules:
@REM Removes the node_modules directory recursively.
@REM - /s deletes all files and subdirectories,
@REM - /q does it quietly without prompting for confirmation.
rd /s /q node_modules

ECHO [===================================================]
ECHO deleting recursively .cushy\store (local pnpm cache)...

rd /s /q .cushy\store

ECHO SUCCESS
pause