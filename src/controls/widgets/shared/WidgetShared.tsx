import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { applyWidgetMixinV2 } from '../../Mixins'
import { registerWidgetClass } from '../WidgetUI.DI'

// CONFIG
export type Widget_shared_config<T extends ISpec = ISpec> = WidgetConfigFields<
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

// SERIAL FROM VALUE
export const Widget_shared_fromValue = (val: Widget_shared_value): Widget_shared_serial => ({
    type: 'shared',
})

// VALUE
export type Widget_shared_value<T extends ISpec = ISpec> = T['$Value']

// TYPES
export type Widget_shared_types<T extends ISpec = ISpec> = {
    $Type: 'shared'
    $Config: Widget_shared_config<T>
    $Serial: Widget_shared_serial
    $Value: Widget_shared_value<T>
    $Widget: ISpec['$Widget']
}

// STATE
export interface Widget_shared<T extends ISpec = ISpec> extends Widget_shared_types<T>, IWidgetMixins {}
export class Widget_shared<T extends ISpec = ISpec> implements IWidget<Widget_shared_types<T>> {
    readonly id: string
    get config():Widget_shared_config<T> { return this.spec.config } // prettier-ignore
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
    hidden = () => {
        const ctor = this.form.builder.SpecCtor
        const config: Widget_shared_config<T> = { ...this.spec.config, hidden: true }
        const spec2: ISpec<Widget_shared<T>> = new ctor('shared', config)
        new Widget_shared<T>(this.form, null, spec2, this.serial)
    }

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_shared<T>>,
        serial?: Widget_shared_serial,
    ) {
        const config = spec.config
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
