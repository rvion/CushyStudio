import { readFileSync } from 'fs'
import * as vscode from 'vscode'
import { logger } from '../logger/logger'
import { bang } from '../utils/bang'
import { AbsolutePath } from '../utils/fs/BrandedPaths'
import { ActionDefinition } from './ActionDefinition'
import { ServerState } from './ServerState'

export type MarkdownTestData = CushyFile | /* TestHeading |*/ ActionDefinition

export const vsTestItemOriginDict = new WeakMap<vscode.TestItem, MarkdownTestData>()

export type CodeRange = {
    fromLine: number
    fromChar: number
    toLine: number
    toChar: number
}

export class CushyFile {
    CONTENT = ''
    workflows: ActionDefinition[] = []
    constructor(
        //
        public workspace: ServerState,
        public absPath: AbsolutePath,
    ) {
        this.CONTENT = readFileSync(absPath, 'utf-8')
        this.extractWorkflows()
    }

    WorkflowRe = /^^action\(['"](.*)['"]/

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
            const flow = new ActionDefinition(this, range, name)
            this.workflows.push(flow)
            this.workspace.knownActions.set(flow.uid, flow)
            continue
        }
        const flows = this.workflows.map((i) => ({ name: i.name, id: i.uid }))
        console.log(flows.map((i) => i.name))
        this.workspace.broadCastToAllClients({ type: 'ls', actions: flows })
        // this.workspace.updateActionListDebounced()
    }
}
