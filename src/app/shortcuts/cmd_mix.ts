import type { Tree } from '../../panels/libraryUI/tree/xxx/Tree'
import type { STATE } from '../../state/state'

import { runInAction } from 'mobx'

import { command, type Command } from '../../operators/Command'
import { ctx_global } from '../../operators/contexts/ctx_global'
import { Trigger } from '../../operators/RET'
import { _duplicateCurrentDraft } from './cmd_duplicateCurrentDraft'
import { CushyShortcut } from './CommandManager'
import { KEYS } from './shorcutKeys'

// ------------------------------------------------------------------------------------
// basic utils
const always = (fn: () => any) => (): Trigger.Success => {
    fn()
    return Trigger.Success
}

const placholder = (combo: CushyShortcut | CushyShortcut[], info: string, when: string): Command => {
    return command({
        id: `placeholder_${info}`,
        combos: Array.isArray(combo) ? combo : [combo],
        label: info,
        ctx: ctx_global,
        validInInput: true,
        action: () => Trigger.UNMATCHED,
    })
}

const placeholderTree = (combo: CushyShortcut | CushyShortcut[], info: string): Command<null> => {
    return placholder(combo, info, 'in tree')
}

// const simple = (shortcut: CushyShortcut | CushyShortcut[], info: string, action: (fn: STATE) => void): Shortcut<STATE> => ({
//     combos: Array.isArray(shortcut) ? shortcut : [shortcut],
//     action: always(action),
//     info,
// })

const simpleValidInInput = (combo: CushyShortcut | CushyShortcut[], info: string, action: () => void): Command<null> =>
    command({
        id: `simple_${info}`,
        combos: Array.isArray(combo) ? combo : [combo],
        ctx: ctx_global,
        action: always(action),
        validInInput: true,
        label: info,
    })

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
            if (treeAlreadySelected) cushy.layout.FOCUS_OR_CREATE('TreeExplorer', {}) // close the panel
            else focusTreeRootIfMounted()
        } else {
            const node = cushy.layout.FOCUS_OR_CREATE('TreeExplorer', {})
            setImmediate((): void => {
                const isVisible = node?.isVisible()
                if (!isVisible) return
                focusTreeRootIfMounted()
            })
        }
    })

// ------------------------------------------------------------------------------------
// core global shortcuts
export const allCommandsV1: Command<null>[] = [
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
        id: 'closeCurrentTab',
        combos: KEYS.closeCurrentTab,
        validInInput: true,
        ctx: ctx_global,
        action: () => cushy.layout.closeCurrentTab(),
        label: 'Close current tab',
    }),

    command({
        id: 'closeDialogOrPopupsOrFullScreenPanel',
        combos: KEYS.closeDialogOrPopupsOrFullScreenPanel,
        ctx: ctx_global,
        label: 'Close Dialog, Popups, or Full-Screen Panels',
        validInInput: true,
        action: () => {
            if (cushy._popups.length > 0) {
                const item = cushy._popups.pop()!
                item.close()
                return Trigger.Success
            }
            if (cushy.layout.fullPageComp == null) return Trigger.UNMATCHED
            cushy.layout.fullPageComp = null
            return Trigger.Success
        },
    }),
]
