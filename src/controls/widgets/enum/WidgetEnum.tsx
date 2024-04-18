import type { EnumValue } from '../../../models/ComfySchema'
import type { CleanedEnumResult } from '../../../types/EnumUtils'
import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Problem_Ext } from '../../Validation'

import { makeAutoObservable, runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { applyWidgetMixinV2 } from '../../Mixins'
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
export interface Widget_enum<O> extends Widget_enum_types<O>, IWidgetMixins {}
export class Widget_enum<O> implements IWidget<Widget_enum_types<O>> {
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
        const config = spec.config
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? {
            type: 'enum',
            id: this.id,
            active: true,
            val: _extractDefaultValue(config) ?? (this.possibleValues[0] as any),
        }
        applyWidgetMixinV2(this)
        makeAutoObservable(this)
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
            this.bumpValue()
        })
    }
}

// DI
registerWidgetClass('enum', Widget_enum)
