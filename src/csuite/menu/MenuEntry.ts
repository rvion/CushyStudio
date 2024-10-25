import type { BoundCommand } from '../commands/BoundCommand'
import type { Command } from '../commands/Command'
import type { Field } from '../model/Field'
import type { RevealStateLazy } from '../reveal/RevealStateLazy'
import type { Menu } from './Menu'
import type { SimpleMenuAction } from './SimpleMenuAction'
import type { SimpleMenuModal } from './SimpleMenuModal'
import type { FC, ReactNode } from 'react'

// prettier-ignore
export type MenuEntry =
    /** inline subform  */
    | Field
    /** custom component  */
    /** a command */
    | Command /* command may be passed unbound: in that case, they retrieve their context from their provider */
    | BoundCommand
    | Menu
    /** simple MenuEntry */
    | SimpleMenuAction
    | SimpleMenuModal
    //
    | FC<{}>
    | ReactNode

// ACTIVITY STACK
export type MenuEntryWithKey = {
   entry: MenuEntry
   /** local key bound to that menu entry */
   char?: string
   /**
    * char index within the string;
    * (value kept around to speed up later processing to add underline at the right position)
    * */
   charIx?: number
   ref?: React.RefObject<RevealStateLazy>
}
