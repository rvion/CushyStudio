import { posix } from 'path'
import * as vscode from 'vscode'

export const cmd_openJS = async function () {
    if (!vscode.window.activeTextEditor || posix.extname(vscode.window.activeTextEditor.document.uri.path) !== '.ts') {
        return vscode.window.showInformationMessage('Open a TypeScript file first')
    }

    const tsUri = vscode.window.activeTextEditor.document.uri
    const jsPath = posix.join(tsUri.path, '..', posix.basename(tsUri.path, '.ts') + '.js')
    const jsUri = tsUri.with({ path: jsPath })

    try {
        await vscode.workspace.fs.stat(jsUri)
        vscode.window.showTextDocument(jsUri, { viewColumn: vscode.ViewColumn.Beside })
    } catch {
        vscode.window.showInformationMessage(`${jsUri.toString(true)} file does *not* exist`)
    }
}
