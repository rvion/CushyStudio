import type { PartialOmit } from '../../../types/Misc'
import type { BaseSchema } from '../BaseSchema'
import type { Field } from '../Field'

import { Field_link, type Field_link_config } from '../../fields/link/FieldLink'
import { Field_shared } from '../../fields/shared/FieldShared'
import { BaseBuilder } from './BaseBuilder'

interface SchemaAndAliasesᐸ_ᐳ extends HKT<Field> {
    Link: HKT<BaseSchema, BaseSchema>
    Shared: HKT<Field>
}

export class BuilderShared<Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ> extends BaseBuilder<Schemaᐸ_ᐳ> {
    static fromSchemaClass = BaseBuilder.buildfromSchemaClass(BuilderShared)

    /**
     * Allow to instanciate a field early, so you can re-use it in multiple places
     * or access it's instance to dynamically change some other field schema.
     *
     * @since 2024-06-27
     * @stability unstable
     */
    with<const SA extends BaseSchema, SB extends BaseSchema>(
        /** the schema of the field you'll want to re-use the in second part */
        injected: SA,
        children: (shared: SA['$Field']) => SB,
        config: PartialOmit<Field_link_config<SA, SB>, 'share' | 'children'> = {},
    ): Apply<Schemaᐸ_ᐳ['Link'], SA, SB> {
        return this.buildSchema(Field_link<SA, SB>, { share: injected, children, ...config })
    }

    linked<T extends Field>(field: T): Apply<Schemaᐸ_ᐳ['Shared'], T> {
        return this.buildSchema(Field_shared<T>, { field })
    }
}
