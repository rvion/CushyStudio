/**
 * There is sadly no perfect normalization for JS identifiers.
 * ComfyUI node names tend to use spaces ' '.
 * ComfyUI node outputs tend to use underscores '_'.
 * So I'm trying to normalize this as best as I can based on the content to be normalized.
 */
export const normalizeJSIdentifier = (name: string, preferredSeparatorToKeepReadable: ' ' | '_'): string => {
   const out: string[] = []
   const firstCharCode = name.charCodeAt(0)

   // If the first character is a digit, prepend an underscore
   if (firstCharCode >= 48 && firstCharCode <= 57) {
      // '0'-'9'
      out.push('_')
   }

   for (let i = 0; i < name.length; i++) {
      const char = name[i]!
      out.push(mapChar(char, preferredSeparatorToKeepReadable))
   }

   return out.join('')
}

const specialCharMap: { [key: string]: string } = {
   ' ': '_',
   _: '$_',
   $: '$$',
   '*': '$Star',
   '&': '$And',
   '(': '$1',
   ')': '$2',
   '/': '$3',
   ':': '$4',
   '.': '$5',
   '+': '$6',
   '-': '$7',
   '|': '$8',
   ',': '$9',
}

const specialCharMapAlt: { [key: string]: string } = {
   ' ': '$_',
   _: '_',
   $: '$$',
   '*': '$Star',
   '&': '$And',
   '(': '$1',
   ')': '$2',
   '/': '$3',
   ':': '$4',
   '.': '$5',
   '+': '$6',
   '-': '$7',
   '|': '$8',
   ',': '$9',
}

const mapChar = (char: string, preferredSeparatorToKeepReadable: ' ' | '_'): string => {
   const code = char.charCodeAt(0)

   // Check for alphanumeric characters
   if (
      (code >= 48 && code <= 57) || // '0'-'9'
      (code >= 65 && code <= 90) || // 'A'-'Z'
      (code >= 97 && code <= 122) // 'a'-'z'
   ) {
      return char
   }

   // Select appropriate mapping based on the preferred separator
   const mapping = preferredSeparatorToKeepReadable === ' ' ? specialCharMap : specialCharMapAlt
   const mappedChar = mapping[char]

   if (mappedChar) {
      return mappedChar
   }

   // Default case for other special characters
   return `$$${code.toString(16).toUpperCase()}`
}
