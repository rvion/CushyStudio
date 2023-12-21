set -eux

# rm -rf node_modules/.vite
git checkout master || true

git pull origin master || true

./maclinux-install.sh