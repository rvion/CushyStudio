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
            '@tensorflow/tfjs': './src/syms/tfjs.js',
            nsfwjs: './src/syms/nsfwjs.js',
            'mime-types': './src/syms/mime-types.js',

            // -----------------------------------------------------------------------
            src: './src',
        },
        external: [
            'react',
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
