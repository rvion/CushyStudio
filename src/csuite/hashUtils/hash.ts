export const hashJSONObjectToNumber = (obj: object): number => hashStringToNumber(stableStringify(obj))

export const hashStringToNumber = (s: string): number => {
    let hash = 0,
        i,
        chr
    for (i = 0; i < s.length; i++) {
        chr = s.charCodeAt(i)
        hash = (hash << 5) - hash + chr
        hash |= 0 // Convert to 32bit integer
    }
    return hash
}

// extracted and modified from npm package "fast-json-stable-hash"
// because the npm package required crypto which didn't work on mobile

export function stableStringify(obj: any): string {
    const type = typeof obj
    if (type === 'string') return JSON.stringify(obj)
    if (Array.isArray(obj)) {
        let str = '['
        const al = obj.length - 1
        for (let i = 0; i < obj.length; i++) {
            str += stableStringify(obj[i])
            if (i !== al) str += ','
        }
        return `${str}]`
    }
    if (type === 'object' && obj !== null) {
        let str = '{'
        const keys = Object.keys(obj)
            .filter((k) => obj[k] !== undefined)
            .sort()
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]!
            const val = (obj as any)[key]
            if (val === undefined) continue
            if (i !== 0) str += ','
            str += `${JSON.stringify(key)}:${stableStringify(val)}`
        }
        return `${str}}`
    }
    if (type === 'number' || type === 'boolean' || obj == null) {
        // bool, num, null have correct auto-coercions
        return `${obj}`
    }

    throw new TypeError(`Invalid JSON type of ${type}, value ${obj}. FJSH can only hash JSON objects.`)
}
