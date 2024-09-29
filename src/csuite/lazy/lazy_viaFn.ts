export function lazy_viaFn<T>(factory: () => T): () => T {
    let instance: T | undefined = undefined
    return () => {
        if (instance === undefined) {
            instance = factory()
        }
        return instance
    }
}
