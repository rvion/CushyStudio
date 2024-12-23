/**
 * you probably want to use `potatoClone` instead
 * see `src/csuite/utils/potatoClone.ts`
 */
export function naiveDeepClone<T>(value: T): T {
   // handle `null` and `undefined`
   if (value == null) return value

   // handle primitives
   if (typeof value === 'string') return value
   if (typeof value === 'string') return value
   if (typeof value === 'number') return value

   // handle objects
   return JSON.parse(JSON.stringify(value))
}
