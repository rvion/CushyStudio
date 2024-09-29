export const escapeJSKey = (s: string): string => {
    if (typeof s !== 'string') {
        return 'string'
        // console.log(s)
        // debugger
    }

    if (!isValidJSIdentifier(s)) {
        return `"${s}"`
    }
    return s
}

export const asJSAccessor = (s: string): string => {
    if (typeof s !== 'string') {
        return 'string'
        // console.log(s)
        // debugger
    }

    if (!isValidJSIdentifier(s)) {
        return `["${s}"]`
    }
    return `.${s}`
}

// Helper function to check if a string is a valid JavaScript identifier
function isValidJSIdentifier(s: string): boolean {
    if (s.length === 0) return false

    let code = s.charCodeAt(0)

    // Check if the first character is valid (letter, $, or _)
    if (
        !(
            (
                (code >= 65 && code <= 90) || // A-Z
                (code >= 97 && code <= 122) || // a-z
                code === 36 || // $
                code === 95
            ) // _
        )
    ) {
        return false
    }

    // Check remaining characters
    for (let i = 1; i < s.length; i++) {
        code = s.charCodeAt(i)
        if (
            !(
                (
                    (code >= 65 && code <= 90) || // A-Z
                    (code >= 97 && code <= 122) || // a-z
                    (code >= 48 && code <= 57) || // 0-9
                    code === 36 || // $
                    code === 95
                ) // _
            )
        ) {
            return false
        }
    }

    return true
}
