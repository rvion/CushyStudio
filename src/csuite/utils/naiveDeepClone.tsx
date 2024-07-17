export function naiveDeepClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value))
}
