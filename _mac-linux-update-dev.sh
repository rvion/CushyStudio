set -eux

# rm -rf node_modules/.vite
git checkout dev || true

git pull origin dev || true

./_mac-linux-install.sh