export const hole = Symbol.for('HOLE')
export type HOLE = typeof hole
export function isHole(t: unknown): t is HOLE {
   return t === hole
}
