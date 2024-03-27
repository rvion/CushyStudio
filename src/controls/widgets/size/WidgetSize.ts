// 🔴 WIP BROKEN TODO: bump
import type { Form } from '../../Form'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { AspectRatio, CushySize, CushySizeByRatio, SDModelType } from './WidgetSizeTypes'

import { makeAutoObservable, runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import { applyWidgetMixinV2 } from '../../Mixins'
import { registerWidgetClass } from '../WidgetUI.DI'
import { ResolutionState } from './ResolutionState'
import { WigetSize_BlockUI, WigetSize_LineUI } from './WidgetSizeUI'

// CONFIG
export type Widget_size_config = WidgetConfigFields<
    {
        default?: CushySizeByRatio
        min?: number
        max?: number
        step?: number
    },
    Widget_size_types
>

// SERIAL
export type Widget_size_serial = WidgetSerialFields<CushySize>

// VALUE
export type Widget_size_value = CushySize // prettier-ignore

// TYPES
export type Widget_size_types = {
    $Type: 'size'
    $Config: Widget_size_config
    $Serial: Widget_size_serial
    $Value: Widget_size_value
    $Widget: Widget_size
}

// STATE
export interface Widget_size extends Widget_size_types, IWidgetMixins {} // prettier-ignore
export class Widget_size implements IWidget<Widget_size_types> {
    DefaultHeaderUI = WigetSize_LineUI
    DefaultBodyUI = WigetSize_BlockUI

    get width() { return this.serial.width } // prettier-ignore
    get height() { return this.serial.height } // prettier-ignore
    set width(next: number) {
        if (next === this.serial.width) return
        runInAction(() => {
            this.serial.width = next
            this.bumpValue()
        })
    }
    set height(next: number) {
        if (next === this.serial.height) return
        runInAction(() => {
            this.serial.height = next
            this.bumpValue()
        })
    }
    get sizeHelper(): ResolutionState {
        // should only be executed once
        const self = this
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
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public config: Widget_size_config,
        serial?: Widget_size_serial,
    ) {
        this.id = serial?.id ?? nanoid()
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
        applyWidgetMixinV2(this)
        makeAutoObservable(this, { sizeHelper: false })
    }
    get value(): Widget_size_value {
        return this.serial
    }
}

// DI
registerWidgetClass('size', Widget_size)
