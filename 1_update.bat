rmdir /s /q node_modules\.vite
git checkout master -- package-lock.json
git checkout master
git pull origin master
npm install
pause