import { autorun, reaction } from 'mobx'
import type { Workspace } from './Workspace'

import * as vscode from 'vscode'

export class StatusBar {
    myStatusBarItem: vscode.StatusBarItem

    constructor(public workspace: Workspace) {
        this.myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99999)
        // this.myStatusBarItem.command = myCommandId

        const subscriptions = workspace.context.subscriptions
        subscriptions.push(this.myStatusBarItem)
        // vscode.workspace.onDidChangeConfiguration((e) => {
        //     if (e.affectsConfiguration('cushystudio.serverHostHTTP')) this.updateStatusBarItem(`🟢 serverHostHTTP`)
        //     if (e.affectsConfiguration('cushystudio.serverWSEndoint')) this.updateStatusBarItem(`🟢 serverWSEndoint`)
        // })
        this.myStatusBarItem.text = '❓ cushy studio'
        this.myStatusBarItem.show()

        autorun(() => {
            const nbClients = this.workspace.clients.size
            const txt = [
                //
                `${nbClients > 0 ? '🟢' : '🔴'} ${nbClients} clients`,
            ].join(' | ')

            if (this.workspace) this.myStatusBarItem.backgroundColor = 'green'
            this.myStatusBarItem.text = txt
            this.myStatusBarItem.show()
        })
    }

    // updateStatusBarItem = (txt: string) => {
    //     // const n = getNumberOfSelectedLines(vscode.window.activeTextEditor)
    //     // if (n > 0) {
    //     console.log(txt)
    //     // } else {
    //     //     myStatusBarItem.hide()
    //     // }
    // }
}
