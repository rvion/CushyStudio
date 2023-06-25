import type { Maybe } from './types'

/** assertNotNull */
export const bang = <T>(x: Maybe<T>): T => {
    if (x == null) throw new Error('bang')
    return x
}
