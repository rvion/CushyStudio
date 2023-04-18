import type { Maybe } from '../utils/types'

import { LogCategory, LogLevel, LogMessage } from './LogTypes'
import { makeAutoObservable } from 'mobx'
import * as vscode from 'vscode'

export class Logger {
    /**
     *  - available in the extension process
     *  - not available in the webview process
     */
    chanel: Maybe<vscode.OutputChannel>
    constructor(public level: LogLevel = LogLevel.INFO) {
        this.level = level
        makeAutoObservable(this)
    }

    public debug(category: LogCategory, message: string): void {
        if (this.level > LogLevel.DEBUG) return
        this.chanel?.appendLine(`[DEBUG] ${message}`)
        console.debug(`[DEBUG] ${message}`)
    }

    public info(category: LogCategory, message: string): void {
        if (this.level > LogLevel.INFO) return
        this.chanel?.appendLine(`${category} ℹ️ ${message}`)
        console.info(`[INFO] ${message}`)
    }

    public warn(category: LogCategory, message: string): void {
        if (this.level > LogLevel.WARN) return
        this.chanel?.appendLine(`${category} 🔶 ${message}`)
        console.warn(`[WARNING] ${message}`)
    }

    public error(category: LogCategory, message: string, ...items: any[]): void {
        if (this.level > LogLevel.ERROR) return
        this.chanel?.appendLine(`${category} ❌ ${message}`)
        console.error(`[ERROR] ${message}`)
        vscode.window.showErrorMessage(message, ...items)
    }
}

export const loggerExt = new Logger()
