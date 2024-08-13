
set -eux

# usage:
#
# to see RELATIVE paths:
# ./scripts/show-file-dependencies.sh lib/front/src/features/dashboards/follow-up/selectors.test.js
#
# to see ABSOLUTE paths:
# ./scripts/show-file-dependencies.sh lib/front/src/features/dashboards/follow-up/selectors.test.js -b lib
#

# ensure file exists (will crash if not passed in, due to -e)
file=$1
echo "file: $file"

# createthe image
mkdir -p tmp
allargs=$@
madge $allargs -i tmp/depedencies.png

# open the file
code tmp/depedencies.png

set +x

echo "for a text list of this, simply run"
echo "madge $file"