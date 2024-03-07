import type { Form } from '../../Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'

import { computed, makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'
import { WidgetSpacerUI } from './WidgetSpacerUI'

/**
 * Bool Config
 * @property {string} label2 - test
 */
export type Widget_spacer_config = WidgetConfigFields<{}>

// SERIAL
export type Widget_spacer_serial = WidgetSerialFields<{ type: 'spacer' }>

// OUT
export type Widget_spacer_output = boolean

// TYPES
export type Widget_string_types = {
    $Type: 'spacer'
    $Input: Widget_spacer_config
    $Serial: Widget_spacer_serial
    $Output: Widget_spacer_output
    $Widget: Widget_spacer
}

// STATE
export interface Widget_spacer extends Widget_string_types {}
export class Widget_spacer implements IWidget<Widget_string_types> {
    HeaderUI = WidgetSpacerUI
    BodyUI = undefined
    readonly id: string
    readonly type: 'spacer' = 'spacer'
    serial: Widget_spacer_serial

    get serialHash(): string {
        return hash(-1)
    }

    constructor(public form: Form<any>, public config: Widget_spacer_config, serial?: Widget_spacer_serial) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            id: this.id,
            type: 'spacer',
            collapsed: false,
        }

        makeObservable(this, {
            serial: observable,
        })
    }

    get value() {
        return false
    }
    set value(val) {}
}

// DI
WidgetDI.Widget_spacer = Widget_spacer