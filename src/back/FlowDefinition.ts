import type { RunMode } from '../core/Graph'
import type { CodeRange, CushyFile } from './CushyFile'

import { nanoid } from 'nanoid'
import { auto } from '../core/autoValue'
import { logger } from '../logger/logger'
import { Presets } from '../presets/presets'
import { WorkflowBuilder, WorkflowBuilderFn } from '../core/WorkflowFn'
import { FlowRun } from './FlowRun'
import { transpileCode } from './transpiler'
import { Branded } from '../utils/types'

export type FlowDefinitionID = Branded<string, 'FlowDefinitionID'>
export const asFlowDefinitionID = (s: string): FlowDefinitionID => s as any

export type FlowRunID = Branded<string, 'FlowRunID'>
export const asFlowRunID = (s: string): FlowRunID => s as any

/**
 * a thin wrapper around a single (work)flow somewhere in a .cushy.ts file
 * flow = the 'WORFLOW(...)' part of a file
 * */
export class FlowDefinition {
    flowID: FlowDefinitionID

    constructor(
        //
        public file: CushyFile,
        public range: CodeRange,
        public flowName: string,
    ) {
        this.flowID = asFlowDefinitionID(`${file.absPath}#${flowName}`)
    }

    run = async (mode: RunMode = 'real'): Promise<boolean> => {
        const start = Date.now()
        const flowRunID = asFlowRunID(nanoid(6))
        const workspace = this.file.workspace
        workspace.broadCastToAllClients({ type: 'flow-start', flowRunID: flowRunID })
        const schema = workspace.schema
        workspace.broadCastToAllClients({ type: 'schema', schema: schema.spec, embeddings: schema.embeddings })

        logger().info('❓ running some flow')

        const codeTS = this.file.CONTENT
        const codeJS = await transpileCode(codeTS)
        logger().info(`\`\`\`ts\n${codeJS}\n\`\`\``)
        // logger().debug('🔥', codeJS + '...')
        if (codeJS == null) {
            logger().info('❌ no code to run')
            return false
        }
        // check if we're in "MOCK" mode
        const opts = mode === 'fake' ? { mock: true } : undefined
        const execution = new FlowRun(this.file.workspace, this.file.absPath, opts)
        console.log('SETTIGN ACTIVE RUN')
        this.file.workspace.activeRun = execution
        // await execution.save()
        // write the code to a file
        // this.runs.unshift(execution)

        // try {
        const ProjectScriptFn = new Function('WORKFLOW', codeJS)
        const graph = execution.graph
        const workflows: { name: string; fn: WorkflowBuilderFn }[] = []
        const WORKFLOW = (name: string, fn: WorkflowBuilderFn): void => {
            logger().info(`found WORKFLOW ${name}`)
            workflows.push({ name, fn })
        }

        try {
            await ProjectScriptFn(WORKFLOW)
            const good = workflows.find((i) => i.name === this.flowName)
            if (good == null) throw new Error('no workflow found')
            const ctx: WorkflowBuilder = {
                graph: graph as any, // 🔶 wrong type
                flow: execution,
                AUTO: auto,
                presets: 0 as any,
                openpose: 'TODO', // 🔶 not done
                stage: 'TODO', // 🔶 not done
            }
            const presets = new Presets(ctx)
            ctx.presets = presets
            this.file.workspace.broadCastToAllClients({ type: 'flow-code', flowRunID: flowRunID, code: good.fn.toString() })
            await good.fn(ctx)
            console.log('[✅] RUN SUCCESS')
            const duration = Date.now() - start
            this.file.workspace.broadCastToAllClients({
                type: 'flow-end',
                flowRunID: flowRunID,
                flowID: this.flowID,
                status: 'success',
            })
            return true
        } catch (error) {
            console.log(error)
            this.file.workspace.broadCastToAllClients({
                type: 'flow-end',
                flowRunID: flowRunID,
                status: 'failure',
                flowID: this.flowID,
            })
            logger().error('🌠', (error as any as Error).name)
            logger().error('🌠', (error as any as Error).message)
            logger().error('🌠', 'RUN FAILURE')
            // const message = new vscode.TestMessage(
            //     new vscode.MarkdownString().appendMarkdown(`### FAILURE: ${vsTestItem.label}`),

            //     // .appendCodeblock(String(this.expected), 'text'),
            // )
            // message.location = new vscode.Location(vsTestItem.uri!, vsTestItem.range!)
            const duration = Date.now() - start
            // vsTestRun.failed(vsTestItem, [] /*message*/, duration)
            return false
        }
    }

    // private evaluate() {
    //     return 3
    // }
}
