import type { STATE } from 'src/state/state'
import { Combo, Shortcut } from './ShortcutManager'
import { Trigger } from './Trigger'
import { TreeUIKeyboardNavigableRootID } from 'src/panels/libraryUI/tree/xxx/TreeUIKeyboardNavigableRootID'
import { runInAction } from 'mobx'

// ------------------------------------------------------------------------------------
// basic utils
const always = (fn: (st: STATE) => any) => (st: STATE) => {
    fn(st)
    return Trigger.Success
}

const simple = (combo: Combo | Combo[], action: (fn: STATE) => void): Shortcut<STATE> => ({
    combos: Array.isArray(combo) ? combo : [combo],
    action: always(action),
})

const simpleValidInInput = (combo: Combo | Combo[], action: (fn: STATE) => void): Shortcut<STATE> => ({
    combos: Array.isArray(combo) ? combo : [combo],
    action: always(action),
    validInInput: true,
})

// ------------------------------------------------------------------------------------
// core global shortcuts
export const shortcutsDef: Shortcut<STATE>[] = [
    // simpleValidInInput('meta+shift+k', (st) => (st.showSuperAdmin = !st.showSuperAdmin)),
    // simpleValidInInput('meta+shift+z', (st) => (st.showSuperAdminBubbles = !st.showSuperAdminBubbles)),
    simpleValidInInput(['meta+2'], (st) => {
        runInAction(() => {
            const node = st.layout.FOCUS_OR_CREATE('FileList', {})
            setImmediate(() => {
                const isVisible = node?.isVisible()
                if (!isVisible) return console.log(`[👙] not visible`)
                const item = window.document.getElementById(TreeUIKeyboardNavigableRootID)
                if (item == null) return console.log(`[👙] dom node #${TreeUIKeyboardNavigableRootID} not found`)
                item.focus()
            })
        })
    }),
    simpleValidInInput(['meta+1', 'ctrl+1', 'meta+p', 'ctrl+p', 'meta+j'], (st) => st.toggleFullLibrary()),
    simpleValidInInput(['meta+,', 'ctrl+,'], (st) => st.layout.FOCUS_OR_CREATE('Config', {})),
    simpleValidInInput(['meta+escape', 'ctrl+escape'], (st) => st.closeFullLibrary()),
    // simpleValidInInput(['meta+2', 'ctrl+2'], (st) => st.layout.addMarketplace()),
    simpleValidInInput(['meta+3', 'ctrl+3'], (st) => st.layout.FOCUS_OR_CREATE('Paint', {})),
    simpleValidInInput(['meta+4', 'ctrl+4'], (st) => st.layout.FOCUS_OR_CREATE('ComfyUI', {})),
    simpleValidInInput(['meta+5', 'ctrl+5'], (st) => st.layout.FOCUS_OR_CREATE('Gallery', {})),
    simpleValidInInput(['meta+6', 'ctrl+6'], (st) => st.layout.FOCUS_OR_CREATE('Config', {})),
    simpleValidInInput(['meta+7', 'ctrl+7'], (st) => st.layout.FOCUS_OR_CREATE('Civitai', {})),
    simpleValidInInput(['meta+8', 'ctrl+8'], (st) => st.layout.FOCUS_OR_CREATE('Hosts', {})),
    // simple('meta+x s', (st) => st.auth.stopImpersonating()),
    // simple('meta+x q', (st) => st.auth.logOut()),

    // T   - Toogle
    // { combos: ['t a m'], action: (st) => Trigger.UNMATCHED_CONDITIONS, info: 'Tooggle Automation Menu' },
    // { combos: ['t a p'], action: (st) => Trigger.UNMATCHED_CONDITIONS, info: 'Tooggle Automation Preview' },
    {
        combos: ['meta+w', 'ctrl+w'],
        validInInput: true,
        action: (st) => st.layout.closeCurrentTab(),
        info: 'Tooggle Graph Monitor',
    },

    {
        combos: ['escape'],
        validInInput: true,
        action: (st) => {
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
