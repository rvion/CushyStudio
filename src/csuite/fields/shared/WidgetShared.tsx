import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'

import { nanoid } from 'nanoid'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'

// CONFIG
export type Field_shared_config<F extends Field> = FieldConfig<
    //
    { field: F },
    Field_shared_types<F>
>

// SERIAL
export type Field_shared_serial = FieldSerial<{
    type: 'shared'
    // NO VALUE HERE; otherwise, we would store the data twice
}>

// SERIAL FROM VALUE
export const Field_shared_fromValue = (val: Field_shared_value): Field_shared_serial => ({
    type: 'shared',
})

// VALUE
export type Field_shared_value<F extends Field = Field> = F['$Value']

// TYPES
export type Field_shared_types<F extends Field = Field> = {
    $Type: 'shared'
    $Config: Field_shared_config<F>
    $Serial: Field_shared_serial
    $Value: Field_shared_value<F>
    $Field: Field_shared<F>
}

// STATE
export class Field_shared<F extends Field = Field> extends Field<Field_shared_types<F>> {
    readonly id: string
    static readonly type: 'shared' = 'shared'
    readonly type: 'shared' = 'shared'
    readonly DefaultHeaderUI = undefined
    readonly DefaultBodyUI = undefined
    serial: Field_shared_serial

    constructor(
        //
        entity: Entity,
        parent: Field | null,
        schema: ISchema<Field_shared<F>>,
        serial?: Field_shared_serial,
    ) {
        super(entity, parent, schema)
        this.id = serial?.id ?? nanoid()
        const config = schema.config
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
        return this.config.field
    }

    get baseErrors(): Problem_Ext {
        return this.shared.baseErrors
    }

    get value(): Field_shared_value<F> {
        return this.shared.value
    }

    set value(val: Field_shared_value<F>) {
        this.shared.value = val
    }
}

// DI
registerWidgetClass('shared', Field_shared)
