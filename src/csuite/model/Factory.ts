import type { Field_group } from '../fields/group/FieldGroup'
import type { BaseSchema } from './BaseSchema'
import type { DraftLike } from './Draft'
import type { EntityConfig } from './Entity'
import type { IBuilder } from './IBuilder'
import type { SchemaDict } from './SchemaDict'

import { type DependencyList, useMemo } from 'react'

import { getGlobalRepository, type Repository } from './Repository'

/** a factory is a top-level class aimed to */
export class Factory<BUILDER extends IBuilder = IBuilder> {
    /**
     * repository technically doesn't require a builder to function
     * but it's easier to assume most project will have one repository,
     * and one default builder.
     * it makes it easier to add convenience mothods on the repository
     * so we can use it to create fields, and not just to retrieve them.
     */
    builder: BUILDER
    repository: Repository

    constructor(
        //
        builder: BUILDER,
        repository?: Repository,
    ) {
        this.repository = repository ?? getGlobalRepository()
        this.builder = builder
    }

    /** LEGACY API; TYPES ARE COMPLICATED DUE TO MAINTAINING BACKWARD COMPAT */
    fields<FIELDS extends SchemaDict>(
        schemaExt: (form: BUILDER) => FIELDS,
        entityConfig: EntityConfig<BaseSchema<Field_group<NoInfer<FIELDS>>>> = { name: 'unnamed' },
    ): Field_group<FIELDS> {
        const schema = this.builder.group({
            label: false,
            items: schemaExt(this.builder),
            collapsed: false,
            onSerialChange: entityConfig.onSerialChange,
            onValueChange: entityConfig.onValueChange,
        })

        // 👇 🔴 CALL CREATE INSTEAD
        return schema.instanciate(
            //
            this.repository,
            null,
            null,
            '$',
            entityConfig.serial?.(),
        )
    }

    // #region Creation
    /** simple alias to create a new Document */
    document<SCHEMA extends BaseSchema>(
        schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
        entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
    ): SCHEMA['$Field'] {
        let schema: SCHEMA = this.evalSchema(schemaExt)
        if (entityConfig.onSerialChange || entityConfig.onValueChange)
            schema = schema.withConfig({
                onSerialChange: entityConfig.onSerialChange,
                onValueChange: entityConfig.onValueChange,
            })
        return schema.create(entityConfig.serial?.(), this.repository)
    }

    /** simple alias to create a new Document */
    draft<SCHEMA extends BaseSchema>(
        schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
        entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
    ): DraftLike<SCHEMA['$Field']> {
        return this.document(schemaExt, entityConfig)
    }

    // #region React Hooks

    /** simple way to defined forms and in react components */
    use<SCHEMA extends BaseSchema>(
        schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
        entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
        deps: DependencyList = [],
    ): SCHEMA['$Field'] {
        const schema: SCHEMA = this.evalSchema(schemaExt)
        return useMemo(() => this.document(schema, entityConfig), deps)
    }

    useDraft<SCHEMA extends BaseSchema>(
        schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
        entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
        deps: DependencyList = [],
    ): DraftLike<SCHEMA['$Field']> {
        const schema: SCHEMA = this.evalSchema(schemaExt)
        return useMemo(() => this.draft(schema, entityConfig), deps)
    }

    /** simple way to defined forms and in react components */
    useLocalstorage<SCHEMA extends BaseSchema>(
        key: string,
        schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
        deps: DependencyList = [],
    ): SCHEMA['$Field'] {
        const schema: SCHEMA = this.evalSchema(schemaExt)
        let serial: any = null

        try {
            const prev = localStorage.getItem(key)
            const parsed = prev ? JSON.parse(prev) : null
            serial = parsed
        } catch {}

        return useMemo(
            () =>
                this.document(schema, {
                    serial: () => serial,
                    onSerialChange: (root) => {
                        localStorage.setItem(key, JSON.stringify(root.serial))
                    },
                }),
            deps,
        )
    }

    // #region misc
    /** simple alias to create a new Form */
    define<SCHEMA extends BaseSchema>(schemaFn: (form: BUILDER) => SCHEMA): SCHEMA {
        return schemaFn(this.builder)
    }

    /** eval schema if it's a function */
    private evalSchema<SCHEMA extends BaseSchema>(buildFn: SCHEMA | ((form: BUILDER) => SCHEMA)): SCHEMA {
        if (typeof buildFn === 'function') return buildFn(this.builder as BUILDER)
        return buildFn
    }
}
