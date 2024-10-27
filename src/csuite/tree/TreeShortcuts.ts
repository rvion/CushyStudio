import type { TreeView } from './TreeView'

import { TreeKeys } from './TreeKeys'

export type KeyEv = React.KeyboardEvent<HTMLDivElement>

/**
 * @deprecated
 * replaced by the new command system, so we can enable the command on hover,
 * not necessarilly on focus
 */
export const onKeyDownHandlers = (ev: KeyEv, view: TreeView): undefined | (() => void) => {
   // if (ev.key === TreeKeys.tree_focusFilter) return view.focusFilter

   if (ev.key === TreeKeys.tree_deleteNodeAndFocusNodeAbove) return view.deleteNodeAndFocusNodeAbove
   if (ev.key === TreeKeys.tree_deleteNodeAndFocusNodeBelow) return view.deleteNodeAndFocusNodeBelow

   if (ev.key === TreeKeys.tree_onPrimaryAction) return view.at?.onPrimaryAction
   if (ev.key === TreeKeys.tree_movePageUp) return view.movePageUp
   if (ev.key === TreeKeys.tree_movePageDown) return view.movePageDown

   if (ev.key === TreeKeys.tree_moveUp) return view.moveUp
   if (ev.key === TreeKeys.tree_moveDown) return view.moveDown
   if (ev.key === TreeKeys.tree_moveRight) return view.moveRight
   if (ev.key === TreeKeys.tree_moveLeft) return view.moveLeft
}
