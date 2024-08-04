import type { Command } from '../commands/Command'
import type { TreeView } from './TreeView'

import { KEYS } from '../../app/shortcuts/shorcutKeys'
import { Trigger } from '../trigger/Trigger'
import { ctx_TreeUI } from './TreeCtx'

export const allTreeCommands: Command<TreeView>[] = [
    // tree navigation --------------------------------
    ctx_TreeUI.command({
        combo: KEYS.tree_moveUp,
        label: 'move up in tree',
        idSuffix: 'moveUp',
        action: (tv) => tv.moveUp(),
    }),

    ctx_TreeUI.command({
        combo: KEYS.tree_moveDown,
        label: 'move down in tree',
        idSuffix: 'moveDown',
        action: (tv) => tv.moveDown(),
    }),

    ctx_TreeUI.command({
        combo: KEYS.tree_moveRight,
        label: 'unfold item if folded, then move down',
        idSuffix: 'moveRight',
        action: (tv) => tv.moveRight(),
    }),

    ctx_TreeUI.command({
        combo: KEYS.tree_moveLeft,
        label: 'fold item if unfolded and movme up',
        idSuffix: 'moveLeft',
        action: (tv) => tv.moveLeft(),
    }),

    ctx_TreeUI.command({
        combo: KEYS.tree_deleteNodeAndFocusNodeAbove,
        label: 'Delete Node And Focus Node Above',
        idSuffix: 'deleteNodeAndFocusNodeAbove',
        action: (tv) => tv.deleteNodeAndFocusNodeAbove(),
    }),

    ctx_TreeUI.command({
        combo: KEYS.tree_deleteNodeAndFocusNodeBelow,
        label: 'Delete Node And Focus Node Below',
        idSuffix: 'deleteNodeAndFocusNodeBelow',
        action: (tv) => tv.deleteNodeAndFocusNodeBelow(),
    }),

    ctx_TreeUI.command({
        combo: KEYS.tree_onPrimaryAction,
        label: 'execute selected tree primary action',
        idSuffix: 'onPrimaryAction',
        action: (tv) => {
            if (tv.at == null) return Trigger.UNMATCHED
            return tv.at.onPrimaryAction()
        },
    }),

    ctx_TreeUI.command({
        combo: KEYS.tree_movePageUp,
        label: 'move all the way to the top of the tree',
        idSuffix: 'movePageUp',
        action: (tv) => tv.movePageUp(),
    }),

    ctx_TreeUI.command({
        combo: KEYS.tree_movePageDown,
        label: 'move 100 items down in the tree',
        idSuffix: 'movePageDown',
        action: (tv) => tv.movePageDown(),
    }),
]
