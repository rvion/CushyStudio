import chalk from 'chalk'
import esbuild from 'esbuild'
import { writeFileSync } from 'fs'

export async function buildJS(p: {
    //
    shouldMinify: boolean
    entryPoints: string[]
    outfile: string
}): Promise<{ metaFilePath: string }> {
    // legacy check when imported untyped until cleanup done
    /* 💊*/ if (typeof p !== 'object') throw new Error(`[buildJS] shouldMinify must be a boolean`)
    /* 💊*/ if (typeof p.shouldMinify !== 'boolean') throw new Error(`[buildJS] shouldMinify must be a boolean`)

    const { shouldMinify, entryPoints } = p
    console.log(`[BUILD] 1. build js`)
    // const shouldMinify = args.includes('mini') || args.includes('minify')
    if (shouldMinify) console.log(`[BUILD] (WITH minify)`)
    else console.log(`[BUILD] (NO minify)`)

    const res = await esbuild.build({
        // https://github.com/evanw/esbuild/issues/2377#issuecomment-1178426065
        define: {
            'process.env.NODE_ENV': '"production"',
        },
        // entryPoints: ['src/app/main.tsx'],
        entryPoints, //: ['src/controls/Builder.loco.ts'],
        plugins: [
            // {
            //     name: 'debug all stuff',
            //     setup(build) {
            //         build.onResolve({ filter: /.*/ }, (args) => {
            //             console.log(`[🤠] args`, args.importer + ' >> ' + args.path)
            //         })
            //     },
            // },
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
        // format: 'iife',
        // lineLimit: 80,
        // external:
        // external: ['three'],
        // jsx: 'react',
        jsxImportSource: 'src/csuite/custom-jsx',
        alias: {
            // -----------------------------------------------------------------------
            // three: './src/syms/three.js',
            // mobx: './src/syms/mobx.js',
            // nsfwjs: './src/syms/nsfwjs.js',
            // '@tensorflow/tfjs': './src/syms/tfjs.js',
            // 'mime-types': './src/syms/mime-types.js',
            // -----------------------------------------------------------------------
            src: './src',
        },
        external: [
            'react',
            'react-dom',
            'marked',
            'react-dnd',
            'image-meta',
            'mobx-react-lite',
            'react-error-boundary',
            'nanoid',
            'react-toastify',
            'react-easy-sort',
            '@uiw/react-json-view',
            'mobx',
            'three',
            'nsfwjs',
            '@tensorflow/tfjs',
            'mime-types',
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
            //
            '@sinclair/typebox',
            '@mdi/js',
            '@mdi/react',
            'colorjs.io',
            'prop-types',
        ],
        // packages: 'external',
        // handle css and svg files
        loader: {
            '.css': 'css',
            '.svg': 'text',
        },
        outfile: p.outfile, //'release-forms/main.js',
    })
    if (res.errors) console.log(`[BUILD] errors:`, res.errors)
    if (res.warnings) console.log(`[BUILD] warnings:`, res.warnings)
    const metaFilePath = p.outfile.replace(/\.js$/, '.meta.json')
    writeFileSync(metaFilePath /* 'release-forms/meta.json' */, JSON.stringify(res.metafile, null, 2))
    console.log(`metafile saved in ${chalk.underline(metaFilePath)}`)
    // await esbuild.stop()
    return { metaFilePath }
}
