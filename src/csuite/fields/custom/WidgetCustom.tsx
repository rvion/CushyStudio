import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'
import type { FC } from 'react'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetCustom_HeaderUI } from './WidgetCustomUI'

export type CustomWidgetProps<T> = { field: Field_custom<T>; extra: import('./WidgetCustomUI').UIKit }

// CONFIG
export type Field_custom_config<T> = FieldConfig<
    {
        defaultValue: () => T
        subTree?: () => ISchema
        Component: FC<CustomWidgetProps<T>>
    },
    Field_custom_types<T>
>

// SERIAL
export type Field_custom_serial<T> = FieldSerial<{ type: 'custom'; active: true; value: T }>

// VALUE
export type Field_custom_value<T> = T

// TYPES
export type Field_custom_types<T> = {
    $Type: 'custom'
    $Config: Field_custom_config<T>
    $Serial: Field_custom_serial<T>
    $Value: Field_custom_value<T>
    $Field: Field_custom<T>
}

// STATE
export class Field_custom<T> extends Field<Field_custom_types<T>> {
    DefaultHeaderUI = WidgetCustom_HeaderUI
    DefaultBodyUI = undefined
    readonly id: string

    static readonly type: 'custom' = 'custom'
    readonly type: 'custom' = 'custom'

    get baseErrors(): Problem_Ext {
        return null
    }

    serial: Field_custom_serial<T>
    Component: Field_custom_config<T>['Component']
    st = () => cushy

    get defaultValue(): T { return this.config.defaultValue() } // prettier-ignore
    get hasChanges(): boolean { return this.value !== this.defaultValue } // prettier-ignore
    reset = () => (this.value = this.config.defaultValue())

    constructor(
        //
        entity: Entity,
        parent: Field | null,
        schema: ISchema<Field_custom<T>>,
        serial?: Field_custom_serial<T>,
    ) {
        super(entity, parent, schema)
        this.id = serial?.id ?? nanoid()
        const config = schema.config
        this.Component = config.Component
        this.serial = serial ?? {
            type: 'custom',
            active: true,
            id: this.id,
            value: this.config.defaultValue(),
        }

        this.init({
            Component: false,
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    /** never mutate this field manually, only access to .state */
    get value(): Field_custom_value<T> {
        return this.serial.value
    }

    set value(next: Field_custom_value<T>) {
        if (this.serial.value === next) return
        runInAction(() => {
            this.serial.value = next
            this.applyValueUpdateEffects()
        })
    }
}

registerWidgetClass('custom', Field_custom)
