import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'

import { makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'

import { applyWidgetMixinV2 } from '../../Mixins'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetSpacerUI } from './WidgetSpacerUI'

/**
 * Bool Config
 * @property {string} label2 - test
 */
export type Widget_spacer_config = WidgetConfigFields<{}, Widget_spacer_types>

// SERIAL
export type Widget_spacer_serial = WidgetSerialFields<{ type: 'spacer' }>

// SERIAL FROM VALUE
export const Widget_spacer_fromValue = (val: Widget_spacer_value): Widget_spacer_serial => ({
    type: 'spacer',
})

// VALUE
export type Widget_spacer_value = boolean

// TYPES
export type Widget_spacer_types = {
    $Type: 'spacer'
    $Config: Widget_spacer_config
    $Serial: Widget_spacer_serial
    $Value: Widget_spacer_value
    $Widget: Widget_spacer
}

// STATE
export interface Widget_spacer extends Widget_spacer_types, IWidgetMixins {}
export class Widget_spacer implements IWidget<Widget_spacer_types> {
    DefaultHeaderUI = WidgetSpacerUI
    DefaultBodyUI = undefined
    get baseErrors(): Problem_Ext {
        return null
    }
    readonly id: string
    get config() { return this.spec.config } // prettier-ignore
    readonly type: 'spacer' = 'spacer'
    serial: Widget_spacer_serial

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_spacer>,
        serial?: Widget_spacer_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            id: this.id,
            type: 'spacer',
            collapsed: false,
        }

        applyWidgetMixinV2(this)
        makeObservable(this, { serial: observable })
    }

    get value() {
        return false
    }
    set value(val) {}
}

// DI
registerWidgetClass('spacer', Widget_spacer)
