#!/bin/zsh
fileVSCode="/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/node_modules/typescript/lib/typescript.js"
fileLocal="./node_modules/typescript/lib/tsserver.js"
sed -i '' 's/defaultMaximumTruncationLength = 160;/defaultMaximumTruncationLength = 4000;/g' "$fileVSCode"
sed -i '' 's/defaultMaximumTruncationLength = 160;/defaultMaximumTruncationLength = 4000;/g' "$fileLocal"
      
# 🔶 also make sure "noErrorTruncation": true in tsconfig.json
