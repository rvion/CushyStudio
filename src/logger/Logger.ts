import * as vscode from 'vscode'
import { makeAutoObservable } from 'mobx'

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

type Category =
    /** Comfy websocket */
    | '🧦'
    /** */
    | '🐰'
    | '🌠'
    /** monaco / typescript */
    | '👁️'
    /** Comfy HTTP */
    | '🦊'
    /** config files */
    | '🛋'
    /** execution emoji */
    | '🔥'
    /** fs operation */
    | '💿'

interface LogMessage {
    level: LogLevel
    category: Category
    message: string
    timestamp: Date
}

export class Logger {
    history: LogMessage[] = []
    chanel!: vscode.OutputChannel
    constructor(public level: LogLevel = LogLevel.INFO) {
        this.level = level
        makeAutoObservable(this)
    }

    private addToLogHistory(level: LogLevel, category: Category, message: string): void {
        if (this.history.length >= 100) this.history.shift()
        this.history.push({ message, category, level, timestamp: new Date() })
    }

    public debug(category: Category, message: string): void {
        if (this.level > LogLevel.DEBUG) return
        this.addToLogHistory(LogLevel.DEBUG, category, message)
        this.chanel.appendLine(`[DEBUG] ${message}`)
        console.debug(`[DEBUG] ${message}`)
    }

    public info(category: Category, message: string): void {
        if (this.level > LogLevel.INFO) return
        this.addToLogHistory(LogLevel.INFO, category, message)
        this.chanel.appendLine(`[INFO] ${message}`)
        console.info(`[INFO] ${message}`)
    }

    public warn(category: Category, message: string): void {
        if (this.level > LogLevel.WARN) return
        this.addToLogHistory(LogLevel.WARN, category, message)
        this.chanel.appendLine(`[WARNING] ${message}`)
        console.warn(`[WARNING] ${message}`)
    }

    public error(category: Category, message: string): void {
        if (this.level > LogLevel.ERROR) return
        this.addToLogHistory(LogLevel.ERROR, category, message)
        this.chanel.appendLine(`[ERROR] ${message}`)
        console.error(`[ERROR] ${message}`)
    }
}

export const logger = new Logger()
