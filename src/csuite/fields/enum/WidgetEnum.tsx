import type { EnumValue } from '../../../models/ComfySchema'
import type { CleanedEnumResult } from '../../../types/EnumUtils'
import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { BaseField } from '../../model/BaseField'
import { registerWidgetClass } from '../WidgetUI.DI'
import { _extractDefaultValue } from './_extractDefaultValue'
import { WidgetEnumUI } from './WidgetEnumUI'

// CONFIG
export type Widget_enum_config<O> = FieldConfig<
    {
        enumName: string
        default?: O //Requirable[T] | EnumDefault<T>
        extraDefaults?: string[]
        filter?: (v: EnumValue) => boolean
    },
    Widget_enum_types<O>
>

// SERIAL
export type Widget_enum_serial<O> = FieldSerial<{
    type: 'enum'
    active: true
    val: O
}>

// VALUE
export type Widget_enum_value<O> = O // Requirable[T]

// TYPES
export type Widget_enum_types<O> = {
    $Type: 'enum'
    $Config: Widget_enum_config<O>
    $Serial: Widget_enum_serial<O>
    $Value: Widget_enum_value<O>
    $Field: Widget_enum<O>
}

// STATE
export class Widget_enum<O> extends BaseField<Widget_enum_types<O>> {
    DefaultHeaderUI = WidgetEnumUI
    DefaultBodyUI = undefined
    readonly id: string

    readonly type: 'enum' = 'enum'

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

    serial: Widget_enum_serial<O>
    constructor(
        //
        entity: Entity,
        parent: BaseField | null,
        spec: ISchema<Widget_enum<O>>,
        serial?: Widget_enum_serial<O>,
    ) {
        super(entity, parent, spec)
        this.id = serial?.id ?? nanoid()
        const config = spec.config
        this.serial = serial ?? {
            type: 'enum',
            id: this.id,
            active: true,
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

    get value(): Widget_enum_value<O> {
        return this.status.finalValue
    }

    set value(next: Widget_enum_value<O>) {
        if (this.serial.val === next) return
        runInAction(() => {
            this.serial.val = next
            this.applyValueUpdateEffects()
        })
    }
}

// DI
registerWidgetClass('enum', Widget_enum)
