import type { CushyFile } from './CushyFile'
import type { RunMode } from '../../core/Graph'

import * as vscode from 'vscode'
import { logger } from '../../logger/Logger'
import { transpileCode } from '../../core/transpiler'

/** a thin wrapper around a workflow somewhere in a CushyFile */
export class CushyFlow {
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

        logger.info('🔥', '❓ HELLO super12')
        // this.focusedProject = this
        // ensure we have some code to run
        // this.scriptBuffer.codeJS
        // get the content of the current editor

        const activeTextEditor = vscode.window.activeTextEditor
        if (activeTextEditor == null) {
            logger.info('🔥', '❌ no active editor')
            return false
        }
        const activeDocument = activeTextEditor.document
        const activeURI = activeDocument.uri
        logger.info('🔥', activeURI.toString())
        const codeTS = activeDocument.getText() ?? ''
        logger.info('🔥', codeTS.slice(0, 1000) + '...')
        const codeJS = await transpileCode(codeTS)
        // logger.info('🔥', codeJS.slice(0, 1000) + '...')
        logger.info('🔥', codeJS + '...')
        if (codeJS == null) {
            logger.info('🔥', '❌ no code to run')
            return false
        }
        // check if we're in "MOCK" mode
        const opts = mode === 'fake' ? { mock: true } : undefined
        const execution = new Run(this, activeURI, opts)
        await execution.save()
        // write the code to a file
        this.runs.unshift(execution)

        // try {
        const ProjectScriptFn = new Function('WORKFLOW', codeJS)
        const graph = execution.graph

        // graph.runningMode = mode
        // this.MAIN = graph

        const WORKFLOW = (fn: any) => fn(graph)

        try {
            await ProjectScriptFn(WORKFLOW)
            console.log('[✅] RUN SUCCESS')
            // this.isRunning = false
            const duration = Date.now() - start
            options.passed(item, duration)
            return true
        } catch (error) {
            console.log(error)
            logger.error('🌠', (error as any as Error).name)
            logger.error('🌠', (error as any as Error).message)
            logger.error('🌠', 'RUN FAILURE')
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
