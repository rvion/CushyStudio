import type { IconName } from '../../icons/icons'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { SchemaDict } from '../../model/SchemaDict'
import type { Problem_Ext } from '../../model/Validation'
import type { ProplessFC } from '../../types/ReactUtils'
import type { TabPositionConfig } from './TabPositionConfig'

import { Field, type KeyedField } from '../../model/Field'
import { bang } from '../../utils/bang'
import { makeLabelFromFieldName } from '../../utils/makeLabelFromFieldName'
import { toastError } from '../../utils/toasts'
import { registerFieldClass } from '../WidgetUI.DI'
import { WidgetChoices_SelectHeaderUI } from './WidgetChoices_SelectHeaderUI'
import { WidgetChoices_TabHeaderUI } from './WidgetChoices_TabHeaderUI'
import { WidgetChoices_BodyUI, WidgetChoices_HeaderUI } from './WidgetChoicesUI'

type ActiveBranches<T> = { [key in keyof T]?: boolean }

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
        default?: ActiveBranches<T> | keyof T

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
    $: 'choices'
    branches: ActiveBranches<T>
    values: { [k in keyof T]?: T[k]['$Serial'] }
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
    UITab: ProplessFC = () => <WidgetChoices_TabHeaderUI field={this} />
    UISelect: ProplessFC = () => <WidgetChoices_SelectHeaderUI field={this} />
    UIChildren: ProplessFC = () => <WidgetChoices_BodyUI field={this} justify={false} />
    DefaultHeaderUI = WidgetChoices_HeaderUI
    DefaultBodyUI = WidgetChoices_BodyUI

    readonly expand: boolean = this.config.expand ?? false

    get ownProblems(): Problem_Ext {
        return null
    }

    /**
     * true if the choice widget multiple values (0+)
     */
    get isMulti(): boolean {
        return this.config.multi
    }

    /**
     * true if the choice widget accept ONE and only ONE value
     * (not 0, not 2+)
     */
    get isSingle(): boolean {
        return !this.config.multi
    }

    /** dictionary of enabled children branches */
    enabledBranches: { [k in keyof T]?: T[k]['$Field'] } = {}

    /** alias for enabledBranches */
    get branches(): { [k in keyof T]?: T[k]['$Field'] } {
        return this.enabledBranches
    }

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
            label:
                typeof schema.config.label === 'string' && schema.config.label.length > 0
                    ? schema.config.label
                    : makeLabelFromFieldName(key),
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

        if (def == null) {
            if (this.isMulti) return false
            return this.allPossibleChoices[0] === branchName
        }
        const shouldBeActive: boolean =
            typeof def === 'string' ? branchName === def : Boolean((def as ActiveBranches<T>)[branchName])
        return shouldBeActive
    }

    constructor(
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_choices<T>>,
        serial?: Field_choices_serial<T>,
    ) {
        super(repo, root, parent, schema, {
            $: 'choices',
            branches: {},
            values: {},
        })
        this.init(serial, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    get subFields(): Field[] {
        return Object.values(this.enabledBranches)
    }

    get subFieldsWithKeys(): KeyedField[] {
        return Object.entries(this.enabledBranches).map(([key, field]) => ({ key, field }))
    }

    toggleBranch(branch: keyof T & string): void {
        // 💬 2024-03-15 rvion: no need to bumpValue in this function;
        // | it's handled by enableBranch and disableBranch themselves.
        if (this.enabledBranches[branch]) {
            if (this.isMulti) this.disableBranch(branch)
        } else this.enableBranch(branch)
    }

    isBranchDisabled(branch: keyof T & string): boolean {
        return !this.serial.branches[branch]
    }

    isBranchEnabled(branch: keyof T & string): boolean {
        return Boolean(this.serial.branches[branch])
    }

    protected setOwnSerial(serial__: Maybe<this['$Serial']>): void {
        const serial_: Maybe<this['$Serial']> =
            serial__ == null
                ? null
                : // 🔶 deep clone is required because serial for this field is handled deeply
                  // here instead of children when branch is disabled but we have a value
                  JSON.parse(
                      JSON.stringify({
                          $: 'choices', //
                          branches: serial__.branches,
                          values: serial__.values ?? (serial__ as any).values_,
                      }),
                  )
        const config = this.config
        if (typeof config.items === 'function') {
            toastError('🔴 ChoicesWidget "items" property should now be an object, not a function')
        }

        if (this.isSingle) {
            const getActiveBranches = (x: ActiveBranches<T>): (keyof T)[] =>
                Object.entries(x)
                    .filter(([k, active]) => active && this.allPossibleChoices.includes(k))
                    .map(([k]) => k)

            if (typeof config.default === 'object' && getActiveBranches(config.default).length > 1) {
                toastError('🔴 ChoicesWidget is single but default sets multiple branches')
            }

            const activeBranches = serial_?.branches && getActiveBranches(serial_?.branches)
            if (activeBranches && activeBranches?.length > 1) {
                toastError(
                    '🔴 ChoicesWidget is single but incoming serial sets multiple branches (recovering by picking the first one)',
                )
                serial_.branches = { [bang(activeBranches[0])]: true } as ActiveBranches<T>
            }
        }

        this.runInValueTransaction(() => {
            for (const branch of this.allPossibleChoices) {
                const shouldBeActive = serial_?.branches[branch] ?? this.isBranchActiveByDefault(branch)

                // first: quick safety net to check against schema changes
                // a. re-create an empty item to check it's schema
                let schema = this.config.items[branch]
                if (typeof schema === 'function') schema = (schema as any)() // 💊 temporary backward compat
                if (schema == null) throw new Error(`❌ Branch "${branch}" has no initializer function`)

                if (shouldBeActive) {
                    this.RECONCILE({
                        correctChildSchema: schema,
                        existingChild: this.enabledBranches[branch],
                        targetChildSerial: serial_?.values?.[branch],
                        attach: (child) => {
                            this.enabledBranches[branch] = child
                            this.serial.values[branch] = child.serial
                        },
                    })
                } else {
                    this.serial.values[branch] = serial_?.values?.[branch]

                    // remove children
                    const prevChild = this.enabledBranches[branch]
                    if (prevChild) prevChild.disposeTree()
                    delete this.enabledBranches[branch]

                    // WE NEED TO KEEP THIS ONE UNLESS WE WANT TO DISCARD THE DRAFT
                    // we could make this opt-in via a config flag and persist in memory only via enableBranch
                    // delete this.serial.values_[branch]
                }

                // set the active branch as active
                this.serial.branches[branch] = shouldBeActive
            }
        })
        // if (this.isSingle && activeBranch == null) toastError(`❌ No active branch found for single choice widget "${this.config.label}"`)
    }

    disableBranch(branch: keyof T & string): void {
        // ensure branch to disable is enabled
        if (!this.enabledBranches[branch]) {
            return // console.info(`❌ Branch "${branch}" not enabled`)
        }
        this.runInValueTransaction(() => {
            // remove children
            const prevChild = this.enabledBranches[branch]
            if (prevChild) prevChild.disposeTree()
            delete this.enabledBranches[branch]

            // WE NEED TO KEEP THIS ONE UNLESS WE WANT TO DISCARD THE DRAFT
            // we could make this opt-in via a config flag and persist in memory only via enableBranch
            // delete this.serial.values_[branch]

            this.serial.branches[branch] = false
        })
    }

    enableBranch<K extends keyof T & string>(
        //
        branch: K,
        // 🔴 VVV what is that ?
        p: { forceSubtree?: boolean } = {},
    ): Maybe<T[K]['$Field']> {
        // ensure branch to enable is disabled
        const existingChild = this.enabledBranches[branch]
        if (this.enabledBranches[branch]) {
            return void console.info(`❌ Branch "${branch}" already enabled`)
        }

        this.runInValueTransaction(() => {
            if (!this.config.multi) {
                for (const key in this.enabledBranches) {
                    this.disableBranch(key)
                }
            }

            // first: quick safety net to check against schema changes
            // a. re-create an empty item to check it's schema
            let schema = this.config.items[branch]
            if (typeof schema === 'function') schema = (schema as any)() // 💊 temporary backward compat
            if (schema == null) throw new Error(`❌ Branch "${branch}" has no initializer function`)

            this.RECONCILE({
                correctChildSchema: schema,
                existingChild: this.enabledBranches[branch],
                targetChildSerial: this.serial.values?.[branch],
                attach: (child) => {
                    this.enabledBranches[branch] = child
                    this.serial.values[branch] = child.serial
                },
            })

            // set the active branch as active
            this.serial.branches[branch] = true
        })

        return this.enabledBranches[branch]
    }

    /** results, but only for active branches */
    get value(): Field_choices_value<T> {
        const out: Field_choices_value<T> = {}
        for (const branch in this.enabledBranches) {
            out[branch] = this.enabledBranches[branch]!.value
        }
        return out
    }

    set value(val: Field_choices_value<T>) {
        this.runInValueTransaction(() => {
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
        })
    }
}

// DI
registerFieldClass('choices', Field_choices)
