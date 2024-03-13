import type { Form } from '../../Form'
import type { IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Spec } from '../../Spec'
import type { IWidget } from 'src/controls/IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { WidgetDI } from '../WidgetUI.DI'
import { applyWidgetMixinV2 } from 'src/controls/Mixins'

// CONFIG
export type Widget_shared_config<T extends Spec = Spec> = WidgetConfigFields<
    {
        /** shared widgets must be registered in the form root group */
        rootKey: string
        widget: T['$Widget']
    },
    Widget_shared_types<T>
>

// SERIAL
export type Widget_shared_serial = WidgetSerialFields<{
    type: 'shared'
}>

// OUT
export type Widget_shared_output<T extends Spec = Spec> = T['$Value']

// TYPES
export type Widget_shared_types<T extends Spec = Spec> = {
    $Type: 'shared'
    $Input: Widget_shared_config<T>
    $Serial: Widget_shared_serial
    $Value: Widget_shared_output<T>
    $Widget: Spec['$Widget']
}

// STATE
export interface Widget_shared<T extends Spec = Spec> extends Widget_shared_types<T>, IWidgetMixins {}
export class Widget_shared<T extends Spec = Spec> implements IWidget<Widget_shared_types<T>> {
    readonly id: string
    readonly type: 'shared' = 'shared'
    readonly DefaultHeaderUI = undefined
    readonly DefaultBodyUI = undefined
    // 👇 magically allow type-safe use of Mounted Widget_shared as Unmounted
    $Widget!: T['$Widget']

    get serialHash(): string { return this.shared.serialHash } // prettier-ignore
    serial: Widget_shared_serial

    get shared(): T['$Widget'] {
        return this.config.widget
    }

    hidden = () => new Widget_shared<T>(this.form, { ...this.config, hidden: true }, this.serial)

    constructor(
        //
        public form: Form<any, any>,
        public config: Widget_shared_config<T>,
        serial?: Widget_shared_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? { id: this.id, type: 'shared', collapsed: config.startCollapsed }
        applyWidgetMixinV2(this)
        makeAutoObservable(this)
    }

    get value(): Widget_shared_output<T> {
        return this.config.widget.value
    }
}

// DI
WidgetDI.Widget_shared = Widget_shared
