import type { FieldTypes } from '../$FieldTypes'

import { Field_bool, type Field_bool_config } from '../../fields/bool/FieldBool'
import { BaseBuilder } from './BaseBuilder'

interface SchemaAndAliasesᐸ_ᐳ extends HKT<FieldTypes> {
    Bool: Apply<this, Field_bool>
}

export class BuilderBool<Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ> extends BaseBuilder<Schemaᐸ_ᐳ> {
    static fromSchemaClass = BaseBuilder.buildfromSchemaClass(BuilderBool)

    /**
     * boolean without default
     * @since 2024-09-04
     */
    bool_(config: Field_bool_config = {}): Schemaᐸ_ᐳ['Bool'] {
        return this.buildSchema(Field_bool, config)
    }

    /**
     * @deprecated; use `bool`
     */
    boolean(config: Field_bool_config = {}): Schemaᐸ_ᐳ['Bool'] {
        return this.bool(config)
    }

    /**
     * boolean with default to false, unless default specified otherwise
     */
    bool(config: Field_bool_config = {}): Schemaᐸ_ᐳ['Bool'] {
        const def = config.default ?? false
        return this.bool_({ default: def, ...config })
    }
}
