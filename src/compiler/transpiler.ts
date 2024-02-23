import * as path from 'pathe'

// import { Package } from 'src/cards/Pkg'
import { CushyTextBanner } from '../back/CushyTextBanner'

export async function createEsbuildContextFor(p: { entrypoints: AbsolutePath[]; root: AbsolutePath }) {
    const esbuild = window.require('esbuild') as typeof import('esbuild')
    const distFolder = path.join(p.root, 'dist')

    return esbuild.context({
        entryPoints: p.entrypoints,
        outbase: p.root,
        bundle: true,
        format: 'esm',
        banner: { js: CushyTextBanner },
        jsx: 'transform',
        jsxSideEffects: false,
        target: ['deno1'],
        loader: {
            '.png': 'dataurl',
            '.jpg': 'dataurl',
            '.svg': 'dataurl',
        },
        outdir: distFolder,
        external: ['react', 'mobx', 'mobx-react-lite', 'fs'],

        // ----------------------
        write: false,
        metafile: true,
        // ----------------------
        // loader: { '.png': 'dataurl' },
        // outfile: path.join(fileFolder, basenameWithoutExt + '.cushyapp.js'), // Output file path
        // write: false,
        // plugins: [restrictFolderPlugin],
    })
}

// export async function compileTSFile(pkg: Package) {
//     const esbuild = window.require('esbuild') as typeof import('esbuild')
//     const distFolder = path.join(pkg.folderAbs, 'dist')

//     return esbuild.context({
//         entryPoints: pkg.esbuildEntrypoints,
//         outbase: pkg.folderAbs,
//         bundle: true,
//         format: 'esm',
//         banner: { js: CushyTextBanner },
//         jsx: 'transform',
//         jsxSideEffects: false,
//         target: ['node20'],
//         loader: { '.png': 'empty' },
//         outdir: distFolder,
//         external: ['react', 'mobx', 'mobx-react-lite'],
//         // metafile: true,
//         // loader: { '.png': 'dataurl' },
//         // outfile: path.join(fileFolder, basenameWithoutExt + '.cushyapp.js'), // Output file path
//         // write: false,
//         // plugins: [restrictFolderPlugin],
//     })
// }
