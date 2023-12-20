@REM rmdir /s /q node_modules\.vite
git checkout master
git pull origin master

CALL _windows_INSTALL.bat
pause