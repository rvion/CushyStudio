import type { Workspace } from './Workspace'

import * as vscode from 'vscode'

export class StatusBar {
    myStatusBarItem: vscode.StatusBarItem
    constructor(public workspace: Workspace) {
        this.myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
        // this.myStatusBarItem.command = myCommandId

        const subscriptions = workspace.context.subscriptions
        subscriptions.push(this.myStatusBarItem)
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('cushystudio.serverHostHTTP')) this.updateStatusBarItem(`🟢 serverHostHTTP`)
            if (e.affectsConfiguration('cushystudio.serverWSEndoint')) this.updateStatusBarItem(`🟢 serverWSEndoint`)
        })
        this.myStatusBarItem.show()
    }

    updateStatusBarItem = (txt: string) => {
        // const n = getNumberOfSelectedLines(vscode.window.activeTextEditor)
        // if (n > 0) {
        console.log(txt)
        this.myStatusBarItem.text = txt
        this.myStatusBarItem.show()
        // } else {
        //     myStatusBarItem.hide()
        // }
    }
}
