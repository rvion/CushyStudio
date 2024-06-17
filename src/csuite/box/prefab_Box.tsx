import type { Widget_choices_config } from '../../controls/widgets/choices/WidgetChoices'
import type { FormBuilder } from '../../CUSHY'
import type { Box } from './Box'

import { run_Kolor, ui_Kolor, type UI_Kolor } from '../kolor/prefab_Kolor'

export type UI_Box = X.XChoices<{
    base: UI_Kolor
    text: UI_Kolor
    textShadow: UI_Kolor
    shadow: UI_Kolor
    border: UI_Kolor
    hover: X.XBool
}>

export const ui_Box = (
    //
    ui: FormBuilder,
    config?: Omit<Widget_choices_config<any>, 'multi' | 'items'>,
): UI_Box => {
    return ui.choicesV2(
        {
            base: ui_Kolor(ui),
            // text stuff
            text: ui_Kolor(ui),
            textShadow: ui_Kolor(ui),
            // border stuff
            shadow: ui_Kolor(ui),
            border: ui_Kolor(ui),
            // interraction effect
            hover: ui.boolean(),
        },
        config,
    )
}

export const run_Box = (ui: UI_Box['$Value']): Box => {
    const box: Box = { hover: ui.hover }
    if (ui.base) box.base = run_Kolor(ui.base)
    if (ui.text) box.text = run_Kolor(ui.text)
    if (ui.textShadow) box.textShadow = run_Kolor(ui.textShadow)
    if (ui.shadow) box.shadow = run_Kolor(ui.shadow)
    if (ui.border) box.border = run_Kolor(ui.border)
    return box
}
