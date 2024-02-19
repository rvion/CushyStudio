import type { Form } from 'src/controls/Form'
import type { IWidget, WidgetConfigFields, WidgetSerialFields, WidgetTypeHelpers } from '../../IWidget'

import { computed, makeAutoObservable, makeObservable, observable } from 'mobx'
import { nanoid } from 'nanoid'
import { Widget } from '../../Widget'
import { WidgetDI } from '../WidgetUI.DI'

// CONFIG
export type Widget_shared_config<T extends Widget> = WidgetConfigFields<{
    startActive?: boolean
    /** shared widgets must be registered in the form root group */
    rootKey: string
    widget: T
}>

// SERIAL
export type Widget_shared_serial = WidgetSerialFields<{
    type: 'shared'
}>

// OUT
export type Widget_shared_output<T extends Widget> = T['$Output']

// TYPES
export type Widget_string_types<T extends Widget> = {
    $Type: 'shared'
    $Input: Widget_shared_config<T>
    $Serial: Widget_shared_serial
    $Output: Widget_shared_output<T>
}

// STATE
export interface Widget_shared<T extends Widget> extends WidgetTypeHelpers<Widget_string_types<T>> {}
export class Widget_shared<T extends Widget> implements IWidget<Widget_string_types<T>> {
    get serialHash(): string { return this.config.rootKey } // prettier-ignore
    readonly isVerticalByDefault = true
    readonly isCollapsible = true
    readonly id: string
    readonly type: 'shared' = 'shared'

    serial: Widget_shared_serial

    shared: T
    constructor(
        //
        public form: Form<any>,
        public config: Widget_shared_config<T>,
        serial?: Widget_shared_serial,
    ) {
        this.id = serial?.id ?? nanoid()
        this.serial = serial ?? { id: this.id, type: 'shared', collapsed: config.startCollapsed }

        // ----------------------------------------------
        const newWidget = config.widget
        const name = `__${this.config.rootKey}__`
        // console.log(`[👙] ;-----------, `, name)
        const newConfig = newWidget.config
        const newType = newWidget.type
        const prevSerial = this.form._ROOT.serial.values_[name]
        if (prevSerial && newType === prevSerial.type) {
            // console.warn(`[🤠🟢] Widget_shared: PREV SERIAL IS OK (${JSON.stringify(prevSerial)})`)
            this.shared = this.form.builder._HYDRATE(newType, newConfig, prevSerial)
        } else {
            // if (prevSerial == null) console.log(`[🤠🔶] Widget_shared: PREV SERIAL IS NULL`)
            // if (prevSerial != null) console.log(`[🔶] invalid serial for "${name}": (${newType} != ${prevSerial?.type}) => using fresh one instead`) // prettier-ignore
            this.shared = newWidget
        }
        this.form._ROOT.serial.values_[name] = this.shared.serial as any
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
