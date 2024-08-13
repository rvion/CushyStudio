import type { EnumValue } from '../../../models/ComfySchema'
import type { CleanedEnumResult } from '../../../types/EnumUtils'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { _extractDefaultValue } from './_extractDefaultValue'
import { WidgetEnumUI } from './WidgetEnumUI'

// CONFIG
export type Field_enum_config<O> = FieldConfig<
    {
        enumName: string
        default?: O
        extraDefaults?: string[]
        filter?: (v: EnumValue) => boolean
        appearance?: 'select' | 'tab'
        /**
         * @since 2024-07-22
         * allow to wrap the list of values if they take more than 1 SLH (standard line height)
         */
        wrap?: boolean
    },
    Field_enum_types<O>
>

// SERIAL
export type Field_enum_serial<O> = FieldSerial<{
    $: 'enum'
    val?: O
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

    get defaultValue(): Field_enum_value<O> {
        return this.config.default ?? (this.possibleValues[0] as any)
    }

    get hasChanges(): boolean {
        return this.serial.val !== this.defaultValue
    }

    reset(): void {
        this.value = this.defaultValue
    }

    get possibleValues(): EnumValue[] {
        return cushy.schema.knownEnumsByName.get(this.config.enumName as any)?.values ?? []
    }

    get ownProblems(): Problem_Ext {
        return null
    }

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_enum<O>>,
        serial?: Field_enum_serial<O>,
    ) {
        super(repo, root, parent, schema)
        this.init(serial, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(serial: Maybe<Field_enum_serial<O>>): void {
        this.serial.val =
            serial?.val ?? //
            _extractDefaultValue(this.config) ??
            (this.possibleValues[0] as any)
    }

    get status(): CleanedEnumResult<any> {
        return cushy.fixEnumValue(this.serial.val as any, this.config.enumName)
    }

    get value(): Field_enum_value<O> {
        return this.status.finalValue
    }

    set value(next: Field_enum_value<O>) {
        if (this.serial.val === next) return
        this.runInValueTransaction(() => (this.serial.val = next))
    }
}

// DI
registerFieldClass('enum', Field_enum)
