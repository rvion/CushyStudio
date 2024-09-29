import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { SelectValueLooks } from '../../select/SelectProps'
import type { SelectValueSlots } from '../../select/SelectState'
import type { TabPositionConfig } from '../choices/TabPositionConfig'
import type { SelectKey } from '../selectOne/SelectOneKey'
import type { SelectOption } from '../selectOne/SelectOption'

import { stableStringify } from '../../hashUtils/hash'
import { Field } from '../../model/Field'
import { isProbablySerialSelectMany, registerFieldClass } from '../WidgetUI.DI'
import { WidgetSelectManyUI } from './WidgetSelectManyUI'

export type SelectManyAppearance = 'select' | 'tab' | 'list'

/**
 * for when all mappers are deductibles because the builder function
 * already imply the mapping logic. (variant for when key === value)
 *
 * (same as `Field_selectMany_config_simplified` for when value is the same as key)
 *
 * @since 2024-08-26
 */

export type Field_selectMany_config_simplified_<KEY extends SelectKey> = Field_selectMany_config_simplified<KEY, KEY>

// #region CONFIG
export type Field_selectMany_config<
    /** the final object that will be accessible as value */
    VALUE,
    /** type-level literal for the id */
    KEY extends SelectKey,
> = FieldConfig<
    {
        /**
         * 🔶 the *IDs* of the options selected by default
         * true: all options selected
         */
        default?: KEY[] | KEY
        /**
         * list of all keys
         * 👉 you can use a lambda if you want the option to to dynamic
         *    the lambda will receive the widget instance as argument, from
         *    which you can access variosu stuff like
         *      - `self.serial.query`: the current filtering text
         *      - `self.form`: the form instance
         *      - `self.form.root`: the root of the widget
         *      - `self.parent...`: natigate the widget tree
         *      - `self.useKontext('...')`: any named dynamic chanel for cross-widget communication
         * 👉 If the list of options is generated from the query directly,
         *    you should also set `disableLocalFiltering: true`, to avoid
         *    filtering the options twice.
         */
        choices: KEY[] | ((self: Field_selectMany<VALUE, KEY>) => KEY[])
        getIdFromValue: (t: VALUE) => KEY
        getValueFromId: (t: KEY) => Maybe<VALUE>
        getOptionFromId: (t: KEY, field: Field_selectMany<VALUE, KEY>) => Maybe<SelectOption<VALUE, KEY>>
        /** set this to true if your choices are dynamically generated from the query directly, to disable local filtering */
        disableLocalFiltering?: boolean
        appearance?: SelectManyAppearance
        OptionLabelUI?: (
            //
            t: Maybe<SelectOption<VALUE, KEY>>,
            where: SelectValueSlots,
        ) => React.ReactNode | SelectValueLooks

        /**
         * @since 2024-06-24
         * allow to wrap the list of values if they take more than 1 SLH (standard line height)
         */
        wrap?: boolean
        wrapButton?: boolean

        /**
         * @since 2024-06-24
         * @deprecated use global csuite config instead
         */
        tabPosition?: TabPositionConfig
        placeholder?: string
    },
    Field_selectMany_types<VALUE, KEY>
>

/**
 * for when key === value is a string
 *
 * @since 2024-08-23
 */
export type Field_selectMany_config_<KEY extends SelectKey> = Field_selectMany_config<KEY, KEY>

/**
 * for when all mappers are deductibles because the builder function
 * already imply the mapping logic.
 *
 * @since 2024-08-26
 */
export type Field_selectMany_config_simplified<VALUE, KEY extends SelectKey> = Omit<
    Field_selectMany_config<VALUE, KEY>,
    'choices' | 'getIdFromValue' | 'getOptionFromId' | 'getValueFromId'
>

// SERIAL
export type Field_selectMany_serial<KEY extends SelectKey> = FieldSerial<{
    $: 'selectMany'
    query?: string
    // 💬 2024-08-20 rvion: TODO: rename as keys ?
    values?: KEY[]
}>

// VALUE
export type Field_selectMany_value<VALUE extends any> = VALUE[]
export type Field_selectMany_unchecked<VALUE extends any> = Field_selectMany_value<VALUE>

// TYPES
export type Field_selectMany_types<
    //
    VALUE extends any,
    KEY extends SelectKey,
> = {
    $Type: 'selectMany'
    $Config: Field_selectMany_config<VALUE, KEY>
    $Serial: Field_selectMany_serial<KEY>
    $Value: Field_selectMany_value<VALUE>
    $Unchecked: Field_selectMany_unchecked<VALUE>
    $Field: Field_selectMany<VALUE, KEY>
    $Child: never
}

// #region STATE
export type Field_selectMany_<KEY extends SelectKey> = Field_selectMany<KEY, KEY>
export class Field_selectMany<
    //
    VALUE extends any,
    KEY extends SelectKey,
> extends Field<Field_selectMany_types<VALUE, KEY>> {
    // #region TYPE
    static readonly type: 'selectMany' = 'selectMany'
    static readonly emptySerial: Field_selectMany_serial<any> = { $: 'selectMany' }
    static migrateSerial<K extends SelectKey>(serial: object): Maybe<Field_selectMany_serial<K>> {
        if (isProbablySerialSelectMany(serial)) {
            const { $, values, ...rest } = serial
            // 2024-08-02: support previous serial format which stored SelectOption<VALUE>.
            const legacyValues: object[] | undefined = values
            if (
                Array.isArray(legacyValues) &&
                legacyValues.length > 0 &&
                typeof legacyValues[0] === 'object' &&
                legacyValues[0] != null &&
                'id' in legacyValues[0]
            ) {
                const values = legacyValues.map((v) => (v as unknown as { id: K }).id).filter(Boolean)
                const next: Field_selectMany_serial<K> = {
                    $: 'selectMany',
                    values,
                    ...rest,
                }
                return next
            }
        }
    }

    // #region UI
    DefaultHeaderUI = WidgetSelectManyUI
    DefaultBodyUI = undefined
    // DefaultBodyUI = WidgetSelectMany_ListUI

    get isCollapsedByDefault(): boolean {
        return true
    }

    get isCollapsible(): boolean {
        // return true // 🚂 we disabled this
        return false
    }

    get defaultKeys(): KEY[] | undefined {
        const def = this.config.default
        if (def === undefined) return
        return Array.isArray(def) ? def : [def]
    }

    get isOwnSet(): boolean {
        return this.serial.values != null
    }

    get hasChanges(): boolean {
        if (this.serial.values == null) return false
        const def = this.defaultKeys
        if (def == null) return this.serial.values.length > 0
        if (this.serial.values.some((id) => !def.includes(id))) return true
        return false
    }

    reset(): void {
        this.selectedKeys = this.defaultKeys ?? []
    }

    wrap = this.config.wrap ?? false

    get query() {
        return this.serial.query ?? ''
    }

    set query(next: string) {
        this.runInSerialTransaction(() => {
            this.patchSerial((draft) => void (draft.query = next))
        })
    }

    get possibleKeys(): KEY[] {
        const _choices = this.config.choices
        // 2024-08-02: domi: 🔴 select all is dangerous for models
        // because it will evaluate choices in the backend...
        return typeof _choices === 'function' //
            ? _choices(this)
            : _choices
    }

    get options(): SelectOption<VALUE, KEY>[] {
        return this.possibleKeys.map((key) => this.getOptionFromId(key)).filter((opt) => opt != null)
    }

    get ownConfigSpecificProblems(): Maybe<string[]> {
        if (Array.isArray(this.config.choices)) {
            if (this.config.choices.length === 0) return ['no choices availble from the config']
        }
        // const invalidDefaults = this.defaultKeys?.filter((key) => !this.possibleKeys.includes(key))
        return null
    }

    get shouldValidateThatValueIsAmongstKeys(): boolean {
        if (Array.isArray(this.config.choices)) return true
        return false
    }

    get ownTypeSpecificProblems(): Maybe<string[]> {
        if (this.serial.values == null) return null
        const errors: string[] = []
        if (this.shouldValidateThatValueIsAmongstKeys) {
            for (const selectedKey of this.selectedKeys) {
                const found = this.possibleKeys.find((possibleKey) => possibleKey === selectedKey)
                if (found === undefined) {
                    const option = this.getOptionFromId(selectedKey)
                    if (option == null)
                        errors.push(`value ${selectedKey} (label: unknown, could not retrieve option) not in choices`)
                    else errors.push(`value ${option.id} (label: ${option.label}) not in choices`)
                }
            }
        }
        if (errors.length > 0) return errors
        return null
    }

    constructor(
        //
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<Field_selectMany<VALUE, KEY>>,
        initialMountKey: string,
        serial?: Field_selectMany_serial<KEY>,
    ) {
        super(repo, root, parent, schema, initialMountKey, serial)
        this.init(serial, {
            // UI
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
            // Values
            value_or_fail: false,
            value_or_zero: false,
            value_unchecked: false,
        })
    }

    protected setOwnSerial(next: Field_selectMany_serial<KEY>): void {
        this.assignNewSerial(next)

        if (this.serial.values == null) {
            const def = this.defaultKeys
            if (def != null) this.patchSerial((draft) => void (draft.values = def))
        }
    }

    /**
     * un-select given item
     * @deprecated use `removeKey` instead
     */
    removeId = this.removeKey
    /**
     * un-select an item with the given key
     */
    removeKey(key: KEY): void {
        if (!this.isKeySet(key)) return console.log(`[🔶] WidgetSelectMany.removeKey: key not set`)
        return this._removeExistingKey(key)
    }
    private _removeExistingKey(key: KEY): void {
        const values = this.serial.values
        if (values == null) return
        this.runInValueTransaction(() =>
            this.patchSerial((draft) => {
                draft.values = values.filter((k) => k !== key) // filter just in case of duplicate
            }),
        )
    }

    /**
     * select given item
     * @deprecated use `addKey` instead
     */
    addId = this.addKey
    /**
     * select an item with the given key
     */
    addKey(key: KEY): void {
        if (this.isKeySet(key)) return console.log(`[🔶] WidgetSelectMany.addKey: key already set`)
        this._addNewKey(key)
    }
    private _addNewKey(key: KEY): void {
        this.runInValueTransaction(() =>
            this.patchSerial((draft) => {
                draft.values ??= [] // adding a new key means we're being set
                draft.values.push(key)
            }),
        )
    }

    addValue(value: VALUE): void {
        const key = this.config.getIdFromValue(value)
        return this.addKey(key)
    }

    /**
     * @deprecated use `toggleKey` instead
     */
    toggleId = this.toggleKey

    /**
     * select an item if the corresponding key was set, or un-select it otherwise
     */
    toggleKey(key: KEY): void {
        if (this.isKeySet(key)) return this._removeExistingKey(key)
        return this._addNewKey(key)
    }

    isKeySet(key: KEY): boolean {
        return this.serial.values?.includes(key) ?? false
    }

    /**
     * @since 2024-09-03
     */
    hasKey(key: KEY): boolean {
        return this.possibleKeys.includes(key)
    }

    /**
     * @since 2024-09-03
     */
    hasValue(value: VALUE): boolean {
        const valueId = this.config.getIdFromValue(value)
        return this.hasKey(valueId)
    }

    /**
     * alias to `hasValue`
     * @since 2024-09-03
     * @see {@link hasValue}
     */
    has = this.hasValue

    /**
     * @since 2024-09-03
     */
    pushValue(...values: VALUE[]): void {
        this.runInValueTransaction(() => {
            for (const value of values) {
                this.addValue(value)
            }
        })
    }

    get value(): Field_selectMany_value<VALUE> {
        return this.value_or_fail
    }

    value_or_fail: Field_selectMany_value<VALUE> = new Proxy([], this.makeValueProxy())
    value_or_zero: Field_selectMany_value<VALUE> = this.value_or_fail
    value_unchecked: Field_selectMany_value<VALUE> = this.value_or_fail

    private makeValueProxy(): ProxyHandler<never> {
        return {
            has: (_, prop): boolean => prop in this.selectedKeys,
            get: (_, prop): any => {
                if (typeof prop === 'symbol') return (this.selectedValues as any)[prop]

                // handle numbers (1) and number-like ('1')
                if (parseInt(prop, 10) === +prop) return this.selectedValueAt(+prop)

                // whiltelist/blacklist some methods
                // (todo: test; review; then add more to the list)
                if (prop === 'push') return this.pushValue.bind(this)
                if (prop === 'splice') throw new Error(`you can't manipulate the FieldSelectMany value directly, please use internal api instead`) // prettier-ignore

                if (prop === 'length') return this.selectedKeys.length
                if (prop === 'includes') return (...args: [any, any]) => this.selectedValues.includes(...args)
                if (prop === 'forEach') return (...args: [any, any]) => this.selectedValues.forEach(...args)
                if (prop === 'map') return (...args: [any, any]) => this.selectedValues.map(...args)
                if (prop === 'concat') return (...args: any[]) => this.selectedValues.concat(...args)
                if (prop === 'slice') return (...args: [any, any]) => this.selectedValues.slice(...args)
                if (prop === 'filter') return (...args: [any, any]) => this.selectedValues.filter(...args)
                if (prop === 'toJSON') return undefined
                // 💬 2024-09-03 rvion:
                // | let's be conservative and just throw, rather to pass that to some other
                // | function we haven't properly tested/reviewed yet.
                // | return (target as any)[prop]

                throw new Error(`FieldSelectMany.value: property ${prop} not handled on the value proxy`)
            },
            set: (_, prop, value): boolean => {
                if (typeof prop === 'symbol') return false

                if (parseInt(prop, 10) === +prop) {
                    const index = +prop
                    const prevKey = this.selectedKeys[index]

                    const newKey = this.config.getIdFromValue(value)
                    if (prevKey == null) {
                        // 🔴 weird to assign at 3 but append at the end 🤔 ❓
                        this.addKey(newKey)
                    } else if (prevKey != null) {
                        if (prevKey === newKey) return false // nothing to do
                        this.runInValueTransaction(() => {
                            this.removeKey(prevKey)
                            this.addKey(newKey)
                        })
                    }
                }
                return false
            },
        }
    }

    set value(next: Field_selectMany_value<VALUE>) {
        this.selectedKeys = next.map((val) => this.config.getIdFromValue(val))
    }

    /** different from reset; doesn't take default into account */
    unset() {
        this.runInValueTransaction(() => {
            this.patchSerial((draft) => void (draft.values = undefined))
        })
    }

    get selectedKeys(): KEY[] {
        if (this.serial.values == null) return []
        return [...this.serial.values]
    }

    set selectedKeys(nextKeys: KEY[]) {
        const values = this.serial.values

        // Avoid patching when no-op
        if (
            values != null && //
            values.length === nextKeys.length &&
            values.every((v, i) => v === nextKeys[i])
        )
            return

        this.runInValueTransaction(() => {
            this.patchSerial((draft) => void (draft.values = [...nextKeys]))

            // 2024-07-08 rvion:
            // | when setting a value with equal id, we may be actually changing the SelectEntry
            // | (cached name could be different, etc.)
            // | since it's a bit complicated, let's not care today. if this cause a bug, let's improve
            // | that later

            // ⏸️ const nextHasSameID = this.value.id === next.id
            // ⏸️ if (!nextHasSameID) this.applyValueUpdateEffects()
            // ⏸️ else this.applySerialUpdateEffects()
        })
    }

    get selectedOptions(): SelectOption<VALUE, KEY>[] {
        return this.selectedKeys.map(this.getOptionFromId).filter((x) => x != null) as SelectOption<VALUE, KEY>[]
    }

    // see FieldSelectOne.getValueFromId notes
    getValueFromId = (id: KEY): Maybe<VALUE> => this.config.getValueFromId(id)
    getOptionFromId = (id: KEY): Maybe<SelectOption<VALUE, KEY>> => this.config.getOptionFromId(id, this)

    private get selectedValues(): VALUE[] {
        return this.selectedKeys.map(this.getValueFromId).filter((x) => x != null) as VALUE[]
    }

    private selectedValueAt(index: number): Maybe<VALUE> {
        if (index < 0 || index >= this.selectedKeys.length) return null
        return this.getValueFromId(this.selectedKeys[index]!)
    }

    // 🔶 do not compare queries
    get isDirtyFromSnapshot_UNSAFE(): boolean {
        const { snapshot, ...currentSerial } = this.serial
        if (snapshot == null) return false
        return stableStringify(snapshot.values) !== stableStringify(currentSerial.values)
    }

    /**
     * TODO: add distribution config in the config
     * pick between 0 and 2 random values
     */
    randomize(): void {
        const choices = this.possibleKeys
        if (choices.length === 0) return
        const numOfValuesSelected = Math.floor(Math.random() * 3)
        for (let i = 0; i < numOfValuesSelected; i++) {
            const idx = Math.floor(Math.random() * choices.length)
            const choice = choices[idx]!
            if (this.selectedKeys.includes(choice)) continue
            this.addKey(choice)
        }
    }
}

// DI
registerFieldClass('selectMany', Field_selectMany)

function removeReadonly<T>(x: T): T extends Readonly<infer X> ? X : T {
    return x as any
}

// function test(x: readonly number[]): number {
//     return x[0]!
// }
// ✅ test([1, 2, 3] as const)
// ✅ test([1, 2, 3])
