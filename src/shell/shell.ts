import * as vscode from 'vscode'

// https://code.visualstudio.com/api/extension-guides/webview
// https://github.com/microsoft/vscode-extension-samples/tree/98346fc4fa81067e253df9b32922cc02e8b24274/webview-sample

export const cmd_sampleWebview = (context: vscode.ExtensionContext) => {
    const panel = vscode.window.createWebviewPanel('catCoding', 'Cat Coding', vscode.ViewColumn.Two, {
        // Only allow the webview to access resources in our extension's media directory
        localResourceRoots: [
            //
            vscode.Uri.joinPath(context.extensionUri, 'media'),
            vscode.Uri.joinPath(context.extensionUri, 'resources'),
        ],
    })

    // const onDiskPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'cat.gif')
    const onDiskPath = vscode.Uri.joinPath(context.extensionUri, 'resources', 'CushyLogo.png')
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
