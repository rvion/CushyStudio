export const bang = <T>(x: T | null): T => {
    if (x == null) throw new Error('bang')
    return x
}
