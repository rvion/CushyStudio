export const toArray = <T>(iterable: { forEach: (fn: (arg: T) => any) => any }) => {
   const items: T[] = []
   iterable.forEach((item) => items.push(item))
   return items
}
