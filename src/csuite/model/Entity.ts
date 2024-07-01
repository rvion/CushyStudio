import type { Field_group, Field_group_serial } from '../fields/group/WidgetGroup'
import type { CovariantFn } from '../variance/BivariantHack'
import type { Field } from './Field'
import type { IBuilder } from './IBuilder'
import type { ISchema } from './ISchema'
import type { Repository } from './Repository'

import { action, isObservable, makeAutoObservable, observable, toJS } from 'mobx'
import { createElement, type ReactNode } from 'react'

import { isWidgetGroup } from '../fields/WidgetUI.DI'
import { FormAsDropdownConfigUI } from '../form/FormAsDropdownConfigUI'
import { FormUI, type FormUIProps } from '../form/FormUI'
import { debounce } from '../utils/debounce'
import { type EntityId, mkNewEntityId } from './EntityId'
import { type EntitySerial } from './EntitySerial'

export type ModelConfig<
    //
    SCHEMA extends ISchema<any>,
    DOMAIN extends IBuilder,
> = {
    name?: string
    serial?: () => Maybe<EntitySerial>
    onValueChange?: (form: Entity<SCHEMA, DOMAIN>) => void
    onSerialChange?: (form: Entity<SCHEMA, DOMAIN>) => void
}

export class Entity<
    /**
     * shape of the form, to preserve type safety down to nested children
     */
    SCHEMA extends ISchema = ISchema,
    /**
     * project-specific builder, allowing to have modular form setups with different widgets
     * Cushy BUILDER is `Builder` in `src/controls/Builder.ts`
     */
    BUILDER extends IBuilder = IBuilder,
> {
    root: SCHEMA['$Field']

    constructor(
        public repository: Repository<BUILDER>,
        public schema: SCHEMA,
        public config: ModelConfig<SCHEMA, BUILDER>,
    ) {
        this.builder = repository.domain

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
        })

        this.root = this.init()
    }

    /** shortcut to `root.subFields` */
    get subFields(): Field[] {
        return this.root.subFields
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
        return (this.root as Field).diffSummaryFromDefault
    }

    /**
     * @since 2024-06-20
     * @status broken
     * shrot text summarizing changes from default
     * */
    get diffSummaryFromSnapshot(): string {
        return (this.root as Field).diffSummaryFromDefault
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
    render = (p: Omit<FormUIProps, 'entity'> = {}): ReactNode => {
        return createElement(FormUI, { entity: this, ...p })
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
            root: this.root.serial,
            snapshot: this.snapshot,
            // shared: this.shared,
            serialLastUpdatedAt: this.serialLastUpdatedAt,
            valueLastUpdatedAt: this.valueLastUpdatedAt,
            snapshotLastUpdatedAt: this.snapshotLastUpdatedAt,
        }
    }

    /** @deprecated ; only work when root is a Field_group */
    get fields(): SCHEMA extends ISchema<Field_group<infer FIELDS>> ? { [k in keyof FIELDS]: FIELDS[k]['$Field'] } : never {
        if (isWidgetGroup(this.root)) return this.root.fields as any
        throw new Error('🔴 root is not a group')
    }

    /** timestamp at which form value was last updated, or 0 when form still pristine */
    valueLastUpdatedAt: Timestamp = 0

    /** timestamp at which form serial was last updated, or 0 when form still pristine */
    serialLastUpdatedAt: Timestamp = 0

    /** timestamp at which last entity snapshot was updated, or 0 if no snpashot */
    snapshotLastUpdatedAt: Timestamp = 0

    private _onSerialChange: ((form: Entity<SCHEMA, any>) => void) | null
    private _onValueChange: ((form: Entity<SCHEMA, any>) => void) | null

    /** every widget node must call this function once it's value change */
    applyValueUpdateEffects = (widget: Field) => {
        this.valueLastUpdatedAt = Date.now()
        this.applySerialUpdateEffects(widget)
        this._onValueChange?.(this)
    }

    _allFormWidgets: Map<string, Field> = new Map()
    knownShared: Map<string, Field> = new Map()

    getWidgetByID = (id: string): Maybe<Field> => {
        return this._allFormWidgets.get(id)
    }

    /** every widget node must call this function once it's serial changed */
    applySerialUpdateEffects = (_widget: Field) => {
        // bump serial last updated at
        this.serialLastUpdatedAt = Date.now()
        // call entity config onSerialChange
        this._onSerialChange?.(this)
    }

    /** from builder, offering simple API for your project specifc widgets  */
    builder: BUILDER

    ready = false

    /** only available once initialized */
    private _uid!: Maybe<EntityId>
    get uid(): EntityId {
        if (this._uid == null) throw new Error('🔴 uid not available before form is initialized')
        return this._uid
    }

    private init(): SCHEMA['$Field'] {
        // console.log(`[🥐] Building form ${this.config.name}`)
        const formBuilder = this.builder

        try {
            // retrieve the previous entity serial
            let serial = this.config.serial?.()

            // keep track of the prev uid, and set-it up so it's avaialable asap
            this._uid = serial?.uid ?? mkNewEntityId()

            // ensure form serial is observable, so we avoid working with soon to expire refs
            if (serial && !isObservable(serial)) {
                serial = observable(serial)
            }

            // if and empty object `{}` is used instead of a real serial, let's pretend it's null
            if (serial != null && Object.keys(serial).length === 0) {
                serial = null
            }

            // attempt to recover from legacy serial
            serial = recoverFromLegacySerial(serial)

            // at this point, we expect the form serial to be fully valid
            if (serial != null && serial.type !== 'FormSerial') {
                throw new Error('❌ INVALID form serial')
            }

            this.snapshot = serial?.snapshot
            this.valueLastUpdatedAt = serial?.valueLastUpdatedAt ?? 0
            this.serialLastUpdatedAt = serial?.serialLastUpdatedAt ?? 0
            this.snapshotLastUpdatedAt = serial?.snapshotLastUpdatedAt ?? 0

            // const schema: SCHEMA = this.buildFn?.(formBuilder)
            const root: SCHEMA['$Field'] = this.schema.instanciate(this, null, serial?.root)
            this.ready = true
            this.error = null
            return root
        } catch (e) {
            console.error(`[🔴] Building entity FAILED`, this)
            console.error(e)
            this.error = 'invalid form definition'
            return this.schema.instanciate(this, null, null)
        }
    }
}

function recoverFromLegacySerial(json: any): Maybe<EntitySerial> {
    if (json == null) return null
    if (typeof json !== 'object') return null
    if (json.type === 'FormSerial') return json

    // BACKWARD COMPAT -----------------------------------------------------------------
    if ('values_' in json) {
        console.log(`[🔴🔴🔴🔴🔴🔴🔴] `, toJS(json))
        const oldSerial: Field_group_serial<any> = json as any
        for (const [k, v] of Object.entries(oldSerial.values_)) {
            if (k.startsWith('__')) {
                delete oldSerial.values_[k]
            }
        }
        console.log(`[🔴] MIGRATED formSerial:`, JSON.stringify(json, null, 3).slice(0, 800))
        return {
            uid: mkNewEntityId(),
            type: 'FormSerial',
            root: json,
        }
    }

    return json
}