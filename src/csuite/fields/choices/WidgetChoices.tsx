import type { Entity } from '../../model/Entity'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial, FieldSerial_CommonProperties } from '../../model/FieldSerial'
import type { ISchema, SchemaDict } from '../../model/ISchema'
import type { Problem_Ext } from '../../model/Validation'
import type { TabPositionConfig } from './TabPositionConfig'

import { nanoid } from 'nanoid'

import { BaseField } from '../../model/BaseField'
import { makeLabelFromFieldName } from '../../utils/makeLabelFromFieldName'
import { toastError } from '../../utils/toasts'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetChoices_BodyUI, WidgetChoices_HeaderUI, WidgetChoices_TabHeaderUI } from './WidgetChoicesUI'

type DefaultBranches<T> = { [key in keyof T]?: boolean }

// CONFIG
export type Widget_choices_config<T extends SchemaDict = SchemaDict> = FieldConfig<
    {
        expand?: boolean
        items: T
        multi: boolean
        /** either a branch name if only one branch is active, or a Dict<boolean> if multiple */
        default?: DefaultBranches<T> | keyof T
        // | boolean 🔴 TODO: support boolean default for "ALL ON", or "ALL OFF"
        placeholder?: string
        appearance?: 'select' | 'tab'
        tabPosition?: TabPositionConfig
    },
    Widget_choices_types<T>
>

// SERIAL
export type Widget_choices_serial<T extends SchemaDict = SchemaDict> = FieldSerial<{
    type: 'choices'
    active: true
    branches: DefaultBranches<T>
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
    $Field: Widget_choices<T>
}

// STATE
export class Widget_choices<T extends SchemaDict = SchemaDict> extends BaseField<Widget_choices_types<T>> {
    UITab = () => <WidgetChoices_TabHeaderUI widget={this} />
    UISelect = () => <WidgetChoices_HeaderUI widget={this} />
    UIChildren = () => <WidgetChoices_BodyUI widget={this} justify={false} />
    DefaultHeaderUI = WidgetChoices_HeaderUI
    DefaultBodyUI = WidgetChoices_BodyUI
    readonly id: string

    readonly type: 'choices' = 'choices'
    readonly expand: boolean = this.config.expand ?? false

    get baseErrors(): Problem_Ext {
        return null
    }

    get isMulti(): boolean {
        return this.config.multi
    }

    get isSingle(): boolean {
        return !this.config.multi
    }

    children: { [k in keyof T]?: T[k]['$Field'] } = {}

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

    /** hack so optional fields do not increase nesting twice */
    get indentChildren(): number {
        return 0
    }

    /** array of all active branch keys */
    get activeBranches(): (keyof T & string)[] {
        return Object.keys(this.serial.branches).filter((x) => this.serial.branches[x])
    }

    get firstActiveBranchName(): (keyof T & string) | undefined {
        return this.activeBranches[0]
    }

    get firstActiveBranchWidget(): T[keyof T]['$Field'] | undefined {
        if (this.firstActiveBranchName == null) return undefined
        return this.children[this.firstActiveBranchName]
    }

    get hasChanges(): boolean {
        const def = this.config.default
        for (const branchName of this.choices) {
            const shouldBeActive =
                def == null //
                    ? false
                    : typeof def === 'string'
                      ? branchName === def
                      : (def as DefaultBranches<T>)[branchName]
            const child = this.children[branchName]
            if (child && !shouldBeActive) return true
            if (!child && shouldBeActive) return true
            if (child && shouldBeActive && child.hasChanges) return true
        }
        return false
    }

    reset(): void {
        const def = this.config.default
        for (const branchName of this.choices) {
            const shouldBeActive =
                def == null //
                    ? false
                    : typeof def === 'string'
                      ? branchName === def
                      : (def as DefaultBranches<T>)[branchName]
            const child = this.children[branchName]
            if (child && !shouldBeActive) this.disableBranch(branchName, { skipBump: true })
            if (!child && shouldBeActive) this.enableBranch(branchName, { skipBump: true })
            // re-check if child is now enabled
            const childAfter = this.children[branchName]
            if (childAfter && childAfter.hasChanges) childAfter.reset()
        }
        this.applyValueUpdateEffects()
    }

    constructor(
        //
        entity: Entity,
        parent: BaseField | null,
        spec: ISchema<Widget_choices<T>>,
        serial?: Widget_choices_serial<T>,
    ) {
        super(entity, parent, spec)
        this.id = serial?.id ?? nanoid()
        const config = spec.config
        // ensure ID
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

        this.init({
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    get subWidgets(): BaseField[] {
        return Object.values(this.children)
    }

    get subWidgetsWithKeys(): { key: string; widget: BaseField }[] {
        return Object.entries(this.children).map(([key, widget]) => ({ key, widget }))
    }

    toggleBranch(branch: keyof T & string) {
        // 💬 2024-03-15 rvion: no need to bumpValue in this function;
        // | it's handled by enableBranch and disableBranch themselves.
        if (this.children[branch]) {
            if (this.isMulti) this.disableBranch(branch)
        } else this.enableBranch(branch)
    }

    isBranchDisabled = (branch: keyof T & string): boolean => !this.serial.branches[branch]
    disableBranch(branch: keyof T & string, p?: { skipBump?: boolean }) {
        // ensure branch to disable is active
        if (!this.children[branch]) throw new Error(`❌ Branch "${branch}" not enabled`)

        // remove children
        delete this.children[branch]
        // delete this.serial.values_[branch] // <- WE NEED TO KEEP THIS ONE UNLESS WE WANT TO DISCARD THE DRAFT
        this.serial.branches[branch] = false
        if (!p?.skipBump) this.applyValueUpdateEffects()
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
        const prevBranchSerial: Maybe<FieldSerial_CommonProperties> = this.serial.values_?.[branch]
        if (prevBranchSerial && schema.type === prevBranchSerial.type) {
            this.children[branch] = this.entity.domain._HYDRATE(this.entity, this, schema, prevBranchSerial)
        }
        // prev serial is not compatible => we use the fresh one instead
        else {
            this.children[branch] = this.entity.domain._HYDRATE(this.entity, this, schema, null)
            this.serial.values_[branch] = this.children[branch]?.serial
        }

        // set the active branch as active
        this.serial.branches[branch] = true
        if (!p?.skipBump) this.applyValueUpdateEffects()
    }

    set value(val: Widget_choices_value<T>) {
        for (const branch of this.choices) {
            // 🐛 console.log(`[🤠] >> ${branch}:`, Boolean(val[branch]), `(is: ${this.isBranchDisabled(branch)})`)
            if (val[branch] == null) {
                if (!this.isBranchDisabled(branch)) {
                    this.disableBranch(branch)
                }
            } else {
                if (this.isBranchDisabled(branch)) {
                    // enable branch
                    this.enableBranch(branch)
                }
                // patch branch value to given value
                this.children[branch]!.value = val[branch]!
            }
        }
        this.applyValueUpdateEffects()
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
