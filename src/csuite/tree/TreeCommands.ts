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
        icon: 'mdiFileTree',
        action: (tv) => tv.moveUp(),
    }),

    ctx_TreeUI.command({
        combo: KEYS.tree_moveDown,
        label: 'move down in tree',
        idSuffix: 'moveDown',
        icon: 'mdiFileTree',
        action: (tv) => tv.moveDown(),
    }),

    ctx_TreeUI.command({
        combo: KEYS.tree_moveRight,
        label: 'unfold item if folded, then move down',
        idSuffix: 'moveRight',
        icon: 'mdiFileTree',
        action: (tv) => tv.moveRight(),
    }),

    ctx_TreeUI.command({
        combo: KEYS.tree_moveLeft,
        label: 'fold item if unfolded and movme up',
        idSuffix: 'moveLeft',
        icon: 'mdiFileTree',
        action: (tv) => tv.moveLeft(),
    }),

    ctx_TreeUI.command({
        combo: KEYS.tree_deleteNodeAndFocusNodeAbove,
        label: 'Delete Node And Focus Node Above',
        idSuffix: 'deleteNodeAndFocusNodeAbove',
        icon: 'mdiFileTree',
        action: (tv) => tv.deleteNodeAndFocusNodeAbove(),
    }),

    ctx_TreeUI.command({
        combo: KEYS.tree_deleteNodeAndFocusNodeBelow,
        label: 'Delete Node And Focus Node Below',
        idSuffix: 'deleteNodeAndFocusNodeBelow',
        icon: 'mdiFileTree',
        action: (tv) => tv.deleteNodeAndFocusNodeBelow(),
    }),

    ctx_TreeUI.command({
        combo: KEYS.tree_onPrimaryAction,
        label: 'execute selected tree primary action',
        idSuffix: 'onPrimaryAction',
        icon: 'mdiFileTree',
        action: (tv) => {
            if (tv.at == null) return Trigger.UNMATCHED
            return tv.at.onPrimaryAction()
        },
    }),

    ctx_TreeUI.command({
        combo: KEYS.tree_movePageUp,
        label: 'move all the way to the top of the tree',
        idSuffix: 'movePageUp',
        icon: 'mdiFileTree',
        action: (tv) => tv.movePageUp(),
    }),

    ctx_TreeUI.command({
        combo: KEYS.tree_movePageDown,
        label: 'move 100 items down in the tree',
        idSuffix: 'movePageDown',
        icon: 'mdiFileTree',
        action: (tv) => tv.movePageDown(),
    }),
]
