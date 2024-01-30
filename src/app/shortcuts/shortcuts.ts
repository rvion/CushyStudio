import type { Tree } from 'src/panels/libraryUI/tree/xxx/Tree'
import type { STATE } from 'src/state/state'

import { runInAction } from 'mobx'
import { CushyShortcut, Shortcut } from './ShortcutManager'
import { Trigger } from './Trigger'
import { _duplicateCurrentDraft } from './_duplicateCurrentDraft'

export const shorcutKeys = {
    collapseAllTree: 'mod+shift+k',
    openConfigPage: 'mod+,',
    openHostsPate: 'mod+shift+,',
    duplicateCurrentDraft: 'mod+shift+d',
    resizeWindowForVideoCapture: 'mod+u mod+1',
    resetLayout: 'mod+u mod+2',
}

// ------------------------------------------------------------------------------------
// basic utils
const always = (fn: (st: STATE) => any) => (st: STATE) => {
    fn(st)
    return Trigger.Success
}

const simple = (shortcut: CushyShortcut | CushyShortcut[], action: (fn: STATE) => void): Shortcut<STATE> => ({
    combos: Array.isArray(shortcut) ? shortcut : [shortcut],
    action: always(action),
})

const simpleValidInInput = (combo: CushyShortcut | CushyShortcut[], action: (fn: STATE) => void): Shortcut<STATE> => ({
    combos: Array.isArray(combo) ? combo : [combo],
    action: always(action),
    validInInput: true,
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
    simpleValidInInput(shorcutKeys.resizeWindowForVideoCapture, (st) => {
        st.resizeWindowForVideoCapture()
        return Trigger.Success
    }),
    simpleValidInInput(shorcutKeys.resetLayout, (st) => {
        st.layout.resetCurrent()
        // const lastDraft = st.db.drafts.last()
        // if (lastDraft) st.layout.FOCUS_OR_CREATE('Draft', { draftID: lastDraft.id })
        return Trigger.Success
    }),
    // simpleValidInInput('mod+shift+k', (st) => (st.showSuperAdmin = !st.showSuperAdmin)),
    // simpleValidInInput('mod+shift+z', (st) => (st.showSuperAdminBubbles = !st.showSuperAdminBubbles)),
    simpleValidInInput(['mod+1', 'mod+shift+e', 'mod+b'], (st) => focusTree(st, st.tree1)),
    simpleValidInInput([shorcutKeys.collapseAllTree], (st) => {
        st.tree1View.resetCaretPos()
        st.tree2View.resetCaretPos()
        st.db.tree_entries.updateAll({ isExpanded: null })
    }),
    simpleValidInInput(['mod+2'], (st) => focusTree(st, st.tree2)),
    // --------------------------
    // draftActions:
    simpleValidInInput([shorcutKeys.duplicateCurrentDraft], (st) => _duplicateCurrentDraft(st)),
    // --------------------------
    // menu utils:
    simpleValidInInput(['mod+k 1'], (st) => st.layout.FOCUS_OR_CREATE('Civitai', {})),
    simpleValidInInput(['mod+k 2'], (st) => st.layout.FOCUS_OR_CREATE('Squoosh', {})),
    simpleValidInInput(['mod+k 3'], (st) => st.layout.FOCUS_OR_CREATE('IFrame', { url: 'https://app.posemy.art/' })),
    simpleValidInInput(['mod+k 4'], (st) => st.layout.FOCUS_OR_CREATE('Paint', {})),
    simpleValidInInput(['mod+k 5'], (st) => st.layout.FOCUS_OR_CREATE('IFrame', { url: 'https://unsplash.com/' })),

    // menu settings --------------------------
    simpleValidInInput([shorcutKeys.openConfigPage], (st) => st.layout.FOCUS_OR_CREATE('Config', {})),
    simpleValidInInput([shorcutKeys.openHostsPate], (st) => st.layout.FOCUS_OR_CREATE('Hosts', {})),

    // --------------------------
    simpleValidInInput(['mod+p', 'mod+j'], (st) => st.toggleFullLibrary()),
    simpleValidInInput(['mod+escape'], (st) => st.closeFullLibrary()),
    // simpleValidInInput(['mod+2'], (st) => st.layout.addMarketplace()),
    simpleValidInInput(['mod+3'], (st) => st.layout.FOCUS_OR_CREATE('Paint', {})),
    simpleValidInInput(['mod+4'], (st) => st.layout.FOCUS_OR_CREATE('ComfyUI', {})),
    simpleValidInInput(['mod+5'], (st) => st.layout.FOCUS_OR_CREATE('Gallery', {})),
    simpleValidInInput(['mod+6'], (st) => st.layout.FOCUS_OR_CREATE('Config', {})),
    simpleValidInInput(['mod+7'], (st) => st.layout.FOCUS_OR_CREATE('Civitai', {})),
    simpleValidInInput(['mod+8'], (st) => st.layout.FOCUS_OR_CREATE('Hosts', {})),
    // simple('mod+x s', (st) => st.auth.stopImpersonating()),
    // simple('mod+x q', (st) => st.auth.logOut()),

    // T   - Toogle
    // { combos: ['t a m'], action: (st) => Trigger.UNMATCHED_CONDITIONS, info: 'Tooggle Automation Menu' },
    // { combos: ['t a p'], action: (st) => Trigger.UNMATCHED_CONDITIONS, info: 'Tooggle Automation Preview' },
    {
        combos: ['mod+w'],
        validInInput: true,
        action: (st) => st.layout.closeCurrentTab(),
        info: 'Tooggle Graph Monitor',
    },

    {
        combos: ['escape'],
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
        info: 'Close Full-Screen Panel if open',
    },

    // G   - Go
    // G M - Go Messagerie
    // { combos: ['g m'], action: (st) => st.router.goTo('CHAT', { inbox: { filter: 'all' } }) }, // Messagerie   | Appbar
    // { combos: ['g m s'], action: (st) => st.router.goTo('CHAT_NEW', {}) }, //         Messagerie   | Appbar
    // { combos: 'cmd+k cmd+s', action: () => {} },
    // { combos: 'cmd+k cmd+s', action: () => {} },
]
