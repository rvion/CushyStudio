import type { Form } from '../../Form'
import type { ISpec, SchemaDict } from '../../ISpec'
import type { IWidget, IWidgetMixins, SharedWidgetSerial, WidgetConfigFields, WidgetSerialFields } from '../../IWidget'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'

import { makeLabelFromFieldName } from '../../../utils/misc/makeLabelFromFieldName'
import { toastError } from '../../../utils/misc/toasts'
import { applyWidgetMixinV2 } from '../../Mixins'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetChoices_BodyUI, WidgetChoices_HeaderUI } from './WidgetChoicesUI'

export type TabPositionConfig = 'start' | 'center' | 'end'

// CONFIG
export type Widget_choices_config<T extends SchemaDict = SchemaDict> = WidgetConfigFields<
    {
        expand?: boolean
        items: T
        multi: boolean
        default?: { [k in keyof T]?: boolean } | keyof T
        placeholder?: string
        appearance?: 'select' | 'tab'
        tabPosition?: TabPositionConfig
    },
    Widget_choices_types<T>
>

// SERIAL
export type Widget_choices_serial<T extends SchemaDict = SchemaDict> = WidgetSerialFields<{
    type: 'choices'
    active: true
    branches: { [k in keyof T]?: boolean }
    values_: { [k in keyof T]?: T[k]['$Serial'] }
}>

// VALUE
export type Widget_choices_value<T extends SchemaDict = SchemaDict> = {
    [k in keyof T]?: T[k]['$Value']
}

// TYPES
export type Widget_choices_types<T extends SchemaDict = SchemaDict> = {
    $Type: 'choices'
    $Config: Widget_choices_config<T>
    $Serial: Widget_choices_serial<T>
    $Value: Widget_choices_value<T>
    $Widget: Widget_choices<T>
}

// STATE
export interface Widget_choices<T extends SchemaDict = SchemaDict> extends Widget_choices_types<T>, IWidgetMixins {}
export class Widget_choices<T extends SchemaDict = SchemaDict> implements IWidget<Widget_choices_types<T>> {
    DefaultHeaderUI = WidgetChoices_HeaderUI
    DefaultBodyUI = WidgetChoices_BodyUI
    /* override */ background = true
    readonly id: string
    get config() { return this.spec.config } // prettier-ignore
    readonly type: 'choices' = 'choices'
    readonly expand: boolean = this.config.expand ?? false

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
        return Object.entries(this.config.items).map(([key, spec]) => ({
            key,
            // note:
            // if child.config.label === false => makeLabelFromFieldName(key)
            // if child.config.label === '' => makeLabelFromFieldName(key)
            label: spec.config.label || makeLabelFromFieldName(key),
        }))
    }

    /** array of all active branch keys */
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
        //
        public readonly form: Form,
        public readonly parent: IWidget | null,
        public readonly spec: ISpec<Widget_choices<T>>,
        serial?: Widget_choices_serial<T>,
    ) {
        const config = spec.config
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

                if (isActive) this.enableBranch(branch, { skipBump: true })
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
            else this.enableBranch(activeBranch, { skipBump: true })
        }

        applyWidgetMixinV2(this)
        makeAutoObservable(this)
    }

    toggleBranch(branch: keyof T & string) {
        // 💬 2024-03-15 rvion: no need to bumpValue in this function;
        // | it's handled by enableBranch and disableBranch themselves.
        if (this.children[branch]) {
            if (this.isMulti) this.disableBranch(branch)
        } else this.enableBranch(branch)
    }

    disableBranch(branch: keyof T & string, p?: { skipBump?: boolean }) {
        // ensure branch to disable is active
        if (!this.children[branch]) throw new Error(`❌ Branch "${branch}" not enabled`)

        // remove children
        delete this.children[branch]
        // delete this.serial.values_[branch] // <- WE NEED TO KEEP THIS ONE UNLESS WE WANT TO DISCARD THE DRAFT
        this.serial.branches[branch] = false
        if (!p?.skipBump) this.bumpValue()
    }

    enableBranch(branch: keyof T & string, p?: { skipBump?: boolean }) {
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
            this.children[branch] = this.form.builder._HYDRATE(this, schema, prevBranchSerial)
        }
        // prev serial is not compatible => we use the fresh one instead
        else {
            this.children[branch] = this.form.builder._HYDRATE(this, schema, null)
            this.serial.values_[branch] = this.children[branch]?.serial
        }

        // set the active branch as active
        this.serial.branches[branch] = true
        if (!p?.skipBump) this.bumpValue()
    }

    /** results, but only for active branches */
    get value(): Widget_choices_value<T> {
        const out: { [key: string]: any } = {}
        for (const branch in this.children) {
            // if (this.state.branches[key] !== true) continue
            out[branch] = this.children[branch]!.value
        }
        return out as any
    }
}

// DI
registerWidgetClass('choices', Widget_choices)
