set -eu

# ask confirmation
read -p "Are you sure you want to reset Cushy's database? (y/n) " -n 1 -r

rm src/db/cushy-1.db