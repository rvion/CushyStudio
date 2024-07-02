import type { Json } from '../types/Json'

/**
 * Convert any value to a JSON-serializable value.
 * @since 2024-06-26
 * @stability unstable / broken
 */
export const convertToJSON_UNFINISHED = (val: unknown): Json => {
    if (
        typeof val === 'string' || //
        typeof val === 'number' ||
        typeof val === 'boolean'
    )
        return val

    if (val === null) return 'null'
    if (val == null) return 'undefined'
    if (val instanceof Date) return val.toISOString()
    if (val instanceof Set) return Array.from(val).map(convertToJSON_UNFINISHED)
    if (val instanceof Map) return Array.from(val).map(([k, v]) => [convertToJSON_UNFINISHED(k), convertToJSON_UNFINISHED(v)])
    if (val instanceof WeakMap) return `<❌ WeakMap; impossible to serialze to json>`
    if (Array.isArray(val)) return val.map(convertToJSON_UNFINISHED)
    try {
        return JSON.stringify(val)
    } catch (e) {
        return `<❌ '${typeof val}' impossible to serialize to json>`
    }
}
