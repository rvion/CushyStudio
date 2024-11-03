const fs = require('fs')
const path = require('path')

const esbuild = require('esbuild')
const { writeFileSync } = require('fs')
const { spawn, spawnSync } = require('child_process')

const args = process.argv.slice(2)

build()

async function build() {
    if (args.includes('js')) await buildJS()
    const files = fs.readdirSync('release')
    for (const f of files) {
        const size = fs.statSync(path.join('release', f)).size
        console.log(`${f}: ${size} bytes`)
    }

    spawnSync('./node_modules/.bin/tailwindcss', ['-o', 'src/theme/twin.css'], { stdio: 'inherit' })

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
        define: { 'process.env.NODE_ENV': '"production"' },
        // entryPoints: ['src/app/main.tsx'],
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
        jsxImportSource: 'src/csuite/custom-jsx',
        alias: {
            // -----------------------------------------------------------------------
            mobx: './src/syms/mobx.js',
            nsfwjs: './src/syms/nsfwjs.js',
            '@tensorflow/tfjs': './src/syms/tfjs.js',
            'mime-types': './src/syms/mime-types.js',

            // -----------------------------------------------------------------------
            src: './src',

            // -----------------------------------------------------------------------
            // 🔶 modifications must be kept in sync between :
            //     | ./src/shell/build.js
            //     | ./vite.config.ts
            //     | ./src/shell/externals.cjs
            // injected node modules
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
            /* */ crypto: `./src/syms/crypto.js`,
            'node:crypto': `./src/syms/crypto.js`,
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
