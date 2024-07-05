import type { IconName } from '../../icons/icons'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial, FieldSerial_CommonProperties } from '../../model/FieldSerial'
import type { ISchema, SchemaDict } from '../../model/ISchema'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'
import type { TabPositionConfig } from './TabPositionConfig'

import { Field, type KeyedField } from '../../model/Field'
import { makeLabelFromFieldName } from '../../utils/makeLabelFromFieldName'
import { toastError } from '../../utils/toasts'
import { registerWidgetClass } from '../WidgetUI.DI'
import { WidgetChoices_SelectHeaderUI } from './WidgetChoices_SelectHeaderUI'
import { WidgetChoices_TabHeaderUI } from './WidgetChoices_TabHeaderUI'
import { WidgetChoices_BodyUI, WidgetChoices_HeaderUI } from './WidgetChoicesUI'

type DefaultBranches<T> = { [key in keyof T]?: boolean }

// CONFIG
export type Field_choices_config<T extends SchemaDict = SchemaDict> = FieldConfig<
    {
        /** schema for  all possible branches */
        items: T

        /**
         * true  => 0, 1 or more values can be selected
         * false => one and only one value can be selected (not 0, not 2)
         */
        multi: boolean

        /**
         * either a branch name if only one branch is active,
         * or a Dict<boolean> if multiple
         * // | boolean 🔴 TODO: support boolean default for "ALL ON", or "ALL OFF"
         */
        default?: DefaultBranches<T> | keyof T

        // UI stuff----------------------
        /** placeholder to display in widget that support placeholders */
        placeholder?: string

        /** preffered widget to use for value selection */
        appearance?: 'select' | 'tab'

        /** if the widget use tabs, where to place tabs */
        tabPosition?: TabPositionConfig

        /** UI stuff */
        expand?: boolean
    },
    Field_choices_types<T>
>

// SERIAL
export type Field_choices_serial<T extends SchemaDict = SchemaDict> = FieldSerial<{
    type: 'choices'
    branches: DefaultBranches<T>
    values_: { [k in keyof T]?: T[k]['$Serial'] }
}>

// VALUE
export type Field_choices_value<T extends SchemaDict = SchemaDict> = {
    [k in keyof T]?: T[k]['$Value']
}

// TYPES
export type Field_choices_types<T extends SchemaDict = SchemaDict> = {
    $Type: 'choices'
    $Config: Field_choices_config<T>
    $Serial: Field_choices_serial<T>
    $Value: Field_choices_value<T>
    $Field: Field_choices<T>
}

// STATE
export class Field_choices<T extends SchemaDict = SchemaDict> extends Field<Field_choices_types<T>> {
    static readonly type: 'choices' = 'choices'
    UITab = () => <WidgetChoices_TabHeaderUI field={this} />
    UISelect = () => <WidgetChoices_SelectHeaderUI field={this} />
    UIChildren = () => <WidgetChoices_BodyUI field={this} justify={false} />
    DefaultHeaderUI = WidgetChoices_HeaderUI
    DefaultBodyUI = WidgetChoices_BodyUI

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

    enabledBranches: { [k in keyof T]?: T[k]['$Field'] } = {}

    get firstPossibleChoice(): (keyof T & string) | undefined {
        return this.allPossibleChoices[0]
    }

    get allPossibleChoices(): (keyof T & string)[] {
        return Object.keys(this.config.items)
    }

    get isCollapsible(): boolean {
        if (this.activeBranchNames.length === 0) return false
        return super.isCollapsible
    }

    get choicesWithLabels(): { key: keyof T & string; label: string; icon?: IconName }[] {
        return Object.entries(this.config.items).map(([key, schema]) => ({
            key,
            // note:
            // if child.config.label === false => makeLabelFromFieldName(key)
            // if child.config.label === '' => makeLabelFromFieldName(key)
            label: schema.config.label || makeLabelFromFieldName(key),
            icon: schema.config.icon,
        }))
    }

    /** array of all active branch keys */
    get activeBranchNames(): (keyof T & string)[] {
        return Object.keys(this.serial.branches) //
            .filter((x) => this.serial.branches[x])
    }

    get firstActiveBranchName(): (keyof T & string) | undefined {
        return this.activeBranchNames[0]
    }

    get firstActiveBranchField(): T[keyof T]['$Field'] | undefined {
        if (this.firstActiveBranchName == null) return undefined
        return this.enabledBranches[this.firstActiveBranchName]
    }

    get hasChanges(): boolean {
        const def = this.config.default
        for (const branchName of this.allPossibleChoices) {
            const shouldBeActive = this.isBranchActiveByDefault(branchName)
            const child = this.enabledBranches[branchName]
            if (child && !shouldBeActive) return true
            if (!child && shouldBeActive) return true
            if (child && shouldBeActive && child.hasChanges) return true
        }
        return false
    }

    isBranchActiveByDefault(branchName: keyof T & string): boolean {
        const def = this.config.default
        const shouldBeActive: boolean =
            def == null //
                ? false
                : typeof def === 'string'
                  ? branchName === def
                  : Boolean((def as DefaultBranches<T>)[branchName])
        return shouldBeActive
    }

    // ⏸️ reset(): void {
    // ⏸️     const def = this.config.default
    // ⏸️     for (const branchName of this.allPossibleChoices) {
    // ⏸️         const shouldBeActive = this.isBranchActiveByDefault(branchName)
    // ⏸️         const child = this.enabledBranches[branchName]
    // ⏸️         if (child && !shouldBeActive) this.disableBranch(branchName, { skipBump: true })
    // ⏸️         if (!child && shouldBeActive) this.enableBranch(branchName, { skipBump: true })
    // ⏸️         // re-check if child is now enabled
    // ⏸️         const childAfter = this.enabledBranches[branchName]
    // ⏸️         if (childAfter && childAfter.hasChanges) childAfter.reset()
    // ⏸️     }
    // ⏸️     this.applyValueUpdateEffects()
    // ⏸️ }

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: ISchema<Field_choices<T>>,
        serial?: Field_choices_serial<T>,
    ) {
        super(repo, root, parent, schema)
        const config = schema.config
        if (typeof config.items === 'function') {
            toastError('🔴 ChoicesWidget "items" property should now be an object, not a function')
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

    protected setOwnSerial(): void {
        if (this.serial.values_ == null) this.serial.values_ = {}
        if (this.serial.branches == null) this.serial.branches = {}
        //
        for (const [fName, fSchema] of this._fieldSchemas) {
            let field = this.fields[fName]
            if (field != null) {
                field.updateSerial(serial?.values_?.[fName])
            } else {
                field = fSchema.instanciate(this.repo, this.root, this, serial?.values_?.[fName])
                this.fields[fName] = field
                this.serial.values_[fName] = field.serial
            }
        }
    }

    get subFields(): Field[] {
        return Object.values(this.enabledBranches)
    }

    get subFieldsWithKeys(): KeyedField[] {
        return Object.entries(this.enabledBranches).map(([key, field]) => ({ key, field }))
    }

    toggleBranch(branch: keyof T & string) {
        // 💬 2024-03-15 rvion: no need to bumpValue in this function;
        // | it's handled by enableBranch and disableBranch themselves.
        if (this.enabledBranches[branch]) {
            if (this.isMulti) this.disableBranch(branch)
        } else this.enableBranch(branch)
    }

    isBranchDisabled = (branch: keyof T & string): boolean => !this.serial.branches[branch]
    isBranchEnabled = (branch: keyof T & string): boolean => Boolean(this.serial.branches[branch])

    disableBranch(branch: keyof T & string, p?: { skipBump?: boolean }) {
        // ensure branch to disable is active
        if (!this.enabledBranches[branch]) throw new Error(`❌ Branch "${branch}" not enabled`)

        // remove children
        delete this.enabledBranches[branch]
        // delete this.serial.values_[branch] // <- WE NEED TO KEEP THIS ONE UNLESS WE WANT TO DISCARD THE DRAFT
        this.serial.branches[branch] = false
        if (!p?.skipBump) this.applyValueUpdateEffects()
    }

    enableBranch(branch: keyof T & string, p?: { skipBump?: boolean }) {
        if (!this.config.multi) {
            for (const key in this.enabledBranches) {
                this.disableBranch(key)
            }
        }
        if (this.enabledBranches[branch]) throw new Error(`❌ Branch "${branch}" already enabled`)
        // first: quick safety net to check against schema changes
        // a. re-create an empty item to check it's schema
        let schema = this.config.items[branch]
        /* 💊 */ if (typeof schema === 'function') schema = (schema as any)() // temporary backward compat

        if (schema == null) throw new Error(`❌ Branch "${branch}" has no initializer function`)

        // prev serial seems compmatible => we use it
        const prevBranchSerial: Maybe<FieldSerial_CommonProperties> = this.serial.values_?.[branch]
        if (prevBranchSerial && schema.type === prevBranchSerial.type) {
            this.enabledBranches[branch] = schema.instanciate(this.repo, this.root, this, prevBranchSerial)
        }
        // prev serial is not compatible => we use the fresh one instead
        else {
            this.enabledBranches[branch] = schema.instanciate(this.repo, this.root, this, null)
            this.serial.values_[branch] = this.enabledBranches[branch]?.serial
        }

        // set the active branch as active
        this.serial.branches[branch] = true
        if (!p?.skipBump) this.applyValueUpdateEffects()
    }

    /** results, but only for active branches */
    get value(): Field_choices_value<T> {
        const out: { [key: string]: any } = {}
        for (const branch in this.enabledBranches) {
            out[branch] = this.enabledBranches[branch]!.value
        }
        return out as any
    }

    set value(val: Field_choices_value<T>) {
        for (const branch of this.allPossibleChoices) {
            // case 1. branch should be DISABLED
            if (val[branch] == null) {
                // disable branch
                if (this.isBranchEnabled(branch)) this.disableBranch(branch)
            }
            // case 2. branch should be ENABLED
            else {
                // 2.1. enable branch if disabled
                if (this.isBranchDisabled(branch)) this.enableBranch(branch)
                // 2.2 then patch branch value to given value
                this.enabledBranches[branch]!.value = val[branch]!
            }
        }
        this.applyValueUpdateEffects()
    }

    // 💬 2024-07-01 rvion:
    // 💬 hack so optional fields do not increase nesting twice
    // 💬 But not sure this override is worth it.
    // 💬 Consistency may be better than the extra line of code.
    // | get indentChildren(): number {
    // |     return 0
    // | }
}

// DI
registerWidgetClass('choices', Field_choices)
