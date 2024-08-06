/** this module helps break the import cycle between MenuUI and Command  */
import type { BoundCommand } from '../commands/BoundCommand'

// 🔵 Explore: should I use Symbol.for here for extra sefety ?
export const BoundCommandSym = Symbol('BoundCommand')

export const isBoundCommand = (x: any): x is BoundCommand =>
    x != null && //
    typeof x === 'object' &&
    '$SYM' in x &&
    x.$SYM === BoundCommandSym
