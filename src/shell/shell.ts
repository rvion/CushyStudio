import * as vscode from 'vscode'

export class MyView implements vscode.WebviewViewProvider {
    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        token: vscode.CancellationToken,
    ): void {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')],
        }
        webviewView.webview.html = getWebviewContent(context.extensionUri, 'myView.html')
    }
}

export class MyActivityBarItem extends vscode.TreeItem {
    constructor(public readonly id: string, public readonly label: string, public readonly view: vscode.WebviewView) {
        super(label, vscode.TreeItemCollapsibleState.None)
        this.command = { command: 'myExtension.showView', title: label, arguments: [id] }
        this.iconPath = new vscode.ThemeIcon('symbol-event')
    }
}

export const start = () => {
    const myView = new MyView()
    const myActivityBarItem = new MyActivityBarItem('myView', 'My View', myView)
    vscode.window.createTreeView('myExtension.myActivityBar', { treeDataProvider: activityBarDataProvider })
    vscode.commands.executeCommand('setContext', 'myExtension.myActivityBarVisible', true)
    vscode.window.registerWebviewViewProvider('myView', myView)
}
