import type { IBuilder } from './IBuilder'

import { builder, type Builder } from '../../controls/Builder'

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
    return builder
}
