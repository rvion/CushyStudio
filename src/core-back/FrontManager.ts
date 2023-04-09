import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from 'vscode'
import { getUri } from '../fs/getUri'
import { getNonce } from '../fs/getNonce'
import { loggerExt } from '../logger/LoggerBack'
import { MessageFromExtensionToWebview } from '../core-types/MessageFromExtensionToWebview'

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
export class FrontManager {
    public static currentPanel: FrontManager | undefined
    private _disposables: Disposable[] = []

    static send(message: MessageFromExtensionToWebview) {
        FrontManager.send_RAW(message)
    }

    private static send_RAW(message: unknown) {
        const curr = FrontManager.currentPanel
        if (curr == null) {
            loggerExt.error('🔥', 'no webview panel to send message to')
            return
        }
        const msg = JSON.stringify(message) // .slice(0, 10)
        loggerExt.info('🔥', 'sending message to webview panel: ' + msg)

        curr.panel.webview.postMessage(msg)
    }

    webview: Webview
    /**
     * singleton class;
     * do not use constructor directly;
     * instanciate via static 'render' method
     */
    private constructor(
        /** A reference to the webview panel */
        private panel: WebviewPanel,

        /** The URI of the directory containing the extension */
        private extensionUri: Uri,
    ) {
        this.webview = panel.webview
        // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
        // the panel or when the panel is closed programmatically)
        this.panel.onDidDispose(() => this.dispose(), null, this._disposables)

        // Set the HTML content for the webview panel
        this.webview.html = this._getWebviewContent()

        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener(this.panel.webview)
    }

    /**
     * Renders the current webview panel if it exists otherwise a new webview panel
     * will be created and displayed.
     *
     * @param extensionUri The URI of the directory containing the extension.
     */
    public static render(extensionUri: Uri) {
        if (FrontManager.currentPanel) {
            // If the webview panel already exists reveal it
            FrontManager.currentPanel.panel.reveal(ViewColumn.Two)
        } else {
            // If a webview panel does not already exist create and show a new one
            const panel = window.createWebviewPanel(
                // Panel view type
                'showHelloWorld',
                // Panel title
                'Hello World',
                // The editor column the panel should be displayed in
                ViewColumn.One,
                // Extra panel configurations
                {
                    retainContextWhenHidden: true,
                    enableCommandUris: true,
                    // Enable JavaScript in the webview
                    enableScripts: true,
                    // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
                    localResourceRoots: [
                        //
                        Uri.joinPath(extensionUri, 'out'),
                        Uri.joinPath(extensionUri, 'webview'),
                    ],
                },
            )

            FrontManager.currentPanel = new FrontManager(panel, extensionUri)
        }
    }

    /**
     * Cleans up and disposes of webview resources when the webview panel is closed.
     */
    public dispose() {
        FrontManager.currentPanel = undefined

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
        const stylesUri = this.getExtensionLocalUri(['webview', 'assets', 'index.css'])
        const scriptUri = this.getExtensionLocalUri(['webview', 'assets', 'index.js'])
        const nonce = getNonce()
        return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${this.webview.cspSource}; script-src 'nonce-${nonce}';">
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

    static with = <A>(fn: (current: FrontManager) => A): A => {
        const curr = FrontManager.currentPanel
        if (curr == null) throw new Error('no current panel')
        return fn(curr)
    }

    getExtensionLocalUri = (pathList: string[]): Uri => getUri(this.webview, this.extensionUri, pathList)

    /**
     * Sets up an event listener to listen for messages passed from the webview context and
     * executes code based on the message that is recieved.
     *
     * @param webview A reference to the extension webview
     * @param context A reference to the extension context
     */
    private _setWebviewMessageListener(webview: Webview) {
        webview.onDidReceiveMessage(
            (message: any) => {
                const command = message.command
                const text = message.text

                switch (command) {
                    case 'hello':
                        // Code that should run in response to the hello message command
                        window.showInformationMessage(text)
                        return
                    // Add more switch case statements here as more webview message commands
                    // are created within the webview context (i.e. inside media/main.js)
                }
            },
            undefined,
            this._disposables,
        )
    }
}
