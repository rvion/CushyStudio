import type { EnumValue } from '../../../models/ComfySchema'
import type { CleanedEnumResult } from '../../../types/EnumUtils'
import type { Field } from '../../model/Field'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'

import { runInAction } from 'mobx'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
import { _extractDefaultValue } from './_extractDefaultValue'
import { WidgetEnumUI } from './WidgetEnumUI'

// CONFIG
export type Field_enum_config<O> = FieldConfig<
    {
        enumName: string
        default?: O //Requirable[T] | EnumDefault<T>
        extraDefaults?: string[]
        filter?: (v: EnumValue) => boolean
    },
    Field_enum_types<O>
>

// SERIAL
export type Field_enum_serial<O> = FieldSerial<{
    type: 'enum'
    val: O
}>

// VALUE
export type Field_enum_value<O> = O // Requirable[T]

// TYPES
export type Field_enum_types<O> = {
    $Type: 'enum'
    $Config: Field_enum_config<O>
    $Serial: Field_enum_serial<O>
    $Value: Field_enum_value<O>
    $Field: Field_enum<O>
}

// STATE
export class Field_enum<O> extends Field<Field_enum_types<O>> {
    DefaultHeaderUI = WidgetEnumUI
    DefaultBodyUI = undefined

    static readonly type: 'enum' = 'enum'

    get defaultValue() { return this.config.default ?? this.possibleValues[0] as any } // prettier-ignore
    get hasChanges(): boolean { return this.serial.val !== this.defaultValue } // prettier-ignore

    reset(): void {
        this.value = this.defaultValue
    }

    get possibleValues(): EnumValue[] {
        return cushy.schema.knownEnumsByName.get(this.config.enumName as any)?.values ?? []
    }

    get baseErrors(): Problem_Ext {
        return null
    }

    constructor(
        //
        root: Field | null,
        parent: Field | null,
        schema: ISchema<Field_enum<O>>,
        serial?: Field_enum_serial<O>,
    ) {
        super(root, parent, schema)
        const config = schema.config
        this.serial = serial ?? {
            type: 'enum',
            id: this.id,
            val: _extractDefaultValue(config) ?? (this.possibleValues[0] as any),
        }
        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }
    get status(): CleanedEnumResult<any> {
        return cushy.fixEnumValue(this.serial.val as any, this.config.enumName)
    }

    get value(): Field_enum_value<O> {
        return this.status.finalValue
    }

    set value(next: Field_enum_value<O>) {
        if (this.serial.val === next) return
        runInAction(() => {
            this.serial.val = next
            this.applyValueUpdateEffects()
        })
    }
}

// DI
registerWidgetClass('enum', Field_enum)
