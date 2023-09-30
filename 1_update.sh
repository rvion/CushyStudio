set -eux
git checkout master || true
git stash push -m "global.d.ts" flows/global.d.ts
git pull origin master || true
npm install