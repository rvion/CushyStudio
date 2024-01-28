import type { STATE } from 'src/state/state'
import type { Tree } from 'src/panels/libraryUI/tree/xxx/Tree'

import { CushyShortcut, Shortcut } from './ShortcutManager'
import { Trigger } from './Trigger'
import { runInAction } from 'mobx'
import { _duplicateCurrentDraft } from './_duplicateCurrentDraft'

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

export const shorcutKeys = {
    openConfigPage: 'mod+,',
    openHostsPate: 'mod+shift+,',
    duplicateCurrentDraft: 'mod+shift+d',
}
// ------------------------------------------------------------------------------------
// core global shortcuts
export const shortcutsDef: Shortcut<STATE>[] = [
    // simpleValidInInput('mod+shift+k', (st) => (st.showSuperAdmin = !st.showSuperAdmin)),
    // simpleValidInInput('mod+shift+z', (st) => (st.showSuperAdminBubbles = !st.showSuperAdminBubbles)),
    simpleValidInInput(['mod+1', 'mod+shift+e', 'mod+b'], (st) => focusTree(st, st.tree1)),
    simpleValidInInput(['mod+shift+k'], (st) => st.db.tree_entries.updateAll({ isExpanded: null })),
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
