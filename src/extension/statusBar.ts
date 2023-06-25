import { autorun } from 'mobx'

import * as vscode from 'vscode'
import { ExtensionState } from './ExtensionState'

export class StatusBar {
    myStatusBarItem: vscode.StatusBarItem

    constructor(public extension: ExtensionState) {
        this.myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99999)

        const subscriptions = extension.context.subscriptions
        subscriptions.push(this.myStatusBarItem)
        const server = this.extension.serverState

        this.myStatusBarItem.text = '❓ cushy studio'
        this.myStatusBarItem.show()

        autorun(() => {
            const nbClients = server.clients.size
            const nbNodes = server.schema.nodes.length
            const hasSID = server.comfySessionId != 'temp'
            const isConnected = server.ws.isOpen
            const txt = [
                //

                `${nbClients > 0 ? '🟢' : '🔴'} ${nbClients} clients`,
                `${nbNodes > 0 ? '🟢' : '🔴'} ${nbNodes} nodes`,
                `${hasSID && isConnected ? '🟢' : isConnected ? '🔶' : '🔴'} ws`,
            ].join(' | ')

            if (this.extension) this.myStatusBarItem.backgroundColor = 'green'
            this.myStatusBarItem.text = `[🛋️ ${txt}]`
            this.myStatusBarItem.show()
        })
    }
}
