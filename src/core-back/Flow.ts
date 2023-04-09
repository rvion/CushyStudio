import type { CushyFile } from '../shell/itest/CushyFile'
import type { RunMode } from '../core-shared/Graph'

import * as vscode from 'vscode'
import { loggerExt } from '../logger/LoggerExtension'
import { transpileCode } from './transpiler'
import { FlowExecution } from './FlowExecution'

/**
 * a thin wrapper around a single (work)flow somewhere in a .cushy.ts file
 * flow = the `WORFLOW(...)` part of a file
 * */
export class Flow {
    constructor(
        //
        public file: CushyFile,
        public range: vscode.Range,
        public flowName: string,
        public generation: number,
    ) {}

    run = async (
        //
        item: vscode.TestItem,
        options: vscode.TestRun,
        mode: RunMode = 'real',
    ): Promise<boolean> => {
        const start = Date.now()

        loggerExt.info('🔥', '❓ running some flow')
        // this.focusedProject = this
        // ensure we have some code to run
        // this.scriptBuffer.codeJS
        // get the content of the current editor

        // const activeTextEditor = vscode.window.activeTextEditor
        // if (activeTextEditor == null) {
        //     logger.info('🔥', '❌ no active editor')
        //     return false
        // }
        // const activeDocument = activeTextEditor.document
        // const activeURI = activeDocument.uri
        // logger.info('🔥', activeURI.toString())
        const codeTS = this.file.CONTENT
        loggerExt.info('🔥', codeTS.slice(0, 1000) + '...')
        const codeJS = await transpileCode(codeTS)
        // logger.info('🔥', codeJS.slice(0, 1000) + '...')
        loggerExt.info('🔥', codeJS + '...')
        if (codeJS == null) {
            loggerExt.info('🔥', '❌ no code to run')
            return false
        }
        // check if we're in "MOCK" mode
        const opts = mode === 'fake' ? { mock: true } : undefined
        const execution = new FlowExecution(this.file.workspace, this.file.uri, opts)
        // await execution.save()
        // write the code to a file
        // this.runs.unshift(execution)

        // try {
        const ProjectScriptFn = new Function('WORKFLOW', codeJS)
        const graph = execution.graph

        // graph.runningMode = mode
        // this.MAIN = graph

        const WORKFLOW = (name: string, fn: any) => {
            loggerExt.info('🌠', `running WORKFLOW ${name}`)
            fn(graph)
        }

        try {
            await ProjectScriptFn(WORKFLOW)
            console.log('[✅] RUN SUCCESS')
            // this.isRunning = false
            const duration = Date.now() - start
            options.passed(item, duration)
            return true
        } catch (error) {
            console.log(error)
            loggerExt.error('🌠', (error as any as Error).name)
            loggerExt.error('🌠', (error as any as Error).message)
            loggerExt.error('🌠', 'RUN FAILURE')
            const message = new vscode.TestMessage(
                new vscode.MarkdownString().appendMarkdown(`### Expected ${item.label}`),
                // .appendCodeblock(String(this.expected), 'text'),
            )
            message.location = new vscode.Location(item.uri!, item.range!)
            const duration = Date.now() - start
            options.failed(item, message, duration)
            return false
        }
    }

    // private evaluate() {
    //     return 3
    // }
}
