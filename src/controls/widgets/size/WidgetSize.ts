import type { Form } from '../../Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from 'src/controls/IWidget'
import type { AspectRatio, CushySize, CushySizeByRatio, SDModelType } from 'src/controls/widgets/size/WidgetSizeTypes'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'
import { ResolutionState } from './ResolutionState'
import { WigetSize_BlockUI, WigetSize_LineUI } from './WidgetSizeUI'

// CONFIG
export type Widget_size_config = WidgetConfigFields<{
    default?: CushySizeByRatio
    min?: number
    max?: number
    step?: number
}>

// SERIAL
export type Widget_size_serial = WidgetSerialFields<CushySize>

// OUT
export type Widget_size_output = CushySize // prettier-ignore

// TYPES
export type Widget_size_types = {
    $Type: 'size'
    $Input: Widget_size_config
    $Serial: Widget_size_serial
    $Output: Widget_size_output
    $Widget: Widget_size
}

// STATE
export interface Widget_size extends Widget_size_types {} // prettier-ignore
export class Widget_size implements IWidget<Widget_size_types> {
    HeaderUI = WigetSize_LineUI
    BodyUI = WigetSize_BlockUI
    get sizeHelper(): ResolutionState {
        // should only be executed once
        const state = new ResolutionState(this.serial)
        Object.defineProperty(this, 'sizeHelper', { value: state })
        return state
    }
    get serialHash() { return hash(this.value) } // prettier-ignore
    get hasBody() {
        if (this.sizeHelper.isAspectRatioLocked) return true
        return false
    }
    readonly id: string
    readonly type: 'size' = 'size'
    readonly serial: Widget_size_serial
    constructor(public form: Form<any>, public config: Widget_size_config, serial?: Widget_size_serial) {
        this.id = serial?.id ?? nanoid()
        if (serial) {
            this.serial = serial
        } else {
            const aspectRatio: AspectRatio = config.default?.aspectRatio ?? '1:1'
            const modelType: SDModelType = config.default?.modelType ?? 'SD1.5 512'
            const width = config.default?.width ?? parseInt(modelType.split(' ')[1])
            const height = config.default?.height ?? parseInt(modelType.split(' ')[1])
            this.serial = {
                type: 'size',
                id: this.id,
                aspectRatio,
                modelType,
                height,
                width,
            }
        }
        makeAutoObservable(this, { sizeHelper: false })
    }
    get value(): Widget_size_output {
        return this.serial
    }
}

// DI
WidgetDI.Widget_size = Widget_size
