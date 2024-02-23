import type { Tree } from 'src/panels/libraryUI/tree/xxx/Tree'
import type { STATE } from 'src/state/state'

import { runInAction } from 'mobx'

import { _duplicateCurrentDraft } from './_duplicateCurrentDraft'
import { KEYS } from './shorcutKeys'
import { CushyShortcut, Shortcut } from './ShortcutManager'
import { Trigger } from './Trigger'

// ------------------------------------------------------------------------------------
// basic utils
const always = (fn: (st: STATE) => any) => (st: STATE) => {
    fn(st)
    return Trigger.Success
}

const placholder = (combo: CushyShortcut | CushyShortcut[], info: string, when: string): Shortcut<STATE> => {
    return {
        combos: Array.isArray(combo) ? combo : [combo],
        info,
        when,
        validInInput: true,
        action: () => Trigger.UNMATCHED_CONDITIONS,
    }
}

const placeholderTree = (combo: CushyShortcut | CushyShortcut[], info: string): Shortcut<STATE> => {
    return placholder(combo, info, 'in tree')
}

// const simple = (shortcut: CushyShortcut | CushyShortcut[], info: string, action: (fn: STATE) => void): Shortcut<STATE> => ({
//     combos: Array.isArray(shortcut) ? shortcut : [shortcut],
//     action: always(action),
//     info,
// })

const simpleValidInInput = (
    combo: CushyShortcut | CushyShortcut[],
    info: string,
    action: (fn: STATE) => void,
): Shortcut<STATE> => ({
    combos: Array.isArray(combo) ? combo : [combo],
    action: always(action),
    validInInput: true,
    info: info,
})

const focusTree = (st: STATE, tree: Tree) =>
    runInAction(() => {
        const focusTreeRootIfMounted = () => {
            const item = window.document.getElementById(tree.KeyboardNavigableDomNodeID)
            if (item == null) return console.log(`[🌲] dom node #${tree.KeyboardNavigableDomNodeID} not found`)
            item.focus()
        }
        if (st.layout.isVisible('TreeExplorer')) {
            const currentFocous = window.document.activeElement
            const treeAlreadySelected = currentFocous?.id === tree.KeyboardNavigableDomNodeID
            if (treeAlreadySelected) st.layout.FOCUS_OR_CREATE('TreeExplorer', {}) // close the panel
            else focusTreeRootIfMounted()
        } else {
            const node = st.layout.FOCUS_OR_CREATE('TreeExplorer', {})
            setImmediate((): void => {
                const isVisible = node?.isVisible()
                if (!isVisible) return
                focusTreeRootIfMounted()
            })
        }
    })

// ------------------------------------------------------------------------------------
// core global shortcuts
export const shortcutsDef: Shortcut<STATE>[] = [
    simpleValidInInput(KEYS.resizeWindowForVideoCapture, 'Resize Window for video capture', (st) => {
        st.resizeWindowForVideoCapture()
        return Trigger.Success
    }),
    simpleValidInInput(KEYS.resizeWindowForLaptop, 'Resize Window for video capture', (st) => {
        st.resizeWindowForLaptop()
        return Trigger.Success
    }),
    simpleValidInInput(KEYS.resetLayout, 'Reset layout', (st) => {
        st.layout.resetCurrent()
        // const lastDraft = st.db.drafts.last()
        // if (lastDraft) st.layout.FOCUS_OR_CREATE('Draft', { draftID: lastDraft.id })
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
    simpleValidInInput(KEYS.focusAppAndDraftTree, 'focus app tree', (st) => focusTree(st, st.tree1)),
    simpleValidInInput(KEYS.focusFileExplorerTree, 'focus file explorer (tree)', (st) => focusTree(st, st.tree2)),
    simpleValidInInput(KEYS.collapseAllTree, 'collapse all tree', (st) => {
        st.tree1View.resetCaretPos()
        st.tree2View.resetCaretPos()
        st.db.tree_entries.updateAll({ isExpanded: null })
        const at = st.tree2View.revealAndFocusAtPath(['built-in'])
        at?.open()
    }),

    // draftActions: ---------------------------------
    simpleValidInInput([KEYS.duplicateCurrentDraft], 'duplicate draft', (st) => _duplicateCurrentDraft(st)),

    // menu utils: -----------------------------------
    simpleValidInInput([KEYS.openPage_Civitai],  'open Civitai',    (st) => st.layout.FOCUS_OR_CREATE('Civitai', {})), // prettier-ignore
    simpleValidInInput([KEYS.openPage_Squoosh],  'open Squoosh',    (st) => st.layout.FOCUS_OR_CREATE('Squoosh', {})), // prettier-ignore
    simpleValidInInput([KEYS.openPage_Posemy],   'open Posemy.art', (st) => st.layout.FOCUS_OR_CREATE('IFrame', { url: 'https://app.posemy.art/' }), ), // prettier-ignore
    simpleValidInInput([KEYS.openPage_Paint],    'open Paint',      (st) => st.layout.FOCUS_OR_CREATE('Paint', {})), // prettier-ignore
    simpleValidInInput([KEYS.openPage_Unsplash], 'open Unsplash',   (st) => st.layout.FOCUS_OR_CREATE('IFrame', { url: 'https://unsplash.com/' }), ), // prettier-ignore
    simpleValidInInput([KEYS.openPage_Marketplace], 'open Unsplash',(st) => st.layout.FOCUS_OR_CREATE('Marketplace', { url: 'https://unsplash.com/' }), ), // prettier-ignore

    // menu settings --------------------------------
    simpleValidInInput([KEYS.openPage_Config],    'open Config',    (st) => st.layout.FOCUS_OR_CREATE('Config', {})), // prettier-ignore
    simpleValidInInput([KEYS.openPage_Hosts],     'open Hosts',     (st) => st.layout.FOCUS_OR_CREATE('Hosts', {})), // prettier-ignore
    simpleValidInInput([KEYS.openPage_Shortcuts], 'open Shortcuts', (st) => st.layout.FOCUS_OR_CREATE('Shortcuts', {})), // prettier-ignore

    // misc... --------------------------------------
    simpleValidInInput([KEYS.openPage_ComfyUI], 'open ComfyUI', (st) => st.layout.FOCUS_OR_CREATE('ComfyUI', {})),
    simpleValidInInput([KEYS.openPage_Gallery], 'open Gallery', (st) => st.layout.FOCUS_OR_CREATE('Gallery', {})),
    simpleValidInInput([KEYS.openPage_Models], 'open Models', (st) => st.layout.FOCUS_OR_CREATE('Models', {})),

    // full screen library  --------------------------
    simpleValidInInput([KEYS.openFull_Library], 'open full screen library', (st) => st.toggleFullLibrary()),
    simpleValidInInput(['mod+escape'], 'close full screen library', (st) => st.closeFullLibrary()),

    {
        combos: [KEYS.closeCurrentTab],
        validInInput: true,
        action: (st) => st.layout.closeCurrentTab(),
        info: 'Close current tab',
    },

    {
        combos: [KEYS.closeDialogOrPopupsOrFullScreenPanel],
        info: 'Close Dialog, Popups, or Full-Screen Panels',
        validInInput: true,
        action: (st) => {
            if (st._popups.length > 0) {
                const item = st._popups.pop()!
                item.close()
                return Trigger.Success
            }
            if (st.layout.fullPageComp == null) return Trigger.UNMATCHED_CONDITIONS
            st.layout.fullPageComp = null
            return Trigger.Success
        },
    },
]
