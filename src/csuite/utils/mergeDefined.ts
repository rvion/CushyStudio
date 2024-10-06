// would be awesome if we could combine getters
// too; so we could pass not-dereferenced values
// and still have them
export const mergeDefined = <A>(a: A, ...overrides: A[]): A => {
    const out: A = { ...a }

    let didChange = false

    for (const b of overrides) {
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
