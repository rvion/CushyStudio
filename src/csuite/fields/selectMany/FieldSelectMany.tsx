import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { SelectValueLooks } from '../../select/SelectProps'
import type { TabPositionConfig } from '../choices/TabPositionConfig'
import type { SELECT_ID, SelectOption } from '../selectOne/FieldSelectOne'
import type { SelectValueSlots } from 'src/cushy-forms/main'

import { Field } from '../../model/Field'
import { potatoClone } from '../../utils/potatoClone'
import { registerFieldClass } from '../WidgetUI.DI'
import { WidgetSelectManyUI } from './WidgetSelectManyUI'
import { stableStringify } from 'src/cushy-forms/src/csuite/hashUtils/hash'

export type SelectManyAppearance = 'select' | 'tab' | 'list'
// CONFIG
export type Field_selectMany_config<VALUE> = FieldConfig<
    {
        /**
         * 🔶 the *IDs* of the options selected by default
         * true: all options selected
         */
        default?: SELECT_ID[] | SELECT_ID | true
        /**
         * list of all choices
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
        choices: SELECT_ID[] | ((self: Field_selectMany<VALUE>) => SELECT_ID[])
        getIdFromValue: (t: VALUE) => SELECT_ID
        getValueFromId: (t: SELECT_ID) => Maybe<VALUE>
        getOptionFromId: (t: SELECT_ID, field: Field_selectMany<VALUE>) => Maybe<SelectOption<VALUE>>
        /** set this to true if your choices are dynamically generated from the query directly, to disable local filtering */
        disableLocalFiltering?: boolean
        appearance?: SelectManyAppearance
        OptionLabelUI?: (t: Maybe<SelectOption<VALUE>>, where: SelectValueSlots) => React.ReactNode | SelectValueLooks

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
    Field_selectMany_types<VALUE>
>

// SERIAL
export type Field_selectMany_serial = FieldSerial<{
    $: 'selectMany'
    query: string
    values: SELECT_ID[]
}>

// SERIAL FROM VALUE
// 🔴 this is not possible anymore, we need the base select entry to get the id.
// not sure if important
// export const Field_selectMany_fromValue = <T extends any>(val: Field_selectMany_value<T>): Field_selectMany_serial => ({
//     $: 'selectMany',
//     query: '',
//     values,
// })

// VALUE
export type Field_selectMany_value<VALUE extends any> = VALUE[]

// TYPES
export type Field_selectMany_types<VALUE extends any> = {
    $Type: 'selectMany'
    $Config: Field_selectMany_config<VALUE>
    $Serial: Field_selectMany_serial
    $Value: Field_selectMany_value<VALUE> // 🔴 not sure if we need nullability since it's an array
    $Field: Field_selectMany<VALUE>
}

// STATE
export class Field_selectMany<VALUE extends any> extends Field<Field_selectMany_types<VALUE>> {
    static readonly type: 'selectMany' = 'selectMany'
    DefaultHeaderUI = WidgetSelectManyUI
    // DefaultBodyUI = WidgetSelectMany_ListUI
    DefaultBodyUI = undefined

    get isCollapsedByDefault(): boolean {
        return true
    }

    get isCollapsible(): boolean {
        // return true // 🚂 we disabled this
        return false
    }

    get defaultIds(): SELECT_ID[] {
        // 2024-08-02: domi: 🔴 select all is dangerous for models
        // because it will evaluate choices in the backend...
        if (this.config.default === true) return this.choices
        if (typeof this.config.default === 'string') return [this.config.default]
        return this.config.default ?? []
    }

    get hasChanges(): boolean {
        if (this.serial.values.length !== this.defaultIds.length) return true
        for (const id of this.serial.values) {
            if (!this.defaultIds.find((i) => i === id)) return true
        }
        return false
    }

    reset(): void {
        this.selectedIds = this.defaultIds
    }

    wrap = this.config.wrap ?? false

    get choices(): SELECT_ID[] {
        const _choices = this.config.choices
        return typeof _choices === 'function' //
            ? _choices(this)
            : _choices
    }

    get options(): SelectOption<VALUE>[] {
        return this.choices.map((id) => this.getOptionFromId(id)).filter((x) => x != null) as SelectOption<VALUE>[]
    }

    get ownProblems(): Maybe<string[]> {
        if (this.serial.values == null) return null
        const errors: string[] = []
        for (const id of this.selectedIds) {
            if (!this.choices.find((choice) => choice === id)) {
                const option = this.getOptionFromId(id)
                if (option == null) errors.push(`value ${id} (label: unknown, could not retrieve option) not in choices`)
                else errors.push(`value ${option.id} (label: ${option.label}) not in choices`)
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
        schema: BaseSchema<Field_selectMany<VALUE>>,
        serial?: Field_selectMany_serial,
    ) {
        super(repo, root, parent, schema)
        const config = schema.config
        /* 💊 */ if (this.serial.values == null) this.serial.values = []
        this.init(serial, {
            DefaultHeaderUI: false,
            DefaultBodyUI: false,
        })
    }

    protected setOwnSerial(serial: Maybe<Field_selectMany_serial>): void {
        this.serial.query = serial?.query ?? ''

        let prevVal = serial?.values
        // 2024-08-02: support previous serial format which stored SelectOption<VALUE>.
        if (
            prevVal &&
            Array.isArray(prevVal) &&
            prevVal.length > 0 &&
            typeof prevVal[0] === 'object' &&
            prevVal[0] != null &&
            'id' in prevVal[0]
        ) {
            prevVal = prevVal.map((v) => (v as unknown as { id: string }).id).filter(Boolean)
        }

        const finalVal = prevVal ?? this.defaultIds
        this.serial.values = [...finalVal]
    }

    /** un-select given item */
    removeId(id: SELECT_ID): void {
        // ensure item was selected
        const indexOf = this.serial.values.findIndex((i) => i === id)
        if (indexOf < 0) return console.log(`[🔶] WidgetSelectMany.removeItem: item not found`)
        // remove it
        this.runInValueTransaction(() => {
            this.serial.values = this.serial.values.filter((v) => v !== id) // filter just in case of duplicate
        })
    }

    /** select given item */
    addId(id: SELECT_ID): void {
        // ensure item is not selected yet
        const i = this.serial.values.findIndex((i) => i === id)
        if (i >= 0) return console.log(`[🔶] WidgetSelectMany.addItem: item already in list`)
        // insert it
        this.runInValueTransaction(() => this.serial.values.push(id))
    }

    addValue(value: VALUE): void {
        const valueId = this.config.getIdFromValue(value)

        if (!valueId) return

        this.addId(valueId)
    }

    /** select item if item was not selected, un-select if item was selected */
    toggleId(id: SELECT_ID): void {
        this.runInValueTransaction(() => {
            const i = this.serial.values.findIndex((i) => i === id)
            if (i < 0) {
                this.serial.values.push(id)
            } else {
                this.serial.values = this.serial.values.filter((v) => v !== id) // filter just in case of duplicate
            }
        })
    }

    get value(): Field_selectMany_value<VALUE> {
        // return naiveDeepClone(this.serial.values)
        return [...this.selectedValues] // do we still need to clone?

        // 2024-08-01 domi: we removed that for simplicity because it gets even more intricated now that value is not an option.
        // stuff like addValue only have dubious implementations
        //
        // return cloned
        // return new Proxy(cloned as any, {
        //     get: (target, prop): any => {
        //         // ⏸️ console.log(`[GET]`, prop)
        //         if (typeof prop === 'symbol') return target[prop]

        //         if (prop === 'push') return this.addValue.bind(this)
        //         if (prop === 'slice') throw new Error(`you can't manipulate the FieldSelectMany value directly, please use internal api instead`) // prettier-ignore
        //         if (prop === 'splice') throw new Error(`you can't manipulate the FieldSelectMany value directly, please use internal api instead`) // prettier-ignore

        //         // handle numbers (1) and number-like ('1')
        //         if (parseInt(prop, 10) === +prop) {
        //             return target[+prop]
        //         }

        //         return target[prop]
        //     },
        //     set: (target, prop, value): boolean => {
        //         const msg = `[🔶] Field_selectMany.value: use .addItem() or .removeItem() instead`

        //         // alt 1. either we throw
        //         throw new Error(msg)

        //         // alt 2. either we warn and return false
        //         // console.warn(msg)
        //         // return false
        //     },
        // })
    }

    set value(next: Field_selectMany_value<VALUE>) {
        if (
            this.serial.values.length === next.length && //
            this.serial.values.every((v, i) => v === next[i])
        )
            return

        const nextIds = next.map((v) => this.config.getIdFromValue(v)).filter((x) => x != null) as SELECT_ID[]
        this.selectedIds = nextIds
    }

    get selectedIds(): SELECT_ID[] {
        return [...this.serial.values]
    }

    set selectedIds(nextIds: SELECT_ID[]) {
        if (
            this.serial.values.length === nextIds.length && //
            this.serial.values.every((v, i) => v === nextIds[i])
        )
            return

        this.runInValueTransaction(() => {
            this.serial.values = [...nextIds]

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

    get selectedOptions(): SelectOption<VALUE>[] {
        return this.selectedIds.map(this.getOptionFromId).filter((x) => x != null) as SelectOption<VALUE>[]
    }

    // see FieldSelectOne.getValueFromId notes
    getValueFromId = (id: SELECT_ID): Maybe<VALUE> => this.config.getValueFromId(id)
    getOptionFromId = (id: SELECT_ID): Maybe<SelectOption<VALUE>> => this.config.getOptionFromId(id, this)

    private get selectedValues(): VALUE[] {
        return this.selectedIds.map(this.getValueFromId).filter((x) => x != null) as VALUE[]
    }

    // 🔶 do not compare queries
    get isDirtyFromSnapshot_UNSAFE(): boolean {
        const { snapshot, ...currentSerial } = this.serial
        if (snapshot == null) return false
        return stableStringify(snapshot.values) !== stableStringify(currentSerial.values)
    }
}

// DI
registerFieldClass('selectMany', Field_selectMany)
