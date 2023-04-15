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
