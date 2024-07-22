import type { Metafile } from 'esbuild'

import chalk from 'chalk'
import { execSync } from 'child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmdirSync, unlinkSync, writeFileSync } from 'fs'
import { readJSONSync } from 'fs-extra'
import { dirname, resolve } from 'pathe'
import { parseArgs } from 'util'

import { bang } from '../csuite/utils/bang'
import { buildJS } from '../scripts/build-form-JS'
import { microbench } from '../utils/microbench'
import { mkPKGJSON } from './mkPKGJSON'
import { CRASH, section, sectionObjective, sectionTool } from './utils/_section'
import { _showESBUILDOutput } from './utils/_showESBUILDOutput'
import { mapPathToModule } from './utils/mapPathToModule'

const { values, positionals } = parseArgs({
    args: process.argv,
    options: {
        help: { type: 'boolean', default: false },
        'no-tsc': { type: 'boolean', default: false },
    },
    strict: true,
    allowPositionals: true,
})

if (values.help) {
    console.log(`Usage: bun node bundle-form-lib.ts [--no-tsc]`)
    process.exit(0)
}
console.log('positionals:', JSON.stringify(positionals))
console.log('flags:', JSON.stringify(values))

// TYPE UTILS ---------------------------------------------------------------
type PATH = Tagged<string, 'PATH'>
type UID = Tagged<string, 'UID'>

// SUMMARY ------------------------------------------------------------------
// buffer to accumulate logs
// so we can review what this script did
let out = ''
const append = (x: string): void => {
    out += x + '\n'
}

const ENTRYPOINT = 'src/csuite/index.ts'
const PACKAGE_NAME = '@cushy/forms'
const DIST_RELPATH = PACKAGE_NAME
const DIST_ABSPATH = resolve(PACKAGE_NAME)
const distPackageJSONPath_REL = `./${DIST_RELPATH}/package.json`
const distPackageJSONPath_ABS = resolve(DIST_ABSPATH, 'package.json')

// ------------------------------------------------------------------------
section(`0. preparing`)
sectionObjective(`ensure dist folder is present, with the bare minimum stuff inside`)
sectionTool('bun script')
await microbench('took', async () => {
    console.log(`- create ${chalk.underline(`./${DIST_RELPATH}/`)} folder`)
    mkdirSync(DIST_RELPATH, { recursive: true })

    console.log(`- (re)generating ${chalk.underline(distPackageJSONPath_REL)}`)
    writeFileSync(distPackageJSONPath_ABS, mkPKGJSON(PACKAGE_NAME))

    console.log(`- ensure custom jsx-runtime will be found`)
    mkdirSync('lib/csuite/custom-jsx', { recursive: true })

    const cpSync2 = (src: string, dest: string): void => {
        cpSync(src, dest)
        console.log(`- copy ${chalk.underline(src)} to ${chalk.underline(dest)}`)
    }
    // copy jsx-runtime.js' & 'jsx-dev-runtime.js' to lib, since they won't be copied by tsc
    cpSync2('src/csuite/custom-jsx/jsx-runtime.js', 'lib/csuite/custom-jsx/jsx-runtime.js')
    cpSync2('src/csuite/custom-jsx/jsx-dev-runtime.js', 'lib/csuite/custom-jsx/jsx-dev-runtime.js')
    cpSync2('src/types/types.d.ts', `${DIST_RELPATH}/types.d.ts`)
})

// ------------------------------------------------------------------------
section(`0.1 cleanup previous build`)
sectionObjective(`starting fresh ensure we're not mising anything?`)
sectionTool('bun script')
await microbench('took', async () => {
    const remove = (distRelPath: string): void => {
        const _path = resolve(DIST_ABSPATH, distRelPath)
        const exists = existsSync(_path)
        if (!exists) return console.log(`- ${chalk.gray.underline(`./${DIST_RELPATH}/${distRelPath}`)} does not exist`)
        if (!_path.includes('/CushyStudio/@cushy/forms/')) CRASH()
        console.log(`- removing ${chalk.underline(`./${DIST_RELPATH}/${distRelPath}`)}`)
        unlinkSync(_path)
    }
    console.log(`- removing ${chalk.underline(`./${DIST_RELPATH}/src`)} folder`)
    const pathToRemove = resolve(DIST_ABSPATH, 'src')
    if (!pathToRemove.includes('/CushyStudio/@cushy/forms/src')) CRASH()
    rmdirSync(pathToRemove, { recursive: true })
    remove('final.css')
    // initial
    remove('pre/initial.css')
    remove('pre/initial.js')
    remove('pre/initial.meta.json')
    // main
    remove('dts/main.d.rollup-stats.json')
    remove('main.css')
    remove('main.d.ts')
    remove('main.js')
    remove('main.meta.json')
    // output
    remove('output.css')
    remove('SUMMARY.txt')
    remove('tailwind.config.js')
    remove('rollup.config.mjs')
    // remove('types.d.ts')
})

// process.exit(0)
// BUNDLE the js (from TS) ----------------------------------------------
section(`1. first build with esbuild`)
sectionObjective(`know the list of all transitive JS files that need to be included`)
sectionTool('esbuild')
let metaFilePath!: string
mkdirSync(DIST_RELPATH, { recursive: true })
mkdirSync(`${DIST_RELPATH}/pre`, { recursive: true })
await microbench('took', async () => {
    let res = await buildJS({
        shouldMinify: false,
        entryPoints: [ENTRYPOINT],
        outfile: `${DIST_RELPATH}/pre/initial.js`,
    })
    metaFilePath = res.metaFilePath
    await _showESBUILDOutput({ prefix: 'pre/initial' })
})

// LIST ALL REAL JS FILES ----------------------------------------------
let allFilesWithExt: string[] = []
let allFilesNoExt: string[] = []
const jsModuleInBundle = new Set()
const esbuildMetafile: Metafile = readJSONSync(metaFilePath)
const esbuildMetafileInput = esbuildMetafile.inputs
const esbuildInputFiles = Object.entries(esbuildMetafileInput)
const peerDeps = new Set<string>()
out += 'INPUT:\n'
for (const [e, v] of esbuildInputFiles) {
    for (const dep of v.imports) {
        if (dep.external) {
            // 1. guard agains esbuild BUG
            if (dep.path.startsWith('./') || dep.path.startsWith('..')) {
                console.log(`🔴 module '${e}' thinks '${dep.path}' is external. What a moron.`)
                throw new Error('🔴 some fuckery is happening with external deps detection; probably some import type missing')
            }
            // 2. track external dependencies
            const depName = bang(
                dep.path.startsWith('@') //
                    ? dep.path.split('/').slice(0, 2).join('/')
                    : dep.path.split('/')[0],
            )
            peerDeps.add(depName)
        }
    }
    // 3. safety net
    if (!e.startsWith('src/')) {
        console.log(`🔴 ERROR: input does not starting with src/: `, e)
        continue
    }
    const eNoExt = mapPathToModule(e)
    allFilesWithExt.push(e)
    allFilesNoExt.push(eNoExt)
    jsModuleInBundle.add(eNoExt)
    out += `    ${e} (${jsModuleInBundle})\n`
}
console.log(`🔵 peer DEPS: `, [...peerDeps.values()])

const updateJSON = <T>(path: string, fn: (json: T) => void): void => {
    const json = JSON.parse(readFileSync(path, 'utf-8'))
    fn(json)
    writeFileSync(path, JSON.stringify(json, null, 4), 'utf-8')
}
updateJSON<{ peerDeps: Record<string, '*'> }>(distPackageJSONPath_ABS, (pkg) => {
    pkg.peerDeps = {}
    for (const p of peerDeps) {
        pkg.peerDeps[p] = '*'
    }
})

// LIST ALL REAL JS FILES ----------------------------------------------
section(`2. COPY ALL TS Files`)
sectionObjective(`create a subset of the codebase that only includes the files that are actually used`)
sectionTool('bun script')
let total = 0
for (const srcRelPath of allFilesWithExt) {
    // const
    const libRelPath = DIST_RELPATH + '/' + srcRelPath // srcRelPath.replace(/^src\//, '../')
    const dir = dirname(libRelPath)
    mkdirSync(dir, { recursive: true })
    cpSync(srcRelPath, libRelPath)
    if (total++ < 3) console.log(`    - ${srcRelPath} -> ${chalk.underline(libRelPath)}`)
    if (total++ === 3) console.log(`    - ... ${allFilesWithExt.length - 3} more`)
}

// LIST ALL REAL JS FILES ----------------------------------------------
section(`2. REEXPORT all ${jsModuleInBundle.size} files from single module`)
sectionTool('bun script')
let libEntrypointCode = ''
let mainReexportTSCode = '' // code at the root of the package that re-export everything
for (const srcRelPath of allFilesNoExt) {
    // const
    if (srcRelPath === 'src/csuite/custom-jsx/jsx-runtime') continue
    if (srcRelPath.endsWith('.css')) continue
    const libRelPath = srcRelPath.replace(/^src\//, '../')
    libEntrypointCode += `export * from '${libRelPath}'\n`
    mainReexportTSCode += `export * from './${srcRelPath}'\n`
}
const SRC_ENTRYPOINT_RELPATH = ENTRYPOINT.replace(/\.tsx?$/, '.LIBRARY.ts')
// const SRC_ENTRYPOINT_ABSPATH = resolve(SRC_ENTRYPOINT_RELPATH)
writeFileSync(SRC_ENTRYPOINT_RELPATH, libEntrypointCode)
writeFileSync(`${PACKAGE_NAME}/main.ts`, mainReexportTSCode)
console.log(`writing new entrypoint here: ${chalk.underline(SRC_ENTRYPOINT_RELPATH)}`)
const LIB_ENTRYPOINT_DTS_RELPATH = SRC_ENTRYPOINT_RELPATH.replace(/\.tsx?$/, '.d.ts').replace(/^src\//, 'lib/')
const LIB_ENTRYPOINT_DTS_ABSPATH = resolve(LIB_ENTRYPOINT_DTS_RELPATH)
console.log(`corresponding lib entrypoint: ${chalk.underline(LIB_ENTRYPOINT_DTS_RELPATH)}`)

// BUNDLE the js (from TS) ----------------------------------------------
section(`3. REBUILD from the re-exported file`)
sectionTool('esbuild')
await buildJS({
    shouldMinify: false,
    entryPoints: [SRC_ENTRYPOINT_RELPATH],
    outfile: `${PACKAGE_NAME}/main.js`,
})
await _showESBUILDOutput({ prefix: 'main' })

jsModuleInBundle.add(mapPathToModule(SRC_ENTRYPOINT_RELPATH))
console.log(`[🤠] jsModuleInBundle`, jsModuleInBundle)

// ---------------------------------------------------------------------
section(`3.2 generate main.tw.css for tailwind expansion`)
sectionTool('postcss + tailwindcss')
console.log(`    - copy tailwind.config.js into ${chalk.underline(`${DIST_RELPATH}/tailwind.config.js`)}`)
cpSync('tailwind.config.js', `${DIST_RELPATH}/tailwind.config.js`)
const commandToGenOutputCSSTailwind = `../../node_modules/.bin/tailwind --content main.js -o main.tw.css`
console.log(`    - executing ${chalk.yellowBright(`${commandToGenOutputCSSTailwind}`)}`)
execSync(commandToGenOutputCSSTailwind, { cwd: DIST_RELPATH, stdio: 'inherit' })
// await buildTailwind()
// await waitConfirm()

section(`3.3 copy css files`)

const addToPackage = (relPath: string): void => {
    console.log(`    - copy ${chalk.underline(relPath)} to ${chalk.underline(`${PACKAGE_NAME}/${relPath}`)}`)
    cpSync(relPath, `${PACKAGE_NAME}/${relPath}`)
}

// addToPackage('src/theme/form.vars.css')
addToPackage('src/theme/markdown.css')
addToPackage('src/theme/form.css')
addToPackage('src/csuite/input-number/InputNumberUI.css')

// --------------------------------------------------------------------
section(`4. generating DTS and JS`)
sectionTool('tsc')
execSync('yarn form:transpile', { stdio: 'inherit' })
// await waitConfirm()

// --------------------------------------------------------------------
console.log(`removing ➖ ${chalk.underline(SRC_ENTRYPOINT_RELPATH)}`)
unlinkSync(SRC_ENTRYPOINT_RELPATH)

// --------------------------------------------------------------------
section(`5. writing new form.rollup.config.mjs`)
sectionTool('bun script')
// const ROLLUP_CONFIG_RELPATH = ENTRYPOINT.replace(/\.tsx?$/, '.rollup.config.mjs')
const ROLLUP_CONFIG_RELPATH = DIST_RELPATH + '/' + 'rollup.config.mjs' //`${cwd()}/${ROLLUP_CONFIG_RELPATH}`
const ROLLUP_CONFIG_ABSPATH = resolve(ROLLUP_CONFIG_RELPATH)
console.log(`writing rollup config here: ${chalk.underline(ROLLUP_CONFIG_RELPATH)}`)
writeFileSync(
    ROLLUP_CONFIG_RELPATH,
    `\
import { dts } from 'rollup-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'

const config = [
    {
        input: '${LIB_ENTRYPOINT_DTS_ABSPATH}',
        output: [{ file: '${DIST_ABSPATH}/main.d.ts', format: 'es' }],
        external: [/\.s?css$/], // ignore .css and .scss file
        plugins: [dts(), visualizer({ template: 'raw-data' })],
    },
]

export default config
`,
)
// await waitConfirm()

// --------------------------------------------------------------------
section(`6. packing types together`)
sectionTool('rollup + plugin-dts + plugin-visualizer')
// const rollupRoot = `${cwd()}/src/scripts`
const rollupBin = './src/scripts/node_modules/.bin/rollup'
// /Users/loco/dev/CushyStudio/src/scripts/node_modules/.bin/rollup -c /Users/loco/dev/CushyStudio/src/controls/Builder.loco.rollup.config.mjs
//`'${rollupRoot}/node_modules/.bin/rollup'`
console.log(` `)
const rollupCmd = [rollupBin, `-c '${ROLLUP_CONFIG_ABSPATH}'`].join(' ')
console.log(`executing comand:  ${chalk.yellowBright(rollupCmd)}`)
execSync(rollupCmd, { stdio: 'inherit' /* cwd: rollupRoot */ })
mkdirSync(`${DIST_RELPATH}/dts`, { recursive: true })
const rollupStatsPath = `${DIST_ABSPATH}/dts/main.d.rollup-stats.json`
renameSync(`stats.json`, rollupStatsPath)
// execSync('yarn form:bundle-dts', { stdio: 'inherit' })
// await waitConfirm()

// node allowed -------------------------------------------------------
section(`7. analysing rollup types`)
const json = readJSONSync(rollupStatsPath)
type Meta = {
    id: string
    imported: { uid: string }[]
    importedBy: { uid: string }[]
}
const nodeMetas: { [key: string]: Meta } = json.nodeMetas
const fileIndex = new Map<UID, Meta>()
// indexing files by UID
for (const [uid, meta] of Object.entries(nodeMetas)) {
    fileIndex.set(uid, meta)
}
// final file infos ------------------------------------------------
const fileInfos = new Map<PATH, { importedBy: PATH[]; imports: PATH[] }>()
for (const e of Object.entries(nodeMetas)) {
    const [uid, meta] = e
    const path = meta.id
    fileInfos.set(path, {
        importedBy: meta.importedBy.map((x) => fileIndex.get(x.uid)!.id),
        imports: meta.imported.map((x) => fileIndex.get(x.uid)!.id),
    })
}

const whitelist: string[] = [
    // 🔴 FIXME 👇
    'src/controls/FormSerial',
    'src/controls/IBuilder',
    'src/controls/ISpec',
    'src/controls/shared/CushyKit',
    'src/controls/fields/size/WidgetSizeTypes',
    'src/llm/OpenRouter_models',
    'src/rsuite/RsuiteTypes',
    'src/rsuite/reveal/RevealProps',
]

function emojiLogic(x: string): string {
    if (jsModuleInBundle.has(x)) return '🟢'
    if (whitelist.includes(x)) return '🟡'
    if (!x.startsWith('src/')) return '🔵'
    return '🔴'
}

append(`\n\nTYPES:`)
const unwanted: string[] = []
let visited = 1 // the <...>.LIBRARY
const entriesSorted = [...fileInfos.entries()].toSorted((a, b) => a[0].localeCompare(b[0]))
for (const [dtsPath, fi] of entriesSorted) {
    const base = mapPathToModule(dtsPath)
    console.log(`${emojiLogic(base)} ${base}`)
    if (!jsModuleInBundle.has(base)) {
        unwanted.push(dtsPath)
        continue
    }

    visited++
    const emoji = emojiLogic(base) // allowed.has(base) ? '🟢' : '🔴'
    append(`    [${emoji}]: ${base}       (from ${fi.importedBy} files)`)
    for (const ip of fi.imports) {
        const finalPath = mapPathToModule(ip)
        const emojiDep = emojiLogic(finalPath) //  allowed.has(finalPath) ? '🟢' : '🔴'
        append(`        [${emojiDep}]: ${finalPath}`)
    }
}

append(`\n\n❌ POSSIBLY UNWANTED FILES IN DTS:`)
const unwantedSorted = unwanted.toSorted()
const unwantedSet = new Set(unwantedSorted)
for (const u of unwantedSorted) {
    // ------------
    const fileInSrcWithoutExt = mapPathToModule(u)
    let fileInSrcWithExt_ts = fileInSrcWithoutExt + '.ts'
    const fileInSrcWithExt_ts_exists = existsSync(fileInSrcWithExt_ts)
    if (fileInSrcWithExt_ts_exists) cpSync(fileInSrcWithExt_ts, `${DIST_RELPATH}/${fileInSrcWithExt_ts}`)

    let fileInSrcWithExt_tsx = fileInSrcWithoutExt + '.tsx'
    const fileInSrcWithExt_tsx_exists = existsSync(fileInSrcWithExt_tsx)
    if (fileInSrcWithExt_tsx_exists) cpSync(fileInSrcWithExt_tsx, `${DIST_RELPATH}/${fileInSrcWithExt_tsx}`)

    if (!fileInSrcWithExt_ts_exists && !fileInSrcWithExt_tsx_exists) {
        console.log(`🔴 ERROR: neither ${fileInSrcWithExt_ts} nor ${fileInSrcWithExt_tsx} exist; skipping COPY.`)
    }
    // const fileWithExt = existsSync(fileInSrcWithoutExt + '.ts') ? fileInSrcWithoutExt + '.ts' : fileInSrcWithoutExt + '.tsx'
    // ------------
    let x = bang(fileInfos.get(u))
    append(`    ${emojiLogic(mapPathToModule(u))} ${mapPathToModule(u)} (${u})`)
    const stack = []
    for (let i = 0; i < 20; i++) {
        const par = x.importedBy[0]
        if (par == null) break
        const emoji = emojiLogic(mapPathToModule(par))
        stack.push(`${emoji} ${mapPathToModule(par)}`)
        // append(`        - ${par}`)
        x = bang(fileInfos.get(par))
    }

    append(`       <- ${stack.join('\n       <- ')}`)
    // for (const ib of x.importedBy.toSorted()) {
    //     append(`        - ${ib}`)
    // }
}

if (visited !== jsModuleInBundle.size) {
    append(`[🔴] some files are not visited (allowed: ${jsModuleInBundle.size}, visited: ${visited})`)
    console.error(`🔴 WARNING: some files are not visited (allowed: ${jsModuleInBundle.size}, visited: ${visited})`)
} else {
    append(`[🟢] all JS files are also present in the bundled DTS`)
}

writeFileSync(resolve(DIST_RELPATH, 'SUMMARY.txt'), out)
execSync(`code ${DIST_RELPATH}/SUMMARY.txt`)

console.log(`[🟢] SUCCESS`)
