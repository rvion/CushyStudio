import type { FieldTypes } from '../$FieldTypes'
import type { NO_PROPS } from '../../types/NO_PROPS'
import type { SchemaDict } from '../SchemaDict'

import { Field_group, type Field_group_config } from '../../fields/group/FieldGroup'
import { BaseBuilder } from './BaseBuilder'

interface SchemaAndAliasesᐸ_ᐳ extends HKT<FieldTypes> {
    Group: HKT<SchemaDict>
    Empty: Apply<this, Field_group<NO_PROPS>>
}

export class BuilderGroup<Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ> extends BaseBuilder<Schemaᐸ_ᐳ> {
    static fromSchemaClass = BaseBuilder.buildfromSchemaClass(BuilderGroup)

    /** see also: `fields` for a more practical api */
    group<T extends SchemaDict>(config: Field_group_config<T> = {}): Apply<Schemaᐸ_ᐳ['Group'], T> {
        return this.buildSchema(Field_group<T>, config)
    }

    fields<T extends SchemaDict>(items: T, config: Omit<Field_group_config<T>, 'items'> = {}): Apply<Schemaᐸ_ᐳ['Group'], T> {
        return this.group({ items, ...config })
    }

    empty(config: Field_group_config<NO_PROPS> = {}): Schemaᐸ_ᐳ['Empty'] {
        return this.group(config)
    }

    // Backward Compat (row/col)
    private _defaultGroupConfigs: {
        row?: Partial<Omit<Field_group_config<any>, 'items'>>
        column?: Partial<Omit<Field_group_config<any>, 'items'>>
    } = {}

    withDefaultGroupConfig(conf: { row?: Partial<Field_group_config<any>>; column?: Partial<Field_group_config<any>> }): this {
        Object.assign(this._defaultGroupConfigs, conf)
        return this
    }

    row = <T extends SchemaDict>(items: T, config: Omit<Field_group_config<T>, 'items'> = {}): Apply<Schemaᐸ_ᐳ['Group'], T> => {
        return this.fields(items, { ...this._defaultGroupConfigs.row, ...config })
    }

    column = <T extends SchemaDict>(
        items: T,
        config: Omit<Field_group_config<T>, 'items'> = {},
    ): Apply<Schemaᐸ_ᐳ['Group'], T> => {
        return this.fields(items, { ...this._defaultGroupConfigs.column, ...config })
    }
}
