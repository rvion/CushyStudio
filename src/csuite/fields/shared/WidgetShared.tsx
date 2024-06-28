import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'

import { nanoid } from 'nanoid'

import { BaseField } from '../../model/BaseField'
import { registerWidgetClass } from '../WidgetUI.DI'

// CONFIG
export type Widget_shared_config<T extends ISchema = ISchema> = FieldConfig<
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
export type Widget_shared_value<T extends ISchema = ISchema> = T['$Value']

// TYPES
export type Widget_shared_types<T extends ISchema = ISchema> = {
    $Type: 'shared'
    $Config: Widget_shared_config<T>
    $Serial: Widget_shared_serial
    $Value: Widget_shared_value<T>
    $Field: ISchema['$Field']
}

// STATE
export class Widget_shared<T extends ISchema = ISchema> extends BaseField<Widget_shared_types<T>> {
    readonly id: string
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
        entity: Entity,
        parent: BaseField | null,
        spec: ISchema<Widget_shared<T>>,
        serial?: Widget_shared_serial,
    ) {
        super(entity, parent, spec)
        this.id = serial?.id ?? nanoid()
        const config = spec.config
        this.serial = serial ?? { id: this.id, type: 'shared', collapsed: config.startCollapsed }
        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }
    set value(val: Widget_shared_value<T>) {
        this.shared.value = val
    }
    get value(): Widget_shared_value<T> {
        return this.shared.value
    }
}

// DI
registerWidgetClass('shared', Widget_shared)
