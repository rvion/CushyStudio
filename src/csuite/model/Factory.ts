import type { Field_group } from '../fields/group/FieldGroup'
import type { BaseSchema } from './BaseSchema'
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
        return schema.instanciate(
            //
            this.repository,
            null,
            null,
            entityConfig.serial?.(),
        )
    }

    /** simple alias to create a new Form */
    define<SCHEMA extends BaseSchema>(
        schemaFn: ((form: BUILDER) => SCHEMA),
    ):SCHEMA{
        return schemaFn(this.builder)   
    }
    
    /** simple alias to create a new Form */
    entity<SCHEMA extends BaseSchema>(
        schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
        entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
    ): SCHEMA['$Field'] {
        let schema: SCHEMA = this.evalSchema(schemaExt)
        if (entityConfig.onSerialChange || entityConfig.onValueChange)
            schema = schema.withConfig({
                onSerialChange: entityConfig.onSerialChange,
                onValueChange: entityConfig.onValueChange,
            })
        return schema.instanciate(
            //
            this.repository,
            null,
            null,
            entityConfig.serial?.(),
        )
    }

    /** simple way to defined forms and in react components */
    use<SCHEMA extends BaseSchema>(
        schemaExt: SCHEMA | ((form: BUILDER) => SCHEMA),
        entityConfig: EntityConfig<NoInfer<SCHEMA>> = {},
        deps: DependencyList = [],
    ): SCHEMA['$Field'] {
        const schema: SCHEMA = this.evalSchema(schemaExt)
        return useMemo(() => this.entity(schema, entityConfig), deps)
    }

    /** eval schema if it's a function */
    private evalSchema<SCHEMA extends BaseSchema>(buildFn: SCHEMA | ((form: BUILDER) => SCHEMA)): SCHEMA {
        if (typeof buildFn === 'function') return buildFn(this.builder as BUILDER)
        return buildFn
    }
}
