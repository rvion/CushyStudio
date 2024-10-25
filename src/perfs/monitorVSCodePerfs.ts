import type { TsDiagnostic } from './TsDiagnostic'

// TODO: import that
import arg from 'arg'
import chalk from 'chalk'
import { spawn } from 'child_process'
import * as fs from 'fs'
import path from 'path'

const args = arg({
   '--trace-file': String,
   '-t': '--trace-file',

   '--clean-traces': Boolean,
   '-c': '--clean-traces',
})

const codeLogsDir = path.join(process.env.HOME!, 'Library/Application Support/Code/logs')
if (!fs.existsSync(codeLogsDir)) throw new Error('❌ no VSCode logs directory found')

ensureTraceIsEnabled()

const options = {
   traceFile: args['--trace-file'] ?? findBestTraceFile(),
   cleanTraces: args['--clean-traces'] ?? false,
}

if (options.cleanTraces) {
   console.log('🧹 cleaning traces...')
   for (const file of allTraceFiles()) fs.unlinkSync(file)
   process.exit(0)
}

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

// e.g. '/Users/globi/Library/Application Support/Code/logs/20240415T115212/window2/exthost/vscode.typescript-language-features/tsserver-log-5mLfBS'
const tracePath = options.traceFile

const foreverRead = spawn('tail', ['-f', tracePath], { stdio: 'pipe' })
let content = ''

foreverRead.stdout.on('data', (chunk) => {
   const utf8 = chunk.toString('utf-8')
   content += utf8
   let isCompleting = false
   const processLine = (line: string) => {
      try {
         const x: TsDiagnostic = JSON.parse(line.endsWith(',') ? line.slice(0, -1) : line)
         // console.log('⏰', JSON.stringify(x), chalk.gray.italic(`(${content.length})`))

         // ------------------------------------------------------------------------------------------------------------------
         void DEBUG_EV(x)

         // ------------------------------------------------------------------------------------------------------------------
         if (x.name === 'request' && x.args.command === 'completionInfo') {
            isCompleting = true
            PENDING_DIAGNOSTIC.uid = x.args.seq
            PENDING_DIAGNOSTIC.lines = []
            PENDING_DIAGNOSTIC.start = process.hrtime.bigint()
            return
         }
         if (x.name === 'response' && x.args.command === 'completionInfo') {
            isCompleting = false
            const ms = Number(process.hrtime.bigint() - PENDING_DIAGNOSTIC.start) / 1_000_000
            console.log(`    | [🔥] COMPLETION [${chalk.bold.bgYellow(ms.toFixed(2))}ms]`) // debug
            if (PENDING_DIAGNOSTIC.uid !== x.args.seq) throw new Error('❌ seq mismatch')
            void processRequest(PENDING_DIAGNOSTIC.lines)
            return
         }

         PENDING_DIAGNOSTIC.lines.push(x)
         // ⏸️ process.stdout.write('.')
         // ⏸️ process.stdout.write(x.name + ',')
         // ⏸️ console.log('🟢', JSON.stringify(x), chalk.gray.italic(`(${content.length})`))
      } catch (e) {
         console.log(`    | [❌] line:`, line)
         console.log(`    | [❌] error`, e)
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

const readFile = (path: string) => {
   // if (fileCache.has(path)) return fileCache.get(path)!
   const content = fs.readFileSync(path, 'utf-8')
   // fileCache.set(path, content)
   return content
}

/** generate a nice diagnostic */
export const processRequest = (JSONS: TsDiagnostic[]) => {
   console.log(`    | ${JSONS.length} events received`)
   console.log(
      `    | ` +
         JSONS.map(
            (i) =>
               (i.name === 'checkExpression' ? chalk.underline(i.name) : i.name) + //
               (i.dur != null ? `(${(i.dur! / 1000).toFixed(1)})` : null),
         ).join(', '),
   )
   // console.log(`ev0 = ${JSON.stringify(JSONS[0])}`)
   const totalTimePerFile = new Map<string, { min: number; max: number; total: number }>()
   const fileCache = new Map<string, string>()
   // fileCach.

   // track files
   for (const x of JSONS) {
      if (x.name === 'checkExpression' || x.name === 'checkVariableDeclaration') {
         // time per file ------------------------------
         const prev = totalTimePerFile.get(x.args.path) ?? { min: Infinity, max: -Infinity, total: 0 }
         totalTimePerFile.set(x.args.path, {
            min: Math.min(prev.min, x.dur),
            max: Math.max(prev.max, x.dur),
            total: prev.total + x.dur,
         })
      }
   }

   for (const x of JSONS) DEBUG_EV(x)

   //    console.log(`[🤠] totalTime for the ${checkExpressionProcessed} checkExpression processed:`)
   const sorted = [...totalTimePerFile.entries()].sort((a, b) => b[1].max - a[1].max)
   for (const [k, v] of sorted) {
      const timeMS = v.max / 1000
      console.log(`    | COMPLETION MAX: ${timeMS.toFixed(2).padStart(10)} ${k}`)
   }
}

export const withGutter = (code: string) => {
   const rawLines = code.split('\n')
   const nonEmptyFirstLineIdx = rawLines.findIndex((l) => l.trim().length > 0)
   const lines = rawLines.slice(nonEmptyFirstLineIdx === -1 ? 0 : nonEmptyFirstLineIdx)
   return lines
      .map((line, i) => `    | ${(i + 1).toString().padStart(lines.length.toString().length)} | ${line}`)
      .join('\n')
}

function DEBUG_EV(x: TsDiagnostic) {
   const longThreshold = 50_000
   const maxSeverity = 20

   const dur = x.dur ?? 0
   const isLongEvent = dur > longThreshold
   if (isLongEvent) {
      const severity = Math.ceil(dur / longThreshold)
      const aboveMaxSeverity = severity > maxSeverity
      const severityString = '🐌'.repeat(Math.min(severity, maxSeverity)) + (aboveMaxSeverity ? '💥' : '')
      const ms = (dur / 1_000).toFixed(1).padStart(6)
      const nameColor = x.name.split('').reduce((acc, x) => acc + x.charCodeAt(0), 0) % 256
      const name = chalk.ansi256(nameColor)(x.name.padEnd(20))
      const orange = chalk.bgRgb(255, 165, 0)

      console.log(`    | ${orange('Long event')} (${chalk.bold(ms)} ms) ${name} [${severityString}]`)
   }

   let checkExpressionProcessed = 0
   if (x.name === 'checkExpression' || x.name === 'checkVariableDeclaration') {
      checkExpressionProcessed++
      if (isLongEvent) {
         const code = readFile(x.args.path)
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

         const chunkBefore = code.slice(startCharPos, x.args.pos)
         const chunkDiagnosed = code.slice(x.args.pos, x.args.end)
         const chunkAfter = code.slice(x.args.end, endPos)
         const out = [chunkBefore, chalk.cyan(chunkDiagnosed), chunkAfter].join('')

         const line = code.slice(0, x.args.pos).split('\n').length
         const pathLink = x.args.path.replace(/^(.*?)\/src\//, 'src/') + ':' + line
         const timing = `(${(x.dur / 1000).toFixed(1)} ms)`

         console.log('    | 👉', chalk.underline(pathLink), chalk.bold(timing))
         console.log(withGutter(out))
         console.log(`    | ${'─'.repeat(80)}`)
      }
   }
}

function lastModifiedPath(dir: string, ty: 'file' | 'dir'): string | null {
   const [entry, ...rest] = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((x) => (ty === 'dir' ? x.isDirectory() : ty === 'file' ? x.isFile() : false))
   if (entry == null) return null

   let lastModified = { entry, stats: fs.statSync(path.join(dir, entry.name)) }
   for (const entry of rest) {
      const stats = fs.statSync(path.join(dir, entry.name))
      if (stats.atimeMs > lastModified.stats.atimeMs) lastModified = { entry, stats }
   }

   return path.join(dir, lastModified.entry.name)
}

function findBestTraceFile(): string {
   const allFiles = [...allTraceFiles()]
   const [file, ...rest] = allFiles
   if (file == null) throw new Error('❌ no trace file found')

   let bestTraceFile = file
   let lastestTime = fs.statSync(file).mtimeMs
   for (const file of rest) {
      const stats = fs.statSync(file)
      if (stats.mtimeMs > lastestTime) {
         bestTraceFile = file
         lastestTime = stats.mtimeMs
      }
   }

   console.log('🔥 best trace file:', bestTraceFile)
   console.log('If it is not the right one, you can manually use one of the following:')
   console.log('\t' + allFiles.map((f) => f.replace(codeLogsDir, '')).join('\n\t'))

   return bestTraceFile
}

function* allTraceFiles(): Generator<string> {
   for (const entry of fs.readdirSync(codeLogsDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const logDir = path.join(codeLogsDir, entry.name)
      for (const entry of fs.readdirSync(logDir, { withFileTypes: true })) {
         if (!entry.isDirectory()) continue
         const lspDir = path.join(logDir, entry.name, 'exthost/vscode.typescript-language-features')
         if (!fs.existsSync(lspDir)) continue
         for (const entry of fs.readdirSync(lspDir, { withFileTypes: true })) {
            if (!entry.isDirectory()) continue
            const traceDir = path.join(lspDir, entry.name)
            const traceFile = lastModifiedPath(traceDir, 'file')
            if (traceFile != null && traceFile.endsWith('.json')) yield traceFile
         }
      }
   }
}

function ensureTraceIsEnabled() {
   const settingsPath = '.vscode/settings.json'
   const settings = fs.readFileSync(settingsPath, 'utf-8')

   const lines = settings.split('\n')
   const tsServerLineIdx = lines.findIndex((line) => line.includes('typescript.tsserver.enableTracing'))
   if (tsServerLineIdx === -1)
      throw new Error('❌ Missing "typescript.tsserver.enableTracing" in settings.json')
   const tsServerLine = lines[tsServerLineIdx]!.trim()
   if (tsServerLine.startsWith('//') || !tsServerLine.includes('true')) {
      console.log(`❌ tracing is not enabled -> go to ${settingsPath}:${tsServerLineIdx + 1}`)
      process.exit(0)
   }
}
