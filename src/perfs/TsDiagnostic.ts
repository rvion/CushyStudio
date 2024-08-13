export type TsDiagnosticCmd = 'documentHighlights' | 'updateOpen' | 'completionInfo'

// https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview
// > There is an extra parameter dur to specify the tracing clock duration of complete
// > events in microseconds. All other parameters are the same as in duration events.
// > The ts parameter indicate the time of the start of the complete event.
// > Unlike duration events, the timestamps of complete events can be in any order.

export type TsDiagnostic = {
   pid: number
   tid: number
   ph: 'I' | 'B' | 'E' | 'X'
   ts: number
   dur?: number
} & (
   | { cat: 'session'; name: 'request'; s: 'g'; args: { seq: number; command: TsDiagnosticCmd } }
   | {
        cat: 'session'
        name: 'response'
        s: 'g'
        args: { seq: number; command: TsDiagnosticCmd; success: boolean }
     }
   | { cat: 'session'; name: 'executeCommand'; args: { seq: number; command: string } }
   | {
        cat: 'program'
        name: 'tryReuseStructureFromOldProgram'
        dur: number
        args: Record<string, never>
     }
   | { cat: 'session'; name: 'updateGraph'; dur: number; args: { name: string; kind: 'Configured' } }
   | { cat: 'program'; name: 'createProgram'; args: { configFilePath: string } }
   | {
        cat: 'bind'
        name: 'bindSourceFile'
        args: any // {path: any},
     }
   | {
        cat: 'check'
        name: 'checkExpression'
        dur: number
        args: { kind: number; pos: number; end: number; path: string }
     }
   | {
        cat: 'check'
        name: 'checkVariableDeclaration'
        dur: number
        args: { kind: number; pos: number; end: number; path: string }
     }
   | {
        cat: 'session'
        name: 'documentRegistryBucketOverlap'
        s: 'g'
        args: { path: string; key1: string; key2: string }
     }
)
