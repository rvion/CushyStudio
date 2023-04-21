import { makeAutoObservable } from 'mobx'
import { ILogger, LogCategory, LogLevel, LogMessage } from './LogTypes'
import { registerLogger } from './logger'

export class LoggerFront implements ILogger {
    history: LogMessage[] = []

    constructor(public level: LogLevel = LogLevel.INFO) {
        this.level = level
        makeAutoObservable(this)
        registerLogger(this)
    }

    private addToLogHistory(level: LogLevel, category: LogCategory, message: string): void {
        if (this.history.length >= 100) this.history.shift()
        this.history.push({ message, category, level, timestamp: new Date() })
    }

    public debug(category: LogCategory, message: string): void {
        if (this.level > LogLevel.DEBUG) return
        this.addToLogHistory(LogLevel.DEBUG, category, message)
        console.debug(`[DEBUG] ${message}`)
    }

    public info(category: LogCategory, message: string): void {
        if (this.level > LogLevel.INFO) return
        this.addToLogHistory(LogLevel.INFO, category, message)
        console.info(`[INFO] ${message}`)
    }

    public warn(category: LogCategory, message: string): void {
        if (this.level > LogLevel.WARN) return
        this.addToLogHistory(LogLevel.WARN, category, message)
        console.warn(`[WARNING] ${message}`)
    }

    public error(category: LogCategory, message: string): void {
        if (this.level > LogLevel.ERROR) return
        this.addToLogHistory(LogLevel.ERROR, category, message)
        console.error(`[ERROR] ${message}`)
    }
}

new LoggerFront()
