import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { Field } from '../../model/Field'
import { parseFloatNoRoundingErr } from '../../utils/parseFloatNoRoundingErr'
import { registerFieldClass } from '../WidgetUI.DI'
import {
    type AspectRatio,
    aspectRatioMap,
    type CushySize,
    type CushySizeByRatio,
    type ModelType,
    type SDModelType,
} from './WidgetSizeTypes'
import { WigetSize_BlockUI, WigetSize_LineUI } from './WidgetSizeUI'

type SizeAble = {
    width: number
    height: number
}

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
        schema: BaseSchema<Field_size>,
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
        return { $: 'size', aspectRatio, modelType, height, width }
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

    get width(): number {
        return this.serial.width
    }

    get height(): number {
        return this.serial.height
    }

    set width(next: number) {
        if (next === this.serial.width) return
        this.runInValueTransaction(() => (this.serial.width = next))
    }

    set height(next: number) {
        if (next === this.serial.height) return
        this.runInValueTransaction(() => (this.serial.height = next))
    }

    setWidth(width: number): void {
        this.width = width
        this.wasHeightAdjustedLast = false
        if (this.isAspectRatioLocked) {
            this.updateHeightBasedOnAspectRatio()
        }
    }

    setHeight(height: number): void {
        this.height = height
        this.wasHeightAdjustedLast = true
        if (this.isAspectRatioLocked) {
            this.updateWidthBasedOnAspectRatio()
        }
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
        this.runInValueTransaction(() => {
            Object.assign(this.serial, val)
        })
    }

    private idealSizeforModelType(model: ModelType | string): SizeAble {
        if (model === 'xl') return { width: 1024, height: 1024 }
        if (model === '2.0') return { width: 768, height: 768 }
        if (model === '2.1') return { width: 768, height: 768 }
        if (model === '1.5') return { width: 512, height: 512 }
        if (model === '1.4') return { width: 512, height: 512 }
        return { width: this.width, height: this.height }
    }

    /** flip width and height */
    flip(): void {
        if (this.width === this.height) return
        this.runInValueTransaction(() => {
            const prevWidth = this.width
            this.width = this.height
            this.height = prevWidth
        })
    }

    desiredModelType: ModelType = '1.5'
    desiredAspectRatio: AspectRatio = '1:1'
    isAspectRatioLocked: boolean = false
    wasHeightAdjustedLast: boolean = true

    private toAspectRatio(realAspectRatio: number): AspectRatio {
        const ratio = parseFloatNoRoundingErr(realAspectRatio, 2)
        if (ratio === parseFloatNoRoundingErr(1 / 1, 2)) return '1:1'
        if (ratio === parseFloatNoRoundingErr(16 / 9, 2)) return '16:9'
        if (ratio === parseFloatNoRoundingErr(4 / 3, 2)) return '4:3'
        if (ratio === parseFloatNoRoundingErr(16 / 15, 2)) return '16:15'
        if (ratio === parseFloatNoRoundingErr(17 / 15, 2)) return '17:15'
        if (ratio === parseFloatNoRoundingErr(17 / 14, 2)) return '17:14'
        if (ratio === parseFloatNoRoundingErr(9 / 7, 2)) return '9:7'
        if (ratio === parseFloatNoRoundingErr(18 / 13, 2)) return '18:13'
        if (ratio === parseFloatNoRoundingErr(19 / 13, 2)) return '19:13'
        if (ratio === parseFloatNoRoundingErr(5 / 3, 2)) return '5:3'
        if (ratio === parseFloatNoRoundingErr(7 / 4, 2)) return '7:4'
        if (ratio === parseFloatNoRoundingErr(21 / 11, 2)) return '21:11'
        if (ratio === parseFloatNoRoundingErr(2 / 1, 2)) return '2:1'
        return '1:1'
    }

    get realAspectRatio(): number {
        return this.width / this.height
    }

    setModelType(modelType: ModelType): void {
        this.desiredModelType = modelType
        // const currentAspect = this.width / this.height
        const itgt = this.idealSizeforModelType(modelType)
        const diagPrev = Math.sqrt(this.width ** 2 + this.height ** 2)
        const diagNext = Math.sqrt(itgt.width ** 2 + itgt.height ** 2)
        const factor = diagNext / diagPrev
        console.log({ modelType, idealTarget: itgt, avg: diagPrev, avg2: diagNext, factor })
        this.width = Math.round(this.width * factor)
        this.height = Math.round(this.height * factor)
        console.log(`final is w=${this.width} x h=${this.height}`)
        console.log(`fixed avg is ${Math.sqrt(this.width ** 2 + this.height ** 2)}`)
    }

    setAspectRatio(aspectRatio: AspectRatio): void {
        this.desiredAspectRatio = aspectRatio
        const definedHeight = aspectRatioMap[this.desiredAspectRatio]?.height
        const definedWidth = aspectRatioMap[this.desiredAspectRatio]?.width
        if (definedHeight && definedWidth) {
            this.height = definedHeight
            this.width = definedWidth
        }
        // if (this.isAspectRatioLocked) {
        else if (this.wasHeightAdjustedLast) {
            this.updateWidthBasedOnAspectRatio()
        } else {
            this.updateHeightBasedOnAspectRatio()
        }
        // }
    }

    private updateHeightBasedOnAspectRatio(): void {
        const [widthRatio, heightRatio] = this.desiredAspectRatio.split(':').map(Number)
        this.height = Math.round(this.width * (heightRatio! / widthRatio!))
    }

    private updateWidthBasedOnAspectRatio(): void {
        const [widthRatio, heightRatio] = this.desiredAspectRatio.split(':').map(Number)
        this.width = Math.round(this.height * (widthRatio! / heightRatio!))
    }
}

// DI
registerFieldClass('size', Field_size)
