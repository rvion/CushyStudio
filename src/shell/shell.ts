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

export const cmd_helloworld = () => {
    vscode.window.showInformationMessage('Hello World from CushyStudio 789asdf!')
}

export const cmd_xxxx = (context: vscode.ExtensionContext) => {
    const panel = vscode.window.createWebviewPanel('catCoding', 'Cat Coding', vscode.ViewColumn.Two, {
        // Only allow the webview to access resources in our extension's media directory
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')],
    })

    const onDiskPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'cat.gif')
    const catGifSrc = panel.webview.asWebviewUri(onDiskPath)

    panel.webview.html = getWebviewContent(catGifSrc)

    function getWebviewContent(src: vscode.Uri) {
        return `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cat Coding</title>
      </head>
      <body>
          <img src="https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif" width="300" />
          <img src="${src}" width="300" />
      </body>
      </html>`
    }
}
