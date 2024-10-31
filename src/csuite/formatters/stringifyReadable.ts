const tab = '    '
export function readableStringify(obj: any, maxLevel = 3, level = 0): string {
   if (level > maxLevel) return JSON.stringify(obj)
   if (typeof obj !== 'object' || obj === null) return JSON.stringify(obj)
   const indent = '    '.repeat(level + 1)
   let result = '{\n'
   const keys = Object.keys(obj)
   for (let i = 0; i < keys.length; i++) {
      const key = keys[i]!
      const value = (obj as any)[key]
      if (value === undefined) continue
      const valueType = typeof value

      if (i > 0) result += ','
      const thisIndent = i > 0 ? indent.slice(1) : indent
      if (Array.isArray(value)) {
         result += `${thisIndent}${JSON.stringify(key)}: ${JSON.stringify(value)}`
      } else if (valueType === 'object' && value !== null) {
         result += `${thisIndent}${JSON.stringify(key)}: ${readableStringify(value, maxLevel, level + 1)}`
      } else {
         const formattedValue = valueType === 'string' ? JSON.stringify(value) : value
         result += `${thisIndent}${JSON.stringify(key)}: ${formattedValue}`
      }
      result += '\n'
   }
   result += `${tab.repeat(Math.max(0, level))}}`

   return result
}
