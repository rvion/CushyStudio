const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/

const isValidJSKey = (s: string): boolean => {
   return regex.test(s)
}

export const escapeJSKey = (s: string): string => {
   if (typeof s !== 'string') {
      return 'string'
      // console.log(s)
      // debugger
   }
   // ❌ probably wrong
   if (!isValidJSKey(s)) {
      // debugger
      return `"${s}"`
   }
   return s
}

export const asJSAccessor = (s: string): string => {
   if (typeof s !== 'string') {
      return 'string'
      // console.log(s)
      // debugger
   }
   if (!isValidJSKey(s)) {
      // debugger
      return `["${s}"]`
   }
   return `.${s}`
}
