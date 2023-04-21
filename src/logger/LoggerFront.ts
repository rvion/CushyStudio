import { makeAutoObservable } from 'mobx'
import { ILogger, LogLevel } from './LogTypes'
import { registerLogger } from './logger'

export class LoggerFront implements ILogger {
    constructor(public level: LogLevel = LogLevel.INFO) {
        this.level = level
        makeAutoObservable(this)
        registerLogger(this)
    }

    debug(...messages: any[]): void {
        if (this.level > LogLevel.DEBUG) return
        console.debug(`[DEBUG]`, ...messages)
    }

    info(...messages: any[]): void {
        if (this.level > LogLevel.INFO) return
        console.info(`[INFO]`, ...messages)
    }

    warn(...messages: any[]): void {
        if (this.level > LogLevel.WARN) return
        console.warn(`[WARNING]`, ...messages)
    }

    error(...messages: any[]): void {
        if (this.level > LogLevel.ERROR) return
        console.error(`[ERROR]`, ...messages)
    }
}

new LoggerFront()
