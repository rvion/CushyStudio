type ClassLike = string | { [cls: string]: any } | null | undefined | boolean
export const cls = (...args: ClassLike[]): string => {
   return buildArray(...args).join(' ')
}

export const buildArray = (...args: ClassLike[]): string[] => {
   const out: string[] = []
   for (const arg of args) {
      if (arg == null) continue
      if (typeof arg === 'string') out.push(arg)
      if (typeof arg === 'object') {
         for (const key of Object.keys(arg)) {
            if (arg[key]) out.push(key)
         }
      }
   }
   return out
}
