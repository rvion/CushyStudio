import * as vscode from 'vscode'

export const cmd_addDecorations = (context: vscode.ExtensionContext) => {
    vscode.window.showInformationMessage('Hello World from CushyStudio 789asdf!')

    // Get path to resource on disk
    const onDiskPath = vscode.Uri.joinPath(context.extensionUri, 'resources', '1432343177.svg')
    // And get the special URI to use with the webview
    // const catGifSrc = vscode.panel.webview.asWebviewUri(onDiskPath)
    const playButtonDecorationType = vscode.window.createTextEditorDecorationType({
        gutterIconPath: onDiskPath,
        gutterIconSize: 'contain',
    })
    const editor = vscode.window.activeTextEditor
    const functionRange = new vscode.Range(0, 0, 0, 0) // Replace with the actual range of your function
    const decorations: vscode.DecorationOptions[] = [
        {
            range: functionRange,
            hoverMessage: 'Play',
            renderOptions: {
                after: {
                    contentText: 'Play',
                    contentIconPath: onDiskPath, // '/resources/1432343177.svg',
                    // gutterIconPath: '/path/to/play-button.svg',
                },
            },
        },
    ]
    editor?.setDecorations(playButtonDecorationType, decorations)
}

// export const watch_decorations = (context: vscode.ExtensionContext) => {
//     const disposable = vscode.window.onDidChangeTextEditorVisibleRanges(event => {
//         const editor = event.textEditor;
//         const clickedPosition = event.position;
//         const clickedLine = clickedPosition.line;

//         // Check if the click happened in the gutter
//         const isGutterClick = event.mouseTargetType === MouseTargetType.GUTTER_GLYPH_MARGIN;

//         if (isGutterClick) {
//           // Handle the click event here
//           console.log(`Gutter clicked on line ${clickedLine}!`);
//         }
//       });
