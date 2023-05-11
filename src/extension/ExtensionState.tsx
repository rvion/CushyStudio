import type { ComfySchemaJSON } from '../types/ComfySchemaJSON'
import type { FlowExecutionStep } from '../types/FlowExecutionStep'
import type { EmbeddingName } from '../core/Schema'

import fetch from 'node-fetch'
import { posix } from 'path'
import * as vscode from 'vscode'
import * as WS from 'ws'
import { sleep } from '../utils/ComfyUtils'
import { Maybe } from '../utils/types'

import { existsSync, readFileSync } from 'fs'
import { makeAutoObservable } from 'mobx'
import { PromptExecution } from '../controls/ScriptStep_prompt'
import { getPayloadID } from '../core/PayloadID'
import { Schema } from '../core/Schema'
import { ComfyPromptJSON } from '../types/ComfyPrompt'
import { ComfyStatus, WsMsg } from '../types/ComfyWsApi'
import { RelativePath } from '../utils/fs/BrandedPaths'
import { asRelativePath } from '../utils/fs/pathUtils'
import { ComfyImporter } from '../importers/ImportComfyImage'
import { getPngMetadata } from '../importers/getPngMetadata'
import { logger } from '../logger/logger'
import { sdkTemplate } from '../typings/sdkTemplate'
import { bang } from '../utils/bang'
import { extractErrorMessage } from '../utils/extractErrorMessage'
import { readableStringify } from '../utils/stringifyReadable'
import { CushyFile, vsTestItemOriginDict } from './CushyFile'
import { MessageFromExtensionToWebview, MessageFromExtensionToWebview_ } from '../types/MessageFromExtensionToWebview'
import { LoggerBack } from '../logger/LoggerBack'
import { PayloadID } from '../core/PayloadID'
import { convertLiteGraphToPrompt } from 'src/core/litegraphToPrompt'
import { StatusBar } from './statusBar'
import { ServerState } from 'src/back/ServerState'
import { VSCodeEmojiDecorator } from './decorator'

/**
 * global State
 *  - manages connection to the backend
 *  - manages list of known / open projects
 *  - dispatches messages to the right projects
 */

export class ExtensionState {
    constructor(
        //
        public context: vscode.ExtensionContext,
        public serverState: ServerState,
        public wspUri: vscode.Uri,
    ) {
        this.statusBar = new StatusBar(this)
        this.vsTestController = this.initVSTestController()
        this.decorator = new VSCodeEmojiDecorator(this.serverState)
    }
    vsTestController: vscode.TestController
    statusBar: StatusBar
    xxx!: vscode.TestRunProfile

    fileChangedEmitter = new vscode.EventEmitter<vscode.Uri>()

    updateNodeForDocument = (e: vscode.TextDocument) => {
        if (e.uri.scheme !== 'file') return
        if (!e.uri.path.endsWith('.cushy.ts')) return
        const cushyFile = this.getOrCreateFile(this.vsTestController, e.uri)
        cushyFile.updateFromContents(e.getText())
    }

    decorator: VSCodeEmojiDecorator

    importCurrentFile = async (opts: { preserveId: boolean }) => {
        const tab = vscode.window.tabGroups.activeTabGroup.activeTab

        // logger().info(JSON.stringify(tab))
        console.log(tab)
        const uri: vscode.Uri = bang((tab!.input as any).uri)

        // case 1. image
        if ((tab?.input as any)?.viewType === 'imagePreview.previewEditor') {
            const isPNG = uri.fsPath.toLowerCase().endsWith('.png')
            if (!isPNG) throw new Error('❌ current image is not a png')
            return this.importCurrentFileAsComfyUIPNG(uri, opts)
        }

        // case 2. json
        const isJSON = uri.fsPath.toLowerCase().endsWith('.json')
        if (isJSON) return this.importCurrentFileAsComfyJSON(uri, opts)
        console.log('not a json')

        throw new Error('❌ unknown file type')
    }
    }
    importCurrentFileAsComfyJSON = async (uri: vscode.Uri, opts: { preserveId: boolean }) => {
        //
        const buff = await vscode.workspace.fs.readFile(uri)
        const txt = buff.toString()

    }
    importCurrentFileAsComfyUIPNG = async (uri: vscode.Uri, opts: { preserveId: boolean }) => {
        //
        const pngData = await vscode.workspace.fs.readFile(uri)
        const result = getPngMetadata(pngData)
    }

    getOrCreateFile = (vsTestController: vscode.TestController, uri: vscode.Uri): CushyFile => {
        // { vsTestItem: vscode.TestItem; cushyFile: CushyFile } {
        const existing = vsTestController.items.get(uri.toString())
        if (existing) {
            const cushyFile = vsTestItemOriginDict.get(existing) as CushyFile
            if (!(cushyFile instanceof CushyFile)) throw new Error('🔴not a cushyfile')
            return cushyFile
        }
        return new CushyFile(this, uri)
    }

    openWebview = async (): Promise<void> => {
        const choice = await vscode.window.showInformationMessage('No UI is opened. Open one?', 'embeded UI', 'web build UI')
        if (choice === 'embeded UI') return FrontWebview.createOrReveal(this)

        // const { shell } = require('electron')
        // https://stackoverflow.com/questions/34205481/how-to-open-browser-from-visual-studio-code-api
        if (choice === 'web build UI') return void vscode.env.openExternal(vscode.Uri.parse('http://127.0.0.1:8388/'))
    }

    notify = (msg: string) => vscode.window.showInformationMessage(`🛋️ ${msg}`)

    addProjectFromComfyWorkflowJSON = (
        //
        relPath: RelativePath,
        title: string,
        comfyPromptJSON: ComfyPromptJSON,
        opts: { preserveId: boolean },
    ): vscode.Uri => {
        let code: string
        try {
            code = new ComfyImporter(this).convertFlowToCode(title, comfyPromptJSON, opts)
        } catch (error) {
            console.log('🔴', error)
            throw error
        }
        // const fileName = title.endsWith('.ts') ? title : `${title}.ts`
        const uri = this.resolve(relPath)
        // const relativePathToDTS = posix.relative(posix.dirname(uri.path), this.cushyTSUri.path)
        // const codeFinal = [`/// <reference path="${relativePathToDTS}" />`, code].join('\n\n')
        this.writeTextFile(uri, code, true)
        return uri
    }

    startWatchingWorkspace = (
        //
        controller: vscode.TestController,
        fileChangedEmitter: vscode.EventEmitter<vscode.Uri>,
    ) => {
        return this.getWorkspaceTestPatterns().map(({ workspaceFolder, pattern }) => {
            const watcher = vscode.workspace.createFileSystemWatcher(pattern)
            watcher.onDidCreate((uri) => {
                this.getOrCreateFile(controller, uri)
                fileChangedEmitter.fire(uri)
            })
            watcher.onDidChange(async (uri) => {
                const cushyFile = this.getOrCreateFile(controller, uri)
                if (cushyFile.didResolve) await cushyFile.updateFromDisk()
                fileChangedEmitter.fire(uri)
            })
            watcher.onDidDelete((uri) => controller.items.delete(uri.toString()))
            this.findInitialFiles(controller, pattern)
            return watcher
        })
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

    initVSTestController(): vscode.TestController {
        const ctrl = vscode.tests.createTestController('mathTestController', 'Markdown Math')
        this.vsTestController = ctrl
        this.context.subscriptions.push(ctrl)
        ctrl.refreshHandler = async () => {
            const testPatterns = this.getWorkspaceTestPatterns()
            const promises = testPatterns.map(({ pattern }) => this.findInitialFiles(ctrl, pattern))
            await Promise.all(promises)
        }
        // ctrl.createRunProfile('Debug Tests', vscode.TestRunProfileKind.Debug, startTestRun, true, undefined, true)
        this.xxx = ctrl.createRunProfile('Run Tests', vscode.TestRunProfileKind.Run, this.startTestRun, true, undefined, true)

        // provided by the extension that the editor may call to request children of a test item
        ctrl.resolveHandler = async (item: vscode.TestItem | undefined) => {
            if (!item) {
                this.context.subscriptions.push(...this.startWatchingWorkspace(ctrl, this.fileChangedEmitter))
                return
            }
            const cushyFile = vsTestItemOriginDict.get(item)
            if (cushyFile instanceof CushyFile) await cushyFile.updateFromDisk()
        }
        return ctrl
    }

    initOutputChannel = () => {
        const outputChan = vscode.window.createOutputChannel('CushyStudio')
        outputChan.appendLine(`starting cushystudio....`)
        outputChan.show(true)
        ;(logger() as LoggerBack).chanel = outputChan
    }
}


// importCurrentFile = async (opts: { preserveId: boolean }) => {
//     const tab = vscode.window.tabGroups.activeTabGroup.activeTab
//     // logger().info(JSON.stringify(tab))
//     console.log(tab)
//     const uri: vscode.Uri = bang((tab!.input as any).uri)

//     // case 1. image
//     if ((tab?.input as any)?.viewType === 'imagePreview.previewEditor') {
//         const isPNG = uri.fsPath.toLowerCase().endsWith('.png')
//         if (!isPNG) throw new Error('❌ current image is not a png')
//         return this.importCurrentFileAsComfyUIPNG(uri, opts)
//     }

//     // case 2. json
//     const isJSON = uri.fsPath.toLowerCase().endsWith('.json')
//     if (isJSON) return this.importCurrentFileAsComfyJSON(uri, opts)
//     console.log('not a json')

//     throw new Error('❌ unknown file type')
// }

// importCurrentFileAsComfyJSON = async (kabsPath: AbsolutePath, opts: { preserveId: boolean }) => {
//     const txt = readFileSync(absPath, 'utf-8')
//     console.log(txt)
//     const json = JSON.parse(txt)

//     const baseName = posix.basename(txt, '.json')
//     // replace the extension with .cushy.ts
//     // const absPath = uri.path.replace(/\.json$/, '.cushy.ts')
//     const absPath = absPath + '.cushy.ts'

//     // make it relative to the workspace
//     const relPathStr = vscode.Uri.file(absPath).path.replace(this.wspUri.fsPath, '.')
//     const relPath = asRelativePath(relPathStr)
//     const convertedUri =
//         'last_node_id' in json
//             ? this.addProjectFromComfyWorkflowJSON(relPath, baseName, convertLiteGraphToPrompt(this.schema, json), opts)
//             : this.addProjectFromComfyWorkflowJSON(relPath, baseName, json, opts)
//     await sleep(1000)
//     //  reveal the URI
//     vscode.window.showTextDocument(convertedUri)
// }

// importCurrentFileAsComfyUIPNG = async (uri: vscode.Uri, opts: { preserveId: boolean }) => {
//     const pngData = await vscode.workspace.fs.readFile(uri)
//     const result = getPngMetadata(pngData)
//     if (result.type === 'failure') {
//         throw new Error(`❌ ${result.value}`)
//     }
//     const pngMetadata = result.value
//     console.log({ pngMetadata })
//     const canBeImportedAsComfyUIJSON = 'prompt' in pngMetadata
//     if (!canBeImportedAsComfyUIJSON) {
//         throw new Error(`❌ no 'prompt' json metadata`)
//     }

//     const json = JSON.parse(pngMetadata.prompt)
//     // console.log(json)
//     const baseName = posix.basename(uri.path, '.png')

//     // replace the extension with .cushy.ts
//     const absPath = uri.path.replace(/\.png$/, '.cushy.ts')

//     // make it relative to the workspace
//     const relPathStr = vscode.Uri.file(absPath).path.replace(this.wspUri.fsPath, '.')
//     const relPath = asRelativePath(relPathStr)
//     const convertedUri = this.addProjectFromComfyWorkflowJSON(relPath, baseName, json, opts)
//     await sleep(1000)
//     //  reveal the URI
//     vscode.window.showTextDocument(convertedUri)

//     // const curr = vscode.window.reveal()
//     // if (curr == null) return
//     // const filename = curr.document.fileName
//     // console.log({ filename })
//     // const editor = curr.document.
//     // const ic = new ImportCandidate(this, filename)
// }