export const mapObjectValues = <T, U>(
   /** object you want to transform values */
   obj: Record<string, T>,
   /** function to apply to every values */
   mapFn: (key: string, value: T, ix: number) => U,
): Record<string, U> => {
   const out: Record<string, U> = {}
   let ix = 0
   for (const key in obj) out[key] = mapFn(key, obj[key]!, ix++)
   return out
}
