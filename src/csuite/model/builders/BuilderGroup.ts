import type { NO_PROPS } from '../../types/NO_PROPS'
import type { Field } from '../Field'
import type { SchemaDict } from '../SchemaDict'

import { Field_group, type Field_group_config } from '../../fields/group/FieldGroup'
import { BaseBuilder } from './BaseBuilder'

interface SchemaAndAliasesᐸ_ᐳ extends HKT<Field> {
    Group: HKT<SchemaDict>
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

    empty(config: Field_group_config<NO_PROPS> = {}): Apply<Schemaᐸ_ᐳ['Group'], NO_PROPS> {
        return this.group(config)
    }
}
