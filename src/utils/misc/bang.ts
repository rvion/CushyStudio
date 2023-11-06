/** assertNotNull */
export const bang = <T>(x: Maybe<T>): T => {
    if (x == null) throw new Error('bang')
    return x
}

export function ASSERT_ARRAY(a: any): a is any[] {
    if (!Array.isArray(a)) throw new Error('❌ not an array')
    return true
}

export function ASSERT_EQUAL(a: any, b: any): a is any[] {
    if (a !== b) throw new Error('❌ not equal')
    return true
}

// ----------
export function ASSERT_STRING(a: any): a is string {
    if (typeof a !== 'string') throw new Error('❌ not a string')
    return true
}
export function asSTRING_orCrash(a: any): string {
    if (typeof a !== 'string') throw new Error('❌ not a string')
    return a
}
