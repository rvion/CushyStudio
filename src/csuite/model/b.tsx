export let b: Z.Builder = 0 as any
export function setBuilder(builder: Z.Builder): void {
   b = builder
}
export function getBuilder(): Z.Builder {
   if ((b as any) === 0) throw new Error('Builder not set yet')
   return b
}
