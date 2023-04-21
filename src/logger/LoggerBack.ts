import type { Maybe } from '../utils/types'

import { makeAutoObservable } from 'mobx'
import * as vscode from 'vscode'
import { ILogger, LogCategory, LogLevel } from './LogTypes'
import { logger, registerLogger } from './logger'

export class LoggerBack implements ILogger {
    /**
     *  - available in the extension process
     *  - not available in the webview process
     */
    chanel?: Maybe<vscode.OutputChannel>
    constructor(public level: LogLevel = LogLevel.INFO) {
        this.level = level
        makeAutoObservable(this)
        registerLogger(this)
    }

    debug(category: LogCategory, message: string): void {
        if (this.level > LogLevel.DEBUG) return
        this.chanel?.appendLine(`[DEBUG] ${message}`)
        console.debug(`[DEBUG] ${message}`)
    }

    info(category: LogCategory, message: string): void {
        if (this.level > LogLevel.INFO) return
        this.chanel?.appendLine(`${category} ℹ️ ${message}`)
        console.info(`[INFO] ${message}`)
    }

    warn(category: LogCategory, message: string): void {
        if (this.level > LogLevel.WARN) return
        this.chanel?.appendLine(`${category} 🔶 ${message}`)
        console.warn(`[WARNING] ${message}`)
    }

    error(category: LogCategory, message: string, ...items: any[]): void {
        if (this.level > LogLevel.ERROR) return
        this.chanel?.appendLine(`${category} ❌ ${message}`)
        console.error(`[ERROR] ${message}`)
        vscode.window.showErrorMessage(message, ...items)
    }
}

new LoggerBack()
