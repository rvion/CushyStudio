export const normalizeJSIdentifier = (name: string) => {
    return name
        .replace(/[^a-zA-Z0-9_]/g, ' ')
        .split(' ')
        .map((i) => i.trim())
        .filter((i) => i.length > 0)
        .map((i) => i[0].toUpperCase() + i.slice(1))
        .join('')
}
