import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { cwd } from 'process'
import { defineConfig } from 'vite'

const installDir = cwd()

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        exclude: [
            //
            'fsevents',
        ],
    },
    publicDir: 'library',
    plugins: [
        // dynamicModulePlugin(),
        react({ jsxImportSource: 'src/utils/custom-jsx' }),
        // viteSingleFile(),
    ],
    server: {
        port: 8788,
        watch: {
            ignored: [
                //
                '**/library/**/*.ts',
                '**/library/**/*.tsx',
                '**/tsconfig.custom.json',
                '**/tsconfig.json',
            ],
        },
    },
    resolve: {
        alias: {
            src: resolve(__dirname, './src'),
            // injected node modules
            // check the `src/syms/_.cjs`
            /* */ buffer: `${installDir}/src/syms/buffer.js`,
            'node:buffer': `${installDir}/src/syms/buffer.js`,
            /* */ child_process: `${installDir}/src/syms/child_process.js`,
            'node:child_process': `${installDir}/src/syms/child_process.js`,
            /* */ fs: `${installDir}/src/syms/fs.js`,
            'node:fs': `${installDir}/src/syms/fs.js`,
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
