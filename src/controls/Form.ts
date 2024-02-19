import type { WidgetDict } from 'src/cards/App'
import type { Widget_group, Widget_group_output, Widget_group_serial } from './widgets/group/WidgetGroup'

import { autorun, isObservable, makeAutoObservable, observable, runInAction } from 'mobx'
import { FormBuilder } from './FormBuilder'

export class Form<const FIELDS extends WidgetDict> {
    error: Maybe<string> = null

    at = <K extends keyof FIELDS>(key: K): FIELDS[K] => {
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

    get fields(): FIELDS {
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
            onChange: (form: Widget_group<FIELDS>) => void
            initialValue: () => Maybe<object>
        },
    ) {
        makeAutoObservable(this, {
            //
            builder: false,
            root: false,
        })
    }

    ready = false
    private init = (): Widget_group<FIELDS> => {
        console.log(`[🥐] Building form ${this.def.name}`)
        try {
            let initialValue = this.def.initialValue()
            if (initialValue && !isObservable(initialValue)) initialValue = observable(initialValue)

            const formBuilder = this.builder
            const rootWidget: Widget_group<FIELDS> = formBuilder._HYDRATE(
                'group',
                { topLevel: true, items: () => this.ui?.(formBuilder) ?? {} },
                initialValue,
            )
            this.ready = true
            this.error = null
            this.startMonitoring(rootWidget)
            return rootWidget
        } catch (e) {
            console.error(`[👙🔴] Building form ${this.def.name} FAILED`, this)
            console.error(e)
            this.error = 'invalid form definition'
            return this.builder.group({})
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
                    this.def.onChange(root)
                })
            },
            { delay: 100 },
        )
    }
}
