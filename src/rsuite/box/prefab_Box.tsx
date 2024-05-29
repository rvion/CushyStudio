import type { FormBuilder } from '../../CUSHY'
import type { Box } from './Box'

import { run_Kolor, ui_Kolor } from '../kolor/prefab_Kolor'

export const ui_Box = (ui: FormBuilder) => {
    return ui.choicesV2({
        base: ui_Kolor(ui),
        // text stuff
        text: ui_Kolor(ui),
        textShadow: ui_Kolor(ui),
        // border stuff
        shadow: ui_Kolor(ui),
        border: ui_Kolor(ui),
        // interraction effect
        hover: ui.boolean(),
    })
}

export const run_Box = (ui: ReturnType<typeof ui_Box>['$Value']): Box => {
    const box: Box = { hover: ui.hover }
    if (ui.base) box.base = run_Kolor(ui.base)
    if (ui.text) box.text = run_Kolor(ui.text)
    if (ui.textShadow) box.textShadow = run_Kolor(ui.textShadow)
    if (ui.shadow) box.shadow = run_Kolor(ui.shadow)
    if (ui.border) box.border = run_Kolor(ui.border)
    return box
}
