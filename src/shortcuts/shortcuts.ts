import { STATE } from 'src/state/state'
import { Combo, Shortcut } from './ShortcutManager'
import { Trigger } from './Trigger'

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
    simpleValidInInput(['meta+1', 'ctrl+1'], (st) => st.openCardPicker()),
    // simpleValidInInput(['meta+2', 'ctrl+2'], (st) => st.layout.addMarketplace()),
    simpleValidInInput(['meta+3', 'ctrl+3'], (st) => st.layout.addPaint()),
    simpleValidInInput(['meta+4', 'ctrl+4'], (st) => st.layout.addComfy()),
    simpleValidInInput(['meta+5', 'ctrl+5'], (st) => st.layout.addGallery()),
    simpleValidInInput(['meta+6', 'ctrl+6'], (st) => st.layout.addConfig()),
    simpleValidInInput(['meta+7', 'ctrl+7'], (st) => st.layout.addCivitai()),
    simpleValidInInput(['meta+8', 'ctrl+8'], (st) => st.layout.addHosts()),
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

    // G   - Go
    // G M - Go Messagerie
    // { combos: ['g m'], action: (st) => st.router.goTo('CHAT', { inbox: { filter: 'all' } }) }, // Messagerie   | Appbar
    // { combos: ['g m s'], action: (st) => st.router.goTo('CHAT_NEW', {}) }, //         Messagerie   | Appbar
    // { combos: 'cmd+k cmd+s', action: () => {} },
    // { combos: 'cmd+k cmd+s', action: () => {} },
]
