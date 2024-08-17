import type { Tree } from '../../csuite/tree/Tree'

import { runInAction } from 'mobx'

import { type Command } from '../../csuite/commands/Command'
import { ctx_TreeUI } from '../../csuite/tree/TreeCtx'
import { Trigger } from '../../csuite/trigger/Trigger'
import { _duplicateCurrentDraft } from './cmd_duplicateCurrentDraft'
import { KEYS } from './shorcutKeys'
import { globalValidInInput } from './simpleValidInInput'

function focusTree(tree: Tree): void {
    return runInAction(() => {
        function focusTreeRootIfMounted(): void {
            const item = window.document.getElementById(tree.KeyboardNavigableDomNodeID)
            if (item == null) return console.log(`[🌲] dom node #${tree.KeyboardNavigableDomNodeID} not found`)
            item.focus()
        }
        if (cushy.layout.isPanelVisible('TreeExplorer')) {
            const currentFocous = window.document.activeElement
            const treeAlreadySelected = currentFocous?.id === tree.KeyboardNavigableDomNodeID
            if (treeAlreadySelected)
                cushy.layout.open('TreeExplorer', {}, { where: 'right' }) // close the panel
            else focusTreeRootIfMounted()
        } else {
            const node = cushy.layout.open('TreeExplorer', {}, { where: 'right' })
            setImmediate((): void => {
                const isVisible = node?.isVisible()
                if (!isVisible) return
                focusTreeRootIfMounted()
            })
        }
    })
}
// ------------------------------------------------------------------------------------
// core global shortcuts
export const allLegacyCommands: Command<any>[] = [
    globalValidInInput(
        KEYS.search,
        'search string globally in window',
        () => {
            if (cushy.search.active) cushy.search.active = false
            else cushy.search.active = true
            return Trigger.Success
        },
        'mdiSelectSearch',
    ),

    globalValidInInput(
        KEYS.resizeWindowForVideoCapture,
        'Resize Window for video capture',
        () => {
            cushy.resizeWindowForVideoCapture()
            return Trigger.Success
        },
        'mdiMoveResize',
    ),
    globalValidInInput(
        KEYS.resetLayout,
        'Reset layout',
        () => {
            cushy.layout.resetCurrent()
            // const lastDraft = cushy.db.drafts.last()
            // if (lastDraft) cushy.layout.FOCUS_OR_CREATE('Draft', { draftID: lastDraft.id })
            return Trigger.Success
        },
        'mdiNewBox',
    ),

    // placeholderTree('/', 'focus tree filter (not implemented for now)'),

    // tree -----------------------------------------
    globalValidInInput(KEYS.focusAppAndDraftTree, 'focus app tree', () => focusTree(cushy.tree1)),
    globalValidInInput(KEYS.focusFileExplorerTree, 'focus file explorer (tree)', () => focusTree(cushy.tree2)),
    globalValidInInput(KEYS.collapseAllTree, 'collapse all tree', () => {
        cushy.tree1View.resetCaretPos()
        cushy.tree2View.resetCaretPos()
        cushy.db.tree_entry.updateAll({ isExpanded: null })
        const at = cushy.tree2View.revealAndFocusAtPath(['built-in'])
        at?.open()
    }),

    // draftActions: ---------------------------------
    globalValidInInput([KEYS.duplicateCurrentDraft], 'duplicate draft', () => _duplicateCurrentDraft(cushy)),

    // menu utils: -----------------------------------
    globalValidInInput([KEYS.openPage_Civitai],  'open Civitai',    () => cushy.layout.open('Civitai', {})), // prettier-ignore
    globalValidInInput([KEYS.openPage_Squoosh],  'open Squoosh',    () => cushy.layout.open('Squoosh', {})), // prettier-ignore
    globalValidInInput([KEYS.openPage_Posemy],   'open Posemy.art', () => cushy.layout.open('IFrame', { url: 'https://app.posemy.art/' }), ), // prettier-ignore
    globalValidInInput([KEYS.openPage_Paint],    'open Paint',      () => cushy.layout.open('Paint', {})), // prettier-ignore
    globalValidInInput([KEYS.openPage_Unsplash], 'open Unsplash',   () => cushy.layout.open('IFrame', { url: 'https://unsplash.com/' }), ), // prettier-ignore
    globalValidInInput([KEYS.openPage_Marketplace], 'open Unsplash',() => cushy.layout.open('Marketplace', { }), ), // prettier-ignore

    // menu settings --------------------------------
    globalValidInInput([KEYS.openPage_Config],    'open Config',    () => cushy.layout.open('Config', {})), // prettier-ignore
    globalValidInInput([KEYS.openPage_Hosts],     'open Hosts',     () => cushy.layout.open('Hosts', {})), // prettier-ignore
    globalValidInInput([KEYS.openPage_Shortcuts], 'open Shortcuts', () => cushy.layout.open('Shortcuts', {})), // prettier-ignore

    // misc... --------------------------------------
    globalValidInInput([KEYS.openPage_ComfyUI], 'open ComfyUI', () => cushy.layout.open('ComfyUI', {})),
    globalValidInInput([KEYS.openPage_Gallery], 'open Gallery', () => cushy.layout.open('Gallery', {})),
    globalValidInInput([KEYS.openPage_Models], 'open Models', () => cushy.layout.open('Models', {})),

    // full screen library  --------------------------
    globalValidInInput([KEYS.openFull_Library], 'open full screen library', () => cushy.toggleFullLibrary()),

    // ⏸️ command({
    // ⏸️     id: 'closeDialogOrPopupsOrFullScreenPanel',
    // ⏸️     combos: KEYS.closeDialogOrPopupsOrFullScreenPanel,
    // ⏸️     ctx: ctx_global,
    // ⏸️     label: 'Close Dialog, Popups, or Full-Screen Panels',
    // ⏸️     validInInput: true,
    // ⏸️     action: () => {
    // ⏸️         if (global_RevealStack.length > 0) {
    // ⏸️             const item = global_RevealStack.pop()!
    // ⏸️             item.close('programmatic')
    // ⏸️             return Trigger.Success
    // ⏸️         }
    // ⏸️         return Trigger.UNMATCHED
    // ⏸️     },
    // ⏸️ }),
]
