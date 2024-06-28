import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { IBlueprint } from '../../model/IBlueprint'
import type { Model } from '../../model/Model'
import type { Problem_Ext } from '../../model/Validation'

import { nanoid } from 'nanoid'

import { BaseField } from '../../model/BaseField'
import { registerWidgetClass } from '../WidgetUI.DI'

// CONFIG
export type Widget_shared_config<T extends IBlueprint = IBlueprint> = FieldConfig<
    {
        /** shared widgets must be registered in the form root group */
        // rootKey: string
        widget: (parent: BaseField) => T['$Field']
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
    serial: Widget_shared_serial

    get hasChanges(): boolean {
        return this.shared.hasChanges ?? false
    }

    reset(): void {
        return this.shared.reset()
    }

    get shared(): T['$Field'] {
        return this.config.widget(this.parent!)
    }

    get baseErrors(): Problem_Ext {
        return this.shared.baseErrors
    }

    constructor(
        //
        public readonly entity: Model,
        public readonly parent: BaseField | null,
        public readonly spec: IBlueprint<Widget_shared<T>>,
        serial?: Widget_shared_serial,
    ) {
        super()
        this.id = serial?.id ?? nanoid()
        const config = spec.config
        this.serial = serial ?? { id: this.id, type: 'shared', collapsed: config.startCollapsed }
        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }
    setValue(val: Widget_shared_value<T>) {
        this.value = val
    }
    set value(val: Widget_shared_value<T>) {
        this.shared.setValue(val)
    }
    get value(): Widget_shared_value<T> {
        return this.shared.value
    }
}

// DI
registerWidgetClass('shared', Widget_shared)
