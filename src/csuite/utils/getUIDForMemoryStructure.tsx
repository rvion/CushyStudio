import { nanoid } from 'nanoid'

const wm = new WeakMap()

export function getUIDForMemoryStructure(
   //
   x: unknown,
   nanoidLength?: number,
): string {
   if (x == null) return 'null'
   if (typeof x === 'number') return x.toString()
   if (typeof x === 'string') return x
   if (typeof x === 'boolean') return x.toString()
   const prev = wm.get(x)
   if (prev) return prev
   const uid = nanoid(nanoidLength ?? 4)
   wm.set(x, uid)
   return uid
}
