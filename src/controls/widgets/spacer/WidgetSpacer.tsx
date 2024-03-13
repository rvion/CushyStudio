import type { Form } from '../../Form'
import type { IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { IWidget } from 'src/controls/IWidget'

import { makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'
import { WidgetSpacerUI } from './WidgetSpacerUI'
import { applyWidgetMixinV2 } from 'src/controls/Mixins'

/**
 * Bool Config
 * @property {string} label2 - test
 */
export type Widget_spacer_config = WidgetConfigFields<{}, Widget_shared_types>

// SERIAL
export type Widget_spacer_serial = WidgetSerialFields<{ type: 'spacer' }>

// OUT
export type Widget_spacer_output = boolean

// TYPES
export type Widget_shared_types = {
    $Type: 'spacer'
    $Config: Widget_spacer_config
    $Serial: Widget_spacer_serial
    $Value: Widget_spacer_output
    $Widget: Widget_spacer
}

// STATE
export interface Widget_spacer extends Widget_shared_types, IWidgetMixins {}
export class Widget_spacer implements IWidget<Widget_shared_types> {
    DefaultHeaderUI = WidgetSpacerUI
    DefaultBodyUI = undefined
    readonly id: string
    readonly type: 'spacer' = 'spacer'
    serial: Widget_spacer_serial

    get serialHash(): string {
        return hash(-1)
    }

    constructor(
        //
        public form: Form<any, any>,
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
WidgetDI.Widget_spacer = Widget_spacer
