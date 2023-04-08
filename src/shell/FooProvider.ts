import * as vscode from 'vscode'

export class FooProvider implements vscode.TreeDataProvider<string> {
    onDidChangeTreeData?: vscode.Event<string | void | string[] | null | undefined> | undefined
    getTreeItem(element: string): vscode.TreeItem | Thenable<vscode.TreeItem> {
        throw new Error('Method not implemented.')
    }
    getChildren(element?: string | undefined): vscode.ProviderResult<string[]> {
        throw new Error('Method not implemented.')
    }
    getParent?(element: string): vscode.ProviderResult<string> {
        throw new Error('Method not implemented.')
    }
    resolveTreeItem?(
        item: vscode.TreeItem,
        element: string,
        token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.TreeItem> {
        throw new Error('Method not implemented.')
    }
}
