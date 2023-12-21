@echo off

@REM TODO: close cushy first

git checkout master
git pull origin master
CALL cushy-install.bat
pause