import type * as vscode from 'vscode'
import type { Maybe } from '../utils/types'

export interface ILogger {
    chanel?: Maybe<vscode.OutputChannel>
    debug(category: LogCategory, message: string): void
    info(category: LogCategory, message: string): void
    warn(category: LogCategory, message: string): void
    error(category: LogCategory, message: string, ...items: any[]): void
}

export interface LogMessage {
    level: LogLevel
    category: LogCategory
    message: string
    timestamp: Date
}

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
}

export type LogCategory =
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
