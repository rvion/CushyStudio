import type { TreeView } from './TreeView'

import { KEYS } from 'src/app/shortcuts/shorcutKeys'

export type KeyEv = React.KeyboardEvent<HTMLDivElement>

export const onKeyDownHandlers = (ev: KeyEv, view: TreeView): undefined | (() => void) => {
    // if (ev.key === KEYS.tree_focusFilter) return view.focusFilter

    if (ev.key === KEYS.tree_deleteNodeAndFocusNodeAbove) return view.deleteNodeAndFocusNodeAbove
    if (ev.key === KEYS.tree_deleteNodeAndFocusNodeBelow) return view.deleteNodeAndFocusNodeBelow

    if (ev.key === KEYS.tree_onPrimaryAction) return view.at?.onPrimaryAction
    if (ev.key === KEYS.tree_movePageUp) return view.movePageUp
    if (ev.key === KEYS.tree_movePageDown) return view.movePageDown

    if (ev.key === KEYS.tree_moveUp) return view.moveUp
    if (ev.key === KEYS.tree_moveDown) return view.moveDown
    if (ev.key === KEYS.tree_moveRight) return view.moveRight
    if (ev.key === KEYS.tree_moveLeft) return view.moveLeft
}
