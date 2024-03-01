import type { Form } from '../../Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { Spec } from 'src/controls/Spec'

import { computed, makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'

import { WidgetDI } from '../WidgetUI.DI'

// CONFIG
export type Widget_optional_config<T extends Spec = Spec> = WidgetConfigFields<{
    startActive?: boolean
    widget: T
}>

// SERIAL
export type Widget_optional_serial<T extends Spec = Spec> = WidgetSerialFields<{
    type: 'optional'
    child?: Maybe<T['$Serial']>
    active: boolean
}>

// OUT
export type Widget_optional_output<T extends Spec = Spec> = Maybe<T['$Output']>

// TYPES
export type Widget_optional_types<T extends Spec = Spec> = {
    $Type: 'optional'
    $Input: Widget_optional_config<T>
    $Serial: Widget_optional_serial<T>
    $Output: Widget_optional_output<T>
    $Widget: Widget_optional_output<T>
}

// STATE
export interface Widget_optional<T extends Spec = Spec> extends Widget_optional_types<T> {}
export class Widget_optional<T extends Spec = Spec> implements IWidget<Widget_optional_types<T>> {
    HeaderUI = undefined
    BodyUI = undefined
    get serialHash(): string {
        if (this.serial.active) return this.childOrThrow.serialHash
        return 'x'
    }
    readonly id: string
    readonly type: 'optional' = 'optional'

    serial: Widget_optional_serial<T>
    child!: T['$Widget']

    get childOrThrow(): T['$Widget'] {
        if (this.child == null) throw new Error('❌ optional active but child is null')
        return this.child
    }

    /**
     * if LAZY:
     *  - child subtree will only be instanciated when checkbox turned on
     *  - child subtree will be destroyed when checkbox is turned off
     *   👉 makes IMPOSSIBLE to display the grayed out widgets
     *
     * if EAGER:
     *  - child subtree will be always be instanciated
     *   👉 makes POSSIBLE to display the grayed out widgets
     * */
    // ⏸️ INIT_MODE: 'LAZY' | 'EAGER' = 'EAGER'

    UpdateChildCollapsedState = () => {
        if (this.child) {
            if (this.serial.active) this.child.serial.collapsed = false
            else this.child.serial.collapsed = true
        }
    }
    toggle = () => {
        if (this.serial.active) this.setOff()
        else this.setOn()
    }

    setOn = () => {
        this.serial.active = true
        this._ensureChildIsHydrated()
    }

    setOff = () => {
        this.serial.active = false
        // ⏸️ if (this.INIT_MODE === 'LAZY') this.child = undefined
    }

    private _ensureChildIsHydrated = () => {
        if (this.child) return
        const spec = this.config.widget
        const prevSerial = this.serial.child
        if (prevSerial && spec.type === prevSerial.type) {
            this.child = this.form.builder._HYDRATE(spec, prevSerial)
        } else {
            this.child = this.form.builder._HYDRATE(spec, null)
            this.serial.child = this.child.serial
        }
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
        // ⏸️ if (this.INIT_MODE === 'EAGER') this._ensureChildIsHydrated()
        this._ensureChildIsHydrated()
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
