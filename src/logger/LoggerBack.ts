import type { Maybe } from '../utils/types'

import { makeAutoObservable } from 'mobx'
import * as vscode from 'vscode'
import { ILogger, LogLevel } from './LogTypes'
import { registerLogger } from './logger'
import { Printable } from '../core/Printable'

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

    stringify = (message: Printable[]): string => {
        return message.map((m) => (typeof m === 'string' ? m : JSON.stringify(m))).join(' ')
    }

    debug(...messages: Printable[]): void {
        if (this.level > LogLevel.DEBUG) return
        const str = `[DEBUG] ${this.stringify(messages)}`
        this.chanel?.appendLine(str)
        console.debug(str)
    }

    info(...messages: Printable[]): void {
        if (this.level > LogLevel.INFO) return
        const str = `ℹ️ ${this.stringify(messages)}`
        this.chanel?.appendLine(str)
        console.info(str)
    }

    warn(...messages: Printable[]): void {
        if (this.level > LogLevel.WARN) return
        const str = `🔶 ${this.stringify(messages)}`
        this.chanel?.appendLine(str)
        console.warn(str)
    }

    error(...messages: Printable[]): void {
        if (this.level > LogLevel.ERROR) return
        const str = `❌ ${this.stringify(messages)}`
        this.chanel?.appendLine(str)
        console.error(str)
        // vscode.window.showErrorMessage(str)
    }
}

new LoggerBack()
