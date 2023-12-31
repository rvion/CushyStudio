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

build()

async function build() {
    if (args.includes('js')) {
        await buildJS()
    }

    if (args.includes('css')) {
        await buildTailwind()
    }
    // show size of all assets in the release folder
    const files = fs.readdirSync('release')
    for (const f of files) {
        const size = fs.statSync(path.join('release', f)).size
        console.log(`${f}: ${size} bytes`)
    }
    process.exit(0)
}

async function buildJS() {
    console.log(`[BUILD] 1. build js`)
    const shouldMinify = args.includes('mini') || args.includes('minify')
    if (shouldMinify) console.log(`[BUILD] (WITH minify)`)
    else console.log(`[BUILD] (NO minify)`)

    const res = await esbuild.build({
        entryPoints: ['src/app/main.tsx'],
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
            'cytoscape-klay': './src/syms/cytoscape-klay.js',
            cytoscape: './src/syms/cytoscape.js',
            lexical: './src/syms/lexical.js',
            '@tensorflow/tfjs': './src/syms/tfjs.js',
            nsfwjs: './src/syms/nsfwjs.js',
            'mime-types': './src/syms/mime-types.js',

            // -----------------------------------------------------------------------
            src: './src',

            // -----------------------------------------------------------------------
            // injected node modules
            // check the `src/syms/_.cjs`
            /* */ assert: `./src/syms/assert.js`,
            'node:assert': `./src/syms/assert.js`,
            /* */ url: `./src/syms/url.js`,
            'node:url': `./src/syms/url.js`,
            /* */ buffer: `./src/syms/buffer.js`,
            'node:buffer': `./src/syms/buffer.js`,
            /* */ child_process: `./src/syms/child_process.js`,
            'node:child_process': `./src/syms/child_process.js`,
            /* */ cluster: `./src/syms/cluster.js`,
            'node:cluster': `./src/syms/cluster.js`,
            /* */ fs: `./src/syms/fs.js`,
            'node:fs': `./src/syms/fs.js`,
            /* */ https: `./src/syms/https.js`,
            'node:https': `./src/syms/https.js`,
            /* */ os: `./src/syms/os.js`,
            'node:os': `./src/syms/os.js`,
            /* */ path: `./src/syms/path.js`,
            'node:path': `./src/syms/path.js`,
            /* */ process: `./src/syms/process.js`,
            'node:process': `./src/syms/process.js`,
            /* */ stream: `./src/syms/stream.js`,
            'node:stream': `./src/syms/stream.js`,
            /* */ util: `./src/syms/util.js`,
            'node:util': `./src/syms/util.js`,
            /* */ zlib: `./src/syms/zlib.js`,
            'node:zlib': `./src/syms/zlib.js`,
            /* */ events: `./src/syms/events.js`,
            'node:events': `./src/syms/events.js`,
            /* */ async_hooks: `./src/syms/async_hooks.js`,
            'node:async_hooks': `./src/syms/async_hooks.js`,
        },
        // external: [
        //     'assert',
        //     'url',
        //     'buffer',
        //     'child_process',
        //     'cluster',
        //     'fs',
        //     'os',
        //     'path',
        //     'process',
        //     'stream',
        //     'util',
        //     'zlib',
        //     'events',
        // ],
        // packages: 'external',
        // handle css and svg files
        loader: {
            '.css': 'css',
            '.svg': 'text',
        },
        outfile: 'release/main.js',
    })
    if (res.errors) console.log(`[BUILD]`, res.errors)
    if (res.warnings) console.log(`[BUILD]`, res.warnings)
    writeFileSync('release/meta.json', JSON.stringify(res.metafile, null, 2))
}

async function buildTailwind() {
    console.log(`[BUILD] 2. build css `)

    try {
        // Define file paths
        const inputFilePath = path.join('release', 'main.css')
        const outputFilePath = path.join('release', 'output.css')

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
