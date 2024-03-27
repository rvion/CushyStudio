import type { Form } from '../../Form'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Spec } from '../../Spec'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { applyWidgetMixinV2 } from '../../Mixins'
import { registerWidgetClass } from '../WidgetUI.DI'

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

// VALUE
export type Widget_shared_value<T extends Spec = Spec> = T['$Value']

// TYPES
export type Widget_shared_types<T extends Spec = Spec> = {
    $Type: 'shared'
    $Config: Widget_shared_config<T>
    $Serial: Widget_shared_serial
    $Value: Widget_shared_value<T>
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

    serial: Widget_shared_serial

    get shared(): T['$Widget'] {
        return this.config.widget
    }

    // 🔴
    hidden = () => new Widget_shared<T>(this.form, null, { ...this.config, hidden: true }, this.serial)

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public config: Widget_shared_config<T>,
        serial?: Widget_shared_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? { id: this.id, type: 'shared', collapsed: config.startCollapsed }
        applyWidgetMixinV2(this)
        makeAutoObservable(this)
    }

    get value(): Widget_shared_value<T> {
        return this.config.widget.value
    }
}

// DI
registerWidgetClass('shared', Widget_shared)
