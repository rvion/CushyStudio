// quick helper for markdown
// todo: 🦊 2023-10-29 move elsewhere

export const _FIX_INDENTATION = (str: TemplateStringsArray) => {
   if (str.length === 0) return ''
   // split string into lines
   let lines = str[0]!.split('\n').slice(1)
   const indent = (lines[0]! ?? '').match(/^\s*/)![0].length
   // trim whitespace at the start and end of each line
   lines = lines.map((line) => line.slice(indent))
   // join lines back together with preserved newlines
   return lines.join('\n')
}
