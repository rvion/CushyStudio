export class Lazy<T> {
    private factory: () => T
    private instance: T | undefined = undefined

    constructor(factory: () => T) {
        this.factory = factory
    }

    get value(): T {
        if (this.instance === undefined) {
            this.instance = this.factory()
        }
        return this.instance
    }
}
