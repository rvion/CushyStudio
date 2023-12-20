const { exec, execSync } = require('child_process')
const esbuild = require('esbuild')
const { writeFileSync } = require('fs')
const { resolve } = require('path')

const args = process.argv.slice(2)

// <script type="importmap">
// {
//     "imports": {
//         "three": "./node_modules/three/build/three.js"
//     }
// }
// </script>
const build = async () => {
    if (args.includes('js')) {
        console.log(`[🚧] 1. build js`)
        const shouldMinify = args.includes('mini') || args.includes('minify')
        if (shouldMinify) console.log(`[🚧] (WITH minify)`)
        else console.log(`[🚧] (NO minify)`)

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
        if (res.errors) console.log(`[🚧]`, res.errors)
        if (res.warnings) console.log(`[🚧]`, res.warnings)
        writeFileSync('release/meta.json', JSON.stringify(res.metafile, null, 2))
    }
    if (args.includes('css')) {
        console.log(`[🚧] 2. build css `)
        execSync('tailwindcss -i release/main.css -o release/output.css', { stdio: 'inherit' })
    }

    //
    execSync('du -sh release/*', { stdio: 'inherit' })
    console.log(resolve('release/main.js'))
}

build()
