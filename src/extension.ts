import * as vscode from 'vscode'
import { Workspace } from './core-back/Workspace'
import { FooProvider } from './shell/FooProvider'
import { cmd_helloworld } from './shell/cmd_helloworld'
import { cmd_openCatCodingWebview } from './shell/cmd_openCatCodingWebview'
import { cmd_openJS } from './shell/cmd_openJS'

// https://github.com/microsoft/vscode-extension-samples/blob/main/fsconsumer-sample/src/extension.ts
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // report current status
    if (!vscode.workspace.workspaceFolders) {
        const infoMsg = 'CushyStudio will not start because no folder nor workspace opened'
        return vscode.window.showInformationMessage(infoMsg)
    } else {
        console.log('🟢 "cushystudio" is now active! further logs will be displayed in the "CushyStudio" output pannel.')
    }

    const folderUri = vscode.workspace.workspaceFolders[0].uri
    const workspace = new Workspace(context, folderUri)
    // get the global typescript language server
    // const tsServer = vscode.server

    // helper to quickly define disposable commands
    const registerDisposableCommand = (name: string, fn: any) => {
        const disposable = vscode.commands.registerCommand(name, fn)
        context.subscriptions.push(disposable)
    }

    registerDisposableCommand('cushystudio.helloWorld', cmd_helloworld.bind(null, context))
    registerDisposableCommand('cushystudio.openjs', cmd_openJS)
    registerDisposableCommand('cushystudio.connect', () => {})
    registerDisposableCommand('cushystudio.samplewebview', cmd_openCatCodingWebview.bind(null, context))
    registerDisposableCommand('cushystudio.openwebview', () => workspace.ensureWebviewPanelIsOpened())
    registerDisposableCommand('cushystudio.import', () => workspace.importCurrentFile({ preserveId: false }))
    registerDisposableCommand('cushystudio.importlegacy', () => workspace.importCurrentFile({ preserveId: true }))

    // add settings to package.json
    // insert a treeview in the cushyrun view
    // const treeDataProvider = new TreeDataProvider()
    vscode.window.registerTreeDataProvider('cushyrun', new FooProvider())
    // registerTreeDataProvider
    // const treeView = vscode.window.createTreeView('cushyrun', {
    //     treeDataProvider,
    // })
    // context.subscriptions.push(disposable)
}

// This method is called when your extension is deactivated
export function deactivate() {}
