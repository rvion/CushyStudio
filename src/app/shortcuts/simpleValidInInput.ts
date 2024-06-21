import { ctx_global } from '../../csuite/command-topic/ctx_global'
import { command, type Command } from '../../csuite/commands/Command'
import { CushyShortcut } from '../../csuite/commands/CommandManager'
import { Trigger } from '../../csuite/trigger/Trigger'

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
export const placeholderTree = (combo: CushyShortcut | CushyShortcut[], info: string): Command<null> => {
    return placholder(combo, info, 'in tree')
}
// const simple = (shortcut: CushyShortcut | CushyShortcut[], info: string, action: (fn: STATE) => void): Shortcut<STATE> => ({
//     combos: Array.isArray(shortcut) ? shortcut : [shortcut],
//     action: always(action),
//     info,
// })
export const globalValidInInput = (combo: CushyShortcut | CushyShortcut[], info: string, action: () => void): Command<null> =>
    command({
        id: `simple_${info}`,
        combos: Array.isArray(combo) ? combo : [combo],
        ctx: ctx_global,
        action: always(action),
        validInInput: true,
        label: info,
    })
