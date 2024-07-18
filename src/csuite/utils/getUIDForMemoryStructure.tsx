import { nanoid } from 'nanoid'

const wm = new WeakMap()

export function getUIDForMemoryStructure(x: object): string {
    const prev = wm.get(x)
    if (prev) return prev
    const uid = nanoid()
    wm.set(x, uid)
    return uid
}
