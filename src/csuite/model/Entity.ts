import type { Widget_group, Widget_group_serial } from '../fields/group/WidgetGroup'
import type { CovariantFn2 } from '../variance/BivariantHack'
import type { BaseField } from './BaseField'
import type { Repository } from './EntityManager'
import type { IBuilder } from './IBuilder'
import type { ISchema } from './ISchema'
import type { EntitySerial } from './ModelSerial'

import { action, isObservable, makeAutoObservable, observable, toJS } from 'mobx'
import { nanoid } from 'nanoid'
import { createElement, type ReactNode } from 'react'

import { isWidgetGroup } from '../fields/WidgetUI.DI'
import { FormAsDropdownConfigUI } from '../form/FormAsDropdownConfigUI'
import { FormUI, type FormUIProps } from '../form/FormUI'
import { debounce } from '../utils/debounce'

export type ModelConfig<
    //
    SCHEMA extends ISchema<any>,
    DOMAIN extends IBuilder,
    CONTEXT,
> = {
    name: string
    // ----------------------------
    onValueChange?: (form: Entity<SCHEMA, DOMAIN, CONTEXT>) => void
    onSerialChange?: (form: Entity<SCHEMA, DOMAIN, CONTEXT>) => void
    initialSerial?: (context: CONTEXT) => Maybe<EntitySerial>
}

export class Entity<
    /** shape of the form, to preserve type safety down to nested children */
    SCHEMA extends ISchema<any /* 🔴 */> = ISchema<any /* 🔴 */>,
    /**
     * project-specific builder, allowing to have modular form setups with different widgets
     * Cushy BUILDER is `Builder` in `src/controls/Builder.ts`
     * */
    DOMAIN extends IBuilder = IBuilder,
    /** custom context, so your model can access whatever it wants in most callbacks */
    CONTEXT = any,
> {
    constructor(
        public repository: Repository<DOMAIN>,
        public buildFn: CovariantFn2<DOMAIN, CONTEXT, SCHEMA>,
        public config: ModelConfig<SCHEMA, DOMAIN, CONTEXT>,
        public context: CONTEXT,
    ) {
        this.domain = repository.domain

        this._onSerialChange = this.config.onSerialChange //
            ? debounce(this.config.onSerialChange, 200)
            : null

        this._onValueChange = this.config.onValueChange //
            ? debounce(this.config.onValueChange, 5)
            : null

        makeAutoObservable(this, {
            // @ts-ignore
            init: action,
            root: false,
            // builder: false,
        })
    }

    get subWidgets(): BaseField[] {
        return this.root.subWidgets
    }

    // get actions(){
    //     return this.root.actions
    // }

    /**
     * Snapshots are the immutable serialization, in plain objects, of a tree at a specific point in time. Snapshots can be inspected through getSnapshot(node, applyPostProcess). Snapshots don't contain any type information and are stripped from all actions, etc., so they are perfectly suitable for transportation. Requesting a snapshot is cheap as MST always maintains a snapshot of each node in the background and uses structural sharing.
     */
    snapshot: Maybe<any> = undefined

    /**
     * update current model snapshot
     */
    saveSnapshot() {
        this.snapshot = JSON.parse(JSON.stringify(this.root.serial))
        this.snapshotLastUpdatedAt = Date.now()
    }

    /**
     * rever to the last snapshot
     */
    revertToSnapshot() {
        throw new Error('❌ not implemented')
    }

    /**
     * @since 2024-06-20
     * @status broken
     * shrot text summarizing changes from default
     */
    get diffSummaryFromDefault(): string {
        return (this.root as BaseField).diffSummaryFromDefault
    }

    /**
     * @since 2024-06-20
     * @status broken
     * shrot text summarizing changes from default
     * */
    get diffSummaryFromSnapshot(): string {
        return (this.root as BaseField).diffSummaryFromDefault
    }

    /** loading error  */
    error: Maybe<string> = null

    /** shortcut to access the <FormUI /> component without having to import it first */
    FormUI = FormUI

    /**
     * allow to quickly render the model as a react form
     * without having to import any component; usage:
     * | <div>{x.render()}</div>
     */
    render = (p: Omit<FormUIProps, 'form'> = {}): ReactNode => {
        return createElement(FormUI, { form: this, ...p })
    }

    /**
     * allow to quickly render the form in a dropdown button
     * without having to import any component; usage:
     * | <div>{x.renderAsConfigBtn()}</div>
     */
    renderAsConfigBtn = (p?: {
        // 1. anchor option
        // ...TODO
        // 2. popup options
        title?: string
        className?: string
        maxWidth?: string
        minWidth?: string
        width?: string
    }): ReactNode => createElement(FormAsDropdownConfigUI, { form: this, ...p })

    get value(): SCHEMA['$Value'] {
        return this.root.value
    }

    set value(val: SCHEMA['$Value']) {
        this.root.value = val
    }

    get serial(): EntitySerial {
        return {
            type: 'FormSerial',
            uid: this.uid,
            name: this.config.name,
            root: this.root.serial,
            snapshot: this.snapshot,
            // shared: this.shared,
            serialLastUpdatedAt: this.serialLastUpdatedAt,
            valueLastUpdatedAt: this.valueLastUpdatedAt,
            snapshotLastUpdatedAt: this.snapshotLastUpdatedAt,
        }
    }

    /** @deprecated ; only work when root is a Widget_group */
    get fields(): SCHEMA extends ISchema<Widget_group<infer FIELDS>> ? { [k in keyof FIELDS]: FIELDS[k]['$Field'] } : never {
        if (isWidgetGroup(this.root)) return this.root.fields as any
        throw new Error('🔴 root is not a group')
    }

    // 🔴 👇 remove that
    get root(): SCHEMA['$Field'] {
        const root = this.init()
        Object.defineProperty(this, 'root', { value: root })
        return root
    }

    // Change tracking ------------------------------------

    /** timestamp at which form value was last updated, or 0 when form still pristine */
    valueLastUpdatedAt: Timestamp = 0

    /** timestamp at which form serial was last updated, or 0 when form still pristine */
    serialLastUpdatedAt: Timestamp = 0

    /** timestamp at which last entity snapshot was updated, or 0 if no snpashot */
    snapshotLastUpdatedAt: Timestamp = 0

    private _onSerialChange: ((form: Entity<SCHEMA, any>) => void) | null
    private _onValueChange: ((form: Entity<SCHEMA, any>) => void) | null

    /** every widget node must call this function once it's value change */
    applyValueUpdateEffects = (widget: BaseField) => {
        this.valueLastUpdatedAt = Date.now()
        this.applySerialUpdateEffects(widget)
        this._onValueChange?.(this)
    }

    _allFormWidgets: Map<string, BaseField> = new Map()
    knownShared: Map<string, BaseField> = new Map()

    getWidgetByID = (id: string): Maybe<BaseField> => {
        return this._allFormWidgets.get(id)
    }

    /** every widget node must call this function once it's serial changed */
    applySerialUpdateEffects = (_widget: BaseField) => {
        // bump serial last updated at
        this.serialLastUpdatedAt = Date.now()
        // call entity config onSerialChange
        this._onSerialChange?.(this)
    }

    /** from builder, offering simple API for your project specifc widgets  */
    domain: DOMAIN

    /** (@internal) will be set at builer creation, to allow for dyanmic recursive forms */
    _ROOT!: SCHEMA['$Field']

    ready = false

    /** only available once initialized */
    private _uid!: Maybe<string>
    get uid(): string {
        if (this._uid == null) throw new Error('🔴 uid not available before form is initialized')
        return this._uid
    }

    private init(): SCHEMA['$Field'] {
        // console.log(`[🥐] Building form ${this.config.name}`)
        const formBuilder = this.domain

        try {
            // retrieve the previous entity serial
            let serial = this.config.initialSerial?.(this.context)

            // keep track of the prev uid, and set-it up so it's avaialable asap
            this._uid = serial?.uid ?? nanoid()

            // ensure form serial is observable, so we avoid working with soon to expire refs
            if (serial && !isObservable(serial)) {
                serial = observable(serial)
            }

            // if and empty object `{}` is used instead of a real serial, let's pretend it's null
            if (serial != null && Object.keys(serial).length === 0) {
                serial = null
            }

            // attempt to recover from legacy serial
            serial = recoverFromLegacySerial(serial, this.config)

            // at this point, we expect the form serial to be fully valid
            if (serial != null && serial.type !== 'FormSerial') {
                throw new Error('❌ INVALID form serial')
            }

            this.snapshot = serial?.snapshot
            this.valueLastUpdatedAt = serial?.valueLastUpdatedAt ?? 0
            this.serialLastUpdatedAt = serial?.serialLastUpdatedAt ?? 0
            this.snapshotLastUpdatedAt = serial?.snapshotLastUpdatedAt ?? 0

            const schema: SCHEMA = this.buildFn?.(formBuilder, this.context)
            const rootWidget: SCHEMA = formBuilder._HYDRATE(this, null, schema, serial?.root)
            this.ready = true
            this.error = null
            // this.startMonitoring(rootWidget)
            return rootWidget
        } catch (e) {
            console.error(`[🔴] Building form ${this.config.name} FAILED`, this)
            console.error(e)
            this.error = 'invalid form definition'
            const spec: SCHEMA = this.buildFn?.(formBuilder, this.context)
            return formBuilder._HYDRATE(this, null, spec, null)
        }
    }
}

function recoverFromLegacySerial(json: any, config: { name: string }): Maybe<EntitySerial> {
    if (json == null) return null
    if (typeof json !== 'object') return null
    if (json.type === 'FormSerial') return json

    // BACKWARD COMPAT -----------------------------------------------------------------
    if ('values_' in json) {
        console.log(`[🔴🔴🔴🔴🔴🔴🔴] `, toJS(json))
        const oldSerial: Widget_group_serial<any> = json as any
        for (const [k, v] of Object.entries(oldSerial.values_)) {
            if (k.startsWith('__')) {
                delete oldSerial.values_[k]
            }
        }
        console.log(`[🔴] MIGRATED formSerial:`, JSON.stringify(json, null, 3).slice(0, 800))
        return {
            name: config.name,
            uid: nanoid(),
            type: 'FormSerial',
            root: json,
        }
    }

    return json
}
