```
yarn vscode:tsc:debug
```


```
tsc --jsx react -p tsconfig.json --generateTrace tmp/traceDiraa --noEmit --incremental false
npx @typescript/analyze-trace tmp/traceDiraa --expandtypes true --forceMillis 100
npx @typescript/analyze-trace tmp/traceDiraa --expandtypes true --forceMillis 100 > x.txt
```