import type { Workspace } from '../../core/Workspace'

import * as vscode from 'vscode'
import { CushyFlow } from './CushyFlow'
import { CushyFile, vsTestItemOriginDict } from './CushyFile'
import { toArray } from './toArray'

export class CushyRunProcessor {
    queue: { test: vscode.TestItem; data: CushyFlow }[] = []
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
        const testCandidates: readonly vscode.TestItem[] =
            this.request.include ?? //
            toArray(this.workspace.vsTestController.items)

        // 3. expand tests to the final list of WORKFLOW to run
        await this.discoverTests(testCandidates)

        // 4. run the workflows
        this.runTestQueue()
    }

    discoverTests = async (tests: Iterable<vscode.TestItem>) => {
        for (const test of tests) {
            if (this.request.exclude?.includes(test)) continue

            const data = vsTestItemOriginDict.get(test)
            if (data instanceof CushyFlow) {
                this.run.enqueued(test)
                this.queue.push({ test, data })
            } else {
                if (data instanceof CushyFile && !data.didResolve) {
                    await data.updateFromDisk(this.workspace.vsTestController, test)
                }

                await this.discoverTests(toArray(test.children))
            }
        }
    }

    runTestQueue = async () => {
        for (const { test, data } of this.queue) {
            this.run.appendOutput(`Running ${test.id}\r\n`)

            if (this.run.token.isCancellationRequested) {
                this.run.skipped(test)
            } else {
                this.run.started(test)
                await data.run(test, this.run, 'real')
            }

            this.run.appendOutput(`Completed ${test.id}\r\n`)
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
