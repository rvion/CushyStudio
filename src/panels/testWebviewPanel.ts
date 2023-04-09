import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from 'vscode'
import { getUri } from '../fs/getUri'
import { getNonce } from '../fs/getNonce'
import { logger } from '../logger/Logger'
import { MessageFromExtensionToWebview } from './MessageFromExtensionToWebview'

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
export class ProxyToWebview {
    public static currentPanel: ProxyToWebview | undefined
    readonly _panel: WebviewPanel
    private _disposables: Disposable[] = []

    static send(message: MessageFromExtensionToWebview) {
        ProxyToWebview.send_RAW(message)
    }
    static send_RAW(message: unknown) {
        const curr = ProxyToWebview.currentPanel
        if (curr == null) {
            logger.error('🔥', 'no webview panel to send message to')
            return
        }
        const msg = JSON.stringify(message) // .slice(0, 10)
        logger.info('🔥', 'sending message to webview panel: ' + msg)

        curr._panel.webview.postMessage(msg)
    }

    /** The HelloWorldPanel class private constructor (called only from the render method). */
    private constructor(
        /** A reference to the webview panel */
        panel: WebviewPanel,
        /** The URI of the directory containing the extension */
        extensionUri: Uri,
    ) {
        this._panel = panel

        // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
        // the panel or when the panel is closed programmatically)
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables)

        // Set the HTML content for the webview panel
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri)

        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener(this._panel.webview)
    }

    /**
     * Renders the current webview panel if it exists otherwise a new webview panel
     * will be created and displayed.
     *
     * @param extensionUri The URI of the directory containing the extension.
     */
    public static render(extensionUri: Uri) {
        if (ProxyToWebview.currentPanel) {
            // If the webview panel already exists reveal it
            ProxyToWebview.currentPanel._panel.reveal(ViewColumn.Two)
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

            ProxyToWebview.currentPanel = new ProxyToWebview(panel, extensionUri)
        }
    }

    /**
     * Cleans up and disposes of webview resources when the webview panel is closed.
     */
    public dispose() {
        ProxyToWebview.currentPanel = undefined

        // Dispose of the current webview panel
        this._panel.dispose()

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
    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
        // The  JS and CSS files from our build output
        const stylesUri = getUri(webview, extensionUri, ['webview', 'assets', 'index.css'])
        const scriptUri = getUri(webview, extensionUri, ['webview', 'assets', 'index.js'])
        const nonce = getNonce()
        return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
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
