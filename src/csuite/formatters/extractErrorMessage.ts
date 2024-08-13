/** Extracts an error message from an exception stuff. */
export const extractErrorMessage = (error: any): string => {
    if (error instanceof Error) return error.message
    if (typeof error === 'string') return error
    if (typeof error === 'object') return error.message || JSON.stringify(error)
    return String(error)
}
