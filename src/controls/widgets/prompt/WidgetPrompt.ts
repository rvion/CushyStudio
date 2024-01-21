import type { FormBuilder } from 'src/controls/FormBuilder'
import type { WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers_OLD, IWidget_OLD } from 'src/controls/IWidget'
import type { WidgetPromptOutput } from 'src/widgets/prompter/WidgetPromptUI'
import type { PossibleSerializedNodes } from 'src/widgets/prompter/plugins/PossibleSerializedNodes'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { WidgetDI } from '../WidgetUI.DI'

export type Widget_prompt_config  = WidgetConfigFields<{ default?: string | WidgetPromptOutput }> // prettier-ignore
export type Widget_prompt_serial = Widget_prompt_state // prettier-ignore
export type Widget_prompt_state  = WidgetSerialFields<{ type: 'prompt'; active: true; /*text: string;*/ tokens: PossibleSerializedNodes[] }> // prettier-ignore
export type Widget_prompt_output = { type: 'prompt'; active: true; /*text: string;*/ tokens: PossibleSerializedNodes[] } // prettier-ignore
export interface Widget_prompt extends WidgetTypeHelpers_OLD<'prompt', Widget_prompt_config, Widget_prompt_serial, Widget_prompt_state, Widget_prompt_output> {} // prettier-ignore
export class Widget_prompt
    implements IWidget_OLD<'prompt', Widget_prompt_config, Widget_prompt_serial, Widget_prompt_state, Widget_prompt_output>
{
    readonly isVerticalByDefault = true
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'prompt' = 'prompt'
    readonly serial: Widget_prompt_state

    constructor(public form: FormBuilder, public config: Widget_prompt_config, serial?: Widget_prompt_serial) {
        this.id = serial?.id ?? nanoid()
        if (serial) {
            this.serial = serial
        } else {
            this.serial = {
                type: 'prompt',
                collapsed: config.startCollapsed,
                id: this.id,
                active: true,
                tokens: [],
            }
            const def = config.default
            if (def != null) {
                if (typeof def === 'string') {
                    this.serial.tokens = [{ type: 'text', text: def }]
                } else {
                    this.serial.tokens = def.tokens
                }
            }
        }
        makeAutoObservable(this)
    }
    get result(): Widget_prompt_output {
        JSON.stringify(this.serial) // 🔶 force deep observation
        return this.serial
    }
}

WidgetDI.Widget_prompt = Widget_prompt
