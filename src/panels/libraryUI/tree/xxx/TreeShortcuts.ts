import type { TreeView } from './TreeView'

export type KeyEv = React.KeyboardEvent<HTMLDivElement>

export const onKeyDownHandlers = (ev: KeyEv, tree: TreeView): undefined | (() => void) => {
    if (ev.key === '/') return tree.focusFilter

    if (ev.key === 'a') {
        if (ev.shiftKey) return tree.addChild
        return tree.addChildAndFocus
    }
    // deletion
    if (ev.key === 'Backspace') return tree.deleteNodeAndFocusNodeAbove
    if (ev.key === 'Delete') return tree.deleteNodeAndFocusNodeBelow

    // if (ev.key === 'Enter') return tree.addSibling

    // ??
    // if (ev.key === 'v') return tree.changeValue
    // rename
    if (ev.key === 'k') return tree.changeKey
    if (ev.key === 'ArrowUp') return tree.moveUp
    if (ev.key === 'ArrowDown') return tree.moveDown
    if (ev.key === 'ArrowRight') return tree.moveRight
    if (ev.key === 'ArrowLeft') {
        // if (ev.altKey) return tree.hoistNodeUp
        return tree.moveLeft
    }
}
