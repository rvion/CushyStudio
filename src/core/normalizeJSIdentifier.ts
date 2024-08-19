export const convertComfyNodeNameToCushyNodeNameValidInJS = (name: string): string => {
    return normalizeJSIdentifier(name, ' ')
}

export const convetComfySlotNameToCushySlotNameValidInJS = (name: string): string => {
    return normalizeJSIdentifier(name, '_')
}

/**
 * there is sadly no perfect normalization for JS identifiers
 * ComfyUI node names tend to use spaces ' '
 * ComfyUI node outputs tend to use underscore '_'
 * so I'm trying to normalize this as best as I can
 * based on the content to be normalized
 * */
export const normalizeJSIdentifier = (
    //
    name: string,
    preferedSeparatorToKeepReadable: ' ' | '_',
): string => {
    let out = ''
    if (name.length > 0 && '0123456789'.includes(name[0]!)) out += '_'
    for (const char of name) out += mapChar(char, preferedSeparatorToKeepReadable)
    return out
}

const p1 = /[a-zA-Z0-9]/
const mapChar = (
    //
    char: string,
    preferedSeparatorToKeepReadable: ' ' | '_',
): string => {
    if (p1.test(char)) return char

    if (preferedSeparatorToKeepReadable === ' ') {
        if (char === ' ') return '_'
        if (char === '_') return '$_'
    } else {
        if (char === ' ') return '$_'
        if (char === '_') return '_'
    }

    if (char === '$') return '$$'
    if (char === '*') return '$Star'
    if (char === '&') return '$And'
    if (char === '(') return '$1'
    if (char === ')') return '$2'
    if (char === '/') return '$3'
    if (char === ':') return '$4'
    if (char === '.') return '$5'
    if (char === '+') return '$6'
    if (char === '-') return '$7'
    if (char === '|') return '$8'
    if (char === ',') return '$9'
    return `$$${char.charCodeAt(0).toString(16).toUpperCase()}`
}
