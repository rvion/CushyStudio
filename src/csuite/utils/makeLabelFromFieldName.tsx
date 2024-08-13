// 💬 2024-05-28 rvion: this code is HORRIBLE and slow. 🐌
// 🔴 todo: rewrite this
export function makeLabelFromFieldName(s: string): string {
    if (typeof s !== 'string') {
        // debugger
        // throw new Error(`makeLabelFromFieldName: expected string, got ${typeof s} (${s})`)
        console.log(`[❌] makeLabelFromFieldName: expected string, got ${typeof s} (${s})`)
    }
    if (s == null) return ''
    if (s.length === 0) return s
    s = s.replace(/([a-z])([A-Z])/g, '$1 $2')
    s = s.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    s = s.replace(/_/g, ' ')
    s = s.replace(/([a-z])([A-Z])/g, '$1 $2')
    s = s.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    // handle numbers
    s = s.replace(/([0-9])([a-zA-Z])/g, '$1 $2')
    s = s.replace(/([a-zA-Z])([0-9])/g, '$1 $2')
    return s[0]!.toUpperCase() + s.slice(1)
}
