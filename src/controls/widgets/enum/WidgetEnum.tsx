import type { CleanedEnumResult } from 'src/types/EnumUtils'
import type { EnumValue } from '../../../models/Schema'
import type { FormBuilder } from '../../FormBuilder'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../../IWidget'

import { EnumDefault, extractDefaultValue } from '../../EnumDefault'
import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { WidgetDI } from '../WidgetUI.DI'

// CONFIG
export type Widget_enum_config<T extends KnownEnumNames> = WidgetConfigFields<{
    default?: Requirable[T] | EnumDefault<T>
    enumName: T
}>

// SERIAL
export type Widget_enum_serial<T extends KnownEnumNames> = WidgetSerialFields<{ type: 'enum'; active: true; val: Requirable[T] }>

// OUT
export type Widget_enum_output<T extends KnownEnumNames> = Requirable[T]

// TYPES
export type Widget_enum_types<T extends KnownEnumNames> = {
    $Type: 'enum'
    $Input: Widget_enum_config<T>
    $Serial: Widget_enum_serial<T>
    $Output: Widget_enum_output<T>
}

// STATE
export interface Widget_enum<T extends KnownEnumNames> extends WidgetTypeHelpers<Widget_enum_types<T>> {}
export class Widget_enum<T extends KnownEnumNames> implements IWidget<Widget_enum_types<T>> {
    readonly isVerticalByDefault = false
    readonly isCollapsible = false
    readonly id: string
    readonly type: 'enum' = 'enum'

    get possibleValues(): EnumValue[] {
        return this.builder.schema.knownEnumsByName.get(this.config.enumName)?.values ?? []
    }

    serial: Widget_enum_serial<T>

    constructor(public builder: FormBuilder, public config: Widget_enum_config<T>, serial?: Widget_enum_serial<T>) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'enum',
            id: this.id,
            active: true,
            val: extractDefaultValue(config) ?? (this.possibleValues[0] as any),
        }
        makeAutoObservable(this)
    }
    get status(): CleanedEnumResult<any> {
        return this.builder.schema.st.fixEnumValue(this.serial.val as any, this.config.enumName, false)
    }
    get result(): Widget_enum_output<T> {
        return this.status.finalValue
    }
}

// DI
WidgetDI.Widget_enum = Widget_enum
