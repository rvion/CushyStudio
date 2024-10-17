import type { CushyShortcut } from '../../csuite/commands/CommandManager'
import type { IconName } from '../../csuite/icons/icons'

import { ctx_global } from '../../csuite/command-topic/ctx_global'
import { command, type Command } from '../../csuite/commands/Command'
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
// const simple = (shortcut: CushyShortcut | CushyShortcut[], info: string, action: (fn: STATE) => void): Shortcut<STATE> => ({
//     combos: Array.isArray(shortcut) ? shortcut : [shortcut],
//     action: always(action),
//     info,
// })
export const globalValidInInput = (
    //
    combo: CushyShortcut | CushyShortcut[],
    info: string,
    action: () => void,
    icon?: IconName,
): Command<null> =>
    command({
        id: `simple_${info}`,
        combos: Array.isArray(combo) ? combo : [combo],
        ctx: ctx_global,
        action: always(action),
        validInInput: true,
        label: info,
        icon,
    })
