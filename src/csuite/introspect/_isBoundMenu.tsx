/** this module helps break the import cycle between MenuUI and Menu  */
import type { BoundMenu } from '../menu/BoundMenuOpts'

// 🔵 Explore: should I use Symbol.for here for extra sefety ?
export const BoundMenuSym = Symbol('BoundMenu')

export const isBoundMenu = (x: any): x is BoundMenu =>
    x != null && //
    typeof x === 'object' &&
    '$SYM' in x &&
    x.$SYM === BoundMenuSym
