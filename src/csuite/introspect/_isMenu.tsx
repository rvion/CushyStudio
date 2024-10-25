/** this module helps break the import cycle between MenuUI and Menu  */
import type { Menu } from '../menu/Menu'

// 🔵 Explore: should I use Symbol.for here for extra sefety ?
export const MenuSym = Symbol('BoundMenu')

// eslint-disable-next-line react-refresh/only-export-components
export const isMenu = (x: any): x is Menu =>
   x != null && //
   typeof x === 'object' &&
   '$SYM' in x &&
   x.$SYM === MenuSym
