/**
 *
 * try to clone the structure of an object as best as possible
 *
 * SEMANTIC:
 *
 *  0 CUSTOM-clone
 *      - anything that has a `potatoClone` method or [Symbol.for('🥔')] method
 *
 *  1. TRUE DEEP-clone
 *      - JSON-like objects
 *          - for JSON structure, potatoClone will work like `JSON.parse(JSON.stringify(obj))` bu)
 *      - Date, RegExp, BigInt, ...
 *
 *  2. SHALLOW-clone
 *      - most containers (arrays)
 *
 *  3. DON'T-clone (passed back as-is / will NOT visit children)
 *     - classes (obj.constructor !== Object)
 *     - WeakMap, WeakSet, ...
 *     - Functions, Errors, Promises
 *
 *  4. LOSE information
 *   - object getters will be lost
 *   - proxies will get removed
 *      - will remove mobx proxies (unless within a class, see 3. classes will be sent back as-is)
 *
 **/
export const potatoSymbol = Symbol.for('🥔')

export function potatoClone<T extends any>(obj: T): T {
    // 1. primitives and null/undefined
    if (obj === null || typeof obj !== 'object') return obj

    // special case if we have a better way to clone
    // or just a way
    if ('potatoClone' in obj) return (obj as any).potatoClone()
    if (potatoSymbol in obj) return (obj as any)[potatoSymbol]()

    // 2. regular objects
    if (obj.constructor === Object) {
        const newObj = {} as T

        // Won't work with { foo: 1, get bar() { return this.foo }}
        for (const key in obj) {
            newObj[key] = potatoClone(obj[key])
        }
        return newObj
    }

    // basic containers
    if (obj instanceof Array) return obj.map(potatoClone) as T
    if (obj instanceof Set) return new Set([...obj.values()].map(potatoClone)) as T
    if (obj instanceof Map) return new Map([...obj.entries()].map(([k, v]) => [k, potatoClone(v)] as const)) as T

    // common types
    if (obj instanceof Date) return new Date(obj.getTime()) as T
    if (obj instanceof RegExp) return new RegExp(obj) as T

    // common stuff we don't want to clone
    if (obj instanceof Promise) return obj
    if (obj instanceof Error) return obj
    if (obj instanceof Function) return obj

    // weak containers (we just can't clone them)
    if (obj instanceof WeakMap) return obj
    if (obj instanceof WeakSet) return obj

    // exotic stuff => let's do the minimum viable clone possible
    if (obj instanceof ArrayBuffer) return obj.slice(0) as T
    if (obj instanceof DataView) return new DataView(obj.buffer.slice(0)) as T
    if (obj instanceof Float32Array) return new Float32Array(obj) as T
    if (obj instanceof Float64Array) return new Float64Array(obj) as T
    if (obj instanceof Int8Array) return new Int8Array(obj) as T
    if (obj instanceof Int16Array) return new Int16Array(obj) as T
    if (obj instanceof Int32Array) return new Int32Array(obj) as T
    if (obj instanceof Uint8Array) return new Uint8Array(obj) as T
    if (obj instanceof Uint8ClampedArray) return new Uint8ClampedArray(obj) as T
    if (obj instanceof Uint16Array) return new Uint16Array(obj) as T
    if (obj instanceof Uint32Array) return new Uint32Array(obj) as T
    if (obj instanceof BigInt64Array) return new BigInt64Array(obj) as T
    if (obj instanceof BigUint64Array) return new BigUint64Array(obj) as T

    // stuff we're not sure about
    // | okay, the ocean is full of fish, we can't know them all, and it's okay.
    // | life moves one, and so do we.
    return obj
}
