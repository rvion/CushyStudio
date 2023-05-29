const modulesToCache = [
    //
    'buffer',
    'fs',
    'os',
    'path',
    'process',
    'stream',
    'util',
    'zlib',
]

const fs = require('fs')

for (const x of modulesToCache) {
    const symbols = Object.keys(require(x))
    const out1 = JSON.stringify(symbols)
    fs.writeFileSync(`src/syms/${x}.txt`, out1)

    let output = `const _ = window.require('${x}')\n`
    output += `export default _\n`
    for (const x of symbols) {
        output += `export const ${x} = _.${x}\n`
    }
    fs.writeFileSync(`src/syms/${x}`, output)
}
