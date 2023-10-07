export function stringifyUnknown(val: unknown): string {
    if (val == null) return 'null'

    if (typeof val === 'string') return val
    if (typeof val === 'number') return val.toString()
    if (typeof val === 'undefined') return 'undefined'

    if (val instanceof Error) return val.message

    try {
        return JSON.stringify(val)
    } catch (_err) {
        return val.toString()
    }
}
