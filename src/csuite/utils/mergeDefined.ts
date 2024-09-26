export const mergeDefined = <A>(a: A, ...bs: A[]): A => {
    const out: A = { ...a }

    let didChange = false

    for (const b of bs) {
        for (const key in b) {
            if (b[key] !== undefined) {
                out[key] = b[key]
                didChange = true
            }
        }
    }

    if (didChange) {
        return out
    }
    return a
}
