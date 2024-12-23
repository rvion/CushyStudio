export const mapObjectEntries = <T, U>(
   /** object you want to transform values */
   obj: Record<string, T>,
   /** function to apply to every values */
   mapFn: (key: string, value: T, ix: number) => [string, U],
): Record<string, U> => {
   const out: Record<string, U> = {}
   let ix = 0
   for (const key in obj) {
      const [nextK, nextV] = mapFn(key, obj[key]!, ix++)
      out[nextK] = nextV
   }
   return out
}
