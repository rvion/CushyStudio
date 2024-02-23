import type { Form } from '../../Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Spec } from '../../Prop'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { WidgetDI } from '../WidgetUI.DI'

// CONFIG
export type Widget_shared_config<T extends Spec> = WidgetConfigFields<{
    startActive?: boolean
    /** shared widgets must be registered in the form root group */
    rootKey: string
    widget: T['$Widget']
}>

// SERIAL
export type Widget_shared_serial = WidgetSerialFields<{
    type: 'shared'
}>

// OUT
export type Widget_shared_output<T extends Spec> = T['$Output']

// TYPES
export type Widget_string_types<T extends Spec> = {
    $Type: 'shared'
    $Input: Widget_shared_config<T>
    $Serial: Widget_shared_serial
    $Output: Widget_shared_output<T>
}

// STATE
export interface Widget_shared<T extends Spec> extends Widget_string_types<T> {}
export class Widget_shared<T extends Spec> implements IWidget<Widget_string_types<T>> {
    // 👇 magically allow type-safe use of Mounted Widget_shared as Unmounted
    $Widget!: T['$Widget']

    get serialHash(): string { return this.config.rootKey } // prettier-ignore
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'shared' = 'shared'

    serial: Widget_shared_serial

    get shared(): T['$Widget'] {
        return this.config.widget
    }

    constructor(
        //
        public form: Form<any>,
        public config: Widget_shared_config<T>,
        serial?: Widget_shared_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? { id: this.id, type: 'shared', collapsed: config.startCollapsed }
        makeAutoObservable(this)
    }

    get value(): Widget_shared_output<T> {
        return this.config.widget.value
    }
}

// DI
WidgetDI.Widget_shared = Widget_shared
