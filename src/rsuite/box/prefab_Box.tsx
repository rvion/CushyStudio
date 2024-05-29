import type { FormBuilder } from '../../CUSHY'
import type { BoxProps } from './BoxProps'

import { run_Kolor, ui_Kolor } from '../kolor/prefab_Kolor'

export const ui_Box = (ui: FormBuilder) => {
    //
    return ui.fields({
        base: ui_Kolor(ui),
        text: ui_Kolor(ui),
        textShadow: ui_Kolor(ui),
        shadow: ui_Kolor(ui),
        border: ui_Kolor(ui),
        hover: ui.boolean(),
    })
}

export const run_Box = (ui: ReturnType<typeof ui_Box>['$Value']): BoxProps => {
    return {
        base: run_Kolor(ui.base),
        text: run_Kolor(ui.text),
        textShadow: run_Kolor(ui.textShadow),
        shadow: run_Kolor(ui.shadow),
        border: run_Kolor(ui.border),
        hover: ui.hover,
    }
}
