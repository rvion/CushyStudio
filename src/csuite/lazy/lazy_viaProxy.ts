/**
 *
 * Below is a TypeScript implementation of a lazy() function that defers the execution
 * of a provided lambda (factory function) until the returned proxy object is actually used.
 * This way, you avoid the cost of instantiating expensive objects unless they are needed.
 */
export function lazy_viaProxy<T extends object>(factory: () => T): T {
    let instance: T | undefined = undefined

    const handler: ProxyHandler<any> = {
        get(target, prop, receiver) {
            if (instance === undefined) {
                instance = factory()
            }
            return Reflect.get(instance, prop, receiver)
        },
        set(target, prop, value, receiver) {
            if (instance === undefined) {
                instance = factory()
            }
            return Reflect.set(instance, prop, value, receiver)
        },
        apply(target, thisArg, argumentsList) {
            if (instance === undefined) {
                instance = factory()
            }
            return Reflect.apply(instance as any, thisArg, argumentsList)
        },
        construct(target, argumentsList, newTarget) {
            if (instance === undefined) {
                instance = factory()
            }
            return Reflect.construct(instance as any, argumentsList, newTarget)
        },
        has(target, prop) {
            if (instance === undefined) {
                instance = factory()
            }
            return Reflect.has(instance, prop)
        },
        ownKeys(target) {
            if (instance === undefined) {
                instance = factory()
            }
            return Reflect.ownKeys(instance)
        },
        getOwnPropertyDescriptor(target, prop) {
            if (instance === undefined) {
                instance = factory()
            }
            return Reflect.getOwnPropertyDescriptor(instance, prop)
        },
        // Add other traps as necessary
    }

    // Use a function as the proxy target to handle both object and function behaviors
    const proxy = new Proxy(function () {}, handler)

    return proxy as T
}
