import type { Form } from '../../Form'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'

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
    readonly id: string
    readonly type: 'spacer' = 'spacer'
    serial: Widget_spacer_serial

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public config: Widget_spacer_config,
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
