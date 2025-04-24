import type { ErrorConfigValue } from '../../errors/extractConfig'
import type { CSchema } from '../../model/CSchema'
import type { FieldConstructor } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { SelectValueSlots } from '../../select/SelectState'
import type { TabPositionConfig } from '../choices/TabPositionConfig'
import type { AnySelectValue, SelectKey } from '../selectOne/SelectOneKey'
import type { SelectOption } from '../selectOne/SelectOption'

import { computed } from 'mobx'

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
 */

export type Field_selectMany_config_simplified_<KEY extends SelectKey> = Field_selectMany_config_simplified<
   KEY,
   KEY
>

// #region CONFIG
export type Field_selectMany_config<VALUE, KEY extends SelectKey> = Field_selectMany<VALUE, KEY>['{config}']
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
   default?: KEY[]
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
   // todo: remove
   OptionLabelUI?: (
      //
      t: Maybe<SelectOption<VALUE, KEY>>,
      where: SelectValueSlots,
      self: Field_selectMany<VALUE, KEY>,
   ) => React.ReactNode

   /** allow to wrap the list of values if they take more than 1 SLH (standard line height) */
   wrap?: boolean
   wrapButton?: boolean

   /** @deprecated use global csuite config instead */
   tabPosition?: TabPositionConfig
   placeholder?: string
   minLength?: ErrorConfigValue<number>
}

/** for when key === value is a string */
export type Field_selectMany_config_<KEY extends SelectKey> = Field_selectMany_config<KEY, KEY>

/**
 * for when all mappers are deductibles because the builder function
 * already imply the mapping logic.
 */
export type Field_selectMany_config_simplified<VALUE, KEY extends SelectKey> = Omit2<
   Field_selectMany_config<VALUE, KEY>,
   'choices' | 'getIdFromValue' | 'getOptionFromId' | 'getValueFromId'
>

type Omit2<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// SERIAL
export type Field_selectMany_serial<KEY extends SelectKey> = Field_selectMany<unknown, KEY>['{serial}']
type Field_selectMany_ownSerial<KEY extends SelectKey> = {
   $: 'selectMany'
   query?: string
   values?: KEY[]
}

// TYPES
export interface Field_selectMany<
   //
   VALUE extends unknown,
   KEY extends SelectKey,
> extends Field {
   '{type}': 'selectMany'
   '{ownConfig}': Field_selectMany_ownConfig<VALUE, KEY>
   '{ownSerial}': Field_selectMany_ownSerial<KEY>
   '{value}': VALUE[]
   '{setValue}': VALUE[] | KEY[] | { $$KEYS: KEY[] } | { $$VALUES: VALUE[] }
   '{unchecked}': VALUE[]
   '{child}': never
   '{opts}': unknown
   '{ownPatch}': Patch<'selectMany'>
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

   static generateSerial(
      setValue_: Maybe<Field_selectMany<AnySelectValue, SelectKey>['{setValue}']>,
      config: Field_selectMany<any, any>['{config}'],
   ): Field_selectMany<any, any>['{serial}'] {
      // always use `setValue_` if provided, or `config.default` otherwise
      const setValue =
         setValue_ != null //
            ? setValue_
            : config.default

      // case undefined --------------------------------------------------------
      if (setValue == undefined) {
         return this.unsetSerial
      }

      if (Array.isArray(setValue)) {
         // case empty array ---------------------------------------------------
         if (setValue.length === 0) {
            return { $: 'selectMany', values: [] }
         }

         // case array of keys -------------------------------------------------
         else if (this.isProbablyValidKey<SelectKey>(setValue[0]!)) {
            return { $: 'selectMany', values: setValue as SelectKey[] }
         }
         //
         else {
            // case array of values --------------------------------------------
            const keys = (setValue as AnySelectValue[]).map(config.getIdFromValue)
            if (this.isProbablyValidKey<SelectKey>(keys[0])) {
               return { $: 'selectMany', values: keys }
            }

            // case ERROR 1-----------------------------------------------------
            else {
               throw new Error('invalid setValue for Field_selectMany schema')
            }
         }
      }
      //
      else if (typeof setValue === 'object' && setValue != null) {
         // case { $$KEYS } ----------------------------------------------------
         if (setValue != null && '$$KEYS' in setValue) {
            const keys = setValue.$$KEYS as SelectKey[]
            return { $: 'selectMany', values: keys }
         }

         // case { $$VALUES } --------------------------------------------------
         else if (setValue != null && '$$VALUES' in setValue) {
            const keys = (setValue.$$VALUES as AnySelectValue[]).map(config.getIdFromValue)
            if (Field_selectMany.isProbablyValidKey<SelectKey>(keys[0]!)) {
               return { $: 'selectMany', values: keys }
            }

            // case ERROR 2 --------------------------------------------------------
            else {
               throw new Error(`FieldSelectMany.set: invalid value ${JSON.stringify(setValue)}`)
            }
         }
      }

      // case ERROR 3 --------------------------------------------------------------
      throw new Error(`FieldSelectMany.set: invalid value ${JSON.stringify(setValue)}`)
   }

   // #region UI
   override get zIsCollapsedByDefault(): boolean {
      return true
   }

   override get zIsCollapsible(): boolean {
      // return true // 🚂 we disabled this
      return false
   }

   get defaultKeys(): KEY[] | undefined {
      const def = this.zConfig.default
      if (def === undefined) return
      return Array.isArray(def) ? def : [def]
   }

   get zIsOwnSet(): boolean {
      return this.zSerial.values != null
   }

   get zHasChanges(): boolean {
      if (this.zSerial.values == null) return false
      const def = this.defaultKeys
      if (def == null) return this.zSerial.values.length > 0
      if (this.zSerial.values.some((id) => !def.includes(id))) return true
      return false
   }

   override zReset(): void {
      this.selectedKeys = this.defaultKeys ?? []
   }

   wrap: boolean

   get query(): string {
      return this.zSerial.query ?? ''
   }

   set query(next: string) {
      this.zRunInTransaction(() => {
         this.zPatchSerial((draft) => void (draft.query = next))
      })
   }

   // todo: remove - do  not belong here
   @computed get OptionLabelUI():
      | ((t: Maybe<SelectOption<VALUE, KEY>>, where: SelectValueSlots) => React.ReactNode)
      | undefined {
      // no prop => do nothing
      if (this.zConfig.OptionLabelUI == null) return
      // prop => bind to self
      return (t: Maybe<SelectOption<VALUE, KEY>>, where: SelectValueSlots): React.ReactNode =>
         this.zConfig.OptionLabelUI!(t, where, this)
   }

   get possibleKeys(): KEY[] {
      const _choices = this.zConfig.choices
      // 2024-08-02: domi: 🔴 select all is dangerous for models
      // because it will evaluate choices in the backend...
      return typeof _choices === 'function' //
         ? _choices(this)
         : _choices
   }

   get options(): SelectOption<VALUE, KEY>[] {
      return this.possibleKeys.map((key) => this.getOptionFromId(key)).filter((opt) => opt != null)
   }

   get zOwnConfigSpecificProblems(): Maybe<string[]> {
      if (Array.isArray(this.zConfig.choices)) {
         if (this.zConfig.choices.length === 0) return ['no choices availble from the config']
      }
      // const invalidDefaults = this.defaultKeys?.filter((key) => !this.possibleKeys.includes(key))
      return null
   }

   get shouldValidateThatValueIsAmongstKeys(): boolean {
      return true
      if (Array.isArray(this.zConfig.choices)) return true
      // return locoFront != null // 🔴 pick a better logic ? add config flag ?
      return false
   }

   get zOwnTypeSpecificProblems(): Maybe<string[]> {
      // when field is not set, no specific error yet; FieldNotSet error will already
      // be thrown elsewhere
      if (this.zSerial.values == null) return null

      const errors: string[] = []
      const min = extractConfigValue(this.zConfig.minLength)
      if (min === 1 && this.zSerial.values.length === 0)
         errors.push(
            extractConfigMessage(
               this.zConfig.minLength,

               csuiteConfig.i18n.err.selectMany.required(),
            ),
         )
      else if (min != null && this.zSerial.values.length < min)
         errors.push(
            extractConfigMessage(
               this.zConfig.minLength,
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
      this.wrap = this.zConfig.wrap ?? false
      this.init(serial)
   }

   protected zSetOwnSerial(next: Field_selectMany_serial<KEY>): void {
      this.zAssignNewSerial(next)

      if (this.zSerial.values == null) {
         const def = this.defaultKeys
         if (def != null) this.zPatchSerial((draft) => void (draft.values = def))
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
      const values = this.zSerial.values
      if (values == null) return
      this.zRunInTransaction(() =>
         this.zPatchSerial((draft) => {
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
      this.zRunInTransaction(() =>
         this.zPatchSerial((draft) => {
            draft.values ??= [] // adding a new key means we're being set
            draft.values.push(key)
         }),
      )
   }

   addValue(value: VALUE): void {
      const key = this.zConfig.getIdFromValue(value)
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
      return this.zSerial.values?.includes(key) ?? false
   }

   hasKey(key: KEY): boolean {
      return this.possibleKeys.includes(key)
   }

   hasValue(value: VALUE): boolean {
      const valueId = this.zConfig.getIdFromValue(value)
      return this.hasKey(valueId)
   }

   /**
    * alias to `hasValue`
    * @see {@link hasValue}
    */
   has = this.hasValue

   pushValue(...values: VALUE[]): void {
      this.zRunInTransaction(() => {
         for (const value of values) {
            this.addValue(value)
         }
      })
   }

   // KEY extends SelectKey
   // see: src/cushy-forms/src/csuite/fields/selectOne/SelectOneKey.ts,
   private static isProbablyValidKey<KEY>(val: unknown): val is KEY {
      if (val === null) return true
      if (typeof val === 'string') return true
      if (typeof val === 'number') return true
      if (typeof val === 'boolean') return true
      // TODO: better checks;
      // TODO: use statically known list of keys when present to quickly check if it's a valid key.
      return false
   }

   override zSet(valOrKey: this['{setValue}']): this {
      if (Array.isArray(valOrKey)) {
         // empty array
         if (valOrKey.length === 0) this.selectedKeys = []
         //
         else if (Field_selectMany.isProbablyValidKey<KEY>(valOrKey[0])) {
            this.selectedKeys = valOrKey as KEY[]
         } else this.zValue = valOrKey as VALUE[]
      }
      //
      else if (typeof valOrKey === 'object' && valOrKey != null) {
         if (valOrKey != null && '$$KEYS' in valOrKey) {
            this.selectedKeys = valOrKey.$$KEYS as KEY[]
         } else if (valOrKey != null && '$$VALUES' in valOrKey) {
            this.zValue = valOrKey.$$VALUES as VALUE[] // prettier-ignore
         } else {
            throw new Error(`FieldSelectMany.set: invalid value ${JSON.stringify(valOrKey)}`)
         }
      }

      return this
   }

   override zGetSetValue(): this['{setValue}'] | undefined {
      // console.log(`[💀 getSetValue] `, this.path)
      return this.selectedKeys
   }

   /** only here to avoid copy-pasting the implementation twice */
   private zValue__setter(next: VALUE[]) {
      this.selectedKeys = next.map((val) => this.zConfig.getIdFromValue(val))
   }

   set zValue(next: VALUE[]) { this.zValue__setter(next) } // prettier-ignore
   get zValue(): VALUE[] {
      const value = new Proxy([], this.makeValueProxy())
      void this.zSerial
      Object.defineProperty(this, 'zValue', {
         get: () => (void this.zSerial, value),
         set: (next: VALUE[]) => this.zValue__setter(next),
      })
      return value
   }

   get zValueOrZero(): VALUE[] {
      return this.zValue
   }
   get zValueUnchecked(): VALUE[] {
      return this.zValue
   }

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
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (prop === 'filter') return (...args: [any, any]) => this.selectedValues.filter(...args)
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (prop === 'find') return (...args: [any, any]) => this.selectedValues.find(...args)
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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

               const newKey = this.zConfig.getIdFromValue(value)
               if (prevKey == null) {
                  // 🔴 weird to assign at 3 but append at the end 🤔 ❓
                  this.addKey(newKey)
               } else if (prevKey != null) {
                  if (prevKey === newKey) return false // nothing to do
                  this.zRunInTransaction(() => {
                     this.removeKey(prevKey)
                     this.addKey(newKey)
                  })
               }
            }
            return false
         },
      }
   }

   zMoveKeyByIndex(sourceIx: number, targetIx: number): this {
      if (this.zSerial.values == null) return this // not-set
      if (sourceIx < 0 || sourceIx >= this.selectedKeys.length) return this // out-of-bounds
      if (targetIx < 0 || targetIx >= this.selectedKeys.length) return this // out-of-bounds

      const sourceKey = this.selectedKeys[sourceIx]!
      return this.zMoveKeyImpl__(sourceIx, targetIx, sourceKey)
   }
   zMoveKeyByName(sourceKey: KEY, targetKey: KEY): this {
      if (this.zSerial.values == null) return this // not-set

      const sourceIx = this.selectedKeys.findIndex((key) => key === sourceKey)
      const targetIx = this.selectedKeys.findIndex((key) => key === targetKey)
      if (sourceIx === -1 || targetIx === -1) return this // not-found

      return this.zMoveKeyImpl__(sourceIx, targetIx, sourceKey)
   }

   private zMoveKeyImpl__(sourceIx: number, targetIx: number, sourceKey: KEY): this {
      this.zPatchInTransaction((next) => {
         const keys: KEY[] = next.values!
         keys.splice(sourceIx, 1)
         keys.splice(targetIx, 0, sourceKey)
         next.values = keys
      })
      return this
   }

   get zHasInvalidKeys(): boolean {
      // re-implemented without using zInvalidKeysInSerial to allow for
      // an early abort and avoid as-many calls as possible
      if (!this.zIsSet) return false
      const allKeys = this.zSerial.values
      if (allKeys == null || allKeys.length === 0) return false
      const possibleKeys = this.possibleKeys
      for (const key of allKeys) if (!possibleKeys.includes(key)) return true
      return false
   }

   get zInvalidKeysInSerial(): KEY[] {
      const allKeys = this.zSerial.values ?? []
      const possibleKeys = this.possibleKeys
      const invalidKeys = allKeys.filter((key) => !possibleKeys.includes(key))
      return invalidKeys
   }
   zRemoveLegacySelectManyValues(): void {
      const possibleKeys = this.possibleKeys
      this.zPatchInTransaction((next) => {
         next.values = next.values?.filter((key) => possibleKeys.includes(key))
      })
   }

   override zIsValueEqual(other: Field): boolean {
      if (!(other instanceof Field_selectMany)) return false
      return JSON.stringify(this.zSerial.values) === JSON.stringify(other.zSerial.values)
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['values'])

   /** different from reset; doesn't take default into account */
   unset(): void {
      this.zRunInTransaction(() => {
         this.zPatchSerial((draft) => void (draft.values = undefined))
      })
   }

   get selectedKeys(): KEY[] {
      if (this.zSerial.values == null) return []
      return [...this.zSerial.values]
   }

   set selectedKeys(nextKeys: KEY[]) {
      const values = this.zSerial.values

      // Avoid patching when no-op
      if (
         values != null && //
         values.length === nextKeys.length &&
         values.every((v, i) => v === nextKeys[i])
      )
         return

      this.zRunInTransaction(() => {
         this.zPatchSerial((draft) => void (draft.values = [...nextKeys]))

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
   getValueFromId = (id: KEY): Maybe<VALUE> => this.zConfig.getValueFromId(id, this)
   getOptionFromId = (id: KEY): Maybe<SelectOption<VALUE, KEY>> => this.zConfig.getOptionFromId(id, this)

   private get selectedValues(): VALUE[] {
      return this.selectedKeys.map(this.getValueFromId).filter((x) => x != null) as VALUE[]
   }

   private selectedValueAt(index: number): Maybe<VALUE> {
      if (index < 0 || index >= this.selectedKeys.length) return null
      return this.getValueFromId(this.selectedKeys[index]!)
   }

   // 🔶 do not compare queries
   override get zIsDirtyFromSnapshot_UNSAFE(): boolean {
      const { snapshot, ...currentSerial } = this.zSerial
      if (snapshot == null) return false
      return JSON.stringify(snapshot.values) !== JSON.stringify(currentSerial.values)
   }

   /**
    * TODO: add distribution config in the config
    * pick between 0 and 2 random values
    */
   override zRandomize(): void {
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
Field_selectMany satisfies FieldConstructor<Field_selectMany<any, any>>
