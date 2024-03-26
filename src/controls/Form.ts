import type { FormManager } from './FormManager'
import type { $WidgetTypes, IWidget } from './IWidget'
import type { ISpec, SchemaDict } from './Spec'
import type { Widget_group, Widget_group_serial, Widget_group_value } from './widgets/group/WidgetGroup'
import type { Widget_optional, Widget_optional_config } from './widgets/optional/WidgetOptional'
import type { Widget_shared } from './widgets/shared/WidgetShared'

import { action, isObservable, makeAutoObservable, observable } from 'mobx'
import { createElement, type ReactNode } from 'react'

import { debounce } from '../utils/misc/debounce'
import { FormUI } from './FormUI'
import { Spec } from './Spec'

export interface IFormBuilder {
    //
    _cache: { count: number }
    _HYDRATE: <T extends ISpec>(self: IWidget | null, unmounted: T, serial: any | null) => T['$Widget']
    optional: <const T extends Spec<IWidget<$WidgetTypes>>>(p: Widget_optional_config<T>) => Spec<Widget_optional<T>>
    shared: <W extends Spec<IWidget<$WidgetTypes>>>(key: string, unmounted: W) => Widget_shared<W>
}

export type FormProperties<FIELDS extends SchemaDict> = {
    name: string
    onSerialChange?: (form: Widget_group<FIELDS>) => void
    onValueChange?: (form: Widget_group<FIELDS>) => void
    initialValue?: () => Maybe<object>
}

export class Form<
    //
    const FIELDS extends SchemaDict = SchemaDict,
    const out MyFormBuilder extends IFormBuilder = IFormBuilder,
> {
    error: Maybe<string> = null

    /** shortcut to access the <FormUI /> component without having to import it first */
    FormUI = FormUI

    /**
     * allow to quickly render the form in a react component
     * without having to import any component; usage:
     * | <div>{x.render()}</div>
     */
    render = (): ReactNode => createElement(FormUI, { form: this })

    at = <K extends keyof FIELDS>(key: K): FIELDS[K]['$Widget'] => {
        return this.root.at(key)
    }

    get = <K extends keyof FIELDS>(key: K): FIELDS[K]['$Value'] => {
        return this.root.get(key)
    }

    get value(): Widget_group_value<FIELDS> {
        return this.root.value
    }

    get serial(): Widget_group_serial<FIELDS> {
        return this.root.serial
    }

    get fields(): { [k in keyof FIELDS]: FIELDS[k]['$Widget'] } {
        return this.root.fields
    }

    // 🔴 👇 remove that
    get root(): Widget_group<FIELDS> {
        const root = this.init()
        Object.defineProperty(this, 'root', { value: root })
        return root
    }

    // Change tracking ------------------------------------
    private valueLastUpdatedAt: Timestamp = 0
    private serialLastUpdatedAt: Timestamp = 0

    private _onSerialChange = this.formConfig.onSerialChange //
        ? debounce(this.formConfig.onSerialChange, 200)
        : null

    private _onValueChange = this.formConfig.onValueChange //
        ? debounce(this.formConfig.onValueChange, 200)
        : null

    /** every widget node must call this function once it's value change */
    valueChanged = (widget: IWidget) => {
        this.valueLastUpdatedAt = Date.now()
        this.serialChanged(widget)
        console.log(`[🦊] value changed`)
        this._onValueChange?.(this.root)
    }

    /** every widget node must call this function once it's serial changed */
    serialChanged = (_widget: IWidget) => {
        this.serialLastUpdatedAt = Date.now()
        this._onSerialChange?.(this.root)
    }

    valueUpdatedAt?: Timestamp
    formUpdatedAt?: Timestamp

    // 💬 2024-03-13 rvion:
    // | change tracking used to be done though autorun + tracking the transitive serialHash
    // | (see below) but this approaches has performances problems; so now, we're letting
    // | widgets manually "ping" the root form
    // |
    // | ```ts
    // | cleanup?: () => void
    // | private startMonitoring = (root: Widget_group<FIELDS>) => {
    // |     this.cleanup = autorun(
    // |         () => {
    // |             // const count = formValue.form._cache.count // manual mobx invalidation
    // |             const _ = root.serialHash
    // |             for (const shared of this.knownShared.values()) shared.serialHash
    // |             runInAction(() => {
    // |                 console.log(`[🦊] form: updating`)
    // |                 this.formConfig.onSerialChange?.(root)
    // |             })
    // |         },
    // |         { delay: 100 },
    // |     )
    // | }
    // | ```

    // ---------------------------------------------------

    builder: MyFormBuilder
    // get builder(): Builder {
    //     const value = new FormBuilder(this)
    //     Object.defineProperty(this, 'builder', { value })
    //     return value
    // }

    /** (@internal) will be set at builer creation, to allow for dyanmic recursive forms */
    _ROOT!: Widget_group<FIELDS>

    knownShared = new Map<string /* rootKey */, IWidget>()

    constructor(
        // public builderFn: (self: Form<FIELDS, Builder>) => Builder,
        public manager: FormManager<any>,
        public ui: (form: IFormBuilder) => FIELDS,
        public formConfig: FormProperties<FIELDS>,
    ) {
        this.builder = manager.getBuilder(this)
        makeAutoObservable(this, {
            //
            // builder: false,
            root: false,
            init: action,
        })
    }

    ready = false
    init = (): Widget_group<FIELDS> => {
        console.log(`[🥐] Building form ${this.formConfig.name}`)
        const formBuilder = this.builder
        const rootDef = { topLevel: true, items: () => this.ui?.(formBuilder) ?? {} }
        const unmounted = new Spec<Widget_group<FIELDS>>('group', rootDef)
        try {
            let initialValue = this.formConfig.initialValue?.()
            if (initialValue && !isObservable(initialValue)) initialValue = observable(initialValue)
            const rootWidget: Widget_group<FIELDS> = formBuilder._HYDRATE(null, unmounted, initialValue)
            this.ready = true
            this.error = null
            // this.startMonitoring(rootWidget)
            return rootWidget
        } catch (e) {
            console.error(`[👙🔴] Building form ${this.formConfig.name} FAILED`, this)
            console.error(e)
            this.error = 'invalid form definition'
            return formBuilder._HYDRATE(null, unmounted, null)
        }
    }
}
