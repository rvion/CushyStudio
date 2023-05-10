import { Printable } from '../core/Printable'

export interface ILogger {
    debug(...message: Printable[]): void
    info(...message: Printable[]): void
    warn(...message: Printable[]): void
    error(...message: Printable[]): void
}

export interface LogMessage {
    level: LogLevel
    message: string
    timestamp: Date
}

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}
