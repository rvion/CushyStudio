<!-- ------------------- -->

esbuild --watch .vscode/extensions/rvion1/extension.ts --bundle --external:vscode  --external:@mdi/js --format=cjs --outfile=.vscode/extensions/rvion1/extension.js

convert -resize 64x64 /Users/loco/dev/CushyStudio/.vscode/extensions/rvion1/HeartsLove.gif /Users/loco/dev/CushyStudio/.vscode/extensions/rvion1/HeartsLove64.gif

<!-- ------------------- -->