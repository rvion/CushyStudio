import chalk from 'chalk'
import cp, { spawn } from 'child_process'
import { readFileSync, rmSync } from 'fs'
import { resolve } from 'path'
import { cwd } from 'process'

export type TsDiagnosticCmd = 'documentHighlights' | 'updateOpen' | 'completionInfo'

// https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview
// > There is an extra parameter dur to specify the tracing clock duration of complete
// > events in microseconds. All other parameters are the same as in duration events.
// > The ts parameter indicate the time of the start of the complete event.
// > Unlike duration events, the timestamps of complete events can be in any order.

// prettier-ignore
export type TsDiagnostic =
    | {
        pid: number,
        tid: number,
        ph: 'I' | 'B' | 'E' | 'X',
        ts: number,
        dur?: number
    } &({  cat: 'session', name: 'request'                        , s: 'g', args: { seq: number, command: TsDiagnosticCmd, }
    } | {  cat: 'session', name: 'response'                       , s: 'g', args: { seq: number, command: TsDiagnosticCmd, success: boolean }
    } | {  cat: 'session', name: 'executeCommand'                 , args: { seq: number, command: string, }
    } | {  cat: 'program', name: 'tryReuseStructureFromOldProgram', dur: number, args: Record<string, never>
    } | {  cat: 'session', name: 'updateGraph'                    , dur: number, args: { name: string, kind: 'Configured' }
    } | {  cat: 'program', name: 'createProgram'                  , args: { configFilePath: string, }
    } | {  cat: 'bind',    name: 'bindSourceFile'                 , args: any, // {path: any},
    } | {  cat: 'check',   name: 'checkExpression'                , dur: number, args: { kind: number, pos: number, end:number, path: string}
    } | {  cat: 'session', name: 'documentRegistryBucketOverlap'  , s:'g', args: { path: string, key1: string, key2:string}
    })

// POOL
const PENDING_DIAGNOSTIC: {
    uid: number
    lines: TsDiagnostic[]
    start: bigint
} = {
    uid: 0,
    lines: [],
    start: BigInt(0),
}

// PROCESS DIAGNOSTIC FILE ----------------
const tracePath = '/Users/loco/Library/Application Support/Code/logs/20240408T110236/window1/exthost/vscode.typescript-language-features/tsserver-log-WNRLpY/trace.8701.json' // prettier-ignore
const foreverRead = spawn('tail', ['-f', tracePath], { stdio: 'pipe' })
let content = ''

foreverRead.stdout.on('data', (chunk) => {
    const utf8 = chunk.toString('utf-8')
    content += utf8
    const processLine = (line: string) => {
        try {
            const x: TsDiagnostic = JSON.parse(line.endsWith(',') ? line.slice(0, -1) : line)
            if (x.name === 'request' && x.args.command === 'completionInfo') {
                console.log()
                PENDING_DIAGNOSTIC.uid = x.args.seq
                PENDING_DIAGNOSTIC.lines = []
                PENDING_DIAGNOSTIC.start = process.hrtime.bigint()

                return
            }
            if (x.name === 'response' && x.args.command === 'completionInfo') {
                const ms = Number(process.hrtime.bigint() - PENDING_DIAGNOSTIC.start) / 1_000_000
                console.log(`\n[🔥] COMPLETION [${chalk.bold.bgYellow(ms.toFixed(2))}ms]`) // debug
                if (PENDING_DIAGNOSTIC.uid !== x.args.seq) throw new Error('❌ seq mismatch')
                void processRequest(PENDING_DIAGNOSTIC.lines)
                return
            }

            PENDING_DIAGNOSTIC.lines.push(x)
            // ⏸️ process.stdout.write('.')
            // ⏸️ process.stdout.write(x.name + ',')
            // ⏸️ console.log('🟢', JSON.stringify(x), chalk.gray.italic(`(${content.length})`))
        } catch (e) {
            console.log(`[❌] line:`, line)
            console.log(`[❌] error`, e)
        }
    }

    const consumeFullLine = (): boolean => {
        const hasNewLine = content.indexOf('\n')
        if (hasNewLine === -1) return false
        const line = content.slice(0, hasNewLine)
        content = content.slice(hasNewLine + 1)
        processLine(line)
        return true
    }

    while (consumeFullLine());
})

const CREATE_VIDEO = false

/** generate a nice diagnostic */
export const processRequest = async (
    //
    JSONS: TsDiagnostic[],
) => {
    // const x = { a: { b: 1 } }
    // const b = x.a.
    console.log(`[🤠] ${JSONS.length} events received`)
    console.log(
        JSONS.map(
            (i) =>
                (i.name === 'checkExpression' ? chalk.underline(i.name) : i.name) + //
                (i.dur ? `(${(i.dur! / 1000).toFixed(1)})` : null),
        ).join(', '),
    )
    // console.log(`ev0 = ${JSON.stringify(JSONS[0])}`)
    const totalTimePerFile = new Map<string, { min: number; max: number; total: number }>()
    const fileCache = new Map<string, string>()
    // fileCach.
    const readFile = (path: string) => {
        if (fileCache.has(path)) return fileCache.get(path)!
        const content = readFileSync(path, 'utf-8')
        // fileCache.set(path, content)
        return content
    }

    // track files
    for (const x of JSONS) {
        if (x.name === 'checkExpression') {
            // time per file ------------------------------
            const prev = totalTimePerFile.get(x.args.path) ?? { min: Infinity, max: -Infinity, total: 0 }
            totalTimePerFile.set(x.args.path, {
                min: Math.min(prev.min, x.dur),
                max: Math.max(prev.max, x.dur),
                total: prev.total + x.dur,
            })
        }
    }

    // list of whitelisted files
    const whiltelistedFiels = new Set<string>([
        // those files will trigger video creation
        // '/users/loco/dev/cushystudio/library/built-in/cushydiffusion.ts',
        '/users/loco/dev/cushystudio/src/runtime/runtime.ts',
        '/users/loco/dev/cushystudio/src/controls/formbuilder.ts',
    ])

    let ix = 0
    let checkExpressionProcessed = 0
    const frames: string[] = []
    for (const x of JSONS) {
        if (x.name === 'checkExpression') {
            checkExpressionProcessed++
            // ------------------------------
            const timeInFile = totalTimePerFile.get(x.args.path)!
            const ratioInFile = x.dur / timeInFile.total
            const ratioToMax = x.dur / timeInFile.max
            // -----------------------------
            // time in "/users/loco/dev/cushystudio/library/built-in/cushydiffusion.ts"
            if (whiltelistedFiels.has(x.args.path)) {
                const code = readFile(x.args.path)
                // const col = chalk.bgHsl(0, 100, ratioToMax / 2)
                const colIX =
                    ratioToMax === 1 //
                        ? ANSI256_red_to_green.length - 1
                        : Math.floor(ratioToMax * ANSI256_red_to_green.length)
                const colX = ANSI256_red_to_green[colIX]!
                // console.log(`[🤠] colX`, colX, ratioToMax, x.dur, timeInFile.max)
                const col = chalk.bgAnsi256(colX)

                // -----------
                let startCharPos = x.args.pos
                while (code[startCharPos] !== '\n' && startCharPos > 0) startCharPos--
                startCharPos--
                while (code[startCharPos] !== '\n' && startCharPos > 0) startCharPos--
                // -----------
                let endPos = x.args.end
                while (code[endPos] !== '\n' && endPos < code.length) endPos++
                endPos++
                while (code[endPos] !== '\n' && endPos < code.length) endPos++

                let out = [
                    // code.slice(0, x.args.pos),
                    // col(code.slice(x.args.pos, x.args.end)),
                    // code.slice(x.args.end),
                    code.slice(startCharPos, x.args.pos),
                    col(code.slice(x.args.pos, x.args.end)),
                    code.slice(x.args.end, endPos),
                ].join('')
                const { wrapBox, withGutter } = await import('../manager/_utils/_wrapBox')
                // console.log(wrapBox(out, Infinity))
                console.log('\n👉', x.args.path, `(${(x.dur / 1000).toFixed(1)}ms)`)
                console.log(withGutter(out))

                if (CREATE_VIDEO) {
                    // console.log(`[🤠] out\n` + out)
                    const targetFile = `anim/test-${ix++}.png`
                    frames.push(targetFile)

                    console.log(`[🤠] creating image ${ix}: ${resolve(`anim/test-${ix++}.png`)}`)
                    cp.spawnSync('/Users/loco/Downloads/textimage', ['-o', targetFile], {
                        input: out,
                    })
                }
            }
        }
    }
    // create video if frames ready
    if (frames.length > 0) {
        rmSync('anim/test.mp4', { recursive: true, force: true })
        const { createMP4FromImages } = await import('../utils/ffmpeg/ffmpegScripts')
        void createMP4FromImages(frames, 'anim/test.mp4', 10, cwd())
    }

    console.log(`[🤠] totalTime for the ${checkExpressionProcessed} checkExpression processed:`)
    const sorted = [...totalTimePerFile.entries()].sort((a, b) => b[1].max - a[1].max)
    for (const [k, v] of sorted) {
        const timeMS = v.max / 1000
        console.log(`[🤠] ${timeMS.toFixed(2).padStart(10)} ${k}`)
    }
}

const ANSI256_red_to_green = [
    196, 189, 181, 174, 166, 159, 151, 144, 136, 129, 121, 114, 106, 99, 91, 84, 76, 69, 61, 54, 46,
].reverse()
