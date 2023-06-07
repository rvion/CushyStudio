const tab = '    '
export function readableStringify(obj: any, maxLevel = 3, level = 0) {
    if (level > maxLevel) return JSON.stringify(obj)
    if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj)
    const indent = '  '.repeat(level)
    let result = '{\n'
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const value = (obj as any)[key]
        if (value === undefined) continue
        const valueType = typeof value

        if (i > 0) result += ','
        if (Array.isArray(value)) {
            result += `${indent}  "${key}": ${JSON.stringify(value)}`
        } else if (valueType === 'object' && value !== null) {
            result += `${indent}  "${key}": ${readableStringify(value, maxLevel, level + 1)}`
        } else {
            const formattedValue = valueType === 'string' ? JSON.stringify(value) : value
            result += `${indent}  "${key}": ${formattedValue}`
        }
        result += '\n'
    }
    result += `${tab.repeat(Math.max(0, level - 1))}}`

    return result
}
