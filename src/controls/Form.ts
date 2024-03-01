import type { Widget_group, Widget_group_output, Widget_group_serial } from './widgets/group/WidgetGroup'
import type { SchemaDict } from 'src/cards/App'

import { action, autorun, isObservable, makeAutoObservable, observable, runInAction } from 'mobx'

import { FormBuilder } from './FormBuilder'
import { Spec } from './Spec'

export class Form<const FIELDS extends SchemaDict> {
    error: Maybe<string> = null

    at = <K extends keyof FIELDS>(key: K): FIELDS[K]['$Widget'] => {
        return this.root.at(key)
    }

    get = <K extends keyof FIELDS>(key: K): FIELDS[K]['$Output'] => {
        return this.root.get(key)
    }

    get value(): Widget_group_output<FIELDS> {
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

    get builder() {
        const value = new FormBuilder(this)
        Object.defineProperty(this, 'builder', { value })
        return value
    }

    /** (@internal) will be set at builer creation, to allow for dyanmic recursive forms */
    _ROOT!: Widget_group<FIELDS>

    constructor(
        public ui: (form: FormBuilder) => FIELDS,
        public def: {
            name: string
            onChange?: (form: Widget_group<FIELDS>) => void
            initialValue?: () => Maybe<object>
        },
    ) {
        makeAutoObservable(this, {
            //
            builder: false,
            root: false,
            init: action,
        })
    }

    ready = false
    init = (): Widget_group<FIELDS> => {
        console.log(`[🥐] Building form ${this.def.name}`)
        const formBuilder = this.builder
        const rootDef = { topLevel: true, items: () => this.ui?.(formBuilder) ?? {} }
        const unmounted = new Spec<Widget_group<FIELDS>>('group', rootDef)
        try {
            let initialValue = this.def.initialValue?.()
            if (initialValue && !isObservable(initialValue)) initialValue = observable(initialValue)
            const rootWidget: Widget_group<FIELDS> = formBuilder._HYDRATE(unmounted, initialValue)
            this.ready = true
            this.error = null
            this.startMonitoring(rootWidget)
            return rootWidget
        } catch (e) {
            console.error(`[👙🔴] Building form ${this.def.name} FAILED`, this)
            console.error(e)
            this.error = 'invalid form definition'
            return formBuilder._HYDRATE(unmounted, null)
        }
    }

    cleanup?: () => void

    private startMonitoring = (root: Widget_group<FIELDS>) => {
        this.cleanup = autorun(
            () => {
                // const count = formValue.form._cache.count // manual mobx invalidation
                const _ = root.serialHash
                runInAction(() => {
                    console.log(`[🦊] form: updating`)
                    this.def.onChange?.(root)
                })
            },
            { delay: 100 },
        )
    }
}
