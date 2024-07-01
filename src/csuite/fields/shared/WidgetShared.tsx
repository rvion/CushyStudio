import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'

import { nanoid } from 'nanoid'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'

// CONFIG
export type Widget_shared_config<F extends Field> = FieldConfig<
    {
        widget: F
    },
    Widget_shared_types<F>
>

// SERIAL
export type Widget_shared_serial = FieldSerial<{
    type: 'shared'
    // NO VALUE HERE; otherwise, we would store the data twice
}>

// SERIAL FROM VALUE
export const Widget_shared_fromValue = (val: Widget_shared_value): Widget_shared_serial => ({
    type: 'shared',
})

// VALUE
export type Widget_shared_value<F extends Field = Field> = F['$Value']

// TYPES
export type Widget_shared_types<F extends Field = Field> = {
    $Type: 'shared'
    $Config: Widget_shared_config<F>
    $Serial: Widget_shared_serial
    $Value: Widget_shared_value<F>
    $Field: Widget_shared<F>
}

// STATE
export class Widget_shared<F extends Field = Field> extends Field<Widget_shared_types<F>> {
    readonly id: string
    readonly type: 'shared' = 'shared'
    readonly DefaultHeaderUI = undefined
    readonly DefaultBodyUI = undefined
    serial: Widget_shared_serial

    constructor(
        //
        entity: Entity,
        parent: Field | null,
        spec: ISchema<Widget_shared<F>>,
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

    get hasChanges(): boolean {
        return this.shared.hasChanges ?? false
    }

    reset(): void {
        return this.shared.reset()
    }

    get shared(): F {
        return this.config.widget
    }

    get baseErrors(): Problem_Ext {
        return this.shared.baseErrors
    }

    get value(): Widget_shared_value<F> {
        return this.shared.value
    }

    set value(val: Widget_shared_value<F>) {
        this.shared.value = val
    }
}

// DI
registerWidgetClass('shared', Widget_shared)
