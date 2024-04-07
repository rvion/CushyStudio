import type { Form } from '../../Form'
import type { ISpec } from '../../ISpec'
import type { IWidget, IWidgetMixins, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'

import { computed, makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'

import { applyWidgetMixinV2 } from '../../Mixins'
import { registerWidgetClass } from '../WidgetUI.DI'

// CONFIG
export type Widget_optional_config<T extends ISpec = ISpec> = WidgetConfigFields<
    {
        startActive?: boolean
        widget: T
    },
    Widget_optional_types<T>
>

// SERIAL
export type Widget_optional_serial<T extends ISpec = ISpec> = WidgetSerialFields<{
    type: 'optional'
    child?: Maybe<T['$Serial']>
    active: boolean
}>

// // SERIAL FROM VALUE
// export const Widget_optional_fromValue = <T extends ISpec = ISpec>(
//     config/* 🔴 */: Widget_optional_config<T>,
//     value: Widget_optional_value<T>,
// ): Widget_optional_serial<T> => ({
//     type: 'optional',
//     active: value != null,
//     child: config.widget,
// })

// VALUE
export type Widget_optional_value<T extends ISpec = ISpec> = Maybe<T['$Value']>

// TYPES
export type Widget_optional_types<T extends ISpec = ISpec> = {
    $Type: 'optional'
    $Config: Widget_optional_config<T>
    $Serial: Widget_optional_serial<T>
    $Value: Widget_optional_value<T>
    $Widget: Widget_optional<T>
}

// STATE
export interface Widget_optional<T extends ISpec = ISpec> extends Widget_optional_types<T>, IWidgetMixins {}
export class Widget_optional<T extends ISpec = ISpec> implements IWidget<Widget_optional_types<T>> {
    DefaultHeaderUI = undefined
    DefaultBodyUI = undefined
    readonly id: string
    get config() { return this.spec.config } // prettier-ignore
    readonly type: 'optional' = 'optional'

    serial: Widget_optional_serial<T>
    child!: T['$Widget']

    get childOrThrow(): T['$Widget'] {
        if (this.child == null) throw new Error('❌ optional active but child is null')
        return this.child
    }

    setActive = (value: boolean) => {
        if (this.serial.active === value) return
        this.serial.active = value
        this.bumpValue()

        // update child collapsed state if need be
        if (value) this.child.setCollapsed(false)
        else this.child.setCollapsed(true)
    }

    /**
     * as of 2024-03-14, this is only called in the constructor
     * TODO: inline ?
     */
    private _ensureChildIsHydrated = () => {
        if (this.child) return
        const spec = this.config.widget
        const prevSerial = this.serial.child
        if (prevSerial && spec.type === prevSerial.type) {
            this.child = this.form.builder._HYDRATE(this, spec, prevSerial)
        } else {
            this.child = this.form.builder._HYDRATE(this, spec, null)
            this.serial.child = this.child.serial
        }
    }

    constructor(
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_optional<T>>,
        serial?: Widget_optional_serial<T>,
    ) {
        const config = spec.config
        this.id = serial?.id ?? nanoid()
        const defaultActive = config.startActive
        this.serial = serial ?? {
            id: this.id,
            type: 'optional',
            active: defaultActive ?? false,
            collapsed: config.startCollapsed,
        }

        // meh
        const isActive = serial?.active ?? defaultActive
        if (isActive) this.serial.active = true

        // ⏸️ if (this.INIT_MODE === 'EAGER') this._ensureChildIsHydrated()
        this._ensureChildIsHydrated()
        applyWidgetMixinV2(this)
        makeObservable(this, { serial: observable, value: computed })
    }

    get value(): Widget_optional_value<T> {
        if (!this.serial.active) return null
        return this.childOrThrow.value
    }
}

// DI
registerWidgetClass('optional', Widget_optional)
