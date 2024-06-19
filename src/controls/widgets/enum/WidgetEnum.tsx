import type { EnumValue } from '../../../models/ComfySchema'
import type { CleanedEnumResult } from '../../../types/EnumUtils'
import type { ISpec } from '../../ISpec'
import type { Model } from '../../Model'
import type { Problem_Ext } from '../../Validation'
import type { WidgetConfig } from '../../WidgetConfig'
import type { WidgetSerial } from '../../WidgetSerialFields'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { BaseWidget } from '../../BaseWidget'
import { registerWidgetClass } from '../WidgetUI.DI'
import { _extractDefaultValue } from './_extractDefaultValue'
import { WidgetEnumUI } from './WidgetEnumUI'

// CONFIG
export type Widget_enum_config<O> = WidgetConfig<
    {
        enumName: string
        default?: O //Requirable[T] | EnumDefault<T>
        extraDefaults?: string[]
        filter?: (v: EnumValue) => boolean
    },
    Widget_enum_types<O>
>

// SERIAL
export type Widget_enum_serial<O> = WidgetSerial<{
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
    $Widget: Widget_enum<O>
}

// STATE
export class Widget_enum<O> extends BaseWidget<Widget_enum_types<O>> {
    DefaultHeaderUI = WidgetEnumUI
    DefaultBodyUI = undefined
    readonly id: string

    readonly type: 'enum' = 'enum'

    get defaultValue() { return this.config.default ?? this.possibleValues[0] as any } // prettier-ignore
    get hasChanges() { return this.serial.val !== this.defaultValue } // prettier-ignore
    reset = () => { this.value = this.defaultValue } // prettier-ignore
    get possibleValues(): EnumValue[] {
        return cushy.schema.knownEnumsByName.get(this.config.enumName as any)?.values ?? []
    }

    get baseErrors(): Problem_Ext {
        return null
    }

    serial: Widget_enum_serial<O>
    constructor(
        //
        public readonly form: Model,
        public readonly parent: BaseWidget | null,
        public readonly spec: ISpec<Widget_enum<O>>,
        serial?: Widget_enum_serial<O>,
    ) {
        super()
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
    setValue(val: Widget_enum_value<O>) {
        this.value = val
    }
    set value(next: Widget_enum_value<O>) {
        if (this.serial.val === next) return
        runInAction(() => {
            this.serial.val = next
            this.bumpValue()
        })
    }
}

// DI
registerWidgetClass('enum', Widget_enum)
