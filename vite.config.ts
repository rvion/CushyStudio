import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

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
            /* */ buffer: './src/syms/buffer',
            'node:buffer': './src/syms/buffer',
            /* */ child_process: './src/syms/child_process',
            'node:child_process': './src/syms/child_process',
            /* */ fs: './src/syms/fs',
            'node:fs': './src/syms/fs',
            /* */ os: './src/syms/os',
            'node:os': './src/syms/os',
            /* */ path: './src/syms/path',
            'node:path': './src/syms/path',
            /* */ process: './src/syms/process',
            'node:process': './src/syms/process',
            /* */ stream: './src/syms/stream',
            'node:stream': './src/syms/stream',
            /* */ util: './src/syms/util',
            'node:util': './src/syms/util',
            /* */ zlib: './src/syms/zlib',
            'node:zlib': './src/syms/zlib',
            /* */ events: './src/syms/events',
            'node:events': './src/syms/events',
        },
    },
})
