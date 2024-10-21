#!/bin/bash
# set -ux

# Set a default value for MAX_LEN
DEFAULT_MAX_LEN=4000

# Use the first argument if provided, otherwise use the default value
MAX_LEN=${1:-$DEFAULT_MAX_LEN}

echo "MAX_LEN: $MAX_LEN"

#!/bin/zsh
fileVSCode="/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/node_modules/typescript/lib/typescript.js"
echo "patching \"$fileVSCode\""
sed -i '' "s/defaultMaximumTruncationLength = [0-9]\{1,\};/defaultMaximumTruncationLength = $MAX_LEN;/g" "$fileVSCode"

# 💬 2024-08-23 rvion:
# | in recent versions of typescript, the same code is present twice in two different build artifacts:
# | - 🟢 `typescript.js`
# | - 🟢 `tsc.js`
# |
# | but is no longer present in
# | - ❌ `tsserver.js`

# ⏸️ fileLocal="./node_modules/typescript/lib/tsserver.js"
# ⏸️ echo "patching \"$fileLocal\""
# ⏸️ sed -i '' "s/defaultMaximumTruncationLength = [0-9]\{1,\};/defaultMaximumTruncationLength = $MAX_LEN;/g" "$fileLocal"

fileLocal2="./node_modules/typescript/lib/typescript.js"
echo "patching \"$fileLocal2\""
sed -i '' "s/defaultMaximumTruncationLength = [0-9]\{1,\};/defaultMaximumTruncationLength = $MAX_LEN;/g" "$fileLocal2"

fileLocal3="./node_modules/typescript/lib/tsc.js"
echo "patching \"$fileLocal3\""
sed -i '' "s/defaultMaximumTruncationLength = [0-9]\{1,\};/defaultMaximumTruncationLength = $MAX_LEN;/g" "$fileLocal3"


echo "you can check the changes with the following commands:"

echo "code \"$fileVSCode\" -g=:16210"
echo "code \"$fileLocal2:16210\""
echo "code \"$fileLocal3:12440\""
