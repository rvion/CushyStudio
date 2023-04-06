import * as vscode from 'vscode'
import { Workspace } from './core/Workspace'
import { logger } from './logger/Logger'
import { cmd_helloworld, cmd_openJS, cmd_xxxx } from './shell/shell'

// https://github.com/microsoft/vscode-extension-samples/blob/main/fsconsumer-sample/src/extension.ts

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('🟢 "cushystudio" is now active! further logs will be displayed in the "CushyStudio" output pannel.')

    // create logger pannel
    const outputChan = vscode.window.createOutputChannel('CushyStudio')

    outputChan.appendLine(`🟢 "cushystudio" is now active!`)
    outputChan.show(true)
    logger.chanel = outputChan

    if (!vscode.workspace.workspaceFolders) {
        return vscode.window.showInformationMessage('No folder or workspace opened')
    }
    const folderUri = vscode.workspace.workspaceFolders[0].uri
    const workspace = new Workspace(folderUri)
    // get the global typescript language server
    // const tsServer = vscode.server

    // helper to quickly define disposable commands
    const registerDisposableCommand = (name: string, fn: any) => {
        const disposable = vscode.commands.registerCommand(name, fn)
        context.subscriptions.push(disposable)
    }

    registerDisposableCommand('cushystudio.helloWorld', cmd_helloworld)

    // let socket: WebSocket | null = null
    // const INIT = () => {
    //     const socketPort = vscode.workspace.getConfiguration('languageServerExample').get('port', 8188)
    //     const url = `ws://192.168.1.19:${socketPort}/ws`
    //     // vscode.workspace.workspaceFile
    //     console.log('INIT', url)
    //     const socket = new ResilientWebSocketClient(
    //         {
    //             url: () => url,
    //             onMessage: (ev) => {
    //                 console.log(ev)
    //                 vscode.window.showInformationMessage(JSON.stringify(ev.data))
    //                 return
    //             },
    //         },
    //         // (ev) => {
    //         // },
    //     )
    // }
    // INIT()

    registerDisposableCommand('cushystudio.openjs', cmd_openJS)
    registerDisposableCommand('cushystudio.connect', () => {})
    registerDisposableCommand('cushystudio.start', cmd_xxxx)

    // add settings to package.json

    // insert a treeview in the cushyrun view
    // const treeDataProvider = new TreeDataProvider()
    class FooProvider implements vscode.TreeDataProvider<string> {
        onDidChangeTreeData?: vscode.Event<string | void | string[] | null | undefined> | undefined
        getTreeItem(element: string): vscode.TreeItem | Thenable<vscode.TreeItem> {
            throw new Error('Method not implemented.')
        }
        getChildren(element?: string | undefined): vscode.ProviderResult<string[]> {
            throw new Error('Method not implemented.')
        }
        getParent?(element: string): vscode.ProviderResult<string> {
            throw new Error('Method not implemented.')
        }
        resolveTreeItem?(
            item: vscode.TreeItem,
            element: string,
            token: vscode.CancellationToken,
        ): vscode.ProviderResult<vscode.TreeItem> {
            throw new Error('Method not implemented.')
        }
    }
    vscode.window.registerTreeDataProvider('cushyrun', new FooProvider())
    // registerTreeDataProvider
    // const treeView = vscode.window.createTreeView('cushyrun', {
    //     treeDataProvider,
    // })

    // context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
