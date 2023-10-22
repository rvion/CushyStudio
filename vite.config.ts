import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { defineConfig } from 'vite'
import { resolve } from 'path'
// import { viteSingleFile } from 'vite-plugin-singlefile'
// import { dynamicModulePlugin } from './viteplugin'

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        exclude: [
            //
            'fsevents',
            // 'fs',
        ],
    },
    publicDir: 'src/public',
    plugins: [
        // dynamicModulePlugin(),
        react({ jsxImportSource: 'src/custom-jsx' }),
        // viteSingleFile(),
    ],
    server: {
        port: 8788,
        watch: {
            ignored: [
                //
                '**/actions/**/*.ts',
                '**/actions/**/*.tsx',
                '**/tsconfig.custom.json',
                '**/tsconfig.json',
            ],
        },
    },
    resolve: {
        alias: {
            src: resolve(__dirname, './src'),
            // 'src/*': './src/*.ts',
            buffer: './src/syms/buffer',
            child_process: './src/syms/child_process',
            fs: './src/syms/fs',
            os: './src/syms/os',
            path: './src/syms/path',
            process: './src/syms/process',
            stream: './src/syms/stream',
            util: './src/syms/util',
            zlib: './src/syms/zlib',
        },
    },
})

// function dynamicModulePlugin() {
//     return {
//         name: 'dynamic-module-plugin',
//         load(id: any) {
//             console.log(`2| ${id}`)
//             if (id.startsWith('__window__')) {
//                 const final = id.replace('__window__', '')
//                 return readFileSync(`src/syms/${final}.js`, 'utf-8')
//                 //                 const exists = existsSync(`syms/${final}.txt`)
//                 //                 if (!exists) throw new Error(`no syms for ${final}`)
//                 //                 const syms = JSON.parse(readFileSync(`syms/${final}.txt`, 'utf-8'))
//                 //                 console.log(`3| ${final}`)
//                 //                 const output = `const _ = window.require('${final}')
//                 // export default _
//                 // ${syms.map((x: string) => `export const ${x} = _.${x}`).join('\n')}
//                 //                 `
//                 //                 writeFileSync(id, output)
//                 //                 return output
//                 //             }
//             }
//             return null
//         },
//     }
// }

// /*
// // run this in node
// const modulesToCache = [ 'process', 'path', 'fs', 'os', 'stream', 'zlib', 'util']
// for (const x of modulesToCache){

//     const out1  = JSON.stringify(Object.keys(require(x)))
//     require('fs').writeFileSync(`syms/${x}.txt`, out1 )
// }
// */
