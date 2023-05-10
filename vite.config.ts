import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // viteSingleFile(),
    ],
    server: {
        watch: {
            ignored: ['**/src/examples/**/*'],
        },
    },
    // esbuild: {
    //     // minify: false,
    //     minifySyntax: false,
    // },
    // build: {
    //     minify: false,
    //     outDir: 'dist/webview',
    //     rollupOptions: {
    //         output: {
    //             entryFileNames: `assets/[name].js`,
    //             chunkFileNames: `assets/[name].js`,
    //             assetFileNames: `assets/[name].[ext]`,
    //         },
    //     },
    // },
})
