import type { PartialOmit } from '../../../types/Misc'
import type { CSchema } from '../../model/CSchema'
import type { FieldConstructor } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { SelectValueSlots } from '../../select/SelectState'
import type { TabPositionConfig } from '../choices/TabPositionConfig'
import type { CanThrow } from './CanCrash'
import type { SelectKey } from './SelectOneKey'
import type { SelectOption } from './SelectOption'

import { computed } from 'mobx'

import { stableStringify } from '../../hashUtils/hash'
import { Field } from '../../model/Field'
import { isProbablySerialSelectOne, registerFieldClass } from '../WidgetUI.DI'

export type SelectOneSkin = 'select' | 'tab' | 'roll'

// 💬 2024-08-.. domi:
// | 🔴 what about dynamic list?
// | it was complicated to add/remove status without more migration mechanism according to globi
//
// 💬 2024-08-21 rvion:
// | it shouldn't be complicated; I've done it a few times, it wasn't that hard.

export type Field_selectOne_config_simplified<VALUE, KEY extends SelectKey> = PartialOmit<
   Field_selectOne_config<VALUE, KEY>,
   'choices' | 'getIdFromValue' | 'getOptionFromId' | 'getValueFromId'
>

export type Field_selectOne_config_simplified_<KEY extends SelectKey> = PartialOmit<
   Field_selectOne_config_<KEY>,
   'choices' | 'getIdFromValue' | 'getOptionFromId' | 'getValueFromId'
>

// #region CONFIG
export type Field_selectOne_config_<KEY extends SelectKey> = Field_selectOne_config<KEY, KEY>
export type Field_selectOne_config<VALUE, KEY extends SelectKey> = Field_selectOne<VALUE, KEY>['Ҩconfig']
type Field_selectOne_ownConfig<
   //
   VALUE,
   KEY extends SelectKey,
> = {
   /** 🔶 the *ID* of the option selected by default */
   default?: KEY

   /**
    * list of all choices
    * 👉 you can use a lambda if you want the option to to dynamic
    *    the lambda will receive the widget instance as argument, from
    *    which you can access various stuff like
    *      - `self.serial.query`: the current filtering text
    *      - `self.form`: the form instance
    *      - `self.form.root`: the root of the widget
    *      - `self.parent...`: navigate the widget tree
    *      - `self.useKontext('...')`: any named dynamic channel for cross-widget communication
    * 👉 If the list of options is generated from the query directly,
    *    you should also set `disableLocalFiltering: true`, to avoid
    *    filtering the options twice.
    */
   choices?: KEY[] | ((self: Field_selectOne<VALUE, KEY>) => KEY[])
   values?: VALUE[] | ((field: Field_selectOne<VALUE, KEY>) => VALUE[])
   options?: SelectOption<VALUE, KEY>[] | ((field: Field_selectOne<VALUE, KEY>) => SelectOption<VALUE, KEY>[])
   createOption?: {
      label?: () => string
      isActive?: () => boolean
      action: () => Promise<Maybe<SelectOption<VALUE, KEY>>>
   }

   getIdFromValue: (t: VALUE) => KEY
   getValueFromId: (id: KEY, self: Field_selectOne<NoInfer<VALUE>, KEY>) => VALUE | undefined
   getOptionFromId: (t: KEY, self: Field_selectOne<NoInfer<VALUE>, KEY>) => Maybe<SelectOption<VALUE, KEY>>
   /** set this to true if your choices are dynamically generated from the query directly, to disable local filtering */
   disableLocalFiltering?: boolean
   OptionLabelUI?: (t: Maybe<SelectOption<VALUE, KEY>>, where: SelectValueSlots) => React.ReactNode
   SlotAnchorContentUI?: React.FC<{}>
   appearance?: SelectOneSkin

   /**
    * @since 2024-06-24
    * allow to wrap the list of values if they take more than 1 SLH (standard line height)
    */
   wrap?: boolean

   /**
    * @since 2024-06-24
    * @deprecated use global csuite config instead
    */
   tabPosition?: TabPositionConfig
   placeholder?: string

   /**
    * @deprecated: NOT IMPLEMENTED YET
    * see notes in FieldSelectOne_NullabilityHelper.tsx
    */
   nullable?: boolean
}

// #region SERIAL
export type Field_selectOne_serial<KEY extends SelectKey> = Field_selectOne<unknown, KEY>['Ҩserial']
type Field_selectOne_ownSerial<KEY extends SelectKey> = {
   $: 'selectOne'
   query?: string
   val?: KEY

   // 💬 2024-08-21 rvion:
   // | cache for the selected option when value is no longer there
   // | allow to keep displaying the option in most cases.
   // |
   // |> selected?: string
   // |> selectedLabel?: string
   // |> selectedIcon?: string

   /**
    * @deprecated: NOT IMPLEMENTED YET
    * 🤔🔴 important stuff to store with the value to rehydrate it without needing to re-query/instanciate stuff...
    * 1. some kind of "value is more complicated than just a string, need to store more"
    * 2. some kind of cache.
    * - nice thing is, there's an unique write entry point in set value.
    * - should we put the option in extra? it probably covers most use-cases.
    *     - that was the previous implementation (serial.val was SelectOption<string>), with the pros and cons.
    *     - except it may be clearer now that it's more of a nice-to-have cache than a core mechanism.
    * - could be passed to getIdFromValue, getOptionFromId, getValueFromId... who could decide to use the cache to quicken things when needed/available?
    *     - but how do we know if the cache should be used? some contexts we do not need accuracy or don't have access to the whole initial data:
    *          - fetching validated data from storage in back-end to do some batch processing
    *          - display temporary inacurate label in front-end before fetching the real one
    * => at the start, I was considering this to reduce the chance that value is not null when coming from the stored serial => which is ok when value is id!
    * => so probably not needed for now
    */
   extra?: any
}

// #region VALUE
export type Field_selectOne_value<VALUE extends any> = VALUE
export type Field_selectOne_unchecked<VALUE extends any> = Field_selectOne_value<VALUE> | undefined

// #region TYPES
export type Field_selectOne_<VALUE extends SelectKey> = Field_selectOne<VALUE, VALUE>
export interface Field_selectOne<
   //
   VALUE extends unknown,
   KEY extends SelectKey,
> {
   ['Ҩtype']: 'selectOne'
   ['ҨownConfig']: Field_selectOne_ownConfig<VALUE, KEY>
   ['ҨownSerial']: Field_selectOne_ownSerial<KEY>
   ['Ҩvalue']: VALUE
   ['Ҩsetvalue']: VALUE | KEY
   ['Ҩunchecked']: Field_selectOne_unchecked<VALUE>
   ['Ҩchild']: never
   ['Ҩopts']: unknown
   ['ҨownPatch']: Patch<'selectOne'>
}
export class Field_selectOne<
   //
   VALUE extends unknown,
   KEY extends SelectKey,
> extends Field {
   // #region TYPE
   static readonly type: 'selectOne' = 'selectOne'
   private static readonly unsetSerial: Field_selectOne_serial<any> = { $: 'selectOne' }
   static readonly codeForTypescriptValue = (config: Field_selectOne_config<any, any>): string => {
      if (config.choices != null && Array.isArray(config.choices)) {
         return `Z.SelectOne<${config.choices.map((i) => JSON.stringify(i)).join(' | ')}>`
      }
      return 'Z.SelectOne<❓>'
   }
   static override migrateSerial<KEY extends SelectKey>(serial: object): Maybe<Field_selectOne_serial<KEY>> {
      if (isProbablySerialSelectOne(serial)) {
         const { $, val, ...rest } = serial
         // 2024-08-02: support previous serial format which stored SelectOption<VALUE>.
         const legacyValue = val as object[] | undefined
         if (
            typeof legacyValue === 'object' && //
            legacyValue != null &&
            'id' in legacyValue
         ) {
            const next: Field_selectOne_serial<KEY> = {
               $: 'selectOne',
               val: legacyValue.id === '❌' ? undefined : (legacyValue.id as KEY),
               ...rest,
            }
            return next
         }
      }
   }

   static generateSerial(
      value: Maybe<Field_selectOne<any, any>['Ҩvalue']>,
      config: Field_selectOne<any, any>['Ҩconfig'],
   ): Field_selectOne<any, any>['Ҩserial'] {
      if (value == null && config.default == null) return this.unsetSerial

      return {
         $: 'selectOne',
         val: value != null ? config.getIdFromValue(value) : config.default,
      }
   }

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_selectOne<VALUE, KEY>>,
      initialMountKey: string,
      serial?: Field_selectOne_serial<KEY>,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region PROBLEMS
   get ϟownConfigSpecificProblems(): Maybe<string[]> {
      if (Array.isArray(this.ϟconfig.choices)) {
         if (this.ϟconfig.choices.length === 0) return ['no choices availble from the config']
      }
      // const invalidDefaults = this.defaultKeys?.filter((key) => !this.possibleKeys.includes(key))
      return null
   }

   get shouldValidateThatValueIsAmongstKeys(): boolean {
      if (Array.isArray(this.ϟconfig.choices)) return true
      // return locoFront != null // 🔴 pick a better logic ? add config flag ?
      return false
   }

   get ϟownTypeSpecificProblems(): Maybe<string[]> {
      // when field is not set, no specific error yet; FieldNotSet error will already
      // be thrown elsewhere
      if (this.ϟserial.val == null) return null

      const errors: string[] = []
      if (this.shouldValidateThatValueIsAmongstKeys) {
         const selected = this.possibleKeys.find((c) => c === this.selectedId)
         if (selected === undefined && !this.ϟconfig.disableLocalFiltering)
            errors.push(`selected value (id: ${this.selectedId}) not in choices`)
      }

      if (errors.length > 0) return errors
      return
   }

   // 📌 CHANGES ----------------------------------------------------------------|
   get ϟisOwnSet(): boolean {
      return this.ϟserial.val !== undefined
   }

   get ϟhasChanges(): boolean {
      return this.ϟserial.val !== this.defaultKey
   }

   override ϟreset(): void {
      this.selectedId = this.defaultKey
   }

   get query(): string {
      return this.ϟserial.query ?? ''
   }

   set query(next: string) {
      this.ϟpatchInTransaction((draft) => void (draft.query = next))
   }

   /**
    * list of all possible keys
    * 🔶 warning: if config.choices is a function, will execute the method
    */
   get possibleKeys(): KEY[] {
      if (this.ϟconfig.choices != null) {
         const _choices = this.ϟconfig.choices
         if (typeof _choices === 'function') {
            // 🔴 if (!this.root.ready) return []
            return _choices(this)
         }
         return _choices
      }

      if (this.ϟconfig.options != null) {
         const _options = this.options
         return _options.map((o) => o.id)
      }

      if (this.ϟconfig.values != null && this.ϟconfig.getIdFromValue != null) {
         const _values = this.values
         return _values.map(this.ϟconfig.getIdFromValue)
      }

      // 🔶 maybe do all these config checks in the constructor?
      throw new Error('no way to get choices. Provide choices or options or values + getIdFromValue')
   }

   //  💬 2024-09-?? ???:
   // | 🔴 make sure that those are triggered lazily by SelectUI:
   // | we don't want to fetch all users if the select popup has not been opened yet
   //

   // 💬 2024-09-16 rvion:
   // | Do we always want to have some "unset" value injected here ?
   get options(): SelectOption<VALUE, KEY>[] {
      if (this.ϟconfig.options != null) {
         const _options = this.ϟconfig.options
         if (typeof _options === 'function') return _options(this)
         return _options
      }

      if (this.ϟconfig.choices != null && this.getOptionFromId != null) {
         return this.possibleKeys.map(this.getOptionFromId).filter((x) => x != null) as SelectOption<
            VALUE,
            KEY
         >[]
      }

      if (this.ϟconfig.values != null && this.getValueFromId != null && this.getOptionFromId != null) {
         return this.values
            .map((v) => this.getOptionFromId(this.ϟconfig.getIdFromValue(v)))
            .filter((x) => x != null)
      }

      throw new Error( 'no way to get options. Provide options or choices + getOptionFromId or values + getIdFromValue + getOptionFromId', ) // prettier-ignore
   }

   private get values(): VALUE[] {
      if (this.ϟconfig.values != null) {
         const _values = this.ϟconfig.values
         if (typeof _values === 'function') {
            if (!this.ϟroot.ϟready) return []
            return _values(this)
         }
         return _values
      }

      if (this.ϟconfig.options != null) {
         const _options = this.options
         return _options.map((o) => o.value)
      }

      if (this.ϟconfig.choices != null && this.ϟconfig.getValueFromId != null) {
         const _choices = this.possibleKeys
         return _choices.map(this.getValueFromId).filter((x) => x != null)
      }

      throw new Error('no way to get values. Provide values or options or choices + getValueFromId')
   }

   // 📌 MOCK ------------------------------------------------------------|
   /** randomly pick one of the options */
   override ϟrandomize(): void {
      const choices = this.possibleKeys
      if (choices.length === 0) return
      const idx = Math.floor(Math.random() * choices.length)
      this.selectedId = choices[idx]!
   }

   // #region CHILDREN

   // 📌 SERIAL -----------------------------------------------------------------|
   protected ϟsetOwnSerial(next: Field_selectOne_serial<KEY>): void {
      this.ϟassignNewSerial(next)

      if (
         this.ϟserial.val === undefined && //
         this.defaultKey !== undefined
      ) {
         this.ϟpatchSerial((draft) => void (draft.val = this.defaultKey))
      }
   }

   /** return true if the value is equal to the given id */
   is(value: VALUE): boolean {
      return this.ϟconfig.getIdFromValue(value) === this.selectedId
   }

   // #region VALUE
   /**
    * First key for the list of possibleKeys
    * returns undefined if the list is empty
    */
   get firstPossibleKey(): KEY | undefined {
      return this.possibleKeys[0]
   }

   /**
    * true when config.default has been set,
    * even when set to null or undefined
    *
    * 🔴 TODO: add test
    */
   get hasDefaultKey(): boolean {
      return 'default' in this.ϟconfig
   }

   /** proxy to this.config.default */
   get defaultKey(): KEY | undefined {
      return this.ϟconfig.default
   }

   // #region VALUE

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

   override ϟset(valOrKey: VALUE | KEY): this {
      if (this.isProbablyValidKey(valOrKey)) this.selectedId = valOrKey
      else this.ϟvalue = valOrKey
      return this
   }

   override ϟgetSetValue(): this['Ҩsetvalue'] | undefined {
      // console.log(`[💀 getSetValue] `, this.path)
      return this.selectedId
   }

   get ϟvalue(): CanThrow<VALUE> {
      return this.ϟvalue_or_fail
   }

   set ϟvalue(next: Field_selectOne_value<VALUE>) {
      this.selectedId = this.ϟconfig.getIdFromValue(next)
   }

   /** different from reset; doesn't take default into account */
   unset(): void {
      this.ϟpatchInTransaction((draft) => void (draft.val = undefined))
   }

   get ϟvalue_or_fail(): CanThrow<VALUE> {
      return this._getValueOrThrow(this.selectedId)
   }

   /** zero value may not exists */
   get ϟvalue_or_zero(): CanThrow<VALUE> {
      return this._getValueOrThrow(this.selectedId ?? this.firstPossibleKey)
   }

   get ϟvalue_unchecked(): Field_selectOne_unchecked<VALUE> {
      if (this.selectedId === undefined) return undefined
      const value = this.getValueFromId(this.selectedId)
      if (value === undefined) return undefined
      return value
   }

   override ϟisValueEqual(other: Field): boolean {
      if (!(other instanceof Field_selectOne)) return false
      return this.selectedId === other.selectedId
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['val'])

   private _getValueOrThrow(key: KEY | undefined): CanThrow<VALUE> {
      if (key === undefined) throw new Error(`Field_selectOne._getValueOrThrow (${this.ϟpathExt}): no key available`) // prettier-ignore
      const value = this.getValueFromId(key)
      if (value === undefined) throw new Error(`Field_selectOne._getValueOrThrow (${this.ϟpathExt}): value not found for first key: ${key}`) // prettier-ignore
      return value as VALUE
   }

   // #region SELECTED OPTION
   @computed get selectedOption_unchecked(): SelectOption<VALUE, KEY> | undefined {
      const key = this.selectedId
      if (key === undefined) return

      const opt = this.getOptionFromId(key)
      if (opt == null) return

      return opt
   }

   @computed get selectedOption(): SelectOption<VALUE, KEY> {
      const key = this.selectedId
      if (key == null) throw new Error('Field_selectOne.selectedOption: no value selected')

      const opt = this.getOptionFromId(key)
      if (opt == null) throw new Error('Field_selectOne.selectedOption: no option found for key')

      return opt
   }

   get selectedId(): KEY | undefined {
      return this.ϟserial.val // || this.default // 🔴 idk, probably bad to have default here
   }

   set selectedId(nextId: KEY | undefined) {
      if (this.ϟserial.val === nextId) return

      this.ϟrunInTransaction(() => {
         this.ϟpatchSerial((draft) => void (draft.val = nextId))

         // 💬 2024-07-08 rvion:
         // | when setting a value with equal id, we may be actually changing the SelectOption
         // | (cached name could be different, etc.)
         // | since it's a bit complicated, let's not care today. if this cause a bug, let's improve
         // | that later

         // ⏸️ const nextHasSameID = this.value.id === next.id
         // ⏸️ if (!nextHasSameID) this.applyValueUpdateEffects()
         // ⏸️ else this.applySerialUpdateEffects()
      })
   }

   // 💬 2024-09-03 rvion:
   // | defaultValue should NEVER be usefull anymore
   // | when setOwnSerial is called with a defaultKey,
   // | the serial should already have the key set, and the default getValue(key)
   // | will properly retrieve the value
   //
   // ❌ get defaultValue(): VALUE | undefined {
   // ❌     if (!this.hasDefaultKey) return undefined
   // ❌     // 💬 2024-09-03 rvion:
   // ❌     // | technically, some select could allow null as KEY,
   // ❌     // | so testing against (== null) is just wrong.
   // ❌     // | that's why we use this.hasDefaultKey instead, then assume
   // ❌     // | that the defaultKey has type KEY, even if it's null in the
   // ❌     // | live below         VVVVVVVVVVVVVVVVVVVVVV
   // ❌     const defaultKey: KEY = this.defaultKey as KEY
   // ❌     const value = this.getValueFromId(defaultKey)
   // ❌     return value ?? undefined
   // ❌ }

   // set value(next: Field_selectOne_value<VALUE>) {
   //     // 🔴 can we do without this?
   // }

   /**
    * 💬 2024-09-03 domi:
    * | problem: getting the value via getOptionFromId
    * | sometimes goes through options or choices (and their side effects),
    * | when we probably just want to go from serial to value.
    * | especially in back-end when we likely don't need label or icon.
    * | In most cases (all for now), value is the id, so we can just get value from serial.
    * | see also "extra"
    */
   getValueFromId = (id: KEY): VALUE | undefined => {
      return this.ϟconfig.getValueFromId(id, this)
   }

   get pathToValueInRootSerial(): string {
      return `${this.ϟgetOwnSerialPathFromRoot()}.val`
   }

   // 💬 2024-08-21 rvion: (for @domi)
   // | I dislike this `getOptionFromId`.
   // | it is redundant / slow / sometimes unnecessary
   // | I'd rather just add the missing mapper for icon, and we would have everything.
   getOptionFromId = (id: KEY): Maybe<SelectOption<VALUE, KEY>> => this.ϟconfig.getOptionFromId(id, this)

   // 🔶 do not compare queries
   override get ϟisDirtyFromSnapshot_UNSAFE(): boolean {
      const { snapshot, ...currentSerial } = this.ϟserial
      if (snapshot == null) return false
      return stableStringify(snapshot.val) !== stableStringify(currentSerial.val)
   }
}

// DI
registerFieldClass('selectOne', Field_selectOne)
Field_selectOne satisfies FieldConstructor<Field_selectOne<any, any>>
