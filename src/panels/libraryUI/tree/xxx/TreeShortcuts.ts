import type { TreeView } from './TreeView'

export type KeyEv = React.KeyboardEvent<HTMLDivElement>

export const onKeyDownHandlers = (ev: KeyEv, view: TreeView): undefined | (() => void) => {
    if (ev.key === '/') return view.focusFilter

    if (ev.key === 'a') {
        if (ev.shiftKey) return view.addChild
        return view.addChildAndFocus
    }
    // deletion
    if (ev.key === 'Backspace') return view.deleteNodeAndFocusNodeAbove
    if (ev.key === 'Delete') return view.deleteNodeAndFocusNodeBelow

    if (ev.key === 'Enter') return view.at?.onPrimaryAction
    if (ev.key === 'PageUp') return view.movePageUp
    if (ev.key === 'PageDown') return view.movePageDown

    // ??
    // if (ev.key === 'v') return tree.changeValue
    // rename
    if (ev.key === 'k') return view.changeKey
    if (ev.key === 'ArrowUp') return view.moveUp
    if (ev.key === 'ArrowDown') return view.moveDown
    if (ev.key === 'ArrowRight') return view.moveRight
    if (ev.key === 'ArrowLeft') {
        // if (ev.altKey) return tree.hoistNodeUp
        return view.moveLeft
    }
}
