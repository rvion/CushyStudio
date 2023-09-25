/** assertNotNull */
export const bang = <T>(x: Maybe<T>): T => {
    if (x == null) throw new Error('bang')
    return x
}

export const ASSERT_ARRAY = (a: any) => {
    if (!Array.isArray(a)) throw new Error('❌ not an array')
}
