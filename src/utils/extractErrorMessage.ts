/** Extracts an error message from an exception stuff. */
export const extractErrorMessage = (error: any): string => {
    if (error instanceof Error) {
        return error.message
    } else if (typeof error === 'string') {
        return error
    } else if (typeof error === 'object') {
        return error.message || JSON.stringify(error)
    } else {
        return String(error)
    }
}
