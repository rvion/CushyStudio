import type { Graph, RunMode } from '../core-shared/Graph'
import type { CushyFile } from './CushyFile'

import * as vscode from 'vscode'
import { FlowRun } from './FlowRun'
import { transpileCode } from './transpiler'
import { logger } from '../logger/logger'

/**
 * a thin wrapper around a single (work)flow somewhere in a .cushy.ts file
 * flow = the 'WORFLOW(...)' part of a file
 * */
export class FlowDefinition {
    constructor(
        //
        public file: CushyFile,
        public range: vscode.Range,
        public flowName: string,
        public generation: number,
    ) {}

    run = async (
        //
        vsTestItem: vscode.TestItem,
        vsTestRun: vscode.TestRun,
        mode: RunMode = 'real',
    ): Promise<boolean> => {
        const start = Date.now()

        // FrontManager.send({ type: 'schema', schema: this.file.workspace.schema.spec })

        logger().info('❓ running some flow')
        // this.focusedProject = this
        // ensure we have some code to run
        // this.scriptBuffer.codeJS
        // get the content of the current editor

        // const activeTextEditor = vscode.window.activeTextEditor
        // if (activeTextEditor == null) {
        //     logger().info( '❌ no active editor')
        //     return false
        // }
        // const activeDocument = activeTextEditor.document
        // const activeURI = activeDocument.uri
        // logger().info( activeURI.toString())
        const codeTS = this.file.CONTENT
        // logger().info( codeTS.slice(0, 1000) + '...')
        const codeJS = await transpileCode(codeTS)
        logger().info(codeJS)
        // logger().debug('🔥', codeJS + '...')
        if (codeJS == null) {
            logger().info('❌ no code to run')
            return false
        }
        // check if we're in "MOCK" mode
        const opts = mode === 'fake' ? { mock: true } : undefined
        const execution = new FlowRun(this.file.workspace, this.file.uri, opts)
        console.log('SETTIGN ACTIVE RUN')
        this.file.workspace.activeRun = execution
        // await execution.save()
        // write the code to a file
        // this.runs.unshift(execution)

        // try {
        const ProjectScriptFn = new Function('WORKFLOW', codeJS)
        const graph = execution.graph

        // graph.runningMode = mode
        // this.MAIN = graph

        type WorkflowFn = (p: { graph: Graph; flow: FlowRun }) => Promise<any>
        const workflows: { name: string; fn: WorkflowFn }[] = []
        const WORKFLOW = (name: string, fn: (p: { graph: Graph; flow: FlowRun }) => Promise<any>): void => {
            logger().info(`found WORKFLOW ${name}`)
            workflows.push({ name, fn })
        }

        try {
            await ProjectScriptFn(WORKFLOW)
            const good = workflows.find((i) => i.name === this.flowName)
            if (good == null) throw new Error('no workflow found')
            await good.fn({ graph, flow: execution })
            console.log('[✅] RUN SUCCESS')
            // this.isRunning = false
            const duration = Date.now() - start
            vsTestRun.passed(vsTestItem, duration)
            return true
        } catch (error) {
            console.log(error)
            logger().error('🌠', (error as any as Error).name)
            logger().error('🌠', (error as any as Error).message)
            logger().error('🌠', 'RUN FAILURE')
            // const message = new vscode.TestMessage(
            //     new vscode.MarkdownString().appendMarkdown(`### FAILURE: ${vsTestItem.label}`),

            //     // .appendCodeblock(String(this.expected), 'text'),
            // )
            // message.location = new vscode.Location(vsTestItem.uri!, vsTestItem.range!)
            const duration = Date.now() - start
            vsTestRun.failed(vsTestItem, [] /*message*/, duration)
            return false
        }
    }

    // private evaluate() {
    //     return 3
    // }
}
