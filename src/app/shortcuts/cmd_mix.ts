import type { Tree } from '../../csuite/tree/Tree'
import type { STATE } from '../../state/state'

import { runInAction } from 'mobx'

import { ctx_global } from '../../csuite/command-topic/ctx_global'
import { command, type Command } from '../../csuite/commands/Command'
import { global_RevealStack } from '../../csuite/reveal/RevealStack'
import { Trigger } from '../../csuite/trigger/Trigger'
import { _duplicateCurrentDraft } from './cmd_duplicateCurrentDraft'
import { KEYS } from './shorcutKeys'
import { placeholderTree, simpleValidInInput } from './simpleValidInInput'

const focusTree = (st: STATE, tree: Tree) =>
    runInAction(() => {
        const focusTreeRootIfMounted = () => {
            const item = window.document.getElementById(tree.KeyboardNavigableDomNodeID)
            if (item == null) return console.log(`[🌲] dom node #${tree.KeyboardNavigableDomNodeID} not found`)
            item.focus()
        }
        if (cushy.layout.isVisible('TreeExplorer')) {
            const currentFocous = window.document.activeElement
            const treeAlreadySelected = currentFocous?.id === tree.KeyboardNavigableDomNodeID
            if (treeAlreadySelected)
                cushy.layout.FOCUS_OR_CREATE('TreeExplorer', {}, 'LEFT_PANE_TABSET') // close the panel
            else focusTreeRootIfMounted()
        } else {
            const node = cushy.layout.FOCUS_OR_CREATE('TreeExplorer', {}, 'LEFT_PANE_TABSET')
            setImmediate((): void => {
                const isVisible = node?.isVisible()
                if (!isVisible) return
                focusTreeRootIfMounted()
            })
        }
    })

// ------------------------------------------------------------------------------------
// core global shortcuts
export const allLegacyCommands: Command<null>[] = [
    simpleValidInInput(KEYS.search, 'search string globally in window', () => {
        if (cushy.search.active) cushy.search.active = false
        else cushy.search.active = true
        return Trigger.Success
    }),

    simpleValidInInput(KEYS.resizeWindowForVideoCapture, 'Resize Window for video capture', () => {
        cushy.resizeWindowForVideoCapture()
        return Trigger.Success
    }),
    simpleValidInInput(KEYS.resizeWindowForLaptop, 'Resize Window for video capture', () => {
        cushy.resizeWindowForLaptop()
        return Trigger.Success
    }),
    simpleValidInInput(KEYS.resetLayout, 'Reset layout', () => {
        cushy.layout.resetCurrent()
        // const lastDraft = cushy.db.drafts.last()
        // if (lastDraft) cushy.layout.FOCUS_OR_CREATE('Draft', { draftID: lastDraft.id })
        return Trigger.Success
    }),

    // tree navigation --------------------------------
    placeholderTree(KEYS.tree_moveUp, 'move up in tree'),
    placeholderTree(KEYS.tree_moveDown, 'move down in tree'),
    placeholderTree(KEYS.tree_moveRight, 'unfold item if folded, then move down'),
    placeholderTree(KEYS.tree_moveLeft, 'fold item if unfolded and movme up'),
    placeholderTree(KEYS.tree_deleteNodeAndFocusNodeAbove, 'Delete Node And Focus Node Above'),
    placeholderTree(KEYS.tree_deleteNodeAndFocusNodeBelow, 'Delete Node And Focus Node Below'),
    placeholderTree(KEYS.tree_onPrimaryAction, 'execute selected tree primary action'),
    placeholderTree(KEYS.tree_movePageUp, 'move all the way to the top of the tree'),
    placeholderTree(KEYS.tree_movePageDown, 'move 100 items down in the tree'),
    // placeholderTree('/', 'focus tree filter (not implemented for now)'),

    // tree -----------------------------------------
    simpleValidInInput(KEYS.focusAppAndDraftTree, 'focus app tree', () => focusTree(cushy, cushy.tree1)),
    simpleValidInInput(KEYS.focusFileExplorerTree, 'focus file explorer (tree)', () => focusTree(cushy, cushy.tree2)),
    simpleValidInInput(KEYS.collapseAllTree, 'collapse all tree', () => {
        cushy.tree1View.resetCaretPos()
        cushy.tree2View.resetCaretPos()
        cushy.db.tree_entry.updateAll({ isExpanded: null })
        const at = cushy.tree2View.revealAndFocusAtPath(['built-in'])
        at?.open()
    }),

    // draftActions: ---------------------------------
    simpleValidInInput([KEYS.duplicateCurrentDraft], 'duplicate draft', () => _duplicateCurrentDraft(cushy)),

    // menu utils: -----------------------------------
    simpleValidInInput([KEYS.openPage_Civitai],  'open Civitai',    () => cushy.layout.FOCUS_OR_CREATE('Civitai', {})), // prettier-ignore
    simpleValidInInput([KEYS.openPage_Squoosh],  'open Squoosh',    () => cushy.layout.FOCUS_OR_CREATE('Squoosh', {})), // prettier-ignore
    simpleValidInInput([KEYS.openPage_Posemy],   'open Posemy.art', () => cushy.layout.FOCUS_OR_CREATE('IFrame', { url: 'https://app.posemy.art/' }), ), // prettier-ignore
    simpleValidInInput([KEYS.openPage_Paint],    'open Paint',      () => cushy.layout.FOCUS_OR_CREATE('Paint', {})), // prettier-ignore
    simpleValidInInput([KEYS.openPage_Unsplash], 'open Unsplash',   () => cushy.layout.FOCUS_OR_CREATE('IFrame', { url: 'https://unsplash.com/' }), ), // prettier-ignore
    simpleValidInInput([KEYS.openPage_Marketplace], 'open Unsplash',() => cushy.layout.FOCUS_OR_CREATE('Marketplace', { url: 'https://unsplash.com/' }), ), // prettier-ignore

    // menu settings --------------------------------
    simpleValidInInput([KEYS.openPage_Config],    'open Config',    () => cushy.layout.FOCUS_OR_CREATE('Config', {})), // prettier-ignore
    simpleValidInInput([KEYS.openPage_Hosts],     'open Hosts',     () => cushy.layout.FOCUS_OR_CREATE('Hosts', {})), // prettier-ignore
    simpleValidInInput([KEYS.openPage_Shortcuts], 'open Shortcuts', () => cushy.layout.FOCUS_OR_CREATE('Shortcuts', {})), // prettier-ignore

    // misc... --------------------------------------
    simpleValidInInput([KEYS.openPage_ComfyUI], 'open ComfyUI', () => cushy.layout.FOCUS_OR_CREATE('ComfyUI', {})),
    simpleValidInInput([KEYS.openPage_Gallery], 'open Gallery', () => cushy.layout.FOCUS_OR_CREATE('Gallery', {})),
    simpleValidInInput([KEYS.openPage_Models], 'open Models', () => cushy.layout.FOCUS_OR_CREATE('Models', {})),

    // full screen library  --------------------------
    simpleValidInInput([KEYS.openFull_Library], 'open full screen library', () => cushy.toggleFullLibrary()),
    simpleValidInInput(['mod+escape'], 'close full screen library', () => cushy.closeFullLibrary()),

    command({
        id: 'closeDialogOrPopupsOrFullScreenPanel',
        combos: KEYS.closeDialogOrPopupsOrFullScreenPanel,
        ctx: ctx_global,
        label: 'Close Dialog, Popups, or Full-Screen Panels',
        validInInput: true,
        action: () => {
            if (global_RevealStack.length > 0) {
                const item = global_RevealStack.pop()!
                item.close()
                return Trigger.Success
            }
            if (cushy.layout.fullPageComp == null) return Trigger.UNMATCHED
            cushy.layout.fullPageComp = null
            return Trigger.Success
        },
    }),
]
