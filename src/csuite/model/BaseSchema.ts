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
    $Field: TYPES['$Field']
    $Type: TYPES['$Type']
    $Config: TYPES['$Config']
    $Serial: TYPES['$Serial']
    $Value: TYPES['$Value']
    $Unchecked: TYPES['$Unchecked']
    $Child: TYPES['$Child']
    $Reflect: TYPES['$Reflect']
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

    /** untyped so the schema remains covariant over Field */
    private UNSAFE_selfConstructor: any

    // private get pocLessUnsafe_selfConstructor(): CovariantFn<[fieldConstructor: FieldConstructor<FIELD>, config: FIELD['$Config']],  Apply<HKSCHEMA, FIELD>> {
    //     return this.UNSAFE_selfConstructor
    // }

    constructor(
        /** field constructor (class or function, see FieldConstructor definition)  */
        public fieldConstructor: FieldConstructor<TYPES /* 🔴['$Field'] */>,
        /** config of the field to instanciate */
        public readonly config: TYPES['$Config'],
        /** necessary for higher-kinded clone (e.g. withConfig) */
        selfConstructor: (
            //
            fieldConstructor: FieldConstructor<TYPES /* 🔴['$Field'] */>,
            config: TYPES['$Config'],
        ) => Apply<Schemaᐸ_ᐳ, TYPES['$Field']>,
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
    applyFieldExtensions(field: TYPES['$Field']): void {
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
     * class Foo1 extends Field_group<T0['$Field']['$Subfields']> {
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
        classToUse: KlassToUse<TYPES['$Field'], CUSTOM>,
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
        extensions: (self: TYPES['$Field']) => EXTS,
    ): Apply<Schemaᐸ_ᐳ, TYPES & { $Field: EXTS & TYPES['$Field'] }> {
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
    useIn<BP extends BaseSchema>(fn: CovariantFn<[field: TYPES['$Field']], BP>): Apply<Schemaᐸ_ᐳ['Link'], this, BP> {
        const FieldLinkClass = getFieldLinkClass()
        const linkConf: Field_link_config<this, BP> = { share: this, children: fn }
        return this.UNSAFE_selfConstructor(FieldLinkClass, linkConf)
    }

    /** wrap field schema to list stuff */
    list(config: Omit<Field_list_config<this>, 'element'> = {}): Apply<Schemaᐸ_ᐳ['List'], this> {
        return this.list_({ defaultLength: config.min ?? 0, ...config })
    }

    /** wrap field schema to list stuff */
    list_(config: Omit<Field_list_config<this>, 'element'> = {}): Apply<Schemaᐸ_ᐳ['List'], this> {
        const FieldListClass = getFieldListClass()
        return this.UNSAFE_selfConstructor(FieldListClass, { ...config, element: this })
    }

    /** make field optional (A => Maybe<A>) */
    optional(startActive: boolean = false, config?: Partial<Field_optional_config<this>>): Apply<Schemaᐸ_ᐳ['Optional'], this> {
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
    get type(): TYPES['$Type'] {
        return this.fieldConstructor.type
    }

    // ⏸️ /** config of the field to instanciate */
    // ⏸️ config: FIELD['$Config']

    // ------------------------------------------------------------
    LabelExtraUI?: CovariantFC<{ field: TYPES['$Field'] }>

    // ------------------------------------------------------------
    // Clone/Fork
    withConfig(config: Partial<TYPES['$Config']>): this {
        const mergedConfig = objectAssignTsEfficient_t_pt(potatoClone(this.config), config)
        const cloned = this.UNSAFE_selfConstructor(this.fieldConstructor, mergedConfig)
        return cloned
    }

    /** clone the schema, and patch the cloned config to make it hidden */
    hidden(): this {
        return this.withConfig({ hidden: true })
    }

    // PubSub -----------------------------------------------------
    publish<T>(chan: Channel<T> | ChannelId, produce: (self: TYPES['$Field']) => T): this {
        return this.withConfig({
            producers: [...(this.config.producers ?? []), { chan, produce }],
        })
    }

    subscribe<T>(chan: Channel<T> | ChannelId, effect: (arg: T, self: TYPES['$Field']) => void): this {
        return this.addReaction(
            (self) => self.consume(chan),
            (arg, self) => {
                if (arg == null) return
                effect(arg, self)
            },
        )
    }

    get reactions(): FieldReaction<TYPES['$Field']>[] {
        return this.config.reactions ?? []
    }

    get producers(): Producer<any, TYPES['$Field']>[] {
        return this.config.producers ?? []
    }

    addReaction<T>(
        //
        expr: (self: TYPES['$Field']) => T,
        effect: (arg: T, self: TYPES['$Field']) => void,
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
        //
        serial_?: Maybe<TYPES['$Serial']> | false,
        /** when unspeficied, the global repository will be used */
        repository_?: Repository,
    ): TYPES['$Field'] {
        // /* 😂 */ console.log(`[🤠] ${getUIDForMemoryStructure(serial_)} (BaseSchema.create (start))`)
        const repository = repository_ ?? getGlobalRepository()
        const serial = serial_ === false ? undefined : serial_
        // /* 😂 */ console.log(`[🤠] ${getUIDForMemoryStructure(serial)} (BaseSchema.create)`)
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
        serial_?: TYPES['$Serial'] | false,
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
        serial_?: TYPES['$Serial'] | false,
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
        serial?: TYPES['$Serial'] | false,
        /** when unspeficied, the global repository will be used */
        repository?: Repository,
    ): Result<TYPES['$Field'], ValidationError> {
        return this.create(serial, repository).validate()
    }

    /**
     * create a document, and throw if fields is invalid
     *
     * @since 2024-09-04
     * @category Validation
     */
    createOrThrowIfInvalid(
        serial?: TYPES['$Serial'] | false,
        /** when unspeficied, the global repository will be used */
        repository?: Repository,
    ): TYPES['$Field'] {
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
    ): TYPES['$Field'] {
        // /* 😂 */ console.log(`[🤠] ${getUIDForMemoryStructure(serial)} (Field.instanciate, before creating instance 🟢 )`)
        // create the instance
        let field: TYPES['$Field']
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
