import type * as vscode from 'vscode'
import type { Maybe } from '../utils/types'
import { Printable } from '../core-shared/Printable'

export interface ILogger {
    chanel?: Maybe<vscode.OutputChannel>
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
