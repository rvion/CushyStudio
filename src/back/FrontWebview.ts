import type { ServerState } from './ServerState'

import * as vscode from 'vscode'
import { getNonce } from '../utils/fs/getNonce'
import { getUri } from '../utils/fs/getUri'
import { ExtensionState } from 'src/extension/ExtensionState'

/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class FrontWebview {
    // ------------------------------------------------------------------------------------------------------------
    static current: FrontWebview | undefined
    static createOrReveal(
        workspace: ExtensionState,
        // extensionUri: Uri /** directory containing the extension */,
    ) {
        if (FrontWebview.current) return FrontWebview.current.panel.reveal(vscode.ViewColumn.Two)

        // If a webview panel does not already exist create and show a new one
        const extensionUri = workspace.context.extensionUri
        const panel = vscode.window.createWebviewPanel(
            'showHelloWorld', // Panel view type
            'CushyStudio', // Panel title
            vscode.ViewColumn.Two, // The editor column the panel should be displayed in
            {
                retainContextWhenHidden: true,
                enableCommandUris: true,
                enableScripts: true, // Enable JavaScript in the webview
                // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
                // localResourceRoots: [
                //     //
                //     Uri.joinPath(extensionUri, 'out'),
                //     Uri.joinPath(extensionUri, 'webview'),
                //     workspace.cacheFolderURI,
                // ],
            },
        )

        FrontWebview.current = new FrontWebview(workspace, panel, extensionUri)
    }

    // ------------------------------------------------------------------------------------------------------------
    private _disposables: vscode.Disposable[] = []
    webview: vscode.Webview

    private constructor(
        private workspace: ServerState,
        /** A reference to the webview panel */
        private panel: vscode.WebviewPanel,
        /** The URI of the directory containing the extension */
        private extensionUri: vscode.Uri,
    ) {
        this.webview = panel.webview
        // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
        // the panel or when the panel is closed programmatically)
        this.panel.onDidDispose(() => this.dispose(), null, this._disposables)
        // Set the HTML content for the webview panel
        this.webview.html = this._getWebviewContent()
    }

    /** Cleans up and disposes of webview resources when the webview panel is closed. */
    public dispose() {
        FrontWebview.current = undefined

        // Dispose of the current webview panel
        this.panel.dispose()

        // Dispose of all disposables (i.e. commands) for the current webview panel
        while (this._disposables.length) {
            const disposable = this._disposables.pop()
            if (disposable) {
                disposable.dispose()
            }
        }
    }

    /**
     * Defines and returns the HTML that should be rendered within the webview panel.
     *
     * @remarks This is also the place where references to the React webview build files
     * are created and inserted into the webview HTML.
     *
     * @param webview A reference to the extension webview
     * @param extensionUri The URI of the directory containing the extension
     * @returns A template string literal containing the HTML that should be
     * rendered within the webview panel
     */
    private _getWebviewContent() {
        // The  JS and CSS files from our build output
        const stylesUri = this.getExtensionLocalUri(['dist', 'webview', 'assets', 'index.css'])
        const scriptUri = this.getExtensionLocalUri(['dist', 'webview', 'assets', 'index.js'])
        // const mermaidjs = this.getExtensionLocalUri(['dist', 'webview', 'mermaid.esm.min.mjs'])
        //   <script type='module' nonce="${nonce}" src="${mermaidjs}"></script>
        const nonce = getNonce()

        return /*html*/ `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <title>Test Layout</title>
                <style type="text/css">
                    body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
                    #content { position:absolute; left: 0; right: 0; bottom: 0; top: 0px; }
                </style>
            </head>
            <body>
                <div id="content">
                    <iframe width="100%" height="100%" frameborder="0" src="http://localhost:8288/"></iframe>
                </div>
            </body>
        </html>
        `
        //     return /*html*/ `
        //   <!DOCTYPE html>
        //   <html lang="en">
        //     <head>
        //       <meta charset="UTF-8" />
        //       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        //       <link rel="stylesheet" type="text/css" href="${stylesUri}">
        //       <title>Cushy Studio</title>
        //     </head>
        //     <body>
        //       <div id="root"></div>
        //       <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        //       <script               nonce="${nonce}" src="${painterro}"></script>
        //       <!-- inject mermaid -->
        //       <script type="module">
        //         import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        //         mermaid.initialize({ startOnLoad: false, theme: 'dark' });
        //         window.mermaid = mermaid
        //       </script>
        //     </body>
        //   </html>
        // `
    }

    static with = <A>(fn: (current: FrontWebview) => A): A => {
        const curr = FrontWebview.current
        if (curr == null) throw new Error('no current panel')
        return fn(curr)
    }

    getExtensionLocalUri = (pathList: string[]): vscode.Uri => getUri(this.webview, this.extensionUri, pathList)
}
