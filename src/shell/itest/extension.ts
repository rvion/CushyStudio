import * as vscode from 'vscode'
import { CushyFlow } from './CushyFlow'
import { CushyFile, testData } from './testTree'

export async function WATCH_WORKFLOWS(context: vscode.ExtensionContext) {
    const ctrl = vscode.tests.createTestController('mathTestController', 'Markdown Math')
    context.subscriptions.push(ctrl)

    const fileChangedEmitter = new vscode.EventEmitter<vscode.Uri>()

    const startTestRun = (request: vscode.TestRunRequest) => {
        const queue: { test: vscode.TestItem; data: CushyFlow }[] = []
        const run = ctrl.createTestRun(request)
        // map of file uris to statements on each line:
        // const coveredLines = new Map</* file uri */ string, (vscode.StatementCoverage | undefined)[]>()

        const discoverTests = async (tests: Iterable<vscode.TestItem>) => {
            for (const test of tests) {
                if (request.exclude?.includes(test)) continue

                const data = testData.get(test)
                if (data instanceof CushyFlow) {
                    run.enqueued(test)
                    queue.push({ test, data })
                } else {
                    if (data instanceof CushyFile && !data.didResolve) {
                        await data.updateFromDisk(ctrl, test)
                    }

                    await discoverTests(gatherTestItems(test.children))
                }
            }
        }

        const runTestQueue = async () => {
            for (const { test, data } of queue) {
                run.appendOutput(`Running ${test.id}\r\n`)
                if (run.token.isCancellationRequested) {
                    run.skipped(test)
                } else {
                    run.started(test)
                    await data.run(test, run)
                }

                // const lineNo = test.range!.start.line
                // const fileCoverage = coveredLines.get(test.uri!.toString())
                // if (fileCoverage) {
                //     fileCoverage[lineNo]!.executionCount++
                // }

                run.appendOutput(`Completed ${test.id}\r\n`)
            }

            run.end()
        }

        // run.coverageProvider = {
        //     provideFileCoverage() {
        //         const coverage: vscode.FileCoverage[] = []
        //         for (const [uri, statements] of coveredLines) {
        //             coverage.push(
        //                 vscode.FileCoverage.fromDetails(
        //                     vscode.Uri.parse(uri),
        //                     statements.filter((s): s is vscode.StatementCoverage => !!s),
        //                 ),
        //             )
        //         }

        //         return coverage
        //     },
        // }

        discoverTests(request.include ?? gatherTestItems(ctrl.items)).then(runTestQueue)
    }

    ctrl.refreshHandler = async () => {
        await Promise.all(getWorkspaceTestPatterns().map(({ pattern }) => findInitialFiles(ctrl, pattern)))
    }
    ctrl.createRunProfile('Run Tests', vscode.TestRunProfileKind.Run, startTestRun, true, undefined, true)

    // provided by the extension that the editor may call to requestchildren of a test item
    ctrl.resolveHandler = async (item) => {
        if (!item) {
            context.subscriptions.push(...startWatchingWorkspace(ctrl, fileChangedEmitter))
            return
        }
        const data = testData.get(item)
        if (data instanceof CushyFile) await data.updateFromDisk(ctrl, item)
    }

    function updateNodeForDocument(e: vscode.TextDocument) {
        if (e.uri.scheme !== 'file') return
        if (!e.uri.path.endsWith('.cushy.ts')) return
        const { file, data } = getOrCreateFile(ctrl, e.uri)
        data.updateFromContents(ctrl, e.getText(), file)
    }

    for (const document of vscode.workspace.textDocuments) {
        updateNodeForDocument(document)
    }

    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(updateNodeForDocument),
        vscode.workspace.onDidChangeTextDocument((e) => updateNodeForDocument(e.document)),
    )
}

function getOrCreateFile(controller: vscode.TestController, uri: vscode.Uri): { file: vscode.TestItem; data: CushyFile } {
    const existing = controller.items.get(uri.toString())
    if (existing) return { file: existing, data: testData.get(existing) as CushyFile }

    const file = controller.createTestItem(uri.toString(), uri.path.split('/').pop()!, uri)
    controller.items.add(file)

    const data = new CushyFile()
    testData.set(file, data)

    file.canResolveChildren = true
    return { file, data }
}

function gatherTestItems(collection: vscode.TestItemCollection) {
    const items: vscode.TestItem[] = []
    collection.forEach((item) => items.push(item))
    return items
}

function startWatchingWorkspace(controller: vscode.TestController, fileChangedEmitter: vscode.EventEmitter<vscode.Uri>) {
    return getWorkspaceTestPatterns().map(({ workspaceFolder, pattern }) => {
        const watcher = vscode.workspace.createFileSystemWatcher(pattern)

        watcher.onDidCreate((uri) => {
            getOrCreateFile(controller, uri)
            fileChangedEmitter.fire(uri)
        })
        watcher.onDidChange(async (uri) => {
            const { file, data } = getOrCreateFile(controller, uri)
            if (data.didResolve) {
                await data.updateFromDisk(controller, file)
            }
            fileChangedEmitter.fire(uri)
        })
        watcher.onDidDelete((uri) => controller.items.delete(uri.toString()))

        findInitialFiles(controller, pattern)

        return watcher
    })
}

function getWorkspaceTestPatterns() {
    if (!vscode.workspace.workspaceFolders) return []
    return vscode.workspace.workspaceFolders.map((workspaceFolder) => ({
        workspaceFolder,
        pattern: new vscode.RelativePattern(workspaceFolder, '**/*.cushy.ts'),
    }))
}

async function findInitialFiles(controller: vscode.TestController, pattern: vscode.GlobPattern) {
    for (const file of await vscode.workspace.findFiles(pattern)) {
        getOrCreateFile(controller, file)
    }
}
