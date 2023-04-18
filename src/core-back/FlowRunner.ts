import type { Workspace } from './Workspace'

import * as vscode from 'vscode'
import { loggerExt } from '../logger/LoggerBack'
import { CushyFile, vsTestItemOriginDict } from './CushyFile'
import { FlowDefinition } from './FlowDefinition'
import { toArray } from '../utils/toArray'

// TODO: rename test runner ?
export class FlowRunner {
    queue: {
        vsTestItem: vscode.TestItem
        cushyFlow: FlowDefinition
    }[] = []

    run: vscode.TestRun

    constructor(public workspace: Workspace, public request: vscode.TestRunRequest) {
        // 1. create a vscode.TestRun
        this.run = workspace.vsTestController.createTestRun(request)
        this.START()
    }

    START = async () => {
        // 2. get all possible workflow we want to run
        loggerExt.info('🌠', 'starting run ')
        const testCandidates: readonly vscode.TestItem[] =
            this.request.include ?? //
            toArray(this.workspace.vsTestController.items)

        // 3. expand tests to the final list of WORKFLOW to run
        loggerExt.info('🌠', 'discovering tests... ')
        await this.discoverTests(testCandidates)

        // 4. run the workflows
        this.runTestQueue()
    }

    discoverTests = async (tests: Iterable<vscode.TestItem>) => {
        for (const vsTestItem of tests) {
            if (this.request.exclude?.includes(vsTestItem)) continue
            const x = vsTestItemOriginDict.get(vsTestItem)
            if (x instanceof FlowDefinition) {
                this.run.enqueued(vsTestItem)
                this.queue.push({ vsTestItem, cushyFlow: x })
            } else {
                if (x instanceof CushyFile && !x.didResolve) await x.updateFromDisk()
                await this.discoverTests(toArray(vsTestItem.children))
            }
        }
    }

    runTestQueue = async () => {
        loggerExt.info('🌠', `queue has ${this.queue.length} item(s)`)
        loggerExt.info('🌠', `opening webview`)
        this.workspace.ensureWebviewPanelIsOpened()
        // cmd_openCatCodingWebview(this.workspace.context)
        for (const { vsTestItem, cushyFlow } of this.queue) {
            loggerExt.info('🌠', `🔴 STARTING RUN ${cushyFlow.flowName}`)
            this.run.appendOutput(`Running ${vsTestItem.id}\r\n`)
            if (this.run.token.isCancellationRequested) {
                this.run.skipped(vsTestItem)
            } else {
                this.run.started(vsTestItem)
                await cushyFlow.run(vsTestItem, this.run, 'real')
            }
            loggerExt.info('🌠', `🔴 RUN ${cushyFlow.flowName} IS DONE`)

            this.run.appendOutput(`Completed ${vsTestItem.id}\r\n`)
        }

        this.run.end()
    }
}

//  startTestRun = (request: vscode.TestRunRequest) => {
// map of file uris to statements on each line:
// const coveredLines = new Map</* file uri */ string, (vscode.StatementCoverage | undefined)[]>()

// gatherTestItems() {
//     const items: vscode.TestItem[] = []
//         // 2023-04-08 rvion: use Array.from ?
//         .forEach((item) => items.push(item))
//     return items
// }

// export async function WATCH_WORKFLOWS(context: vscode.ExtensionContext) {
// const ctrl = vscode.tests.createTestController('mathTestController', 'Markdown Math')
// context.subscriptions.push(ctrl)
// const fileChangedEmitter = new vscode.EventEmitter<vscode.Uri>()
