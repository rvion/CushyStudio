import type { FormBuilder } from 'src/controls/FormBuilder'
import type { WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers_OLD, IWidget_OLD } from 'src/controls/IWidget'
import type { CushySizeByRatio, CushySize, AspectRatio, SDModelType } from 'src/controls/widgets/size/WidgetSizeTypes'

// import type { AspectRatio, CushySize, CushySizeByRatio, SDModelType } from "./misc/SDModelType"

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { WidgetDI } from '../WidgetUI.DI'
import { hash } from 'ohash'
import { ResolutionState } from './ResolutionState'

export type Widget_size_config = WidgetConfigFields<{
    default?: CushySizeByRatio
    min?: number
    max?: number
    step?: number
}>
export type Widget_size_serial = Widget_size_state // prettier-ignore
export type Widget_size_state  = WidgetSerialFields<CushySize> // prettier-ignore
export type Widget_size_output = CushySize // prettier-ignore
export interface Widget_size extends WidgetTypeHelpers_OLD<'size', Widget_size_config, Widget_size_serial, Widget_size_state, Widget_size_output> {} // prettier-ignore
export class Widget_size
    implements IWidget_OLD<'size', Widget_size_config, Widget_size_serial, Widget_size_state, Widget_size_output>
{
    get sizeHelper(): ResolutionState {
        // should only be executed once
        const state = new ResolutionState(this.serial)
        Object.defineProperty(this, 'sizeHelper', { value: state })
        return state
    }
    get serialHash() { return hash(this.value) } // prettier-ignore
    readonly isVerticalByDefault = true
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'size' = 'size'
    readonly serial: Widget_size_state
    constructor(public form: FormBuilder, public config: Widget_size_config, serial?: Widget_size_serial) {
        this.id = serial?.id ?? nanoid()
        if (serial) {
            this.serial = serial
        } else {
            const aspectRatio: AspectRatio = config.default?.aspectRatio ?? '1:1'
            const modelType: SDModelType = config.default?.modelType ?? 'SD1.5 512'
            const width = 512 // 🔴
            const height = 512 // 🔴
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

WidgetDI.Widget_size = Widget_size
