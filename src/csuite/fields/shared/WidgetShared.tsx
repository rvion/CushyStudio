import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { IBlueprint } from '../../model/IBlueprint'
import type { Model } from '../../model/Model'
import type { Problem_Ext } from '../../model/Validation'

import { nanoid } from 'nanoid'

import { makeAutoObservableInheritance } from '../../../utils/mobx-store-inheritance'
import { BaseField } from '../../model/BaseField'
import { registerWidgetClass } from '../WidgetUI.DI'

// CONFIG
export type Widget_shared_config<T extends IBlueprint = IBlueprint> = FieldConfig<
    {
        /** shared widgets must be registered in the form root group */
        rootKey: string
        widget: T['$Field']
    },
    Widget_shared_types<T>
>

// SERIAL
export type Widget_shared_serial = FieldSerial<{
    type: 'shared'
}>

// SERIAL FROM VALUE
export const Widget_shared_fromValue = (val: Widget_shared_value): Widget_shared_serial => ({
    type: 'shared',
})

// VALUE
export type Widget_shared_value<T extends IBlueprint = IBlueprint> = T['$Value']

// TYPES
export type Widget_shared_types<T extends IBlueprint = IBlueprint> = {
    $Type: 'shared'
    $Config: Widget_shared_config<T>
    $Serial: Widget_shared_serial
    $Value: Widget_shared_value<T>
    $Field: IBlueprint['$Field']
}

// STATE
export class Widget_shared<T extends IBlueprint = IBlueprint> extends BaseField<Widget_shared_types<T>> {
    readonly id: string
    get config():Widget_shared_config<T> { return this.spec.config } // prettier-ignore
    readonly type: 'shared' = 'shared'
    readonly DefaultHeaderUI = undefined
    readonly DefaultBodyUI = undefined
    // 👇 magically allow type-safe use of Mounted Widget_shared as Unmounted
    $Field!: T['$Field']

    serial: Widget_shared_serial

    get hasChanges() {
        return this.config.widget.hasChanges
    }
    reset() {
        return this.config.widget.reset()
    }

    get shared(): T['$Field'] {
        return this.config.widget
    }

    get baseErrors(): Problem_Ext {
        return null
    }
    // 🔴
    hidden = () => {
        const ctor = this.form.builder.SpecCtor
        const config: Widget_shared_config<T> = { ...this.spec.config, hidden: true }
        const spec2: IBlueprint<Widget_shared<T>> = new ctor('shared', config)
        new Widget_shared<T>(this.form, null, spec2, this.serial)
    }

    constructor(
        //
        public readonly form: Model,
        public readonly parent: BaseField | null,
        public readonly spec: IBlueprint<Widget_shared<T>>,
        serial?: Widget_shared_serial,
    ) {
        super()
        this.id = serial?.id ?? nanoid()
        const config = spec.config
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
