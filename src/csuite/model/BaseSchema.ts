import type { Field_link_config } from '../fields/link/FieldLink'
import type { Field_list_config } from '../fields/list/FieldList'
import type { Field_optional_config } from '../fields/optional/FieldOptional'
import type { CovariantFn } from '../variance/BivariantHack'
import type { CovariantFC } from '../variance/CovariantFC'
import type { FieldTypes } from './$FieldTypes'
import type { Field, FieldCtorProps } from './Field'
import type { FieldConstructor } from './FieldConstructor'
import type { Channel, ChannelId } from './pubsub/Channel'
import type { FieldReaction } from './pubsub/FieldReaction'
import type { Producer } from './pubsub/Producer'
import type { Result } from './Result'
import type { ValidationError } from './ValidationError'

import { reaction } from 'mobx'
import { nanoid } from 'nanoid'

import { getFieldLinkClass, getFieldListClass, getFieldOptionalClass } from '../fields/WidgetUI.DI'
import { objectAssignTsEfficient_t_pt } from '../utils/objectAssignTsEfficient'
import { potatoClone } from '../utils/potatoClone'
import { Draft, type DraftLike } from './Draft'
import { getKlass, type KlassToUse } from './KlassToUse'
import { getGlobalRepository, type Repository } from './Repository'

interface SchemaAndAliasesᐸ_ᐳ extends HKT<FieldTypes> {
   Link: HKT
   List: HKT
   Optional: HKT
}

export interface BaseSchema<
   //
   out TYPES extends FieldTypes = FieldTypes,
   Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ = SchemaAndAliasesᐸ_ᐳ,
> {
   $field: TYPES['$field']
   $type: TYPES['$type']
   $config: TYPES['$config']
   $serial: TYPES['$serial']
   $value: TYPES['$value']
   $unchecked: TYPES['$unchecked']
   $child: TYPES['$child']
   $reflect: TYPES['$reflect']
   // reflect API
}

export class BaseSchema<
   //
   out TYPES extends FieldTypes = FieldTypes,
   Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ = SchemaAndAliasesᐸ_ᐳ,
> {
   codegenValueType(): string {
      return this.fieldConstructor.codegenValueType(this.config)
   }

   /** is not stable; but should be hopefully */
   uid = nanoid()
   withUID(uid: string): this {
      this.uid = uid
      return this
   }

   /** untyped so the schema remains covariant over Field */
   private UNSAFE_selfConstructor: any

   // private get pocLessUnsafe_selfConstructor(): CovariantFn<[fieldConstructor: FieldConstructor<FIELD>, config: FIELD['$config']],  Apply<HKSCHEMA, FIELD>> {
   //     return this.UNSAFE_selfConstructor
   // }

   constructor(
      /** field constructor (class or function, see FieldConstructor definition)  */
      public fieldConstructor: FieldConstructor<TYPES /* 🔴['$field'] */>,
      /** config of the field to instanciate */
      public readonly config: TYPES['$config'],
      /** necessary for higher-kinded clone (e.g. withConfig) */
      selfConstructor: (
         //
         fieldConstructor: FieldConstructor<TYPES /* 🔴['$field'] */>,
         config: TYPES['$config'],
      ) => Apply<Schemaᐸ_ᐳ, TYPES['$field']>,
   ) {
      this.UNSAFE_selfConstructor = selfConstructor

      // early check, just in case, this should also be checked at instanciation time
      if (this.config.classToUse != null) {
         if (fieldConstructor.build !== 'new') throw new Error('impossible to use a custom class')
         if (this.config.builderToUse != null) throw new Error('impossible to use a custom class')
      }
      if (this.config.builderToUse != null) {
         if (fieldConstructor.build !== 'new') throw new Error('impossible to use a custom class')
         if (this.config.classToUse != null) throw new Error('impossible to use a custom class')
      }
   }

   // ------------------------------------------------------------
   applyFieldExtensions(field: TYPES['$field']): void {
      for (const ext of this.config.customFieldProperties ?? []) {
         const xxx = ext(field)
         Object.defineProperties(field, Object.getOwnPropertyDescriptors(xxx))
      }
   }

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
    * class Foo1 extends Field_group<T0['$field']['$Subfields']> {
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
    * const S1: Schema<Foo1> = S0.useClass(() => Foo1)
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
    * // S1: BaseSchema<Foo2>                      // 👈 but can't be anno
    * ```
    *
    */
   useClass<CUSTOM extends Field>(
      /** the class constructor */
      // prettier-ignore
      classToUse: KlassToUse<TYPES['$field'], CUSTOM>,
   ): Apply<Schemaᐸ_ᐳ, CUSTOM> {
      if (this.config.classToUse != null) throw new Error('already have a custom class')
      if (this.config.builderToUse != null) throw new Error('already have a custom class')
      return this.withConfig({ classToUse }) as any as Apply<Schemaᐸ_ᐳ, CUSTOM>
   }

   useBuilder<F extends Field>(
      /** the builder function that will call some field constructor itself */
      builderToUse: (...args: FieldCtorProps<TYPES>) => F,
   ): Apply<Schemaᐸ_ᐳ, F> {
      if (this.config.classToUse != null) throw new Error('already have a custom class')
      if (this.config.builderToUse != null) throw new Error('already have a custom class')
      return this.withConfig({ builderToUse }) as any as Apply<Schemaᐸ_ᐳ, F>
   }

   useMixin<EXTS extends object>(
      extensions: (self: TYPES['$field']) => EXTS,
   ): Apply<Schemaᐸ_ᐳ, TYPES & { $field: EXTS & TYPES['$field'] }> {
      const x: BaseSchema<TYPES> = this.withConfig({
         customFieldProperties: [...(this.config.customFieldProperties ?? []), extensions],
      })
      return x as any
   }

   /**
    * chain construction
    * @since 2024-06-30
    * TODO: WRITE MORE DOC
    * MORE DOC: yo dawg; I heard you like beeing hight wiht types, so I put a type in your type,
    * so you can type a lot of type.
    */
   useIn<BP extends BaseSchema>(
      fn: CovariantFn<[field: TYPES['$field']], BP>,
   ): Apply<Schemaᐸ_ᐳ['Link'], this, BP> {
      const FieldLinkClass = getFieldLinkClass()
      const linkConf: Field_link_config<this, BP> = { share: this, children: fn }
      return this.UNSAFE_selfConstructor(FieldLinkClass, linkConf)
   }

   /** wrap field schema to list stuff */
   list(config: Omit<Field_list_config<this>, 'element'> = {}): Apply<Schemaᐸ_ᐳ['List'], this> {
      return this.list_({ defaultLength: config.defaultLength ?? config.min ?? 0, ...config })
   }

   /** wrap field schema to list stuff */
   list_(config: Omit<Field_list_config<this>, 'element'> = {}): Apply<Schemaᐸ_ᐳ['List'], this> {
      const FieldListClass = getFieldListClass()
      return this.UNSAFE_selfConstructor(FieldListClass, { ...config, element: this })
   }

   /** make field optional (A => Maybe<A>) */
   optional(
      startActive: boolean = false,
      config?: Partial<Field_optional_config<this>>,
   ): Apply<Schemaᐸ_ᐳ['Optional'], this> {
      const FieldOptionalClass = getFieldOptionalClass()
      return this.UNSAFE_selfConstructor(FieldOptionalClass, {
         schema: this,
         startActive: startActive,
         label: this.config.label,
         startCollapsed: this.config.startCollapsed,
         collapsed: this.config.collapsed,
         border: this.config.border,
         ...config,
      })
   }

   applySchemaExtensions(): void {
      for (const ext of this.config.customSchemaProperties ?? []) {
         const xxx = ext(this)
         Object.defineProperties(this, Object.getOwnPropertyDescriptors(xxx))
      }
   }
   // ------------------------------------------------------------
   // ⏸️ /** constructor/class/builder-fn of the field to instanciate */
   // ⏸️ fieldConstructor: FieldConstructor<FIELD>

   /** type of the field to instanciate */
   get type(): TYPES['$type'] {
      return this.fieldConstructor.type
   }

   // ⏸️ /** config of the field to instanciate */
   // ⏸️ config: FIELD['$config']

   // ------------------------------------------------------------
   LabelExtraUI?: CovariantFC<{ field: TYPES['$field'] }>

   // ------------------------------------------------------------
   // Clone/Fork
   withConfig(config: Partial<TYPES['$config']>): this {
      const mergedConfig = objectAssignTsEfficient_t_pt(potatoClone(this.config), config)
      const cloned = this.UNSAFE_selfConstructor(this.fieldConstructor, mergedConfig)
      return cloned
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
   publish<T>(chan: Channel<T> | ChannelId, produce: (self: TYPES['$field']) => T): this {
      return this.withConfig({
         producers: [...(this.config.producers ?? []), { chan, produce }],
      })
   }

   publishSelf(chan: Channel<TYPES['$field']> | ChannelId): this {
      return this.withConfig({
         producers: [...(this.config.producers ?? []), { chan, produce: (s) => s }],
      })
   }

   publishValue(chan: Channel<TYPES['$value']> | ChannelId): this {
      return this.withConfig({
         producers: [...(this.config.producers ?? []), { chan, produce: (s) => s.value }],
      })
   }

   subscribe<T>(chan: Channel<T> | ChannelId, effect: (arg: T, self: TYPES['$field']) => void): this {
      return this.addReaction(
         (self) => self.consume(chan),
         (arg, self) => {
            if (arg == null) return
            effect(arg, self)
         },
      )
   }

   get reactions(): FieldReaction<TYPES['$field']>[] {
      return this.config.reactions ?? []
   }

   get producers(): Producer<any, TYPES['$field']>[] {
      return this.config.producers ?? []
   }

   addCheck(check: NonNullable<TYPES['$config']['check']>): this {
      const prevCheck = this.config.check
      if (prevCheck == null) return this.withConfig({ check })
      return this.withConfig({
         check: (f) => {
            const prevCheckResults = prevCheck!(f)
            const nextCheckResults = check(f)
            return [prevCheckResults, nextCheckResults]
         },
      })
   }

   addReaction<T>(
      //
      expr: (self: TYPES['$field']) => T,
      effect: (arg: T, self: TYPES['$field']) => void,
   ): this {
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
      serial_?: Maybe<TYPES['$serial']> | false,
      /** when unspeficied, the global repository will be used */
      repository_?: Repository,
   ): TYPES['$field'] {
      const repository = repository_ ?? getGlobalRepository()
      const serial = serial_ === false ? undefined : serial_
      return this.instanciate(repository, null, null, '$', serial)
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
      serial_?: TYPES['$serial'] | false,
      /** when unspeficied, the global repository will be used */
      repository_?: Repository,
   ): DraftLike<TYPES> {
      return this.create(serial_, repository_)
   }

   /**
    * similar to `createDraft`, but actually create an intermediary `Draft` object
    * instead of directly sending the field disguised as a Draft though type masking/interface.
    *
    * @since 2024-09-02
    * @category Create Document
    * @category Validation
    */
   createDraftAlt(
      //
      serial_?: TYPES['$serial'] | false,
      /** when unspeficied, the global repository will be used */
      repository_?: Repository,
   ): Draft<TYPES> {
      const field = this.create(serial_, repository_)
      const draft = new Draft<TYPES>(field)
      return draft
   }

   /**
    * @since 2024-09-04
    * @category Create Document
    * @category Validation
    */
   createAndValidate(
      serial?: TYPES['$serial'] | false,
      /** when unspeficied, the global repository will be used */
      repository?: Repository,
   ): Result<TYPES['$field'], ValidationError> {
      return this.create(serial, repository).validate()
   }

   /**
    * create a document, and throw if fields is invalid
    *
    * @since 2024-09-04
    * @category Validation
    */
   createOrThrowIfInvalid(
      serial?: TYPES['$serial'] | false,
      /** when unspeficied, the global repository will be used */
      repository?: Repository,
   ): TYPES['$field'] {
      return this.create(serial, repository).validateOrThrow()
   }

   // #region CREATE SUB-FIELDS
   /**
    * unlike `create`, this allow to pass parent/root and can be
    * used to instanciate field deep within a document
    *
    * 👉 If you need to create a document, please use `create` or one
    * of its vairant instead.
    */
   instanciate(
      //
      repo: Repository,
      root: Field<any> | null,
      parent: Field | null,
      initialMountKey: string,
      serial?: unknown,
   ): TYPES['$field'] {
      // /* 😂 */ console.log(`[🤠] ${getUIDForMemoryStructure(serial)} (Field.instanciate, before creating instance 🟢 )`)
      // create the instance
      let field: TYPES['$field']
      if (this.fieldConstructor.build === 'new') {
         if (this.config.classToUse) {
            const SUPER = this.fieldConstructor
            const KTOR = getKlass(SUPER, this.config.classToUse)
            field = new KTOR(repo, root, parent, this, serial)
         } else if (this.config.builderToUse != null) {
            field = this.config.builderToUse(repo, root, parent, this, initialMountKey, serial)
         } else {
            const KTOR = this.fieldConstructor
            field = new KTOR(repo, root, parent, this, initialMountKey, serial)
         }
      } else {
         /** final safety net for the extends class feature */
         if (this.config.classToUse != null) {
            throw new Error('impossible to use a custom class when using a FieldConstructor_ViaFunction')
         }

         field = this.fieldConstructor.build(repo, root, parent, this, initialMountKey, serial)
      }

      // start publications
      field.publishValue()

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
   }
}
