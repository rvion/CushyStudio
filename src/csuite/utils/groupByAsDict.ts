export function groupByAsDict<T>(arr: T[], key: (t: T) => string): Record<string, T[]> {
   const res: Record<string, any[]> = {}
   for (const x of arr) {
      const k = key(x)
      if (res[k] == null) res[k] = []
      res[k].push(x)
   }
   return res
}
