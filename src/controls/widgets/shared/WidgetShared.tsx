import type { Form } from 'src/controls/Form'
import type { Unmounted } from 'src/controls/Prop'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../../IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { WidgetDI } from '../WidgetUI.DI'

// CONFIG
export type Widget_shared_config<T extends Unmounted> = WidgetConfigFields<{
    startActive?: boolean
    /** shared widgets must be registered in the form root group */
    rootKey: string
    widget: T['$Widget']
}>

// SERIAL
export type Widget_shared_serial = WidgetSerialFields<{
    type: 'shared'
}>

// OUT
export type Widget_shared_output<T extends Unmounted> = T['$Output']

// TYPES
export type Widget_string_types<T extends Unmounted> = {
    $Type: 'shared'
    $Input: Widget_shared_config<T>
    $Serial: Widget_shared_serial
    $Output: Widget_shared_output<T>
}

// STATE
export interface Widget_shared<T extends Unmounted> extends WidgetTypeHelpers<Widget_string_types<T>> {}
export class Widget_shared<T extends Unmounted> implements IWidget<Widget_string_types<T>> {
    // 👇 magically allow type-safe use of Mounted Widget_shared as Unmounted
    $Widget!: T['$Widget']

    get serialHash(): string { return this.config.rootKey } // prettier-ignore
    readonly isVerticalByDefault = true
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'shared' = 'shared'

    serial: Widget_shared_serial

    get shared(): T['$Widget'] {
        return this.config.widget
    }

    constructor(
        //
        public form: Form<any>,
        public config: Widget_shared_config<T>,
        serial?: Widget_shared_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? { id: this.id, type: 'shared', collapsed: config.startCollapsed }

        // ----------------------------------------------
        // const newWidget = config.widget
        // const newType = newWidget.type
        // const name = `__${this.config.rootKey}__`
        // const prevSerial = this.form._ROOT.serial.values_[name]
        // if (prevSerial && newType === prevSerial.type) {
        //     // console.warn(`[🤠🟢] Widget_shared: PREV SERIAL IS OK (${JSON.stringify(prevSerial)})`)
        //     this.shared = this.form.builder._HYDRATE(newWidget, prevSerial)
        // } else {
        //     // if (prevSerial == null) console.log(`[🤠🔶] Widget_shared: PREV SERIAL IS NULL`)
        //     // if (prevSerial != null) console.log(`[🔶] invalid serial for "${name}": (${newType} != ${prevSerial?.type}) => using fresh one instead`) // prettier-ignore
        //     this.shared = this.form.builder._HYDRATE(newWidget, null)
        // }
        // this.shared = this.config.widget
        // this.form._ROOT.serial.values_[name] = this.shared.serial as any
        // ----------------------------------------------

        makeAutoObservable(this)
        // makeObservable(this, {
        //     serial: observable,
        //     shared: observable.ref,
        //     value: computed,
        // })
    }

    get value(): Widget_shared_output<T> {
        return this.config.widget.value
    }
}

// DI
WidgetDI.Widget_shared = Widget_shared
