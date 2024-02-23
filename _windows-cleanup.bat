@rem @echo off: This turns off the command echoing, which makes the script output cleaner and then you don't need to prefix commands with @
@echo off

rem setlocal: Ensures that the environment changes are local to the script.
setlocal
rem set current working directory to the directory of this script
pushd %~dp0

echo [===================================================]
echo deleting node_modules folder...

rem rd /s /q node_modules:
rem Removes the node_modules directory recursively.
rem - /s deletes all files and subdirectories,
rem - /q does it quietly without prompting for confirmation.
rd /s /q node_modules

echo [===================================================]
echo deleting recursively .cushy

rd /s /q .cushy

echo SUCCESS
pause