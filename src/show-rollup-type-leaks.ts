import type { Metafile } from 'esbuild'

import chalk from 'chalk'
import { execSync } from 'child_process'
import { cpSync, mkdirSync, renameSync, statSync, unlinkSync, writeFileSync } from 'fs'
import { readJSONSync } from 'fs-extra'
import { dirname, join, resolve } from 'path'

import { formatSize } from './db/getDBStats'
import { wrapBox } from './manager/_utils/_wrapBox'
import { buildJS } from './scripts/build-form-JS'
import { bang } from './utils/misc/bang'

// TYPE UTILS ------------------------------------------------
type PATH = Tagged<string, 'PATH'>
type UID = Tagged<string, 'UID'>

// SUMMARY ---------------------------------------------------
// buffer to accumulate logs
// so we can review what this script did
let out = ''
const append = (x: string) => (out += x + '\n')

const ENTRYPOINT = 'src/controls/FormBuilder.loco.ts'
const DIST_RELPATH = 'release-forms'
const DIST_ABSPATH = resolve('release-forms')

section(`0. preparing`)
objective(`ensure dist folder is present, with the bare minimum stuff inside`)
explainTool('bun script')
console.log(`- create ${chalk.underline(`./${DIST_RELPATH}/`)} folder`)
mkdirSync(DIST_RELPATH, { recursive: true })
console.log(`- (re)generating ${chalk.underline(`./${DIST_RELPATH}/package.json`)}`)
writeFileSync(resolve(DIST_ABSPATH, 'package.json'), mkPKGJSON('cushy-forms'))
console.log(`- ensure custom jsx-runtime will be found`)
mkdirSync('lib/utils/custom-jsx', { recursive: true })
cpSync('src/utils/custom-jsx/jsx-runtime.js', 'lib/utils/custom-jsx/jsx-runtime.js')
cpSync('src/utils/custom-jsx/jsx-dev-runtime.js', 'lib/utils/custom-jsx/jsx-dev-runtime.js')
// writeFileSync(resolve(DIST_ABSPATH, 'package.json'), mkPKGJSON('form'))

// BUNDLE the js (from TS) ----------------------------------------------
// use esbuild, start from typescript files, do not use lib file
// should take ~ 1 sec
section(`1. first build with esbuild`)
objective(`know the list of all transitive JS files that need to be included`)
explainTool('esbuild')
const { metaFilePath } = await buildJS({
    shouldMinify: false,
    entryPoints: [ENTRYPOINT],
    outfile: 'release-forms/initial.js',
})
await showESBUILDOutput({ prefix: 'initial' })

// LIST ALL REAL JS FILES ----------------------------------------------
let allFilesWithExt: string[] = []
let allFilesNoExt: string[] = []
// let allEdges: [string, string][] = []
const allowed = new Set()
const esbuildMetafile: Metafile = readJSONSync(metaFilePath)
const esbuildMetafileInput = esbuildMetafile.inputs
const esbuildInputFiles = Object.entries(esbuildMetafileInput)
out += 'INPUT:\n'
for (const [e, v] of esbuildInputFiles) {
    if (!e.startsWith('src/')) continue
    const eNoExt = mapPathToModule(e)
    allFilesWithExt.push(e)
    allFilesNoExt.push(eNoExt)
    allowed.add(eNoExt)
    out += `    ${e} (${allowed})\n`
}

// LIST ALL REAL JS FILES ----------------------------------------------
section(`2. COPY ALL TS Files`)
objective(`create a subset of the codebase that only includes the files that are actually used`)
explainTool('bun script')
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
section(`2. REEXPORT all ${allowed.size} files from single module`)
explainTool('bun script')
let libEntrypointCode = ''
for (const srcRelPath of allFilesNoExt) {
    // const
    if (srcRelPath === 'src/utils/custom-jsx/jsx-runtime') continue
    const libRelPath = srcRelPath.replace(/^src\//, '../')
    libEntrypointCode += `export * from '${libRelPath}'\n`
}
const SRC_ENTRYPOINT_RELPATH = ENTRYPOINT.replace(/\.tsx?$/, '.LIBRARY.ts')
// const SRC_ENTRYPOINT_ABSPATH = resolve(SRC_ENTRYPOINT_RELPATH)
writeFileSync(SRC_ENTRYPOINT_RELPATH, libEntrypointCode)
console.log(`writing new entrypoint here: ${chalk.underline(SRC_ENTRYPOINT_RELPATH)}`)
const LIB_ENTRYPOINT_DTS_RELPATH = SRC_ENTRYPOINT_RELPATH.replace(/\.tsx?$/, '.d.ts').replace(/^src\//, 'lib/')
const LIB_ENTRYPOINT_DTS_ABSPATH = resolve(LIB_ENTRYPOINT_DTS_RELPATH)
console.log(`corresponding lib entrypoint: ${chalk.underline(LIB_ENTRYPOINT_DTS_RELPATH)}`)

// BUNDLE the js (from TS) ----------------------------------------------
section(`3. REBUILD from the re-exported file`)
explainTool('esbuild')
await buildJS({ shouldMinify: false, entryPoints: [SRC_ENTRYPOINT_RELPATH], outfile: 'release-forms/main.js' })
await showESBUILDOutput({ prefix: 'main' })

// --------------------------------------------------------------------
section(`4. generating DTS and JS`)
explainTool('tsc')
execSync('yarn form:transpile', { stdio: 'inherit' })
await waitConfirm()

// --------------------------------------------------------------------
console.log(`removing ➖ ${chalk.underline(SRC_ENTRYPOINT_RELPATH)}`)
unlinkSync(SRC_ENTRYPOINT_RELPATH)

// --------------------------------------------------------------------
section(`5. writing new form.rollup.config.mjs`)
explainTool('bun script')
// const ROLLUP_CONFIG_RELPATH = ENTRYPOINT.replace(/\.tsx?$/, '.rollup.config.mjs')
const ROLLUP_CONFIG_RELPATH = DIST_RELPATH + '/' + 'rollup.config.mjs' //`${cwd()}/${ROLLUP_CONFIG_RELPATH}`
const ROLLUP_CONFIG_ABSPATH = resolve(ROLLUP_CONFIG_RELPATH)
console.log(`writing rollup config here: ${chalk.underline(ROLLUP_CONFIG_RELPATH)}`)
writeFileSync(
    ROLLUP_CONFIG_RELPATH,
    `\
import { cwd } from 'process'
import { dts } from 'rollup-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'

const root = cwd()
const config = [
    {
        // input: 'lib/controls/FormBuilder.loco.d.ts',
        input: '${LIB_ENTRYPOINT_DTS_ABSPATH}',
        output: [{ file: '${DIST_ABSPATH}/main.d.ts', format: 'es' }],
        plugins: [dts(), visualizer({ template: 'raw-data' })],
    },
]

export default config
`,
)
await waitConfirm()

// --------------------------------------------------------------------
section(`6. packing types together`)
explainTool('rollup + plugin-dts + plugin-visualizer')
// const rollupRoot = `${cwd()}/src/scripts`
const rollupBin = '/Users/loco/dev/CushyStudio/src/scripts/node_modules/.bin/rollup'
// /Users/loco/dev/CushyStudio/src/scripts/node_modules/.bin/rollup -c /Users/loco/dev/CushyStudio/src/controls/FormBuilder.loco.rollup.config.mjs
//`'${rollupRoot}/node_modules/.bin/rollup'`
console.log(` `)
const rollupCmd = [rollupBin, `-c '${ROLLUP_CONFIG_ABSPATH}'`].join(' ')
console.log(`executing comand:  ${chalk.yellowBright(rollupCmd)}`)
execSync(rollupCmd, { stdio: 'inherit' /* cwd: rollupRoot */ })
const rollupStatsPath = `${DIST_ABSPATH}/main.d.rollup-stats.json`
renameSync(`stats.json`, rollupStatsPath)
// execSync('yarn form:bundle-dts', { stdio: 'inherit' })
await waitConfirm()

// node allowed -------------------------------------------------------
section(`7. analysing rollup types`)
const json = readJSONSync(rollupStatsPath)
type Meta = { id: string; imported: { uid: string }[]; importedBy: { uid: string }[] }
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
    // need fixing
    'src/controls/IWidget',
    //
    'src/rsuite/RsuiteTypes', // no direct deps
    'src/rsuite/reveal/RevealProps', // no direct deps
    'src/controls/widgets/listExt/WidgetListExt',
    'src/controls/widgets/size/WidgetSizeTypes',
    'src/llm/OpenRouter_models',
]

function emojiLogic(x: string) {
    if (allowed.has(x)) return '🟢'
    if (whitelist.includes(x)) return '🟡'
    if (!x.startsWith('src/')) return '🔵'
    return '🔴'
}

append(`\n\nTYPES:`)
const unwanted: string[] = []
let visited = 0
for (const [k, fi] of fileInfos.entries()) {
    // base
    const base = mapPathToModule(k)
    // console.log(`${allowed.has(base) ? '✅' : '❌'} allowed.has(${base})`)
    console.log(`${emojiLogic(base)} ${base}`)
    // append(`[X] allowed.has(${base}) = ${allowed.has(base)} FROM ${fi.importedBy}`)
    // if (base === 'src/controls/widgets/choices/WidgetChoicesUI') {
    //     console.log(`[🤠] 🔴:`, allowed.has(base))
    // }
    if (!allowed.has(base)) {
        unwanted.push(k)
        continue
    }

    visited++
    const emoji = emojiLogic(base) // allowed.has(base) ? '🟢' : '🔴'
    append(`    [${emoji}]: ${base}       (from ${fi.importedBy} files)`)
    // imports
    for (const ip of fi.imports) {
        const finalPath = mapPathToModule(ip)
        const emojiDep = emojiLogic(finalPath) //  allowed.has(finalPath) ? '🟢' : '🔴'
        append(`        [${emojiDep}]: ${finalPath}`)
    }
}

append(`\n\n❌ POSSIBLY UNWANTED FILES IN DTS:`)
for (const u of unwanted) {
    const x = bang(fileInfos.get(u))
    append(`    ❌ ${u}`)
    for (const ib of x.importedBy) {
        append(`        - ${ib}`)
    }
}

writeFileSync(resolve(DIST_RELPATH, 'SUMMARY.txt'), out)
if (visited !== allowed.size) {
    append(`[🔴] some files are not visited (allowed: ${allowed.size}, visited: ${visited})`)
    console.error(`🔴 WARNING: some files are not visited (allowed: ${allowed.size}, visited: ${visited})`)
} else {
    append(`[🟢] all JS files are also present in the bundled DTS`)
}
// console.log(`[🤠] files:`, allFiles.slice(0, 10), '...')

// UTILS ------------------------------------------
// function walk(dir: string) {
//     const entries = readdirSync(dir)
//     for (const e of entries) {
//         const path = `${dir}/${e}`
//         const isFile = statSync(path).isFile()
//         if (isFile) {
//             allFiles.push(path)
//         } else {
//             walk(path)
//         }
//     }
// }

function mapPathToModule(k: string) {
    return k
        .replace(/^\/lib\//, 'src/') //
        .replace(/\.d?\.?tsx?$/, '')
        .replace(/\.js$/, '')
}

function waitConfirm() {
    return
    const readline = require('readline')
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
    return new Promise((res) => {
        rl.question('Press any key to continue', () => {
            rl.close()
            res(null)
        })
    })
}

function explainTool(x: string) {
    console.log(`tool: ${chalk.yellowBright(x)}`)
}

function objective(x: string) {
    console.log(chalk.gray.italic(`objective: ${x}`))
}

function section(x: string) {
    console.log('\n' + wrapBox(x, 1, chalk.bold.cyan))
    // console.log(`\n${chalk.bold.blue(x)} -----------------------------------------`)
}

async function showESBUILDOutput(p: { prefix: string }) {
    // const files = readdirSync('release-forms')
    for (const f of [p.prefix + '.js', p.prefix + '.meta.json']) {
        const size = statSync(join('release-forms', f)).size
        console.log(`${f}: ${formatSize(size)} bytes`)
    }
    await waitConfirm()
}

function mkPKGJSON(name: string) {
    return `\
{
    "name": "${name}",
    "version": "0.0.${Date.now()}",
    "author": {
        "name": "rvion",
        "url": "https://github.com/rvion/CushyStudio",
        "email": "vion.remi@gmail.com"
    },
    "icon": "../public/CushyLogo.png",
    "publisher": "rvion",
    "repository": {
        "type": "git",
        "url": "https://github.com/rvion/CushyStudio"
    },
    "description": "TODO",
    "license": "AGPL-3.0",
    "categories": [
        "Other"
    ],
    "main": "./main.js",
    "types": "./main.d.ts",
    "scripts": {},
    "devDependencies": {
        "rollup": "^4.13.0",
        "rollup-plugin-dts": "^6.1.0"
    }
}
`
}
