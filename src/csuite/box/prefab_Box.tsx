import type { Widget_choices_config } from '../../controls/widgets/choices/WidgetChoices'
import type { FormBuilder } from '../../CUSHY'
import type { Box } from './Box'

import { run_Kolor, ui_tint, type UI_Tint } from '../kolor/prefab_Kolor'

export type UI_Box = X.XChoices<{
    base: UI_Tint
    text: UI_Tint
    textShadow: UI_Tint
    shadow: UI_Tint
    border: UI_Tint
    hover: X.XBool
}>

export const ui_Box = (
    //
    ui: FormBuilder,
    config?: Omit<Widget_choices_config<any>, 'multi' | 'items'>,
): UI_Box => {
    return ui.choicesV2(
        {
            base: ui_tint(ui),
            // text stuff
            text: ui_tint(ui),
            textShadow: ui_tint(ui),
            // border stuff
            shadow: ui_tint(ui),
            border: ui_tint(ui),
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
