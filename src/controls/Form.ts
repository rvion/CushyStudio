import type { CovariantFn } from './BivariantHack'
import type { FormManager } from './FormManager'
import type { FormSerial } from './FormSerial'
import type { IFormBuilder } from './IFormBuilder'
import type { ISpec } from './ISpec'
import type { IWidget } from './IWidget'
import type { Widget_group, Widget_group_serial } from './widgets/group/WidgetGroup'

import { action, isObservable, makeAutoObservable, observable, toJS } from 'mobx'
import { nanoid } from 'nanoid'
import { createElement, type ReactNode } from 'react'

import { FormAsDropdownConfigUI } from '../panels/Panel_Gallery/FormAsDropdownConfigUI'
import { debounce } from '../utils/misc/debounce'
import { FormUI } from './FormUI'
import { isWidgetGroup } from './widgets/WidgetUI.DI'

export type FormProperties<
    //
    ROOT extends ISpec<any>,
    BUILDER extends IFormBuilder,
> = {
    name: string
    onSerialChange?: (form: Form<ROOT, BUILDER>) => void
    onValueChange?: (form: Form<ROOT, BUILDER>) => void
    initialSerial?: () => Maybe<FormSerial>
}

export class Form<
    /** shape of the form, to preserve type safety down to nested children */
    ROOT extends ISpec<any> = ISpec<any>,
    /**
     * project-specific builder, allowing to have modular form setups with different widgets
     * Cushy BUILDER is `FormBuilder` in `src/controls/FormBuilder.ts`
     * */
    BUILDER extends IFormBuilder = IFormBuilder,
> {
    uid = nanoid()

    constructor(
        public manager: FormManager<BUILDER>,
        public ui: CovariantFn<BUILDER, ROOT>,
        public formConfig: FormProperties<ROOT, BUILDER>,
    ) {
        this.builder = manager.getBuilder(this)
        makeAutoObservable(this, {
            //
            // builder: false,
            root: false,
            init: action,
        })
    }

    /** loading error  */
    error: Maybe<string> = null

    /** shortcut to access the <FormUI /> component without having to import it first */
    FormUI = FormUI

    /**
     * allow to quickly render the form in a react component
     * without having to import any component; usage:
     * | <div>{x.render()}</div>
     */
    render = (): ReactNode => createElement(FormUI, { form: this })
    renderAsConfigBtn = (): ReactNode =>
        createElement(FormAsDropdownConfigUI, {
            form: this,
        })

    get value(): ROOT['$Value'] {
        return this.root.value
    }

    // get rootSerial(): ROOT['$Serial'] {
    //     return this.root.serial
    // }
    get serial(): FormSerial {
        return {
            type: 'FormSerial',
            name: this.formConfig.name,
            root: this.root.serial,
            shared: this.shared,
            serialLastUpdatedAt: this.serialLastUpdatedAt,
            valueLastUpdatedAt: this.valueLastUpdatedAt,
        }
    }

    /** @deprecated ; only work when root is a Widget_group */
    get fields(): ROOT extends ISpec<Widget_group<infer FIELDS>> ? { [k in keyof FIELDS]: FIELDS[k]['$Widget'] } : never {
        if (isWidgetGroup(this.root)) return this.root.fields as any
        throw new Error('🔴 root is not a group')
    }

    // 🔴 👇 remove that
    get root(): ROOT['$Widget'] {
        const root = this.init()
        Object.defineProperty(this, 'root', { value: root })
        return root
    }

    /** Out of Tree unmounted serials  */
    shared: {
        [key: string]: any
    } = {}

    // Change tracking ------------------------------------

    /** timestamp at which form value was last updated, or 0 when form still pristine */
    valueLastUpdatedAt: Timestamp = 0

    /** timestamp at which form serial was last updated, or 0 when form still pristine */
    serialLastUpdatedAt: Timestamp = 0

    private _onSerialChange: ((form: Form<ROOT, any>) => void) | null = this.formConfig.onSerialChange //
        ? debounce(this.formConfig.onSerialChange, 200)
        : null

    private _onValueChange: ((form: Form<ROOT, any>) => void) | null = this.formConfig.onValueChange //
        ? debounce(this.formConfig.onValueChange, 5)
        : null

    /** every widget node must call this function once it's value change */
    valueChanged = (widget: IWidget) => {
        this.valueLastUpdatedAt = Date.now()
        this.serialChanged(widget)
        console.log(`[🦊] value changed`)
        this._onValueChange?.(this)
    }

    knownShared: Map<string, IWidget> = new Map()

    /** every widget node must call this function once it's serial changed */
    serialChanged = (_widget: IWidget) => {
        this.serialLastUpdatedAt = Date.now()
        this._onSerialChange?.(this)
    }

    /** from builder, offering simple API for your project specifc widgets  */
    builder: BUILDER

    /** (@internal) will be set at builer creation, to allow for dyanmic recursive forms */
    _ROOT!: ROOT['$Widget']

    ready = false
    init = (): ROOT => {
        console.log(`[🥐] Building form ${this.formConfig.name}`)
        const formBuilder = this.builder

        try {
            let formSerial = this.formConfig.initialSerial?.()
            // ensure form serial is observable, so we avoid working with soon to expire refs
            if (formSerial && !isObservable(formSerial)) formSerial = observable(formSerial)

            // empty object case ---------------------------------------------------------------
            // if and empty object `{}` is used instead of a real serial, let's pretend it's null
            if (formSerial != null && Object.keys(formSerial).length === 0) {
                formSerial = null
            }

            // BACKWARD COMPAT -----------------------------------------------------------------
            if (
                formSerial != null && //
                formSerial.type !== 'FormSerial' &&
                'values_' in formSerial
            ) {
                console.log(`[🔴🔴🔴🔴🔴🔴🔴] `, toJS(formSerial))
                const oldSerial: Widget_group_serial<any> = formSerial as any
                const oldsharedSerial: { [key: string]: any } = {}
                for (const [k, v] of Object.entries(oldSerial.values_)) {
                    if (k.startsWith('__')) {
                        oldsharedSerial[k.slice(2, -2)] = v
                        delete oldSerial.values_[k]
                    }
                }
                formSerial = {
                    name: this.formConfig.name,
                    type: 'FormSerial',
                    root: formSerial,
                    shared: oldsharedSerial,
                    serialLastUpdatedAt: 0,
                    valueLastUpdatedAt: 0,
                }
                console.log(`[🔴] MIGRATED formSerial:`, JSON.stringify(formSerial, null, 3).slice(0, 800))
            }

            // ---------------------------------------------------------------------------------
            // at this point, we expect the form serial to be fully valid
            if (formSerial != null && formSerial.type !== 'FormSerial') {
                throw new Error('❌ INVALID form serial')
            }

            // restore shared serials
            this.shared = formSerial?.shared || {}

            // instanciate the root widget
            const spec: ROOT = this.ui?.(formBuilder)
            const rootWidget: ROOT = formBuilder._HYDRATE(null, spec, formSerial?.root)
            this.ready = true
            this.error = null
            // this.startMonitoring(rootWidget)
            return rootWidget
        } catch (e) {
            console.error(`[👙🔴] Building form ${this.formConfig.name} FAILED`, this)
            console.error(e)
            this.error = 'invalid form definition'
            const spec: ROOT = this.ui?.(formBuilder)
            return formBuilder._HYDRATE(null, spec, null)
        }
    }
}
