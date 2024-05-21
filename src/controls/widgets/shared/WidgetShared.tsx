import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'

import { nanoid } from 'nanoid'

import { makeAutoObservableInheritance } from '../../../utils/mobx-store-inheritance'
import { BaseWidget } from '../../BaseWidget'
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
export interface Widget_shared<T extends ISpec = ISpec> extends Widget_shared_types<T> {}
export class Widget_shared<T extends ISpec = ISpec> extends BaseWidget implements IWidget<Widget_shared_types<T>> {
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

    get baseErrors(): Problem_Ext {
        return null
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
        super()
        const config = spec.config
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? { id: this.id, type: 'shared', collapsed: config.startCollapsed }
        makeAutoObservableInheritance(this)
    }
    setValue(val: Widget_shared_value<T>) {
        this.value = val
    }
    set value(val: Widget_shared_value<T>) {
        this.config.widget.setValue(val)
    }
    get value(): Widget_shared_value<T> {
        return this.config.widget.value
    }
}

// DI
registerWidgetClass('shared', Widget_shared)
