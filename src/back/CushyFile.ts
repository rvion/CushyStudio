import { readFileSync } from 'fs'
import * as vscode from 'vscode'
import { logger } from '../logger/logger'
import { bang } from '../utils/bang'
import { AbsolutePath } from '../utils/fs/BrandedPaths'
import { FlowDefinition } from './FlowDefinition'
import { ServerState } from './ServerState'

export type MarkdownTestData = CushyFile | /* TestHeading |*/ FlowDefinition

export const vsTestItemOriginDict = new WeakMap<vscode.TestItem, MarkdownTestData>()

export type CodeRange = {
    fromLine: number
    fromChar: number
    toLine: number
    toChar: number
}

export class CushyFile {
    CONTENT = ''
    workflows: FlowDefinition[] = []
    constructor(
        //
        public workspace: ServerState,
        public absPath: AbsolutePath,
    ) {
        this.CONTENT = readFileSync(absPath, 'utf-8')
        this.extractWorkflows()
    }

    WorkflowRe = /^^WORKFLOW\(['"](.*)['"]/

    extractWorkflows = () => {
        const lines = this.CONTENT.split('\n')

        this.workflows = []
        for (let lineNo = 0; lineNo < lines.length; lineNo++) {
            const line = lines[lineNo]
            const isWorkflow = this.WorkflowRe.exec(line)
            if (!isWorkflow) continue
            logger().info(`found workflow "${isWorkflow?.[1]}"`)
            const name = bang(isWorkflow[1])
            const range: CodeRange = { fromLine: lineNo, fromChar: 0, toLine: lineNo, toChar: line.length }
            const flow = new FlowDefinition(this, range, name)
            this.workflows.push(flow)
            this.workspace.knownFlows.set(flow.flowID, flow)
            continue
        }
        const flows = this.workflows.map((i) => ({ name: i.flowName, id: i.flowID }))
        this.workspace.broadCastToAllClients({ type: 'ls', knownFlows: flows })
    }
}
