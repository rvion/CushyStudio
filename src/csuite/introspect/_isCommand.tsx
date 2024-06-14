/** this module helps break the import cycle between MenuUI and Command  */
import type { Command } from '../commands/Command'

// 🔵 Explore: should I use Symbol.for here for extra sefety ?
export const CommandSym = Symbol('Command')

export const isCommand = (x: any): x is Command =>
    x != null && //
    typeof x === 'object' &&
    '$SYM' in x &&
    x.$SYM === CommandSym
