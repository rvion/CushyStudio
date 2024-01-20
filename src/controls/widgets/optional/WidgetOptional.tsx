import type { ComfySchemaL } from 'src/models/Schema'
import type { FormBuilder } from '../../FormBuilder'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../../IWidget'

import { computed, makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'
import { Widget } from '../../Widget'
import { WidgetDI } from '../WidgetUI.DI'

// CONFIG
export type Widget_optional_config<T extends Widget> = WidgetConfigFields<{
    startActive?: boolean
    widget: () => T
}>

// SERIAL
export type Widget_optional_serial<T extends Widget> = WidgetSerialFields<{
    type: 'optional'
    child?: Maybe<T['$Serial']>
    active: boolean
}>

// OUT
export type Widget_optional_output<T extends Widget> = Maybe<T['$Output']>

// TYPES
export type Widget_string_types<T extends Widget> = {
    $Type: 'optional'
    $Input: Widget_optional_config<T>
    $Serial: Widget_optional_serial<T>
    $Output: Widget_optional_output<T>
}

// STATE
export interface Widget_optional<T extends Widget> extends WidgetTypeHelpers<Widget_string_types<T>> {}
export class Widget_optional<T extends Widget> implements IWidget<Widget_string_types<T>> {
    readonly isVerticalByDefault = true
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'optional' = 'optional'

    serial: Widget_optional_serial<T>
    child?: T

    get childOrThrow(): T {
        if (this.child == null) throw new Error('❌ optional active but child is null')
        return this.child
    }

    toggle = () => {
        if (this.serial.active) this.setOff()
        else this.setOn()
    }

    setOn = () => {
        this.serial.active = true
        const fresh = this.config.widget?.()
        const prevSerial = this.serial.child
        if (prevSerial && fresh.type === prevSerial.type) {
            this.child = this.builder._HYDRATE(prevSerial.type, fresh.config, prevSerial)
        } else {
            this.child = fresh
            this.serial.child = fresh?.serial
        }
    }

    setOff = () => {
        this.serial.active = false
        this.child = undefined
        // this.serial.child = undefined
    }

    constructor(public builder: FormBuilder, public config: Widget_optional_config<T>, serial?: Widget_optional_serial<T>) {
        this.id = serial?.id ?? nanoid()
        const defaultActive = config.startActive
        this.serial = serial ?? {
            id: this.id,
            type: 'optional',
            active: defaultActive ?? false,
            collapsed: config.startCollapsed,
        }
        if (defaultActive) this.setOn()
        makeObservable(this, {
            serial: observable,
            result: computed,
        })
    }

    get result(): Widget_optional_output<T> {
        if (!this.serial.active) return null
        return this.childOrThrow.result
    }
}

// DI
WidgetDI.Widget_optional = Widget_optional
