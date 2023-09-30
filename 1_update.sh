set -eux
git checkout master || true
git pull origin master || true
npm install