import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'
import type { AspectRatio, CushySize, CushySizeByRatio, SDModelType } from './WidgetSizeTypes'

import { runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { BaseField } from '../../model/BaseField'
import { registerWidgetClass } from '../WidgetUI.DI'
import { ResolutionState } from './ResolutionState'
import { WigetSize_BlockUI, WigetSize_LineUI } from './WidgetSizeUI'

// CONFIG
export type Widget_size_config = FieldConfig<
    {
        default?: CushySizeByRatio
        min?: number
        max?: number
        step?: number
    },
    Widget_size_types
>

// SERIAL
export type Widget_size_serial = FieldSerial<CushySize>

// SERIAL FROM VALUE
export const Widget_size_fromValue = (val: Widget_size_value): Widget_size_serial => ({
    ...val,
})

// VALUE
export type Widget_size_value = CushySize // prettier-ignore

// TYPES
export type Widget_size_types = {
    $Type: 'size'
    $Config: Widget_size_config
    $Serial: Widget_size_serial
    $Value: Widget_size_value
    $Field: Widget_size
}

// STATE
export class Widget_size extends BaseField<Widget_size_types> {
    DefaultHeaderUI = WigetSize_LineUI
    DefaultBodyUI = WigetSize_BlockUI
    get baseErrors(): Problem_Ext {
        return null
    }

    get defaultValue(): Widget_size_value {
        const config = this.spec.config
        const aspectRatio: AspectRatio = config.default?.aspectRatio ?? '1:1'
        const modelType: SDModelType = config.default?.modelType ?? 'SD1.5 512'
        const width = config.default?.width ?? parseInt(modelType.split(' ')[1]!)
        const height = config.default?.height ?? parseInt(modelType.split(' ')[1]!)
        return { type: 'size', aspectRatio, modelType, height, width }
    }
    get hasChanges(): boolean {
        const def = this.defaultValue
        if (this.serial.width !== def.width) return true
        if (this.serial.height !== def.height) return true
        if (this.serial.aspectRatio !== def.aspectRatio) return true
        return false
    }
    reset(): void {
        this.value = this.defaultValue
    }

    get width() { return this.serial.width } // prettier-ignore
    get height() { return this.serial.height } // prettier-ignore
    set width(next: number) {
        if (next === this.serial.width) return
        runInAction(() => {
            this.serial.width = next
            this.applyValueUpdateEffects()
        })
    }
    set height(next: number) {
        if (next === this.serial.height) return
        runInAction(() => {
            this.serial.height = next
            this.applyValueUpdateEffects()
        })
    }
    get sizeHelper(): ResolutionState {
        // should only be executed once
        const state = new ResolutionState(this)
        Object.defineProperty(this, 'sizeHelper', { value: state })
        return state
    }

    // ⏸️ get hasBody() {
    // ⏸️     if (this.sizeHelper.isAspectRatioLocked) return true
    // ⏸️     return false
    // ⏸️ }

    readonly id: string

    readonly type: 'size' = 'size'
    readonly serial: Widget_size_serial

    constructor(
        //
        entity: Entity,
        parent: BaseField | null,
        spec: ISchema<Widget_size>,
        serial?: Widget_size_serial,
    ) {
        super(entity, parent, spec)
        this.id = serial?.id ?? nanoid()
        const config = spec.config
        if (serial) {
            this.serial = serial
        } else {
            const aspectRatio: AspectRatio = config.default?.aspectRatio ?? '1:1'
            const modelType: SDModelType = config.default?.modelType ?? 'SD1.5 512'
            const width = config.default?.width ?? parseInt(modelType.split(' ')[1]!)
            const height = config.default?.height ?? parseInt(modelType.split(' ')[1]!)
            this.serial = {
                type: 'size',
                id: this.id,
                aspectRatio,
                modelType,
                height,
                width,
            }
        }

        this.init({
            sizeHelper: false,
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    get value(): Widget_size_value {
        return this.serial
    }

    set value(val: Widget_size_value) {
        // ugly code;
        if (
            val.width === this.serial.width && //
            val.height === this.serial.height &&
            val.aspectRatio === this.serial.aspectRatio
        ) {
            return
        }
        runInAction(() => {
            Object.assign(this.serial, val)
            this.applyValueUpdateEffects()
        })
    }
}

// DI
registerWidgetClass('size', Widget_size)
