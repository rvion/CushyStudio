import type { CleanedEnumResult } from 'src/types/EnumUtils'
import type { EnumValue } from '../../../models/Schema'
import type { FormBuilder } from '../../FormBuilder'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../../IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { _extractDefaultValue } from './_extractDefaultValue'
import { WidgetDI } from '../WidgetUI.DI'
import { hash } from 'ohash'

// CONFIG
export type Widget_enum_config<O> = WidgetConfigFields<{
    enumName: string
    default?: O //Requirable[T] | EnumDefault<T>
    extraDefaults?: string[]
    filter?: (v: EnumValue) => boolean
}>

// SERIAL
export type Widget_enum_serial<O> = WidgetSerialFields<{ type: 'enum'; active: true; val: O }>

// OUT
export type Widget_enum_output<O> = O // Requirable[T]

// TYPES
export type Widget_enum_types<O> = {
    $Type: 'enum'
    $Input: Widget_enum_config<O>
    $Serial: Widget_enum_serial<O>
    $Output: Widget_enum_output<O>
}

// STATE
export interface Widget_enum<O> extends WidgetTypeHelpers<Widget_enum_types<O>> {}
export class Widget_enum<O> implements IWidget<Widget_enum_types<O>> {
    readonly isVerticalByDefault = false
    readonly isCollapsible = false
    readonly id: string
    readonly type: 'enum' = 'enum'

    get isChanged() { return this.serial.val !== this.config.default } // prettier-ignore
    reset = () => { this.serial.val = this.defaultValue } // prettier-ignore
    get serialHash () { return hash(this.value) } // prettier-ignore
    get possibleValues(): EnumValue[] {
        return cushy.schema.knownEnumsByName.get(this.config.enumName as any)?.values ?? []
    }

    serial: Widget_enum_serial<O>
    get defaultValue() { return this.config.default ?? this.possibleValues[0] as any } // prettier-ignore
    constructor(public form: FormBuilder, public config: Widget_enum_config<O>, serial?: Widget_enum_serial<O>) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'enum',
            id: this.id,
            active: true,
            val: _extractDefaultValue(config) ?? (this.possibleValues[0] as any),
        }
        makeAutoObservable(this)
    }
    get status(): CleanedEnumResult<any> {
        return cushy.fixEnumValue(this.serial.val as any, this.config.enumName)
    }
    get value(): Widget_enum_output<O> {
        return this.status.finalValue
    }
}

// DI
WidgetDI.Widget_enum = Widget_enum
