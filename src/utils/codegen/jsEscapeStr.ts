export function jsEscapeStr(x: any) {
   if (typeof x === 'string') return JSON.stringify(x)
   if (typeof x === 'number') return x.toString()
   if (typeof x === 'boolean') return x.toString()
   return x
}
