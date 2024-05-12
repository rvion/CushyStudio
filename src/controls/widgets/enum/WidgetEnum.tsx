import type { EnumValue } from '../../../models/ComfySchema'
import type { CleanedEnumResult } from '../../../types/EnumUtils'
import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { makeAutoObservableInheritance } from '../../../utils/mobx-store-inheritance'
import { BaseWidget } from '../../BaseWidget'
import { registerWidgetClass } from '../WidgetUI.DI'
import { _extractDefaultValue } from './_extractDefaultValue'
import { WidgetEnumUI } from './WidgetEnumUI'

// CONFIG
export type Widget_enum_config<O> = WidgetConfigFields<
    {
        enumName: string
        default?: O //Requirable[T] | EnumDefault<T>
        extraDefaults?: string[]
        filter?: (v: EnumValue) => boolean
    },
    Widget_enum_types<O>
>

// SERIAL
export type Widget_enum_serial<O> = WidgetSerialFields<{
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
export interface Widget_enum<O> extends Widget_enum_types<O> {}
export class Widget_enum<O> extends BaseWidget implements IWidget<Widget_enum_types<O>> {
    DefaultHeaderUI = WidgetEnumUI
    DefaultBodyUI = undefined
    readonly id: string
    get config() { return this.spec.config } // prettier-ignore
    readonly type: 'enum' = 'enum'

    get isChanged() { return this.serial.val !== this.config.default } // prettier-ignore
    reset = () => { this.value = this.defaultValue } // prettier-ignore
    get possibleValues(): EnumValue[] {
        return cushy.schema.knownEnumsByName.get(this.config.enumName as any)?.values ?? []
    }

    get baseErrors(): Problem_Ext {
        return null
    }

    serial: Widget_enum_serial<O>
    get defaultValue() { return this.config.default ?? this.possibleValues[0] as any } // prettier-ignore
    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_enum<O>>,
        serial?: Widget_enum_serial<O>,
    ) {
        super()
        const config = spec.config
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'enum',
            id: this.id,
            active: true,
            val: _extractDefaultValue(config) ?? (this.possibleValues[0] as any),
        }
        makeAutoObservableInheritance(this, {
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
