import type { Form } from '../../Form'
import type { IWidget, SharedWidgetSerial, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'
import type { SchemaDict } from 'src/cards/App'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { hash } from 'ohash'

import { WidgetDI } from '../WidgetUI.DI'
import { WidgetChoices_BodyUI, WidgetChoices_HeaderUI } from './WidgetChoicesUI'
import { makeLabelFromFieldName } from 'src/utils/misc/makeLabelFromFieldName'
import { toastError } from 'src/utils/misc/toasts'

// CONFIG
export type Widget_choices_config<T extends SchemaDict = SchemaDict> = WidgetConfigFields<{
    items: T
    multi: boolean
    default?: { [k in keyof T]?: boolean } | keyof T
    placeholder?: string
    appearance?: 'select' | 'tab'
}>

// SERIAL
export type Widget_choices_serial<T extends SchemaDict = SchemaDict> = WidgetSerialFields<{
    type: 'choices'
    active: true
    branches: { [k in keyof T]?: boolean }
    values_: { [k in keyof T]?: T[k]['$Serial'] }
}>

// OUT
export type Widget_choices_output<T extends SchemaDict = SchemaDict> = {
    [k in keyof T]?: T[k]['$Output']
}

// TYPES
export type Widget_choices_types<T extends SchemaDict = SchemaDict> = {
    $Type: 'choices'
    $Input: Widget_choices_config<T>
    $Serial: Widget_choices_serial<T>
    $Output: Widget_choices_output<T>
    $Widget: Widget_choices<T>
}

// STATE
export interface Widget_choices<T extends SchemaDict = SchemaDict> extends Widget_choices_types<T> {}
export class Widget_choices<T extends SchemaDict = SchemaDict> implements IWidget<Widget_choices_types<T>> {
    HeaderUI = WidgetChoices_HeaderUI
    BodyUI = WidgetChoices_BodyUI
    readonly id: string
    readonly type: 'choices' = 'choices'

    get serialHash(): string {
        return hash(this.value)
    }
    get isMulti(): boolean {
        return this.config.multi
    }
    get isSingle(): boolean {
        return !this.config.multi
    }
    children: { [k in keyof T]?: T[k]['$Widget'] } = {}
    serial: Widget_choices_serial<T>

    get firstChoice(): (keyof T & string) | undefined {
        return this.choices[0]
    }

    get choices(): (keyof T & string)[] {
        return Object.keys(this.config.items)
    }
    get choicesWithLabels(): { key: keyof T & string; label: string }[] {
        return Object.entries(this.config.items).map(([key, value]) => ({
            key,
            // note:
            // if child.config.label === false => makeLabelFromFieldName(key)
            // if child.config.label === '' => makeLabelFromFieldName(key)
            label: value.config.label || makeLabelFromFieldName(key),
        }))
    }

    get activeBranches(): (keyof T & string)[] {
        return Object.keys(this.serial.branches).filter((x) => this.serial.branches[x])
    }

    get firstActiveBranchName(): (keyof T & string) | undefined {
        return this.activeBranches[0]
    }

    get firstActiveBranchWidget(): T[keyof T]['$Widget'] | undefined {
        if (this.firstActiveBranchName == null) return undefined
        return this.children[this.firstActiveBranchName]
    }

    constructor(
        public readonly form: Form<any>,
        public readonly config: Widget_choices_config<T>,
        serial?: Widget_choices_serial<T>,
    ) {
        // ensure ID
        this.id = serial?.id ?? nanoid()
        // TODO: investigate why this contructor is called so many times (5 times ???)

        // basic sanity check because of the recent breaking change
        if (typeof config.items === 'function') {
            toastError('🔴 ChoicesWidget "items" property should now be an object, not a function')
            debugger
        }

        // ensure serial present and valid
        this.serial = serial ?? {
            type: 'choices',
            id: this.id,
            active: true,
            values_: {},
            branches: {},
        }

        // find all active branches
        const allBranches = Object.keys(config.items) as (keyof T & string)[]
        const def = this.config.default
        const isMulti = this.config.multi

        if (isMulti) {
            for (const branch of allBranches) {
                const isActive =
                    this.serial.branches[branch] ??
                    (typeof def === 'string' //
                        ? branch === def
                        : typeof def === 'object'
                        ? def?.[branch] ?? false
                        : null)

                if (isActive) this.enableBranch(branch)
            }
        } else {
            const allBranches = Object.keys(this.config.items)
            const activeBranch =
                allBranches.find((x) => this.serial.branches[x]) ??
                (def == null
                    ? allBranches[0]
                    : typeof def === 'string' //
                    ? def
                    : typeof def === 'object'
                    ? Object.entries(def).find(([, v]) => v)?.[0] ?? allBranches[0]
                    : allBranches[0])
            if (activeBranch == null) toastError(`❌ No active branch found for single choice widget "${this.config.label}"`)
            else this.enableBranch(activeBranch)
        }

        makeAutoObservable(this)
    }

    toggleBranch(branch: keyof T & string) {
        if (this.children[branch]) {
            if (this.isMulti) this.disableBranch(branch)
        } else this.enableBranch(branch)
    }

    disableBranch(branch: keyof T & string) {
        if (!this.children[branch]) throw new Error(`❌ Branch "${branch}" not enabled`)
        delete this.children[branch]
        // delete this.serial.values_[branch] // <- WE NEED TO KEEP THIS ONE UNLESS WE WANT TO DISCARD THE DRAFT
        this.serial.branches[branch] = false
    }

    enableBranch(branch: keyof T & string) {
        if (!this.config.multi) {
            for (const key in this.children) {
                this.disableBranch(key)
            }
        }
        if (this.children[branch]) throw new Error(`❌ Branch "${branch}" already enabled`)
        // first: quick safety net to check against schema changes
        // a. re-create an empty item to check it's schema
        let schema = this.config.items[branch]
        /* 💊 */ if (typeof schema === 'function') schema = (schema as any)() // temporary backward compat

        if (schema == null) throw new Error(`❌ Branch "${branch}" has no initializer function`)

        // prev serial seems compmatible => we use it
        const prevBranchSerial: Maybe<SharedWidgetSerial> = this.serial.values_?.[branch]
        if (prevBranchSerial && schema.type === prevBranchSerial.type) {
            this.children[branch] = this.form.builder._HYDRATE(schema, prevBranchSerial)
        }
        // prev serial is not compatible => we use the fresh one instead
        else {
            this.children[branch] = this.form.builder._HYDRATE(schema, null)
            this.serial.values_[branch] = this.children[branch]?.serial
        }

        // set the active branch as active
        this.serial.branches[branch] = true
    }

    /** results, but only for active branches */
    get value(): Widget_choices_output<T> {
        const out: { [key: string]: any } = {}
        for (const branch in this.children) {
            // if (this.state.branches[key] !== true) continue
            out[branch] = this.children[branch]!.value
        }
        return out as any
    }
}

// DI
WidgetDI.Widget_choices = Widget_choices
