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

const esbuild = require('esbuild')
const { writeFileSync } = require('fs')
const { resolve } = require('path')

const args = process.argv.slice(2)

console.log(`[🤠] AAA`)
build()

async function build() {
    if (args.includes('js')) {
        await buildJS()
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
    process.exit(0)
}

fs.mkdirSync('release-forms', { recursive: true })

process.env.NODE_ENV = 'production'
async function buildJS() {
    console.log(`[BUILD] 1. build js`)
    const shouldMinify = args.includes('mini') || args.includes('minify')
    if (shouldMinify) console.log(`[BUILD] (WITH minify)`)
    else console.log(`[BUILD] (NO minify)`)

    const res = await esbuild.build({
        // https://github.com/evanw/esbuild/issues/2377#issuecomment-1178426065
        define: {
            'process.env.NODE_ENV': '"production"',
        },
        // entryPoints: ['src/app/main.tsx'],
        entryPoints: ['src/controls/FormBuilder.loco.ts'],
        plugins: [
            {
                name: 'debug all stuff',
                setup(build) {
                    build.onResolve({ filter: /.*/ }, (args) => {
                        console.log(`[🤠] args`, args.importer + ' >> ' + args.path)
                    })
                },
            },
        ],
        bundle: true,
        minify: shouldMinify,
        // minifyIdentifiers: shouldMinify,
        // minifySyntax: shouldMinify,
        // minifyWhitespace: false,
        // minifySyntax: false,
        sourcemap: false,
        metafile: true,
        treeShaking: true,
        target: ['esnext'],
        format: 'esm',
        // lineLimit: 80,
        // external:
        // external: ['three'],
        // jsx: 'react',
        jsxImportSource: 'src/utils/custom-jsx',
        alias: {
            // -----------------------------------------------------------------------
            three: './src/syms/three.js',
            mobx: './src/syms/mobx.js',
            nsfwjs: './src/syms/nsfwjs.js',
            '@tensorflow/tfjs': './src/syms/tfjs.js',
            'mime-types': './src/syms/mime-types.js',

            // -----------------------------------------------------------------------
            src: './src',
        },
        external: [
            'react',
            'react-dom',
            'marked',
            'react-dnd',
            'image-meta',
            'react-mobx-lite',
            '@uiw/react-json-view',
            'mobx',
            //
            'crypto',
            'assert',
            'url',
            'buffer',
            'child_process',
            'cluster',
            'fs',
            'os',
            'path',
            'process',
            'stream',
            'util',
            'zlib',
            'events',
        ],
        // packages: 'external',
        // handle css and svg files
        loader: {
            '.css': 'css',
            '.svg': 'text',
        },
        outfile: 'release-forms/main.js',
    })
    if (res.errors) console.log(`[BUILD]`, res.errors)
    if (res.warnings) console.log(`[BUILD]`, res.warnings)
    writeFileSync('release-forms/meta.json', JSON.stringify(res.metafile, null, 2))
}

async function buildTailwind() {
    console.log(`[BUILD] 2. build css `)

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
