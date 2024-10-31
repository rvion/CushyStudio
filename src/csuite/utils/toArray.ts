export const toArray = <T>(iterable: { forEach: (fn: (arg: T) => any) => any }): T[] => {
   const items: T[] = []
   iterable.forEach((item) => items.push(item))
   return items
}
