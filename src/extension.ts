import './logger/LoggerBack' // inject a global logger
import * as vscode from 'vscode'
import { ServerState } from './back/ServerState'
import { extractErrorMessage } from './utils/extractErrorMessage'
import { logger } from './logger/logger'
import { asAbsolutePath } from './utils/fs/pathUtils'
import { ExtensionState } from './extension/ExtensionState'

// https://github.com/microsoft/vscode-extension-samples/blob/main/fsconsumer-sample/src/extension.ts
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // report current status
    if (!vscode.workspace.workspaceFolders) {
        const infoMsg = 'CushyStudio will not start because no folder nor workspace opened'
        console.log(infoMsg)
        return
    }

    console.log('🟢 "cushystudio" is now active! further logs will be displayed in the "CushyStudio" output pannel.')
    const folderUri = vscode.workspace.workspaceFolders[0].uri
    const folderAbsPath = folderUri.fsPath
    const serverstate = new ServerState(asAbsolutePath(folderAbsPath))
    const extensionState = new ExtensionState(context, serverstate, folderUri)
    // get the global typescript language server
    // const tsServer = vscode.server

    // helper to quickly define disposable commands
    const registerDisposableCommand = (name: string, fn: any) => {
        const wrappedFn = async () => {
            try {
                await fn()
            } catch (error) {
                const errMsg = extractErrorMessage(error)
                logger().error('🌠', errMsg, error as any)
                // vscode.window.showErrorMessage(errMsg)
            }
        }
        const disposable = vscode.commands.registerCommand(name, wrappedFn)
        context.subscriptions.push(disposable)
    }

    registerDisposableCommand('cushystudio.updateschema', () => serverstate.fetchAndUdpateSchema())
    registerDisposableCommand('cushystudio.openwebview', () => extensionState.openWebview())
    registerDisposableCommand('cushystudio.import', () => extensionState.importCurrentFile({ preserveId: false }))
    registerDisposableCommand('cushystudio.importlegacy', () => extensionState.importCurrentFile({ preserveId: true }))

    // add settings to package.json
    // insert a treeview in the cushyrun view
    // const treeDataProvider = new TreeDataProvider()
    // vscode.window.registerTreeDataProvider('cushyrun', new FooProvider())
    // registerTreeDataProvider
    // const treeView = vscode.window.createTreeView('cushyrun', {
    //     treeDataProvider,
    // })
    // context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
