import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { ISchema } from '../../model/ISchema'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'
import type { AspectRatio, CushySize, CushySizeByRatio, SDModelType } from './WidgetSizeTypes'

import { runInAction } from 'mobx'

import { Field } from '../../model/Field'
import { registerWidgetClass } from '../WidgetUI.DI'
import { ResolutionState } from './ResolutionState'
import { WigetSize_BlockUI, WigetSize_LineUI } from './WidgetSizeUI'

// CONFIG
export type Field_size_config = FieldConfig<
    {
        default?: CushySizeByRatio
        min?: number
        max?: number
        step?: number
    },
    Field_size_types
>

// SERIAL
export type Field_size_serial = FieldSerial<CushySize /* {
    width: number
    height: number
    aspectRatio: AspectRatio
    // TODO: remove VVV
    modelType: SDModelType
} */>

// SERIAL FROM VALUE
export const Field_size_fromValue = (val: Field_size_value): Field_size_serial => ({
    ...val,
})

// VALUE
export type Field_size_value = CushySize // prettier-ignore

// TYPES
export type Field_size_types = {
    $Type: 'size'
    $Config: Field_size_config
    $Serial: Field_size_serial
    $Value: Field_size_value
    $Field: Field_size
}

// STATE
export class Field_size extends Field<Field_size_types> {
    static readonly type: 'size' = 'size'

    DefaultHeaderUI = WigetSize_LineUI
    DefaultBodyUI = WigetSize_BlockUI

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: ISchema<Field_size>,
        serial?: Field_size_serial,
    ) {
        super(repo, root, parent, schema)
        this.init(serial, {
            sizeHelper: false,
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(serial: Maybe<Field_size_serial>): void {
        const config = this.config
        this.serial.aspectRatio = serial?.aspectRatio ?? config.default?.aspectRatio ?? '1:1'
        this.serial.modelType = serial?.modelType ?? config.default?.modelType ?? 'SD1.5 512'
        this.serial.width = serial?.width ?? config.default?.width ?? parseInt(this.serial.modelType.split(' ')[1]!)
        this.serial.height = serial?.height ?? config.default?.height ?? parseInt(this.serial.modelType.split(' ')[1]!)
    }

    get ownProblems(): Problem_Ext {
        return null
    }

    get defaultValue(): Field_size_value {
        const config = this.schema.config
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

    get width() {
        return this.serial.width
    }

    get height() {
        return this.serial.height
    }

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

    get value(): Field_size_value {
        return this.serial
    }

    set value(val: Field_size_value) {
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
registerWidgetClass('size', Field_size)
