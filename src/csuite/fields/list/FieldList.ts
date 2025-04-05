import type { CSchema } from '../../model/CSchema'
import type { CodegenOpts, FieldConstructor, SchemaDictWithPaths } from '../../model/FieldConstructor'
import type { Patch_Common } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { computed, observable, reaction } from 'mobx'
import { nanoid } from 'nanoid'

import { Field, type KeyedField, type VALUE_MODE } from '../../model/Field'
import { isFieldSerial } from '../../model/FieldSerial'
import { bang } from '../../utils/bang'
import { clamp_or_min_or_zero } from '../../utils/clamp'
import { registerFieldClass } from '../WidgetUI.DI'
import { numberToListKey } from './FieldListId'
import { hole, type HOLE } from './HOLE'

// #region 🔶AUTO
interface AutoBehaviour<out T extends CSchema> {
   /** list of keys that must be present */
   keys(self: T['{field}']): string[] // ['foo', 'bar', 'baz']

   /**
    * @deprecated
    * for every item given by the list above
    */
   getKey?(self: T['{field}'], ix: number): string

   /** initialization  */
   init?(key: string /* foo */): T['{setValue}']
}

// #region CONFIG
export type Field_list_config<T extends CSchema> = Field_list<T>['{config}']
type Field_list_ownConfig<out T extends CSchema> = {
   /**
    * item schema;
    * function notation to support tuples
    */
   element: ((ix: number) => T) | T

   /**
    * when specified, the list will work in some AUTOMATIC mode
    *  - disable the "add" button
    *  - disable the "remove" button
    *  - disable the "clear" button
    *  - automatically add or remove missing items when reaction
    *  - subscribe via mobx to anything you want
    */
   auto?: AutoBehaviour<T>

   /** @default: true */
   sortable?: boolean

   // #region config DEFAULT
   /**
    * mininum length;
    * if min > 0, list will be populated on creation
    * if length < min, list will be populated with empty items
    * if length <= min, list will not be clearable
    * */
   min?: number

   /** max length */
   max?: number

   defaultLength?: number
}

// #region SERIAL type
export type Field_list_ItemID = Tagged<string, 'Field_list_ItemID'>

export type Field_list_serial<T extends CSchema> = Field_list<T>['{serial}']
type Field_list_ownSerial<T extends CSchema> = {
   $: 'list'
   /** when undefined, means the list has not be `set` yet */
   items_?: (T['{serial}'] | HOLE)[]
   keys?: Field_list_ItemID[]
}

// #region VALUE type
export type Field_list_value<T extends CSchema> = T['{value}'][]
export type Field_list_SetValue<T extends CSchema> = T['{setValue}'][]
export type Field_list_unchecked<T extends CSchema> = T['{unchecked}'][]

export type Field_list_patch<T extends CSchema> =
   | Field_list_patch_insert<T>
   | Field_list_patch_remove
   | Field_list_patch_move
export type Field_list_patch_insert<T extends CSchema> = Patch_Common<'list'> & {
   op: 'insert'
   order: Field_list_ItemID[]
   key: Field_list_ItemID
   value: T['{serial}']
}
export type Field_list_patch_remove = Patch_Common<'list'> & {
   op: 'remove'
   key: Field_list_ItemID
}

export type Field_list_patch_move = Patch_Common<'list'> & {
   op: 'move'
   order: Field_list_ItemID[]
}

// #region $FieldType
// 💬 2025-02-14#212 rvion: we need ~3 different types to properly handle the 3 different
// list usages:
// 1. regular lists:     e.g. T[]
// 2. tuple lists:       e.g. [T1,T2,T2]
// 3. "dict" (auto mode) e.g. [x:T1, y:T2, z:T3]

// #region STATE
export interface Field_list<T extends CSchema> {
   '{type}': 'list'
   '{ownConfig}': Field_list_ownConfig<T>
   '{ownSerial}': Field_list_ownSerial<T>
   '{value}': Field_list_value<T>
   '{setValue}': Field_list_SetValue<T>
   '{unchecked}': Field_list_unchecked<T>
   '{child}': T['{field}']
   '{opts}': unknown
   '{ownPatch}': Field_list_patch<T>
}
export class Field_list<T extends CSchema> extends Field {
   // #region TYPE
   static readonly type: 'list' = 'list'
   static readonly codeForTypescriptValue = (
      config: Field_list_config<CSchema>,
      opts: CodegenOpts,
   ): string => {
      const childSchema = typeof config.element === 'function' ? config.element(0) : config.element
      const childTypeCode = childSchema.codeForTypescriptValue(opts)
      return `${childTypeCode}[]`
   }
   static override migrateSerial(serial: object): Maybe<Field_list_serial<any>> {
      if (!isFieldSerial(serial)) return undefined
      if (serial.$ !== 'list') return undefined
      if (isSerialWithMountKeys(serial)) return serial
      if (isSerialList(serial)) {
         const serialItems = serial.items_
         if (serialItems == null) return { $: 'list' }

         return {
            $: 'list',
            items_: serialItems,
            keys: serialItems.map((_, ix) => Field_list.zGenerateListItemKey(ix)),
         }
      }
      return undefined
   }

   static override getChildren(config: Field_list_config<CSchema>): SchemaDictWithPaths {
      const element = config.element
      const keys = [0] // TODO: make that based on the list mode (tuple, auto, etc.)
      const schemaDict: SchemaDictWithPaths = {}
      for (const key of keys)
         schemaDict[key.toString()] = {
            schema: typeof element === 'function' ? element(key) : element,
            serialPath: `items_[${key}]`,
         }
      return schemaDict
   }

   private static readonly unsetSerial: Field_list_serial<any> = { $: 'list' }
   static generateSerial(
      setValue: Maybe<Field_list<CSchema>['{setValue}']>,
      config: Field_list_config<CSchema>,
   ): Field_list_serial<CSchema> {
      if (setValue == null && config.defaultLength == null) return this.unsetSerial

      const length = Math.max(config.defaultLength ?? 0, setValue?.length ?? 0)

      return {
         $: 'list',
         items_: Array(length)
            .fill(undefined)
            .map((_, ix) => {
               if (setValue != null && ix < setValue.length) {
                  const itemValue = setValue[ix]
                  const schema = typeof config.element === 'function' ? config.element(ix) : config.element
                  return schema.generateSerial(itemValue)
               }

               return typeof config.element === 'function'
                  ? config.element(ix).generateSerial(undefined)
                  : config.element.generateSerial(undefined)
            }),
         keys: Array(length)
            .fill(undefined)
            .map((_, ix) => Field_list.zGenerateListItemKey(ix)),
      }
   }

   // static override getChild(config: Field_list_config<CSchema>, key: string): Maybe<CSchema> {
   //    return Field_group.getSchemaDict(config)[key]
   // }
   protected static zGenerateListItemKey(
      /**
       * do not use this option when adding an element,
       * except if you are generating a default serial or something like that
       */
      nth?: number,
   ): Field_list_ItemID {
      // by default, let's use a nanoid, so real collaborative edition, we'll
      // avoid multiple people generating items with the same key on their respective
      // devices
      if (nth == null) return nanoid(8) as string as Field_list_ItemID

      // wehn instanciating a field, let's do the oposite and use a simple number-ish
      // string so we can guarantee the keys are always the same. this allow to cache
      // the default empty serial
      return numberToListKey(nth) // conflict ?
   }

   get zIsOwnSet(): boolean {
      return this.zSerial.items_ != null
   }

   get length(): number {
      return this.items_.length
   }

   private readonly items_: T['{field}'][] = observable([])
   public get items(): readonly T['{field}'][] { return this.items_ } // prettier-ignore
   public get _(): readonly T['{field}'][] { return this.items_ } // prettier-ignore
   map<U>(fn: (item: T['{field}'], ix: number) => U): U[] {
      return this.items_.map(fn)
   }

   @computed get zHasChanges(): boolean {
      // 💬 2024-06-?? rvion:
      //  | in auto mode, length is managed,
      //  | so we must not take it into account
      // 💬 2024-07-05 rvion:
      //   | ^^^ 🤔< NOT SURE about my previous opinion here
      //   |         I'll add some '🔴' for future review
      if (!this.zConfig.auto) {
         const defaultLength = clamp_or_min_or_zero(
            this.zConfig.defaultLength,
            this.zConfig.min,
            this.zConfig.max,
         )
         if (this.items_.length !== defaultLength) return true
      }
      // check if any remaining item has changes
      return this.items_.some((i) => i.zHasChanges)
   }

   override zReset(): void {
      super.zReset()
      this.zChildrenAll.forEach((i) => i.zReset()) // fixme this should not be here
   }

   findItemIndexContaining(widget: Field): number | null {
      let at = widget as Field | null
      let child = at
      while (at != null) {
         at = at.zParent
         if (at === this) {
            return this.items_.indexOf(child as T['{field}'])
         }
         child = at
      }
      return null
   }

   override zGetChildrenSerialPath(branchName: string): string {
      return `items_.[${branchName}]`
   }

   override get zChildrenAll(): T['{field}'][] {
      return this.items_
   }

   override get zSubFieldsWithKeys(): KeyedField[] {
      return this.items_.map((field, ix) => ({ key: ix.toString(), field }))
   }

   schemaAt(ix: number): T {
      const _schema = this.zConfig.element
      const schema: T =
         typeof _schema === 'function' //
            ? _schema(ix)
            : _schema
      return schema
   }

   get isAuto(): boolean {
      return this.zConfig.auto != null
   }

   // probably slow and clunky;
   // TODO: rewrite this piece of crap
   private startAutoBehaviour(): void {
      const auto = this.zConfig.auto
      if (auto == null) return

      const disposeFn = reaction(
         (): string[] => {
            try {
               return auto.keys(this)
            } catch (e) {
               console.error(`🔶 list.auto reaction failed; please avoid crashing.`)
               console.error(e)
               return []
            }
         },
         (keys: string[]) => {
            if (keys == null) {
               console.error(`[❌ INVARIANT VIOLATION] FList.config.auto => keys() returned null `)
               keys = []
            }
            this.zRunInTransaction(() => {
               // 1. Add missing entries
               const getKeyFn = auto.getKey
               const currentKeys: string[] =
                  getKeyFn != null
                     ? this.items_.map((i, ix) => getKeyFn(i, ix))
                     : this.items_.map((i) => i.zMountKey as string)
               const missingKeys: string[] = keys.filter((k) => !currentKeys.includes(k))
               for (const k of missingKeys) {
                  // console.log(`[super🔴] adding`, { valueExt: auto.init?.(k) ?? {}, itemKey: k })
                  if (auto.init != null) this.addItem({ valueExt: auto.init(k), itemKey: k })
                  else this.addItem({ itemKey: k })
               }

               // 2. delete items that must be removed.
               let ix = 0
               for (const item of this.items_.slice()) {
                  const itemKey = getKeyFn != null ? getKeyFn(item, ix++) : item.zMountKey
                  const isExtra = !keys.includes(itemKey)
                  if (!isExtra) continue
                  this.removeItem(item)
               }
            })
         },
         { fireImmediately: true, name: `list-auto@${this.zPath}` },
      )

      this.zDisposeFns.push(disposeFn)
   }

   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_list<T>>,
      initialMountKey: string,
      serial?: Field_list_serial<T>,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
      this.startAutoBehaviour()
   }

   at(ix: number): T['{field}'] | undefined {
      return this.items_.at(ix)
   }

   get valueArr(): Field_list_value<T> {
      return this.items_.map((i) => i.zValue)
   }

   valueArrMode(mode: VALUE_MODE): Field_list_value<T> | Field_list_unchecked<T> {
      return this.items_.map((i) => i.zGetValue(mode))
   }

   override zAcknowledgeNewChildSerial(
      //
      mountKey: Field_list_ItemID,
      nextChildSerial: any,
   ): boolean {
      // parse index
      const index = this.zSerial.keys?.indexOf(mountKey) ?? -1

      // ensure index is valid
      if (index < 0) throw new Error(`❌ FieldList._acknowledgeNewChildSerial: index(${index}) is < 0`)
      if (index > (this.zSerial.items_ ?? []).length)
         throw new Error(`❌ FieldList._acknowledgeNewChildSerial: index is OOB (${index}`)

      if (this.zSerial.items_?.[index] === nextChildSerial) return false

      // make sure the serial.items_ is set (akin to saying that from now-on, the field is `set`)
      // 💬 2024-09-11 rvion:
      // | 🔴 we could actually throw here 🤔
      // | it's probably possible to make sure this is set before, since we're in control of
      // | all primitive actions on that field.
      if (this.zSerial.items_ == null || this.zSerial.keys == null) {
         this.zPatchSerial((draft) => {
            draft.items_ ??= []
            draft.keys ??= []
         })
      }

      // swap the pointer in the serial.items_ array at given index to new serial
      return this.zPatchSerial((draft) => {
         draft.items_![index] = nextChildSerial
      })
   }

   protected zSetOwnSerial(next: Field_list_serial<T>): void {
      // apply default value
      // IF AND ONLY IF both
      //  - we are NOT in auto mode
      //  - we are not set yet
      if (next.items_ == null || next.keys == null) {
         for (const item of this.items_) item.zDisposeTree()
         this.items_.length = 0

         // 2. ASSIGN SERIAL

         this.zAssignNewSerial(next)

         if (!this.zConfig.auto) {
            const defaultLength = this.zConfig.defaultLength // clamp_or_null(this.config.defaultLength, this.config.min, this.config.max)
            // console.log(`[🤠] AA defaultLength`, defaultLength)
            if (defaultLength == null) {
               // no default, we never set the `draft.items_`, so the
               // field remains unset
               return
            }
            this.zPatchSerial((draft) => {
               draft.items_ ??= []
               draft.keys ??= []
            })
            for (let i = this.items_.length; i < defaultLength; i++) {
               this.addItem({ applyEvenIfAtMaxLen: true })
            }
         }
         return
      }

      const nextItems = next.items_
      const nextMountKeys = next.keys
      const nextIds = new Set(nextMountKeys)

      const remainingEntries = this.items_.filter((item) => nextIds.has(item.zMountKey as Field_list_ItemID))
      const deletedEntries = this.items_.filter((item) => !nextIds.has(item.zMountKey as Field_list_ItemID))

      // Remove deleted elements
      deletedEntries.forEach((item) => {
         item.zDisposeTree()
      })
      // Update the list of items with only the remaining entries
      this.items_.length = 0
      this.items_.push(...remainingEntries)

      this.zAssignNewSerial(next)

      // Add new elements
      for (let ix = 0; ix < nextItems.length; ix++) {
         const mountKey = nextMountKeys[ix] as Field_list_ItemID
         const nextSerial = nextItems[ix]

         if (mountKey == null) throw new Error('❌ List item key is null')
         if (nextSerial == null) throw new Error('❌ List item serial is null')
         if (nextSerial == hole) throw new Error('❌ List item serial is hole')

         const schema = this.schemaAt(ix)

         this.zRECONCILE({
            mountKey,
            correctChildSchema: schema,
            existingChild: remainingEntries.find((i) => i.zMountKey === mountKey),
            targetChildSerial: nextSerial,
            attach: (sub) => {
               // push instead of doing [ix]= ... since we're re-creating them in order
               this.items_.push(sub)
               // bang(this.serial.items_).push(sub.serial)
            },
         })
         // const subWidget = schema.instanciate(this.repo, this.root, this, subSerial)
         // this.items.push(subWidget)
      }

      // Reorder items to match the order of the serial
      // TODO repace by a faster (inplace?) impl; this seems wrong.
      const indicesByKeys = new Map(nextMountKeys.map((key, ix) => [key, ix]))
      this.items_.sort((a, b) => {
         const aIndex = indicesByKeys.get(a.zMountKey as Field_list_ItemID) ?? -1
         const bIndex = indicesByKeys.get(b.zMountKey as Field_list_ItemID) ?? -1
         return aIndex - bIndex
      })

      // 💬 2024-09-10: 🙅🙅‍♀️🙅‍♂️ < NO LONGER TRUE !!
      // | we don't want to invent data by default
      // |
      // | ```ts
      // | // 3. add missing items if min specified
      // | const missingItems = (this.config.min ?? 0) - this.items.length
      // | for (let i = 0; i < missingItems; i++) {
      // |     this.addItem()
      // | }
      // | ```
   }

   /**
    * code below is very wtf, and surprisingly simple for what it achieve
    * see `src/csuite/model/TESTS/proxy.test.ts` if you're not scared
    */

   get zValue(): Field_list_value<T> {
      const value = new Proxy([], this.makeValueProxy('fail'))
      void this.zSerial
      Object.defineProperty(this, 'zValue', {
         get: () => {
            void this.zSerial
            return value
         },
      })
      return value
   }
   get zValueOrZero(): Field_list_value<T> {
      const value = new Proxy([], this.makeValueProxy('zero'))
      void this.zSerial
      Object.defineProperty(this, 'zValueOrZero', {
         get: () => {
            void this.zSerial
            return value
         },
      })
      return value
   }
   get zValueUnchecked(): Field_list_unchecked<T> {
      const value = new Proxy([], this.makeValueProxy('unchecked'))
      void this.zSerial
      Object.defineProperty(this, 'zValueUnchecked', {
         get: () => {
            void this.zSerial
            return value
         },
      })
      return value
   }
   get value_set(): Field_list_SetValue<T> {
      const value = new Proxy([], this.makeValueProxy('set'))
      void this.zSerial
      Object.defineProperty(this, 'value_set', {
         get: () => {
            void this.zSerial
            return value
         },
      })
      return value
   }

   [Symbol.iterator](): IterableIterator<T['{field}']> {
      return this.items_[Symbol.iterator]()
   }

   set zValue(val: Field_list_value<T>) {
      this.zRunInTransaction(() => {
         for (let i = 0; i < val.length; i++) {
            // 1. replace existing items
            if (i < this.items_.length) this.items_[i]!.zValue = val[i]
            // 2. add missing items
            else this.addItem({ at: i, value: val[i] })
         }
         this.splice(val.length)
      })
   }

   // 💬 2025-01-21 rvion: all of those `setSerial()`, `set()`, and `set value()` are wrong and should have
   // some kind of basic keyed reconciliation.
   // I really want to do better; should be super cheap and will avoid days of crying and/or waiting later.
   override zSet(x: Field_list_SetValue<T>): this {
      this.zRunInTransaction(() => {
         for (let i = 0; i < x.length; i++) {
            // 1. replace existing items
            if (i < this.items_.length) this.items_[i]!.zSet(x[i])
            // 2. add missing items
            else this.addItem({ at: i, valueExt: x[i] })
         }
         this.splice(x.length)
      })
      return this
   }

   public zIsValueEqual(other: Field): boolean {
      if (this === other) return true
      if (!(other instanceof Field_list)) return false
      if (this.items_.length !== other.items_.length) return false

      return this.items_.every((item, ix) => other.items_[ix] != null && item.zIsValueEqual(other.items_[ix]))
   }

   private makeValueProxy(mode: VALUE_MODE): ProxyHandler<never> {
      return {
         get: (_, prop: any): any => {
            // ⏸️ console.log(`[GET]`, prop)
            const target = this.items_ as any
            if (typeof prop === 'symbol') return target[prop]

            // MOBX HACK ----------------------------------------------------
            // Handle mutations
            if (prop === 'toJSON') return () => this.valueArrMode(mode)
            if (prop === 'pop') return () => this.pop()
            if (prop === 'shift') return () => this.shift()
            if (prop === 'unshift') return (...args: any[]) => this.unshift(...args)
            if (prop === 'push') return (...args: any[]) => this.push(...args)
            if (prop === 'map') return (...args: [any, any]) => this.valueArrMode(mode).map(...args)
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (prop === 'filter') return (...args: [any, any]) => this.valueArrMode(mode).filter(...args)
            // MOBX HACK ----------------------------------------------------

            // handle numbers (1) and number-like ('1')
            if (parseInt(prop, 10) === +prop) {
               const field: Maybe<Field> = this.items_[+prop]
               return field?.zGetValue(mode)
               // return target[+prop]?.getvalue
            }

            // defer to valueArr for other props
            return this.valueArrMode(mode)[prop]
         },

         set: (_, prop: any, value): boolean => {
            // ⏸️ console.log(`[SET]`, prop, value)
            if (typeof prop === 'symbol') return false
            if (parseInt(prop, 10) === +prop) {
               const index = +prop
               if (index === this.items_.length) {
                  this.addItem({ value })
                  return true
               } else if (this.items_[prop]) {
                  this.items_[prop]!.zValue = value
                  return true
               }
            }
            return false
         },

         has: (_, prop: any): boolean => {
            return Reflect.has(this.valueArr, prop)
         },
      }
   }

   override zGetSetValue(): this['{setValue}'] | undefined {
      // console.log(`[💀 getSetValue] `, this.path)
      return this.value_set
   }

   // #region Validation
   get zOwnConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get zOwnTypeSpecificProblems(): string[] {
      // console.log(`[🤠] `, this.config.min, this.length)
      // console.log(`[🤠] `, this.config.max, this.length)
      const out: string[] = []
      if (
         //
         this.zConfig.min != null &&
         this.length < this.zConfig.min
      ) {
         out.push(`List is too short`)
      }

      if (
         //
         this.zConfig.max != null &&
         this.length > this.zConfig.max
      ) {
         out.push(`List is too long`)
      }
      return out
   }

   // ADDING ITEMS -------------------------------------------------
   duplicateItemAtIndex(ix: number): Maybe<T['{field}']> {
      const item = bang(this.items_[ix])
      return this.addItem({ at: ix, value: item.zIsValid ? item.zValue : undefined })
   }

   /**
    * Appends new elements to the end of an array,
    * and returns the new length of the array.
    */
   push(...values: T['{setValue}'][]): number {
      if (values.length === 0) return this.length
      this.zRunInTransaction(() => {
         for (const v of values) {
            this.addItem({ valueExt: v })
         }
      })
      return this.length
   }

   /**
    * Inserts new elements at the start of an array,
    * and returns the new length of the array.
    */
   unshift(...values: T['{value}'][]): number {
      if (values.length === 0) return this.length
      this.zRunInTransaction(() => {
         for (const v of values) {
            this.addItem({ value: v, at: 0 })
         }
      })
      return this.length
   }

   // TODO: remove holes
   addItem(
      p: {
         // at
         at?: number
         applyEvenIfAtMaxLen?: boolean
         /** 🔶 only use this param if you know what you're doing */
         itemKey?: string
         // value
         value?: T['{value}']
         valueExt?: T['{setValue}']
         serial?: T['{serial}']
      } = {},
   ): Maybe<T['{field}']> {
      if (p.at != null && p.at < 0) return void console.log(`[🔶] list.addItem: at is negative`)
      if (p.at != null && p.at > this.items_.length)
         return void console.log(`[🔶] list.addItem: at is out of bounds`)
      if (
         !Boolean(p.applyEvenIfAtMaxLen) &&
         this.zConfig.max != null &&
         this.items_.length >= this.zConfig.max
      )
         return void console.log(`[🔶] list.addItem: list is already at max length`)

      return this.zRunInTransaction(() => {
         const itemId = p.itemKey ?? Field_list.zGenerateListItemKey()

         // get position
         let at: number = p.at ?? this.items_.length
         if (at < 0) at = this.items_.length + at

         // should we crash instead ?
         if (at < 0) {
            console.warn(`[🔶] field ${this.zPathExt} tried to insert a value at index ${at}; clamping to 0`)
            at = 0
         }
         if (at > this.items_.length) {
            console.warn(`[🔶] field ${this.zPathExt} tried to insert a value at index ${at} (length=${this.items_.length}); clamping to ${this.items_.length}`) // prettier-ignore
            at = this.items_.length
         }

         this.zPatchSerial((draft) => {
            if (draft.items_ == null || draft.keys == null) {
               if (at !== 0) throw new Error('❌ Field_list is not sparsed')
               draft.items_ = [hole]
               draft.keys = [itemId]
            } else {
               draft.items_.splice(at, 0, hole)
               draft.keys.splice(at, 0, itemId)
            }
         })

         const schema = this.schemaAt(at) // TODO: evaluate schema in the form loop
         const item = schema.instanciate(this.zRepo, this.zRoot, this, itemId, p.serial ?? null)
         if (p.value !== undefined) item.zValue = p.value
         if (p.valueExt !== undefined) item.zSet(p.valueExt)

         this.items_.splice(at, 0, item)
         // 👉 lists are assumed not to be sparsed        ^^^^
         return item
      })
   }

   // MOVING ITEMS ---------------------------------------------------
   moveItem(
      /** previous item index in the list */
      oldIndex: number,
      /** new index in the list to move the item to */
      newIndex: number,
   ): void {
      if (this.zSerial.items_ == null || this.zSerial.keys == null) return console.log(`[🔶] list.moveItem: list is not set`) // prettier-ignore
      if (oldIndex === newIndex) return console.log(`[🔶] list.moveItem: oldIndex === newIndex`)
      if (oldIndex < 0 || oldIndex >= this.length) return console.log(`[🔶] list.moveItem: oldIndex out of bounds`) // prettier-ignore
      if (newIndex < 0 || newIndex >= this.length) return console.log(`[🔶] list.moveItem: newIndex out of bounds`) // prettier-ignore

      // serials

      this.zRunInTransaction(() => {
         this.zPatchSerial((draft) => {
            const items = draft.items_
            const mountKeys = draft.keys
            if (items == null || mountKeys == null) return // should never be the case

            const removedItems = items.splice(oldIndex, 1)
            const removedKeys = mountKeys.splice(oldIndex, 1)

            items.splice(newIndex, 0, bang(removedItems[0]))
            mountKeys.splice(newIndex, 0, bang(removedKeys[0]))
         })

         // instances
         const instances = this.items_
         instances.splice(newIndex, 0, bang(instances.splice(oldIndex, 1)[0]))
      })
   }

   // REMOVING ITEMS ------------------------------------------------

   /**
    * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
    * @returns An array containing the elements that were deleted.
    */
   splice(
      /**  The zero-based location in the array from which to start removing elements. */
      start: number,
      /** The number of elements to remove. */
      deleteCount: number = Infinity,
   ): T['{field}'][] {
      if (deleteCount === 0) return []
      if (start >= this.length) return []
      let deleted: T['{field}'][] = []
      this.zRunInTransaction(() => {
         // remove from serial
         this.zPatchSerial((draft) => {
            const mountKeys = draft.keys
            const items = draft.items_
            if (mountKeys == null || items == null) throw new Error('❌ Field_list is not set yet')

            draft.items_?.splice(start, deleteCount)
            draft.keys?.splice(start, deleteCount)
         })
         // remove from instance list
         deleted = this.items_.splice(start, deleteCount)

         // dispose every removed children
         for (const x of deleted) x.zDisposeTree()
      })
      return deleted
   }

   /**
    * Removes all elements from the array and
    * @returns An array containing the elements that were deleted.
    */
   removeAllItems(): T['{field}'][] {
      // ensure list is not empty
      if (this.length === 0) {
         console.log(`[🔶] list.removeAllItems: list is already empty`)
         return []
      }
      // ensure list is not at min len already
      const minLen = this.zConfig.min ?? 0
      if (this.length <= minLen) {
         console.log(`[🔶] list.removeAllItems: list is already at min lenght`)
         return []
      }
      // remove all items
      return this.splice(minLen)
      // this.MUTVALUE(() => {
      //     this.serial.items_ = this.serial.items_.slice(0, minLen)
      //     this.items = this.items.slice(0, minLen)
      // })
   }

   removeItem(item: T['{field}']): Maybe<T['{field}']> {
      // ensure item is in the list
      const i = this.items_.indexOf(item)
      if (i === -1) {
         // 💬 2024-07-11 rvion: should we throw
         return void console.log(`[🔶] list.removeItem: item not found`)
      }
      this.removeItemAt(i)
      return item
   }

   pop(): void {
      this.removeItemAt(this.items_.length - 1)
   }

   /**
    * Removes the first element from an array and returns it.
    * If the array is empty, undefined is returned and the array is not modified.
    */
   shift(): Maybe<T['{field}']> {
      return this.removeItemAt(0)
   }

   removeItemAt(i: number): Maybe<T['{field}']> {
      if (this.length < i) return null
      return this.splice(i, 1)[0]
   }

   // #region Patches
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['keys_'])

   protected override zGenerateOwnPatches(referenceField: this): Field_list_patch<T>[] {
      const patches: Field_list_patch<T>[] = []
      const thisSerials = this.zSerial.items_ ?? []

      const refMountKeys = referenceField.zSerial.keys ?? []
      const refMountKeysSet = new Set(refMountKeys)

      const thisMountKeys = this.zSerial.keys ?? []
      const thisMountKeysSet = new Set(thisMountKeys)

      const added = thisMountKeys
         .map((mountKey, ix) => ({
            mountKey,
            serial: thisSerials[ix] as T['{serial}'],
         }))
         // It's easier to filter afterwards, because the map function needs the index
         // to get the serial
         .filter(({ mountKey }) => !refMountKeysSet.has(mountKey))

      const removed = refMountKeys.filter((mountKey) => !thisMountKeysSet.has(mountKey))

      const inCommonKeysThisSorted = thisMountKeys.filter((mountKey) => refMountKeysSet.has(mountKey))
      const inCommonKeysRefSorted = refMountKeys.filter((mountKey) => thisMountKeysSet.has(mountKey))

      patches.push(
         ...removed.map(
            (id): Field_list_patch_remove => ({
               op: 'remove',
               key: id,
               fieldPath: this.zPath,
               fieldType: 'list',
            }),
         ),
      )

      if (inCommonKeysThisSorted.some((id, ix) => inCommonKeysRefSorted[ix] !== id)) {
         patches.push({
            op: 'move',
            order: inCommonKeysThisSorted,
            fieldPath: this.zPath,
            fieldType: 'list',
         })
      }

      patches.push(
         ...added.map(
            ({ mountKey, serial }): Field_list_patch_insert<T> => ({
               op: 'insert',
               key: mountKey,
               order: thisMountKeys,
               value: serial,
               fieldPath: this.zPath,
               fieldType: 'list',
            }),
         ),
      )

      return patches
   }

   protected override zApplyOwnPatches(patches: Field_list_patch<T>[]): void {
      if (patches.length === 0) return

      this.zRunInTransaction(() => {
         this.zPatchSerial((draft) => {
            patches.forEach((patch) => {
               const thisMountKeys = draft.keys
               const items = draft.items_
               if (isPatchRemove(patch)) {
                  if (items == null || thisMountKeys == null) return
                  const index = thisMountKeys.indexOf(patch.key)
                  if (index === -1) return

                  items.splice(index, 1)
                  thisMountKeys.splice(index, 1)
               } else if (isPatchMove(patch)) {
                  if (items == null || thisMountKeys == null) return

                  const currentIndexByKey = new Map(thisMountKeys.map((key, ix) => [key, ix]))

                  const patchIndices = new Map(patch.order.map((key, ix) => [key, ix]))

                  const newMountKeys = thisMountKeys.sort((a, b): number => {
                     let aNewIndex = patchIndices.get(a)
                     let bNewIndex = patchIndices.get(b)

                     if (aNewIndex != null && bNewIndex != null) return aNewIndex - bNewIndex
                     if (aNewIndex == null && bNewIndex == null)
                        return currentIndexByKey.get(a)! - currentIndexByKey.get(b)!

                     if (aNewIndex == null) aNewIndex = estimateIndex(a, patchIndices, thisMountKeys)
                     if (bNewIndex == null) bNewIndex = estimateIndex(b, patchIndices, thisMountKeys)

                     return aNewIndex - bNewIndex
                  })

                  draft.keys = newMountKeys
                  draft.items_ = newMountKeys.map((id) => items[currentIndexByKey.get(id)!]!)
               } else if (isPatchInsert(patch)) {
                  const newItems = items ?? []
                  const newMountKeys = thisMountKeys ?? []
                  draft.keys = newMountKeys
                  draft.items_ = newItems

                  const previousIndexByMountKey = new Map(newMountKeys.map((key, ix) => [key, ix]))
                  if (previousIndexByMountKey.get(patch.key) != null) return // Weird case

                  const indexEstimation = Math.min(
                     newItems.length ?? 0,
                     Math.max(0, Math.ceil(estimateIndex(patch.key, previousIndexByMountKey, patch.order))),
                  )

                  newMountKeys.splice(indexEstimation, 0, patch.key)
                  newItems.splice(indexEstimation, 0, patch.value as T['{serial}'])
               } else {
                  throw new Error('❌ Field_list.applyOwnPatches: unknown patch')
               }
            })
         })

         for (const patch of patches) {
            if (isPatchRemove(patch)) {
               const removedIndex = this.items_.findIndex((i) => i.zMountKey === patch.key)

               if (removedIndex > -1) {
                  const removedItem = this.items_.splice(removedIndex, 1)[0]!
                  removedItem.zDisposeTree()
               }
            } else if (isPatchInsert(patch)) {
               const index = this.zSerial.keys!.indexOf(patch.key)

               if (this.items_.find((i) => i.zMountKey === patch.key)) return // already exists, weird case
               if (index == -1) throw new Error('❌ Field_list.applyOwnPatches: patch.key not found')

               this.zRECONCILE({
                  mountKey: patch.key,
                  correctChildSchema: this.schemaAt(index),
                  existingChild: null,
                  targetChildSerial: patch.value as Field_list_serial<T>,
                  attach: (sub) => {
                     this.items_.push(sub)
                  },
               })
            }
         }

         const itemsByKey = new Map(this.items_.map((i) => [i.zMountKey, i]))
         this.items_.length = 0
         this.items_.push(...(this.zSerial.keys ?? []).map((key) => itemsByKey.get(key)!))
      })
   }
}

// DI
registerFieldClass('list', Field_list)
Field_list satisfies FieldConstructor<Field_list<any>>

function isSerialList(serial: any): serial is Field_list_serial<any> {
   return serial.$ === 'list'
}

function isSerialWithMountKeys(serial: any): serial is Field_list_serial<any> {
   return (
      isSerialList(serial) &&
      (serial.items_ == null || serial.keys != null) &&
      serial.items_?.length === serial.keys?.length
   )
}

function isPatchInsert<T extends CSchema>(patch: Field_list_patch<T>): patch is Field_list_patch_insert<T> {
   return patch.op === 'insert'
}

function isPatchRemove<T extends CSchema>(patch: Field_list_patch<T>): patch is Field_list_patch_remove {
   return patch.op === 'remove'
}

function isPatchMove<T extends CSchema>(patch: Field_list_patch<T>): patch is Field_list_patch_move {
   return patch.op === 'move'
}

function estimateIndex(
   key: Field_list_ItemID,
   targetIndices: Map<Field_list_ItemID, number>,
   sourceOrder: Field_list_ItemID[],
): number {
   const sourceIndex = sourceOrder.indexOf(key)
   if (sourceIndex === -1) throw new Error('❌ Field_list.generateCorrespondingIndex: key not found')

   let leftIndex = -1
   let rightIndex = targetIndices.size

   for (let ix = sourceIndex - 1; ix >= 0; ix -= 1) {
      const key = sourceOrder[ix]!
      const index = targetIndices.get(key)
      if (index != null) {
         leftIndex = index + 1
         break
      }
   }

   for (let ix = sourceIndex + 1; ix < sourceOrder.length; ix += 1) {
      const key = sourceOrder[ix]!
      const index = targetIndices.get(key)
      if (index != null) {
         rightIndex = index - 1
         break
      }
   }

   return (leftIndex + rightIndex) / 2
}
