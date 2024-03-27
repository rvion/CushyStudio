/*
NOTES:

1 💬 we don't want to silence errors like this at build time:
1 | ✘ [ERROR] Could not resolve "fs"
1 |
1 |     src/models/createMediaImage_fromWebFile.ts:6:55:
1 |       6 │ import { mkdirSync, readFileSync, writeFileSync } from 'fs'
1 |         ╵                                                        ~~~~
1 |
1 |   The package "fs" wasn't found on the file system but is built into node. Are you trying to bundle
1 |   for node? You can use "platform: 'node'" to do that, which will remove this error.
1 |
1 | ✘ [ERROR] Could not resolve "crypto"
1 |
1 |     src/state/hashBlob.ts:1:19:
1 |       1 │ import crypto from 'crypto'
1 |         ╵                    ~~~~~~~~
1 |

*/
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const postcss = require('postcss')
const tailwindcss = require('tailwindcss')

const { resolve } = require('path')
const { buildJS } = require('./build-form-JS')

const args = process.argv.slice(2)
const shouldMinify = args.includes('mini') || args.includes('minify')

console.log(`[🤠] AAA`)
build()

async function build() {
    if (args.includes('js')) {
        await buildJS(shouldMinify)
    }

    if (args.includes('css')) {
        await buildTailwind()
    }
    // show size of all assets in the release folder
    const files = fs.readdirSync('release-forms')
    for (const f of files) {
        const size = fs.statSync(path.join('release-forms', f)).size
        console.log(`${f}: ${size} bytes`)
    }
    // process.exit(0)
}

fs.mkdirSync('release-forms', { recursive: true })

process.env.NODE_ENV = 'production'

async function buildTailwind() {
    // console.log(`[BUILD] 2. build css `)
    // console.log(`[🔵] SKIP`)
    // return
    try {
        // Define file paths
        const inputFilePath = path.join('release-forms', 'main.css')
        const outputFilePath = path.join('release-forms', 'output.css')

        // Read the CSS file
        const css = await readFile(inputFilePath, 'utf8')

        // Process the CSS with Tailwind
        const result = await postcss([tailwindcss]).process(css, { from: inputFilePath, to: outputFilePath })

        // Write the processed CSS to a file
        await writeFile(outputFilePath, result.css)

        if (result.map) {
            await writeFile(outputFilePath + '.map', result.map)
        }

        console.log('Tailwind CSS build complete.')
    } catch (error) {
        console.error('Error occurred building css:', error)
    }
}

// buildTailwind()
