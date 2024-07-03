import type { Field_group } from '../fields/group/WidgetGroup'
import type { EntityConfig } from './Entity'
import type { EntityId } from './EntityId'
import type { IBuilder } from './IBuilder'
import type { ISchema, SchemaDict } from './ISchema'

import { type DependencyList, useMemo } from 'react'

import { Field } from './Field'

/**
 * you need one, and only one (singleton) per project
 * allow to inject the proper form config for your specific project.
 * to avoid problem with hot-reload, export an instance from a module directly and use it from there.
 */
export class Repository<DOMAIN extends IBuilder> {
    //
    _allEntities: Map<EntityId, Field> = new Map()
    _allFields: Map<string, Field> = new Map()
    _allFieldsByType: Map<string, Map<string, Field>> = new Map()

    getEntityByID = (entityId: EntityId): Maybe<Field> => {
        return this._allEntities.get(entityId)
    }

    getFieldByID = (fieldId: string): Maybe<Field> => {
        return this._allFields.get(fieldId)
    }

    /**
     * return all currently instanciated widgets
     * field of a given input type
     */
    getWidgetsByType = <W extends Field = Field>(type: string): W[] => {
        const typeStore = this._allFieldsByType.get(type)
        if (!typeStore) return []
        return Array.from(typeStore.values()) as W[]
    }

    domain: DOMAIN
    constructor(domain: DOMAIN) {
        this.domain = domain
    }

    /** LEGACY API; TYPES ARE COMPLICATED DUE TO MAINTAINING BACKWARD COMPAT */
    fields = <FIELDS extends SchemaDict>(
        schemaExt: (form: DOMAIN) => FIELDS,
        modelConfig: EntityConfig<ISchema<Field_group<FIELDS>>, DOMAIN> = { name: 'unnamed' },
    ): Field<ISchema<Field_group<FIELDS>>, DOMAIN> => {
        const schema = this.domain.group({
            label: false,
            items: schemaExt(this.domain),
            collapsed: false,
        })
        const form = new Field<ISchema<Field_group<FIELDS>>, DOMAIN>(this, schema, modelConfig)
        return form
    }

    /** simple alias to create a new Form */
    entity<SCHEMA extends ISchema>(
        schemaExt: SCHEMA | ((form: DOMAIN) => SCHEMA),
        modelConfig: EntityConfig<SCHEMA> = {},
    ): SCHEMA['$Field'] {
        const schema: SCHEMA = this.evalSchema(schemaExt)
        return schema.instanciate(null, null, modelConfig.serial?.())
    }

    /** simple way to defined forms and in react components */
    use<SCHEMA extends ISchema>(
        schemaExt: (form: DOMAIN) => SCHEMA,
        modelConfig: EntityConfig<SCHEMA> = {},
        deps: DependencyList = [],
    ): SCHEMA['$Field'] {
        return useMemo(() => this.entity(schemaExt, modelConfig), deps)
    }

    /** eval schema if it's a function */
    private evalSchema = <SCHEMA extends ISchema>(
        //
        buildFn: SCHEMA | ((form: DOMAIN) => SCHEMA),
    ): SCHEMA => {
        if (typeof buildFn === 'function') return buildFn(this.domain as DOMAIN)
        return buildFn
    }
}
