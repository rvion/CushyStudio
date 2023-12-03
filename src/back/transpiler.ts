import * as path from 'pathe'
import { Package } from 'src/cards/Pkg'
import { CushyTextBanner } from './CushyTextBanner'
import { Plugin, OnResolveArgs } from 'esbuild'

export async function compilePackage(pkg: Package) {
    const esbuild = window.require('esbuild') as typeof import('esbuild')
    const distFolder = path.join(pkg.folderAbs, 'dist')
    // const PREFIX = `[👙 ${pkg.name}] :`

    return esbuild.context({
        entryPoints: pkg.esbuildEntrypoints,
        outbase: pkg.folderAbs,
        bundle: true,
        // use esm
        format: 'esm',
        banner: { js: CushyTextBanner },
        jsxFactory: '_ui',
        target: ['node20'],
        // plugins: [fakeDepsInjector()],

        loader: { '.png': 'empty' },
        outdir: distFolder,
        external: ['react', 'mobx', 'mobx-react-lite'],
        // metafile: true,
        // loader: { '.png': 'dataurl' },
        // outfile: path.join(fileFolder, basenameWithoutExt + '.cushyapp.js'), // Output file path
        // write: false,
        // plugins: [restrictFolderPlugin],
    })
    // writeFileSync(path.join(distFolder, 'meta.json'), JSON.stringify(result.metafile, null, 2))
    // console.log(`${PREFIX} 🟢compiled:`, buildOptions, result)
    // } catch (error) {
    //     console.error(`${PREFIX} ❌ compilation failed:`, error)
    //     throw error
    // }
}
// // ------------------------------------------------------------------------
// // Define a mapping of libraries to their global variables
// const LIBRARY_GLOBALS: Record<string, string> = {
//     react: 'GLOBALVAR.react',
//     mobx: 'GLOBALVAR.mobx',
//     'mobx-react-lite': 'GLOBALVAR["mobx-react-lite"]',
//     'react/jsx-runtime': 'GLOBALVAR["jsx-runtime"]',
// }
// const fakeDepsInjector = (): Plugin => {
//     return {
//         name: 'global-import-plugin',
//         setup(build) {
//             // Intercept import paths
//             build.onResolve({ filter: /.*/ }, (args: OnResolveArgs) => {
//                 if (LIBRARY_GLOBALS[args.path]) {
//                     return {
//                         path: args.path,
//                         namespace: 'global-import',
//                     }
//                 }
//             })

//             // Replace imports with global variables
//             build.onLoad({ filter: /.*/, namespace: 'global-import' }, (args) => {
//                 const globalVar = LIBRARY_GLOBALS[args.path]
//                 return { contents: `module.exports = ${globalVar};`, loader: 'js' }
//             })
//         },
//     }
// }

// export default fakeDepsInjector
