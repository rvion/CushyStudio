import type { ErrorConfigValue } from '../../errors/extractConfig'
import type { CSchema } from '../../model/CSchema'
import type { FieldConstructor } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { SelectValueSlots } from '../../select/SelectState'
import type { TabPositionConfig } from '../choices/TabPositionConfig'
import type { SelectKey } from '../selectOne/SelectOneKey'
import type { SelectOption } from '../selectOne/SelectOption'

import { csuiteConfig } from '../../config/configureCsuite'
import { extractConfigMessage, extractConfigValue } from '../../errors/extractConfig'
import { Field } from '../../model/Field'
import { isProbablySerialSelectMany, registerFieldClass } from '../WidgetUI.DI'

export type SelectManyAppearance = 'select' | 'tab' | 'list'

/**
 * for when all mappers are deductibles because the builder function
 * already imply the mapping logic. (variant for when key === value)
 *
 * (same as `Field_selectMany_config_simplified` for when value is the same as key)
 *
 * @since 2024-08-26
 */

export type Field_selectMany_config_simplified_<KEY extends SelectKey> = Field_selectMany_config_simplified<
   KEY,
   KEY
>

// #region CONFIG
export type Field_selectMany_config<VALUE, KEY extends SelectKey> = Field_selectMany<VALUE, KEY>['…config']
type Field_selectMany_ownConfig<
   /** the final object that will be accessible as value */
   VALUE,
   /** type-level literal for the id */
   KEY extends SelectKey,
> = {
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
   createOption?: {
      label?: () => string
      isActive?: () => boolean
      action: () => Promise<Maybe<SelectOption<VALUE, KEY>>>
   }
   selectAll?: (self: Field_selectMany<VALUE, KEY>) => void
   getIdFromValue: (t: VALUE) => KEY
   getValueFromId: (t: KEY, field: Field_selectMany<VALUE, KEY>) => Maybe<VALUE>
   getOptionFromId: (t: KEY, field: Field_selectMany<VALUE, KEY>) => Maybe<SelectOption<VALUE, KEY>>
   /** set this to true if your choices are dynamically generated from the query directly, to disable local filtering */
   disableLocalFiltering?: boolean
   appearance?: SelectManyAppearance
   OptionLabelUI?: (
      //
      t: Maybe<SelectOption<VALUE, KEY>>,
      where: SelectValueSlots,
   ) => React.ReactNode

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
   minLength?: ErrorConfigValue<number>
}

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
export type Field_selectMany_config_simplified<VALUE, KEY extends SelectKey> = Omit2<
   Field_selectMany_config<VALUE, KEY>,
   'choices' | 'getIdFromValue' | 'getOptionFromId' | 'getValueFromId'
>

type Omit2<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// SERIAL
export type Field_selectMany_serial<KEY extends SelectKey> = Field_selectMany<unknown, KEY>['…serial']
type Field_selectMany_ownSerial<KEY extends SelectKey> = {
   $: 'selectMany'
   query?: string
   // 💬 2024-08-20 rvion: TODO: rename as keys ?
   values?: KEY[]
}

// VALUE
export type Field_selectMany_value<VALUE extends any> = VALUE[]
export type Field_selectMany_unchecked<VALUE extends any> = Field_selectMany_value<VALUE>

// TYPES
export interface Field_selectMany<
   //
   VALUE extends unknown,
   KEY extends SelectKey,
> extends Field {
   ['…type']: 'selectMany'
   ['…ownConfig']: Field_selectMany_ownConfig<VALUE, KEY>
   ['…ownSerial']: Field_selectMany_ownSerial<KEY>
   ['…value']: Field_selectMany_value<VALUE>
   ['…setvalue']: VALUE[] | KEY[]
   ['…unchecked']: Field_selectMany_unchecked<VALUE>
   ['…child']: never
   ['…opts']: unknown
   ['…ownPatch']: Patch<'selectMany'>
}

// #region STATE
export type Field_selectMany_<KEY extends SelectKey> = Field_selectMany<KEY, KEY>

export class Field_selectMany<
   //
   VALUE extends unknown,
   KEY extends SelectKey,
> extends Field {
   // #region TYPE
   static readonly type: 'selectMany' = 'selectMany'
   static readonly unsetSerial: Field_selectMany_serial<any> = { $: 'selectMany' }
   static readonly codeForTypescriptValue = (config: Field_selectMany_config<any, any>): string =>
      'Z.SelectMany<❓>'

   static override migrateSerial<K extends SelectKey>(serial: object): Maybe<Field_selectMany_serial<K>> {
      if (isProbablySerialSelectMany(serial)) {
         const { $, values, ...rest } = serial
         // 2024-08-02: support previous serial format which stored SelectOption<VALUE>.
         const legacyValues = values as object[] | undefined
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

   static generateSerial<VALUE, KEY extends SelectKey>(
      value: Maybe<Field_selectMany<VALUE, KEY>['…value']>,
      config: Field_selectMany<VALUE, KEY>['…config'],
   ): Field_selectMany<VALUE, KEY>['…serial'] {
      if (value == null && config.default == null) return this.unsetSerial

      const defaultSelectedKeys = Array.isArray(config.default)
         ? config.default
         : config.default != null
           ? [config.default]
           : []

      return {
         $: 'selectMany',
         values: value != null ? value.map((v) => config.getIdFromValue(v)) : defaultSelectedKeys,
      }
   }

   // #region UI
   override get isCollapsedByDefault(): boolean {
      return true
   }

   override get isCollapsible(): boolean {
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

   override reset(): void {
      this.selectedKeys = this.defaultKeys ?? []
   }

   wrap: boolean

   get query(): string {
      return this.serial.query ?? ''
   }

   set query(next: string) {
      this.runInTransaction(() => {
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
      // return locoFront != null // 🔴 pick a better logic ? add config flag ?
      return false
   }

   get ownTypeSpecificProblems(): Maybe<string[]> {
      // when field is not set, no specific error yet; FieldNotSet error will already
      // be thrown elsewhere
      if (this.serial.values == null) return null

      const errors: string[] = []
      const min = extractConfigValue(this.config.minLength)
      if (min === 1 && this.serial.values.length === 0)
         errors.push(
            extractConfigMessage(
               this.config.minLength,

               csuiteConfig.i18n.err.selectMany.required(),
            ),
         )
      else if (min != null && this.serial.values.length < min)
         errors.push(
            extractConfigMessage(
               this.config.minLength,
               csuiteConfig.i18n.err.selectMany.notEnoughValues({ min }),
            ),
         )

      if (this.shouldValidateThatValueIsAmongstKeys) {
         for (const selectedKey of this.selectedKeys) {
            const found = this.possibleKeys.find((possibleKey) => possibleKey === selectedKey)
            if (found === undefined) {
               const option = this.getOptionFromId(selectedKey)
               if (option == null)
                  errors.push(
                     `value ${selectedKey} (label: unknown, could not retrieve option) not in choices`,
                  )
               else errors.push(`value ${option.id} (label: ${option.label}) not in choices`)
            }
         }
      }
      if (errors.length > 0) return errors
      return
   }

   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_selectMany<VALUE, KEY>>,
      initialMountKey: string,
      serial?: Field_selectMany_serial<KEY>,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.wrap = this.config.wrap ?? false
      this.init(serial)
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
      this.runInTransaction(() =>
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
      this.runInTransaction(() =>
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
      this.runInTransaction(() => {
         for (const value of values) {
            this.addValue(value)
         }
      })
   }

   // KEY extends SelectKey
   // see: src/cushy-forms/src/csuite/fields/selectOne/SelectOneKey.ts,
   private isProbablyValidKey(val: unknown): val is KEY {
      if (val === null) return true
      if (typeof val === 'string') return true
      if (typeof val === 'number') return true
      if (typeof val === 'boolean') return true
      // TODO: better checks;
      // TODO: use statically known list of keys when present to quickly check if it's a valid key.
      return false
   }

   override set(valOrKey: VALUE[] | KEY[]): this {
      if (valOrKey.length === 0) this.selectedKeys = []
      else if (this.isProbablyValidKey(valOrKey[0])) this.selectedKeys = valOrKey as KEY[]
      else this.value = valOrKey as VALUE[]
      return this
   }

   override getSetValue(): this['…setvalue'] | undefined {
      // console.log(`[💀 getSetValue] `, this.path)
      return this.selectedKeys
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

            // skip mobx stuff
            if (prop === 'isMobXAtom') return (this.selectedValues as any)[prop]
            if (prop === 'isMobXReaction') return (this.selectedValues as any)[prop]
            if (prop === 'isMobXComputedValue') return (this.selectedValues as any)[prop]

            // handle numbers (1) and number-like ('1')
            if (parseInt(prop, 10) === +prop) return this.selectedValueAt(+prop)

            // whitelist/blacklist some methods
            // (todo: test; review; then add more to the list)
            if (prop === 'push') return this.pushValue.bind(this)
            if (prop === 'splice') throw new Error(`you can't manipulate the FieldSelectMany value directly, please use internal api instead`) // prettier-ignore

            if (prop === 'length') return this.selectedKeys.length
            if (prop === 'includes') return (...args: [any, any]) => this.selectedValues.includes(...args)
            if (prop === 'forEach') return (...args: [any, any]) => this.selectedValues.forEach(...args)
            if (prop === 'map') return (...args: [any, any]) => this.selectedValues.map(...args)
            if (prop === 'slice') return (...args: [any, any]) => this.selectedValues.slice(...args)
            if (prop === 'filter') return (...args: [any, any]) => this.selectedValues.filter(...args)
            if (prop === 'find') return (...args: [any, any]) => this.selectedValues.find(...args)
            if (prop === 'some') return (...args: [any, any]) => this.selectedValues.some(...args)
            if (prop === 'concat') return (...args: any[]) => this.selectedValues.concat(...args)
            if (prop === 'sort') return (...args: [any]) => this.selectedValues.sort(...args)
            if (prop === 'join') return (...args: [any]) => this.selectedValues.join(...args)
            if (prop === 'toSorted') return (...args: [any]) => this.selectedValues.toSorted(...args)
            if (prop === 'toJSON') return undefined
            if (prop === 'constructor') return Reflect.get(_, prop)
            if (prop === 'hasOwnProperty') return Reflect.get(this.selectedValues, prop)
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
                  this.runInTransaction(() => {
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

   override isValueEqual(other: Field): boolean {
      if (!(other instanceof Field_selectMany)) return false
      return JSON.stringify(this.serial.values) === JSON.stringify(other.serial.values)
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['values'])

   /** different from reset; doesn't take default into account */
   unset(): void {
      this.runInTransaction(() => {
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

      this.runInTransaction(() => {
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
      return this.selectedKeys.map(this.getOptionFromId).filter((x) => x != null) as SelectOption<
         VALUE,
         KEY
      >[]
   }

   // see FieldSelectOne.getValueFromId notes
   getValueFromId = (id: KEY): Maybe<VALUE> => this.config.getValueFromId(id, this)
   getOptionFromId = (id: KEY): Maybe<SelectOption<VALUE, KEY>> => this.config.getOptionFromId(id, this)

   private get selectedValues(): VALUE[] {
      return this.selectedKeys.map(this.getValueFromId).filter((x) => x != null) as VALUE[]
   }

   private selectedValueAt(index: number): Maybe<VALUE> {
      if (index < 0 || index >= this.selectedKeys.length) return null
      return this.getValueFromId(this.selectedKeys[index]!)
   }

   // 🔶 do not compare queries
   override get isDirtyFromSnapshot_UNSAFE(): boolean {
      const { snapshot, ...currentSerial } = this.serial
      if (snapshot == null) return false
      return JSON.stringify(snapshot.values) !== JSON.stringify(currentSerial.values)
   }

   /**
    * TODO: add distribution config in the config
    * pick between 0 and 2 random values
    */
   override randomize(): void {
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

   override get isEmpty(): boolean {
      return this.selectedKeys.length === 0
   }
}

// DI
registerFieldClass('selectMany', Field_selectMany)
Field_selectMany satisfies FieldConstructor<Field_selectMany<any, any>>
