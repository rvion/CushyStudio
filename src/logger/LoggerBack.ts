import type { Maybe } from '../utils/ComfyUtils'

import { LogCategory, LogLevel, LogMessage } from './LogTypes'
import { makeAutoObservable } from 'mobx'
import * as vscode from 'vscode'

export class Logger {
    history: LogMessage[] = []

    /**
     *  - available in the extension process
     *  - not available in the webview process
     */
    chanel: Maybe<vscode.OutputChannel>
    constructor(public level: LogLevel = LogLevel.INFO) {
        this.level = level
        makeAutoObservable(this)
    }

    private addToLogHistory(level: LogLevel, category: LogCategory, message: string): void {
        if (this.history.length >= 100) this.history.shift()
        this.history.push({ message, category, level, timestamp: new Date() })
    }

    public debug(category: LogCategory, message: string): void {
        if (this.level > LogLevel.DEBUG) return
        this.addToLogHistory(LogLevel.DEBUG, category, message)
        this.chanel?.appendLine(`[DEBUG] ${message}`)
        console.debug(`[DEBUG] ${message}`)
    }

    public info(category: LogCategory, message: string): void {
        if (this.level > LogLevel.INFO) return
        this.addToLogHistory(LogLevel.INFO, category, message)
        this.chanel?.appendLine(`[INFO] ${message}`)
        console.info(`[INFO] ${message}`)
    }

    public warn(category: LogCategory, message: string): void {
        if (this.level > LogLevel.WARN) return
        this.addToLogHistory(LogLevel.WARN, category, message)
        this.chanel?.appendLine(`[WARNING] ${message}`)
        console.warn(`[WARNING] ${message}`)
    }

    public error(category: LogCategory, message: string): void {
        if (this.level > LogLevel.ERROR) return
        this.addToLogHistory(LogLevel.ERROR, category, message)
        this.chanel?.appendLine(`[ERROR] ${message}`)
        console.error(`[ERROR] ${message}`)
    }
}

export const loggerExt = new Logger()
