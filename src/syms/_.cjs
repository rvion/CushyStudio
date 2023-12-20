const modulesToCache = [
    // node ----------
    ['assert', 'assert'],
    ['url', 'url'],
    ['buffer', 'buffer'],
    ['child_process', 'child_process'],
    ['fs', 'fs'],
    ['os', 'os'],
    ['path', 'path'],
    ['process', 'process'],
    ['stream', 'stream'],
    ['util', 'util'],
    ['zlib', 'zlib'],
    ['events', 'events'],
    ['cluster', 'cluster'],
    ['https', 'https'],
    // externals ----------------
    ['three', 'three'],
    ['mobx', 'mobx'],
    ['cytoscape-klay', 'cytoscape-klay'],
    ['cytoscape', 'cytoscape'],
    ['lexical', 'lexical'],
    // ['react-dom', 'react-dom'],
    // ['konva', 'konva/lib/index.js'],
    // 'wildcards',
    // 'three/examples/jsm/controls/OrbitControls.js',
]

const fs = require('fs')

for (const [x, pt] of modulesToCache) {
    const symbols = Object.keys(require(pt))
    const out1 = JSON.stringify(symbols)
    // fs.writeFileSync(`src/syms/${x}.txt`, out1)

    let output = `const _ = window.require('${x}')\n`
    output += `export default _\n`
    for (const x of symbols) {
        output += `export const ${x} = _.${x}\n`
    }
    fs.writeFileSync(`src/syms/${x}.js`, output)
}
