import type { CovariantFC } from '../variance/CovariantFC'
import type { Field, FieldCtorProps } from './Field'
import type { FieldConstructor } from './FieldConstructor'
import type { Channel, ChannelId } from './pubsub/Channel'
import type { FieldReaction } from './pubsub/FieldReaction'
import type { Producer } from './pubsub/Producer'
import type { ValidationError } from './ValidationError'

import { reaction } from 'mobx'

import { getUIDForMemoryStructure } from '../utils/getUIDForMemoryStructure'
import { Draft, type DraftLike } from './Draft'
import { getGlobalRepository, type Repository } from './Repository'

export interface BaseSchema<out FIELD extends Field = Field> {
    $Field: FIELD
    $Type: FIELD['$Type']
    $Config: FIELD['$Config']
    $Serial: FIELD['$Serial']
    $Value: FIELD['$Value']
    $Unchecked: FIELD['$Unchecked']
}

export abstract class BaseSchema<out FIELD extends Field = Field> {
    // ------------------------------------------------------------
    applyFieldExtensions(field: FIELD): void {
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
    useClass<EXTS extends Field>(
        /** the class constructor */
        classToUse: (base: new (...args: any[]) => FIELD) => new (...args: any[]) => EXTS,
    ): BaseSchema<EXTS /* & FIELD */> {
        if (this.config.classToUse != null) throw new Error('already have a custom class')
        if (this.config.builderToUse != null) throw new Error('already have a custom class')
        return this.withConfig({ classToUse }) as any as BaseSchema<EXTS>
    }

    useBuilder<EXTS extends Field>(
        /** the builder function that will call some field constructor itself */
        builderToUse: (...args: FieldCtorProps<FIELD>) => EXTS,
    ): BaseSchema<EXTS /* & FIELD */> {
        if (this.config.classToUse != null) throw new Error('already have a custom class')
        if (this.config.builderToUse != null) throw new Error('already have a custom class')
        return this.withConfig({ builderToUse }) as any as BaseSchema<EXTS>
    }

    useMixin<EXTS extends object>(extensions: (self: FIELD) => EXTS): BaseSchema<EXTS & FIELD> {
        const x: BaseSchema<FIELD> = this.withConfig({
            customFieldProperties: [...(this.config.customFieldProperties ?? []), extensions],
        })
        return x as any as BaseSchema<EXTS & FIELD>
    }

    applySchemaExtensions(): void {
        for (const ext of this.config.customSchemaProperties ?? []) {
            const xxx = ext(this)
            Object.defineProperties(this, Object.getOwnPropertyDescriptors(xxx))
        }
    }
    // ------------------------------------------------------------
    /** constructor/class/builder-fn of the field to instanciate */
    abstract fieldConstructor: FieldConstructor<FIELD>

    /** type of the field to instanciate */
    get type(): FIELD['type'] {
        return this.fieldConstructor.type
    }

    /** config of the field to instanciate */
    abstract config: FIELD['$Config']

    // ------------------------------------------------------------
    LabelExtraUI?: CovariantFC<{ field: FIELD }>

    // ------------------------------------------------------------
    // Clone/Fork
    abstract withConfig(config: Partial<FIELD['$Config']>): this

    /** clone the schema, and patch the cloned config to make it hidden */
    hidden(): this {
        return this.withConfig({ hidden: true })
    }

    // PubSub -----------------------------------------------------
    publish<T>(chan: Channel<T> | ChannelId, produce: (self: FIELD['$Field']) => T): this {
        return this.withConfig({
            producers: [...(this.config.producers ?? []), { chan, produce }],
        })
    }

    subscribe<T>(chan: Channel<T> | ChannelId, effect: (arg: T, self: FIELD['$Field']) => void): this {
        return this.addReaction(
            (self) => self.consume(chan),
            (arg, self) => {
                if (arg == null) return
                effect(arg, self)
            },
        )
    }

    get reactions(): FieldReaction<FIELD>[] {
        return this.config.reactions ?? []
    }

    get producers(): Producer<any, FIELD>[] {
        return this.config.producers ?? []
    }

    addReaction<T>(
        //
        expr: (self: FIELD['$Field']) => T,
        effect: (arg: T, self: FIELD['$Field']) => void,
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
        serial_?: Maybe<FIELD['$Serial']> | false,
        /** when unspeficied, the global repository will be used */
        repository_?: Repository,
    ): FIELD {
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
        serial_?: FIELD['$Serial'] | false,
        /** when unspeficied, the global repository will be used */
        repository_?: Repository,
    ): DraftLike<FIELD> {
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
        serial_?: FIELD['$Serial'] | false,
        /** when unspeficied, the global repository will be used */
        repository_?: Repository,
    ): Draft<FIELD> {
        const field = this.create(serial_, repository_)
        const draft = new Draft<FIELD>(field)
        return draft
    }

    /**
     * @since 2024-09-04
     * @category Create Document
     * @category Validation
     */
    createAndValidate(
        serial?: FIELD['$Serial'] | false,
        /** when unspeficied, the global repository will be used */
        repository?: Repository,
    ): Result<FIELD, ValidationError> {
        return this.create(serial, repository).validate()
    }

    /**
     * create a document, and throw if fields is invalid
     *
     * @since 2024-09-04
     * @category Validation
     */
    createOrThrowIfInvalid(
        serial?: FIELD['$Serial'] | false,
        /** when unspeficied, the global repository will be used */
        repository?: Repository,
    ): FIELD {
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
    ): FIELD {
        // /* 😂 */ console.log(`[🤠] ${getUIDForMemoryStructure(serial)} (Field.instanciate, before creating instance 🟢 )`)
        // create the instance
        let field: FIELD
        if (this.fieldConstructor.build === 'new') {
            if (this.config.classToUse) {
                const KTOR = this.config.classToUse(this.fieldConstructor)
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
