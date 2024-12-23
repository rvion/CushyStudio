export const createRandomGenerator = (hash: string) => {
   const seed = xmur3(hash)()
   const random = mulberry32(seed)
   const randomInt = (minInclusive = 0, maxExclusive = Number.MAX_SAFE_INTEGER): number =>
      Math.min(minInclusive + Math.floor(random() * (maxExclusive - minInclusive)), maxExclusive - 1)
   const randomItem = <T>(items: T[]): T | undefined => items[randomInt(0, items.length)]
   return { random, randomInt, randomItem }
}

// FROM: https://stackoverflow.com/a/47593316/567524
function xmur3(str: string): () => number {
   let h = 1779033703 ^ str.length
   for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
      h = (h << 13) | (h >>> 19)
   }

   return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507)
      h = Math.imul(h ^ (h >>> 13), 3266489909)
      return (h ^= h >>> 16) >>> 0
   }
}

function mulberry32(a: number): () => number {
   return () => {
      let t = (a += 0x6d2b79f5)
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
   }
}
