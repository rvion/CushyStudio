import type { Form } from '../../Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Spec } from 'src/controls/Prop'

import { computed, makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'

import { WidgetDI } from '../WidgetUI.DI'

// CONFIG
export type Widget_optional_config<T extends Spec> = WidgetConfigFields<{
    startActive?: boolean
    widget: T
}>

// SERIAL
export type Widget_optional_serial<T extends Spec> = WidgetSerialFields<{
    type: 'optional'
    child?: Maybe<T['$Serial']>
    active: boolean
}>

// OUT
export type Widget_optional_output<T extends Spec> = Maybe<T['$Output']>

// TYPES
export type Widget_optional_types<T extends Spec> = {
    $Type: 'optional'
    $Input: Widget_optional_config<T>
    $Serial: Widget_optional_serial<T>
    $Output: Widget_optional_output<T>
}

// STATE
export interface Widget_optional<T extends Spec> extends Widget_optional_types<T> {}
export class Widget_optional<T extends Spec> implements IWidget<Widget_optional_types<T>> {
    get serialHash(): string {
        if (this.serial.active) return this.childOrThrow.serialHash
        return 'x'
    }
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'optional' = 'optional'

    serial: Widget_optional_serial<T>
    child?: T['$Widget']

    get childOrThrow(): T['$Widget'] {
        if (this.child == null) throw new Error('❌ optional active but child is null')
        return this.child
    }

    toggle = () => {
        if (this.serial.active) this.setOff()
        else this.setOn()
    }

    setOn = () => {
        this.serial.active = true
        const unmounted = this.config.widget
        const prevSerial = this.serial.child
        if (prevSerial && unmounted.type === prevSerial.type) {
            this.child = this.form.builder._HYDRATE(unmounted, prevSerial)
        } else {
            this.child = this.form.builder._HYDRATE(unmounted, null)
            this.serial.child = this.child.serial
        }
    }

    setOff = () => {
        this.serial.active = false
        this.child = undefined
        // this.serial.child = undefined
    }

    constructor(public form: Form<any>, public config: Widget_optional_config<T>, serial?: Widget_optional_serial<T>) {
        this.id = serial?.id ?? nanoid()
        const defaultActive = config.startActive
        this.serial = serial ?? {
            id: this.id,
            type: 'optional',
            active: defaultActive ?? false,
            collapsed: config.startCollapsed,
        }
        const isActive = serial?.active ?? defaultActive
        if (isActive) this.setOn()
        makeObservable(this, {
            serial: observable,
            value: computed,
        })
    }

    get value(): Widget_optional_output<T> {
        if (!this.serial.active) return null
        return this.childOrThrow.value
    }
}

// DI
WidgetDI.Widget_optional = Widget_optional
