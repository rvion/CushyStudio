import type { WidgetDict } from 'src/cards/App'
import type { Widget_group, Widget_group_output, Widget_group_serial } from './widgets/group/WidgetGroup'

import { autorun, action, isObservable, makeAutoObservable, observable, runInAction } from 'mobx'
import { FormBuilder } from './FormBuilder'

export class Form<FIELDS extends WidgetDict> {
    error: Maybe<string> = null
    get output(): Maybe<Widget_group_output<FIELDS>> { return this.root?.result } // prettier-ignore
    get serial(): Maybe<Widget_group_serial<FIELDS>> { return this.root?.serial } // prettier-ignore

    // attempt to make form lazy
    private _root: Maybe<Widget_group<FIELDS>> = null
    get root(): Maybe<Widget_group<FIELDS>> {
        if (this._root != null) return this._root
        this._root = this.init()
        return this._root
    }

    constructor(
        public def: {
            onChange: (form: Widget_group<FIELDS>) => void
            ui: (form: FormBuilder) => FIELDS
            initialValue: () => Maybe<object>
        },
    ) {
        makeAutoObservable(this, {
            formBuilder: false,
            ['_hasBeenInitialized' as any]: false,
            init: action,
        })
    }

    private _hasBeenInitialized = false
    init = (): Maybe<Widget_group<FIELDS>> => {
        if (this._hasBeenInitialized) return
        this._hasBeenInitialized = true
        console.log(`[👙🔴] BUILDING FORM`, this)
        try {
            let initialValue = this.def.initialValue()
            if (initialValue && !isObservable(initialValue)) initialValue = observable(initialValue)

            const formBuilder = this.formBuilder
            const rootWidget: Widget_group<FIELDS> = formBuilder._HYDRATE(
                'group',
                { topLevel: true, items: () => this.def.ui?.(formBuilder) ?? {} },
                initialValue,
            )
            /** 👇 HACK; see the comment near the ROOT property definition */
            formBuilder._ROOT = rootWidget
            this._root = rootWidget
            this.error = null
            console.log(`[👙🔴] BUILDING FORM SUCCESS 🟢`, this)
            this.startMonitoring()
            return rootWidget
        } catch (e) {
            console.log(`[👙🔴] BUILDING FORM FAILED`, this)
            console.error(e)
            // this.root = null //  __FAIL('ui function crashed', e)
            this.error = 'invalid form definition'
            return null
        }
    }

    cleanup?: () => void

    get formBuilder() {
        const value = new FormBuilder(cushy.schema)
        Object.defineProperty(this, 'formBuilder', { value })
        return value
    }

    private startMonitoring = () => {
        this.cleanup = autorun(
            () => {
                const rootWidget = this.root
                if (rootWidget == null) return null
                // const count = formValue.form._cache.count // manual mobx invalidation
                const _ = rootWidget.serialHash
                runInAction(() => {
                    console.log(`[🦊] form: updating`)
                    this.def.onChange(rootWidget)
                    // this.update({ formSerial: rootWidget.serial })
                    // this.isDirty = true
                    // this.checkIfShouldRestart()
                })
            },
            { delay: 100 },
        )
    }
}
