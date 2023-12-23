import react from '@vitejs/plugin-react'
import { cwd } from 'process'
import { defineConfig } from 'vite'

const installDir = cwd()

// Read package.json and get all dependencies
// const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))
// const allDependencies = Object.keys(packageJson.dependencies)

console.log(`[VITE] loading vite config`)

// https://vitejs.dev/config/
export default defineConfig({
    clearScreen: false,
    optimizeDeps: {
        // exclude: allDependencies,
        exclude: [
            //
            'fsevents',
            'esbuild',
        ],
    },
    // publicDir: 'library',
    plugins: [
        // dynamicModulePlugin(),
        react({ jsxImportSource: 'src/utils/custom-jsx' }),
        // viteSingleFile(),
    ],
    build: {
        // rollupOptions: {
        //     external: allDependencies,
        // },
        emptyOutDir: true,
        copyPublicDir: false,
    },
    server: {
        port: 8788,
        watch: {
            ignored: [
                //
                '**/library/**/*.ts',
                '**/library/**/*.tsx',
                '**/tsconfig.custom.json',
                '**/tsconfig.json',

                // find which one to keep later
                '**/library/**/*.js',
                '**/library/*/*/dist',
                '**/library/*/*/dist/',
                '**/library/*/*/dist/**/*.js',
                '**/library/**/dist/**/*.js',
            ],
        },
    },
    resolve: {
        alias: {
            // -----------------------------------------------------------------------
            three: `${installDir}/src/syms/three.js`,
            mobx: `${installDir}/src/syms/mobx.js`,
            'cytoscape-klay': `${installDir}/src/syms/cytoscape-klay.js`,
            cytoscape: `${installDir}/src/syms/cytoscape.js`,
            lexical: `${installDir}/src/syms/lexical.js`,
            '@tensorflow/tfjs': './src/syms/tfjs.js',

            // -----------------------------------------------------------------------
            src: `${installDir}/src`,

            // -----------------------------------------------------------------------
            // injected node modules
            // check the `src/syms/_.cjs`
            /* */ assert: `${installDir}/src/syms/assert.js`,
            'node:assert': `${installDir}/src/syms/assert.js`,
            /* */ url: `${installDir}/src/syms/url.js`,
            'node:url': `${installDir}/src/syms/url.js`,
            /* */ buffer: `${installDir}/src/syms/buffer.js`,
            'node:buffer': `${installDir}/src/syms/buffer.js`,
            /* */ child_process: `${installDir}/src/syms/child_process.js`,
            'node:child_process': `${installDir}/src/syms/child_process.js`,
            /* */ cluster: `${installDir}/src/syms/cluster.js`,
            'node:cluster': `${installDir}/src/syms/cluster.js`,
            /* */ fs: `${installDir}/src/syms/fs.js`,
            'node:fs': `${installDir}/src/syms/fs.js`,
            /* */ https: `${installDir}/src/syms/https.js`,
            'node:https': `${installDir}/src/syms/https.js`,
            /* */ os: `${installDir}/src/syms/os.js`,
            'node:os': `${installDir}/src/syms/os.js`,
            /* */ path: `${installDir}/src/syms/path.js`,
            'node:path': `${installDir}/src/syms/path.js`,
            /* */ process: `${installDir}/src/syms/process.js`,
            'node:process': `${installDir}/src/syms/process.js`,
            /* */ stream: `${installDir}/src/syms/stream.js`,
            'node:stream': `${installDir}/src/syms/stream.js`,
            /* */ util: `${installDir}/src/syms/util.js`,
            'node:util': `${installDir}/src/syms/util.js`,
            /* */ zlib: `${installDir}/src/syms/zlib.js`,
            'node:zlib': `${installDir}/src/syms/zlib.js`,
            /* */ events: `${installDir}/src/syms/events.js`,
            'node:events': `${installDir}/src/syms/events.js`,
        },
    },
})
