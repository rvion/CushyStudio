import type { ILogger } from './LogTypes'

export let logger!: ILogger
export const registerLogger = (logger: ILogger) => {
    logger = logger
}
