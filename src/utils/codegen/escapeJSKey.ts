export const escapeJSKey = (s: string) => {
    if (typeof s !== 'string') {
        // 🔴 ⁉️
        return 'string'
        // console.log(s)
        // debugger
    }
    // ❌ probably wrong
    if (!s.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
        // debugger
        return `"${s}"`
    }
    return s
}

export const asJSAccessor = (s: string) => {
    if (typeof s !== 'string') {
        return 'string'
        // console.log(s)
        // debugger
    }
    if (!s.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
        // debugger
        return `["${s}"]`
    }
    return `.${s}`
}
