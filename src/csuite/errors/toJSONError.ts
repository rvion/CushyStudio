import type { JSONDict } from '../types/Json'

import { convertToJSON_UNFINISHED } from './convertToJSON_UNFINISHED'

/** easy to store in database */
export type JSONError = {
    message: string
    name: string
    stack: string | null
    customFields: JSONDict
}

/** give it anything, and it will try to  */
export function toJSONError(thrown: unknown): JSONError {
    const isError = thrown instanceof Error

    // attempt to extract the key error fields (with fallback for non-errors)
    const OUT: JSONError = {
        message: isError ? thrown.message : String(thrown),
        name: isError ? thrown.name : typeof thrown,
        stack: isError ? thrown.stack ?? null : null,
        customFields: {} as JSONDict,
    }

    // attempt to preserve key extra properties on the error object
    if (isError) {
        // Extract any additional enumerable properties from the error object
        for (const key of Object.keys(thrown)) {
            OUT.customFields[key] = convertToJSON_UNFINISHED((thrown as any)[key])
        }
    } else if (typeof thrown === 'object' && thrown !== null) {
        // Capture all fields from non-error objects
        for (const [key, value] of Object.entries(thrown)) {
            OUT.customFields[key] = convertToJSON_UNFINISHED(value)
        }
    }

    return OUT
}
