export function extractComponentName(type) {
   if (type == null) return null // recursivity terminal condition
   if (typeof type === 'string') return null // discard 'div', 'span', etc.
   if (type.name) return '🔘' + type.name
   if (type.displayName) return '🔘' + type.displayName
   return extractComponentName(type.type) // recrusively descend into type, so we can go though HOCs, Memo, or even React Contexts
}
