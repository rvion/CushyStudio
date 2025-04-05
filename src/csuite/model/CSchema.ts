/* eslint-disable @typescript-eslint/no-namespace */
import type { Field_list_config } from '../fields/list/FieldList'
import type { Field_optional, Field_optional_config } from '../fields/optional/FieldOptional'
import type { DraftLike } from './Draft'
import type { Field, FieldCtorProps } from './Field'
import type { FieldConfigFor } from './FieldConfig'
import type { FieldConstructor, TravelEdge } from './FieldConstructor'
import type { CastUnknown, IsUnknown } from './IsItUnknown'
import type { Klass } from './KlassToUse'
import type { Channel, ChannelId } from './pubsub/Channel'
import type { FieldReaction } from './pubsub/FieldReaction'
import type { Publication } from './pubsub/Producer'

import { reaction, runInAction } from 'mobx'
import { nanoid } from 'nanoid'

import {
   getFieldListClass,
   getFieldOptionalClass,
   isSchemaBool,
   isSchemaDate,
   isSchemaNumber,
   isSchemaOptional,
   isSchemaSelectMany,
   isSchemaSelectOne,
   isSchemaString,
} from '../fields/WidgetUI.DI'
import { memoizedFN, schemaConfigHash } from '../hashUtils/hash'
import { objectAssignTsEfficient_t_pt } from '../utils/objectAssignTsEfficient'
import { potatoClone } from '../utils/potatoClone'
import { CSchemaNeighborhood, type NeighborhoodName } from './CSchemaTraversal'
import { getGlobalRepository, type Repository } from './Repository'

declare global {
   namespace CSuite {
      export interface CSchemaExtensions<$ extends { '{schema}': CSchema<any> }> {}
   }
}

// export interface CSchema<out FIELD extends Field = Field>
export interface CSchema<out FIELD extends Field = Field>
   extends CSuite.CSchemaExtensions<{ '{schema}': CSchema<FIELD> }> {
   '{field}': FIELD
   '{type}': FIELD['{type}']
   '{ownConfig}': FIELD['{ownConfig}']
   '{ownSerial}': FIELD['{ownSerial}']
   '{serial}': FIELD['{serial}']
   '{config}': FIELD['{config}']
   '{value}': FIELD['{value}']
   '{setValue}': FIELD['{setValue}']
   '{unchecked}': FIELD['{unchecked}']
   '{child}': FIELD['{child}']
   '{opts}': FIELD['{opts}']
   '{ownPatch}': FIELD['{ownPatch}']
}

export type WithConfigOptions = {
   onValueChange?: 'override'
   onDispose?: 'override'
   onInit?: 'override'
   onSerialChange?: 'override'
}

/** if you ever want ot subclass this, you'll need to override withConfig /!\ so it returns the correct class */
export interface CSchema<out FIELD extends Field = Field> {
   $: FIELD
}
export class CSchema<out FIELD extends Field = Field> {
   _symCSchema = Symbol.for('CSchema')
   static addMIXIN<MIXIN>(mixin: MIXIN & ThisType<CSchema & MIXIN>): void {
      Object.defineProperties(CSchema.prototype, Object.getOwnPropertyDescriptors(mixin))
   }

   /** truely unique per instance */
   _uid = nanoid(6)

   /** is not stable; but should be hopefully */
   uid = nanoid(6)
   withUID(uid: string): this {
      this.uid = uid
      return this
   }

   get schema(): this {
      return this
   }

   // ------------------------------------------------------------------------------------
   // Cache mechanism
   static CacheBufferSize = 1000
   static CacheLogEvery = 1000
   static Cache: Map<string, CSchema> = new Map()
   static CacheKeys: string[] = []
   static CacheSeen = 0
   static CacheHits = 0
   static CacheMisses = 0
   static CacheSet(key: string, schema: CSchema): void {
      CSchema.Cache.set(key, schema)
      CSchema.CacheKeys.push(key)
      CSchema.CacheSeen++
      if (CSchema.Cache.size > CSchema.CacheBufferSize) CSchema.Cache.delete(CSchema.CacheKeys.shift()!)
      if (CSchema.CacheSeen % CSchema.CacheLogEvery === 0) console.log(`[🏛 CSchema] seen=${CSchema.CacheSeen} hits=${CSchema.CacheHits} misses=${CSchema.CacheMisses}`) // prettier-ignore
   }
   static CacheReset(): void {
      CSchema.Cache.clear()
      CSchema.CacheKeys = []
      CSchema.CacheSeen = 0
      CSchema.CacheHits = 0
      CSchema.CacheMisses = 0
   }
   // ------------------------------------------------------------------------------------

   static new<T extends Field>(fieldConstructor: FieldConstructor<T>, config: T['{config}']): CSchema<T> {
      const configHash = schemaConfigHash([fieldConstructor.type, fieldConstructor, config])
      const prev = CSchema.Cache.get(configHash)
      // console.log(`[> ${prev == null ? '❌ NEW' : '🟢 OLD'}]`, configHash)
      if (prev) {
         CSchema.CacheHits++
         return prev as CSchema<T>
      }
      CSchema.CacheMisses++
      const next = new CSchema(fieldConstructor, config)

      CSchema.CacheSet(configHash, next)
      return next
   }

   private constructor(
      /** field constructor (class or function, see FieldConstructor definition)  */
      public fieldConstructor: FieldConstructor<FIELD>,
      /** config of the field to instanciate */
      public readonly config: FIELD['{config}'],
   ) {}

   /**
    * example usage:
    *
    * ```ts
    * // define base schema
    * type T0 = S.Record<{foo: S.int}>
    * const S0 = b.fields({
    *     foo: b.int({ default: 10 }),
    * })
    * ```
    *
    * ## USAGE 1: external class definition, with type annotation
    *
    * ```ts
    * // 👉 using an external class require it to properly extend your field shape
    * //                 VVVVVVVVVVV VVVVVVVVVVVVVVVVVVVVVVVVVV
    * class Foo1 extends Field_group<T0['{field}']['{subfields}']> {
    *     static HELLO = 'WORLD'
    *     volatile = 12
    *     constructor(...args:FieldCtorProps){ // 👈 constructor is only required if you want
    *          super()                         // to make it observable or extend the constructor in some way
    *
    *          this.extendAutoObservable()     // 👈 observability for your custom class is
    *     }                                    // done via the custom `extendAutoObservable`
    *     get foofoo(): number {
    *         return this.value.foo * 2
    *     }
    * }
    * const S1: Schema<Foo1> = S0.useClass(() => Foo1, null)
    * ```
    *
    * ## USAGE 2: inline class definition, without type annotion
    *
    * ```ts
    * // use `useClass` to extend the auto-generated class
    * // with your custom class
    * const S1 = S0.useClass((FIELD) => {         // 👈 doesn't require type annotation
    *     return class Foo2 extends FIELD {
    *         static HELLO = 'WORLD'
    *         volatile = 12
    *
    *         // constructor is required if you want to make your field observable
    *         constructor(...args:FieldCtorProps){ // 👈 constructor is only required if you want
    *              super()                         // to make it observable or extend the constructor in some way
    *
    *              this.extendAutoObservable()     // 👈 observability for your custom class is
    *         }                                    // done via the custom `extendAutoObservable`
    *         get foofoo(): number {
    *             return this.value.foo * 2
    *         }
    *     }
    * })
    * // S1: CSchema<Foo2>                      // 👈 but can't be anno
    * ```
    *
    */
   useClass<CUSTOM extends Field>(
      /** the class constructor */
      classToUse: Klass<CUSTOM>,

      /**
       * if your custom class require opts, you MUST pass them here.
       * to make your custom class require ['{opts}'], do that:
       *
       * ```ts
       * export class Example extends Field_group<{ name: Z.string}> {
       *    override ['{opts}']!: {whatever: string}
       *    static schema = (b: Z.Builder): Z.Schema<Example> =>
       *       b.fields({ name: b.string() }).useClass(Example, { whatever: 'you want' })
       * }
       * ```
       */
      ...[opts]: IsUnknown<CUSTOM['{opts}']> extends false //
         ? [opts: CastUnknown<CUSTOM['{opts}'], null>]
         : [opts?: null]
   ): CSchema<CUSTOM> {
      if (this.config.classToUse != null) throw new Error('already have a custom class')
      return this.withConfig({ classToUse, opts }) as any as CSchema<CUSTOM>
   }

   /** wrap field schema to list stuff */
   list(config: Omit<Field_list_config<this>, 'element'> = {}): Z.List<this> {
      return this.list_({ defaultLength: config.defaultLength ?? config.min ?? 0, ...config })
   }

   /** wrap field schema to list stuff */
   list_(config: Omit<Field_list_config<this>, 'element'> = {}): Z.List<this> {
      const FieldListClass = getFieldListClass()
      return CSchema.new(FieldListClass, { ...config, element: this })
   }

   /** make field optional (A => Maybe<A>) */
   optional(startActive: boolean = false, config?: Partial<Field_optional_config<this>>): Z.Maybe<this> {
      return this.optional_(Boolean(startActive), config)
   }

   optional_(startActive?: boolean, config?: Partial<Field_optional_config<this>>): Z.Maybe<this> {
      const FieldOptionalClass = getFieldOptionalClass()
      return CSchema.new<Field_optional<this>>(FieldOptionalClass, {
         schema: this,
         startActive: startActive,
         label: this.config.label,
         startCollapsed: this.config.startCollapsed,
         collapsed: this.config.collapsed,
         border: this.config.border,
         ...config,
      })
   }

   // ------------------------------------------------------------
   // ⏸️ /** constructor/class/builder-fn of the field to instanciate */
   // ⏸️ fieldConstructor: FieldConstructor<FIELD>

   /** type of the field to instanciate */
   get type(): FIELD['{type}'] {
      return this.fieldConstructor.type
   }

   // ⏸️ /** config of the field to instanciate */
   // ⏸️ config: FIELD['{config}']

   // ------------------------------------------------------------
   // LabelExtraUI?: CovariantFC<{ field: FIELD }>

   // ------------------------------------------------------------
   // Clone/Fork
   withConfig(config: Partial<FIELD['{config}']>, opts?: WithConfigOptions): this {
      const { onValueChange, onDispose, onInit, onSerialChange, ...rest } = config
      const mergedConfig = objectAssignTsEfficient_t_pt(
         potatoClone(this.config),
         rest as Partial<FIELD['{config}']>,
      )

      ;(['onValueChange', 'onDispose', 'onInit', 'onSerialChange'] as const).forEach((key) => {
         if (opts?.[key] === 'override' || mergedConfig[key] == null) {
            mergedConfig[key] = config[key]
         } else if (config[key] != null) {
            mergedConfig[key] = (field: FIELD): void => {
               config[key]?.(field)
               mergedConfig[key]?.(field)
            }
         }
      })

      const cloned = CSchema.new(this.fieldConstructor, mergedConfig)
      return cloned as this
   }

   /** clone the schema, and patch the cloned config to make it hidden */
   hidden(): this {
      return this.withConfig({ hidden: true })
   }
   // TODO: make this add extra protection so people don't edit it by mistake
   protected(warning: string): this {
      return this.withConfig({ hidden: true })
   }

   // PubSub -----------------------------------------------------
   publishLocallyToChannel<T>(chan: Channel<T> | ChannelId, produce: (self: FIELD) => T): this {
      return this.withConfig({
         publications: [...(this.config.publications ?? []), { chan, produce, hoist: false }],
      })
   }

   publishSelfLocallyToChannel(chan: Channel<FIELD> | ChannelId): this {
      return this.withConfig({
         publications: [...(this.config.publications ?? []), { chan, hoist: false, produce: (s) => s }],
      })
   }

   publishToChannel<T>(chan: Channel<T> | ChannelId, produce: (self: FIELD) => T): this {
      return this.withConfig({
         publications: [...(this.config.publications ?? []), { chan, hoist: true, produce }],
      })
   }

   publishSelfToChannel(chan: Channel<FIELD> | ChannelId): this {
      return this.withConfig({
         publications: [...(this.config.publications ?? []), { chan, hoist: true, produce: (s) => s }],
      })
   }

   publishValueToChannel(chan: Channel<FIELD['{value}']> | ChannelId): this {
      return this.withConfig({
         publications: [...(this.config.publications ?? []), { chan, hoist: true, produce: (s) => s.zValue }],
      })
   }

   subscribeToChannel<T>(chan: Channel<T> | ChannelId, effect: (arg: T, self: FIELD) => void): this {
      return this.addReaction(
         (self) => self.zReadChannel(chan),
         (arg, self) => {
            if (arg == null) return
            effect(arg, self)
         },
      )
   }

   get reactions(): readonly FieldReaction<FIELD>[] {
      return this.config.reactions ?? []
   }

   // 🔴 not sure why FIELD['{config}'] cannot be equated to FieldConfigFor<FIELD>
   private get konfig(): FieldConfigFor<FIELD> {
      return this.config as any
   }

   get publications(): Publication<any, FIELD>[] {
      return this.konfig.publications ?? []
   }

   addReaction<T>(expr: (self: FIELD) => T, effect: (arg: T, self: FIELD) => void): this {
      return this.withConfig({
         reactions: [...(this.config.reactions ?? []), { expr, effect }],
      })
   }

   // #region CREATE DOCUMENTS
   // ------------------------------------------------------------
   // Instanciation

   /**
    * Create a `document` from a given schema.
    * (create a root field along it's children)
    *
    * 👉 the resulting document may have errors but the field construction will not crash.
    * | accessing invalid value will crash, though.
    * |  (e.g. if the serial is missing and if some fields are required but lack proper default)
    * |  `b.fields({ x: b.string_() }).create().value.x` => THROW, because value.x is undefined; x has no defalut value
    *
    * the name `create` is kept for backward compatibility, but we may add some suffix later.
    * 💬 2024-09-04 rvion:
    * | I think it's an acceptable behaviour for the default `create` function.
    *
    * @since 2024-01-01-ish
    * @category Create Document
    */
   create(
      // when unspecified, an empty serial is used
      serial?: Maybe<FIELD['{serial}']>,
      /** when unspecified, the global repository will be used */
      repository_?: Repository,
   ): FIELD {
      const repository = repository_ ?? getGlobalRepository()
      return this.instanciate(repository, null, null, '$', serial)
   }

   createFromValue(value?: FIELD['{value}'], repository_?: Repository): FIELD {
      return this.create(this.generateSerial(value), repository_)
   }

   // ------------------------------------------------------------------------
   // 💬 2025-03-25 rvion:
   // 🔴 this was caching serial too agressively
   // | get defaultSerial(): FIELD['{serial}'] {
   // |    const serial = this.fieldConstructor.generateSerial(undefined, this.config)
   // |    Object.defineProperty(this, 'defaultSerial', { value: serial })
   // |    return serial
   // | }
   //
   // 🟢 a better solution would be to have `generateSerial()` return whether or not
   // - 🟢 would still be cached in most cases
   // - 🔶 we would loose the serial equality unless we hash every value and maintain a cache
   //     - we could only keep the past hash/serial everytime; would still be a decent heuristic.
   //
   // 🔶 a temporary hacky solution is to cache it if the 2nd call yields the same hash as the first call.
   // 👉 IT IS STILL WRONG (just a bit less)
   // a `Z.Day` would appear stable, but it's not => default will be wrong when day change if
   // server is not restarted.

   private ___empty: Maybe<{
      hash: string
      serial: FIELD['{serial}']
      stable: boolean | null
   }>
   get defaultSerial(): FIELD['{serial}'] {
      const serial = this.fieldConstructor.generateSerial(undefined, this.config)
      // first call
      if (this.___empty == null) {
         this.___empty = { serial, hash: JSON.stringify(serial), stable: null }
      }
      // second call
      else if (this.___empty.stable == null) {
         const hash = JSON.stringify(serial)
         if (this.___empty.hash === hash) {
            // if 2nd call yields the exact same hash as 1st call,
            // we cache it as stable
            const FINAL = this.___empty.serial
            Object.defineProperty(this, 'defaultSerial', { value: FINAL })
            this.___empty = null
            return FINAL
         } else {
            this.___empty.stable = false
         }
      }
      // 3rd+ calls
      return serial
   }
   // ------------------------------------------------------------------------

   generateSerial(value: Maybe<FIELD['{value}']>): FIELD['{serial}'] {
      if (value === undefined) return this.defaultSerial

      return this.fieldConstructor.generateSerial(value, this.config)
   }

   /**
    * create a `document` from a given schema, but reduce its API surface to be `Draft`-like.
    *
    * @since 2024-09-02
    * @category Create Document
    * @category Validation
    */
   createDraft(
      //
      serial_?: FIELD['{serial}'],
      /** when unspeficied, the global repository will be used */
      repository_?: Repository,
   ): DraftLike<FIELD> {
      return this.create(serial_, repository_)
   }

   // #region CREATE SUB-FIELDS
   /**
    * unlike `create`, this allow to pass parent/root and can be
    * used to instantiate field deep within a document
    *
    * 👉 If you need to create a document, please use `create` or one
    * of its variant instead.
    */
   instanciate(
      //
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      initialMountKey: string,
      serial?: unknown,
   ): FIELD {
      return runInAction(() => {
         // create the instance
         const args: FieldCtorProps<any> = [
            repo,
            root,
            parent,
            this,
            initialMountKey,
            serial ?? this.defaultSerial,
         ]
         const KTOR: Klass<FIELD> = this.konfig.classToUse ?? this.fieldConstructor
         const field: FIELD = new KTOR(...args)

         // start publications
         field.zRunPublications()

         // start reactions
         for (const { expr, effect } of this.reactions) {
            // 🔴 Need to dispose later
            reaction(
               () => expr(field),
               (arg) => effect(arg, field),
               { fireImmediately: true },
            )
         }
         return field
      })
   }

   addCheck(
      /** the check function you want to add */
      check_: NonNullable<FIELD['{config}']['check']>,

      /**
       * a list of explicit dependencies this function should be cache against
       * helps to cache schema which enables a wide range of optimisations
       *    - fast path when comparing schema
       *    - reused derived values (travels, children, etc.)
       */
      memo: any[],
   ): this {
      const checkToAdd = memoizedFN(this, 'addCheck-1', check_, memo)
      const prevCheck = this.config.check
      // case 1. same
      if (prevCheck === checkToAdd) return this

      // case 2. first check
      if (prevCheck == null) return this.withConfig({ check: checkToAdd })

      // case 3. merge both
      const mergedChecks = memoizedFN(
         this,
         'addCheck-2',
         (f) => {
            const prevCheckResults = prevCheck!(f)
            const nextCheckResults = checkToAdd(f)
            return [prevCheckResults, nextCheckResults]
         },
         [prevCheck, checkToAdd],
      )

      return this.withConfig({ check: mergedChecks })
   }

   // CODEGEN -------------------------------------------------------
   codeForTypescriptValue(p?: { indent?: number; tab?: string }): string {
      return this.fieldConstructor.codeForTypescriptValue(this.config, { tab: '   ', indent: 0, ...p })
   }

   // ------------------------------------------------------------------------
   neighboors: { [key in NeighborhoodName]: CSchemaNeighborhood<string> } = {
      children: new CSchemaNeighborhood<string>('children', this, () =>
         this.fieldConstructor.getChildren(this.config),
      ),
      travels: new CSchemaNeighborhood<TravelEdge>('travels', this, () =>
         this.fieldConstructor.getTravels(this.config),
      ),
   }
   get children(): CSchemaNeighborhood<string>{ return this.neighboors.children } // prettier-ignore
   get travels(): CSchemaNeighborhood<TravelEdge>{ return this.neighboors.travels } // prettier-ignore

   getSerialPath(travelPath: string[]): Maybe<string> {
      const found = this.travels.getP(travelPath)
      let path = found.serialPath
      let node = found.schema

      if (isSchemaOptional(node)) {
         node = node.config.schema
         path = `${path}.y`
      }

      // leaves.
      if (isSchemaString(node)) path = `${path}.value`
      if (isSchemaNumber(node)) path = `${path}.value`
      if (isSchemaBool(node)) path = `${path}.value`
      if (isSchemaDate(node)) path = `${path}.value`
      if (isSchemaSelectMany(node)) path = `${path}.values`
      if (isSchemaSelectOne(node)) path = `${path}.val`
      // 🚂 if (isSchemaRelationship(node)) path = `${path}.value`
      // 🚂 if (isSchemaRelationships(node)) path = `${path}.value`

      return path
   }

   postgres_castJsonExpr(uncasted: string): Maybe<string> {
      // eslint-disable-next-line consistent-this
      let node: CSchema = this

      if (isSchemaOptional(node)) node = node.config.schema
      // leaves.
      if (isSchemaString(node)) return `${uncasted} #>> '{{}}'`
      if (isSchemaNumber(node)) return `${uncasted}::float`
      if (isSchemaBool(node)) return `${uncasted}::boolean`
      if (isSchemaDate(node)) return `(${uncasted} #>> '{{}}')::timestamp`
      if (isSchemaSelectMany(node)) return `${uncasted} #>> '{{}}'`
      if (isSchemaSelectOne(node)) return `${uncasted} #>> '{{}}'`
      // 🚂 if (isSchemaRelationship(node)) return `(${uncasted} #>> '{{}}')::uuid`
      // 🚂 if (isSchemaRelationships(node)) return `(${uncasted} #>> '{{}}')::text[]::uuid[]`

      console.log('🦫 unsupported castor type', node.type)
      return `${uncasted}::🦫`
   }
}
