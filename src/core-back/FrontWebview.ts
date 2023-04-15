import * as vscode from 'vscode'
import { MessageFromExtensionToWebview, MessageFromWebviewToExtension } from '../core-types/MessageFromExtensionToWebview'
import { getNonce } from '../fs/getNonce'
import { getUri } from '../fs/getUri'
import { loggerExt } from '../logger/LoggerBack'
import { exhaust } from '../utils/ComfyUtils'
import type { Workspace } from './Workspace'

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
        workspace: Workspace,
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

    static queue: MessageFromExtensionToWebview[] = []
    flushQueue = () => {
        const queue = FrontWebview.queue
        loggerExt.info('🔥', `flushing queue of ${queue.length} messages`)
        queue.forEach((msg) => FrontWebview.sendMessage(msg))
        queue.length = 0
    }

    static sendMessage(message: MessageFromExtensionToWebview) {
        const curr = FrontWebview.current
        if (curr == null || !curr.ready) {
            loggerExt.info('🔥', `queueing [${message.type}]`)
            FrontWebview.queue.push(message)
            // const errMsg = `no webview panel to send message a ${message.type}`
            // loggerExt.error('🔥', errMsg)
            // vscode.window.showErrorMessage(errMsg)
            return
        }

        const msg = JSON.stringify(message) // .slice(0, 10)
        // loggerExt.info('🔥', `sending ${message.type} to webview`)
        loggerExt.debug('🔥', `sending ` + msg)

        curr.panel.webview.postMessage(msg)
    }
    // ------------------------------------------------------------------------------------------------------------
    private _disposables: vscode.Disposable[] = []
    webview: vscode.Webview

    private constructor(
        private workspace: Workspace,
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
        // Set an event listener to listen for messages passed from the webview context
        panel.webview.onDidReceiveMessage(this.onMessageFromWebview, undefined, this._disposables)
    }

    /** wether or not the webview is up and running and react is mounted */
    ready = false

    /** Cleans up and disposes of webview resources when the webview panel is closed. */
    public dispose() {
        FrontWebview.current = undefined

        // Dispose of the current webview panel
        this.panel.dispose()
        this.ready = false

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
        const stylesUri = this.getExtensionLocalUri(['webview', 'assets', 'index.css'])
        const scriptUri = this.getExtensionLocalUri(['webview', 'assets', 'index.js'])
        const nonce = getNonce()

        return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Cushy Studio</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `
    }

    static with = <A>(fn: (current: FrontWebview) => A): A => {
        const curr = FrontWebview.current
        if (curr == null) throw new Error('no current panel')
        return fn(curr)
    }

    getExtensionLocalUri = (pathList: string[]): vscode.Uri => getUri(this.webview, this.extensionUri, pathList)

    onMessageFromWebview = (msg: MessageFromWebviewToExtension) => {
        // const command = smg.command
        // const text = smg.text

        if (msg.type === 'say-hello') {
            vscode.window.showInformationMessage(msg.message)
            return
        }

        if (msg.type === 'answer-boolean') {
            // window.showInformationMessage(msg.message)
            return
        }
        if (msg.type === 'answer-string') {
            // window.showInformationMessage(msg.message)
            return
        }
        if (msg.type === 'say-ready') {
            // window.showInformationMessage(msg.message)
            this.ready = true
            this.flushQueue()
            return
        }

        exhaust(msg)
    }
}
