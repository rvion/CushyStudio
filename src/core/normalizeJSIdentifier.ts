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
    throw new Error(`❌ invalid char in node name: "${char}"`)
}
export const normalizeJSIdentifier = (name: string) => {
    if (name.startsWith('Enum_Image_Rembg_$')) debugger
    let out = ''
    // if (name === '*') return 'STAR'
    for (const char of name) out += mapChar(char)

    return out
    // return name
    //     .replace(/[^a-zA-Z0-9_]/g, ' ')
    //     .split(' ')
    //     .map((i) => i.trim())
    //     .filter((i) => i.length > 0)
    //     .map((i) => i[0].toUpperCase() + i.slice(1))
    //     .join('')
}
