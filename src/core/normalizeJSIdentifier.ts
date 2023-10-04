const p1 = /[a-zA-Z0-9_]/

const mapChar = (char: string) => {
    if (p1.test(char)) return char
    if (char === ' ') return '_'
    if (char === '$') return '$$'
    if (char === '*') return '$Star'
    if (char === '&') return '$And'
    if (char === '_') return '$_'
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

export const normalizeJSIdentifier = (name: string) => {
    let out = ''
    for (const char of name) out += mapChar(char)
    return out
}
