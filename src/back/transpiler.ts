import * as path from 'pathe'
import { Package } from 'src/cards/Pkg'
import { CushyTextBanner } from './CushyTextBanner'

export async function compilePackage(pkg: Package) {
    const esbuild = window.require('esbuild') as typeof import('esbuild')
    const distFolder = path.join(pkg.folderAbs, 'dist')
    // const PREFIX = `[👙 ${pkg.name}] :`

    return esbuild.context({
        entryPoints: pkg.esbuildEntrypoints,
        outbase: pkg.folderAbs,
        bundle: true,
        banner: { js: CushyTextBanner },
        jsxFactory: '_ui',
        loader: { '.png': 'empty' },
        outdir: distFolder,
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
