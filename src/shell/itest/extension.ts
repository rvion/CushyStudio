import type { Workspace } from '../../core/Workspace'

import * as vscode from 'vscode'
import { CushyFlow } from './CushyFlow'
import { CushyFile, vsTestItemOriginDict } from './CushyFile'
import { toArray } from './toArray'
import { logger } from '../../logger/Logger'
import { cmd_sampleWebview } from '../shell'
import { HelloWorldPanel } from '../../panels/testWebviewPanel'

export class CushyRunProcessor {
    queue: {
        vsTestItem: vscode.TestItem
        cushyFlow: CushyFlow
    }[] = []

    run: vscode.TestRun

    constructor(
        //
        public request: vscode.TestRunRequest,
        public workspace: Workspace,
    ) {
        // 1. create a vscode.TestRun
        this.run = workspace.vsTestController.createTestRun(request)

        this.START()
    }

    START = async () => {
        // 2. get all possible workflow we want to run
        logger.info('🌠', 'starting run ')
        const testCandidates: readonly vscode.TestItem[] =
            this.request.include ?? //
            toArray(this.workspace.vsTestController.items)

        // 3. expand tests to the final list of WORKFLOW to run
        logger.info('🌠', 'discovering tests... ')
        await this.discoverTests(testCandidates)

        // 4. run the workflows
        this.runTestQueue()
    }

    discoverTests = async (tests: Iterable<vscode.TestItem>) => {
        for (const vsTestItem of tests) {
            if (this.request.exclude?.includes(vsTestItem)) continue

            const x = vsTestItemOriginDict.get(vsTestItem)

            if (x instanceof CushyFlow) {
                this.run.enqueued(vsTestItem)
                this.queue.push({ vsTestItem, cushyFlow: x })
            } else {
                if (x instanceof CushyFile && !x.didResolve) await x.updateFromDisk()
                await this.discoverTests(toArray(vsTestItem.children))
            }
        }
    }

    runTestQueue = async () => {
        logger.info('🌠', `queue has ${this.queue} item(s)`)
        logger.info('🌠', `opening webview`)
        this.workspace.ensureWebviewPanelIsOpened()
        cmd_sampleWebview(this.workspace.context)
        for (const { vsTestItem, cushyFlow } of this.queue) {
            this.run.appendOutput(`Running ${vsTestItem.id}\r\n`)
            if (this.run.token.isCancellationRequested) {
                this.run.skipped(vsTestItem)
            } else {
                this.run.started(vsTestItem)
                await cushyFlow.run(vsTestItem, this.run, 'real')
            }

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
