set -eux
bump patch
npm run back:build -- --minify
npm run front:build
npm run package