import type { ILogger } from './LogTypes'

export const ref: { value?: ILogger } = {}

export const logger = () => {
    if (ref.value == null) throw new Error('logger not registered')
    return ref.value
}

export const registerLogger = (logger: ILogger) => {
    console.log('registerLogger', logger)
    ref.value = logger
}
