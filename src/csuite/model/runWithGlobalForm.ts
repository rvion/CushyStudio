import type { Builder } from '../../controls/Builder'
import type { IBuilder } from './IBuilder'

// ---------------------------------------------
/**
 * @legacy
 * @deprecated
 */
export const runWithGlobalForm = <T>(_: IBuilder, f: () => T): T => {
    return f()
}

/**
 * @legacy
 * @deprecated
 */
export const getCurrentForm_IMPL = (): Builder => {
    return cushy.builder
}
