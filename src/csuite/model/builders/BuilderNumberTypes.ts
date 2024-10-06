import type { FieldTypes } from '../$FieldTypes'

import { Field_number, type Field_number_config } from '../../fields/number/FieldNumber'
import { BaseBuilder } from './BaseBuilder'

interface SchemaAndAliasesᐸ_ᐳ extends HKT<FieldTypes> {
    Number: Apply<this, Field_number>
}

export class BuilderNumber<Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ> extends BaseBuilder<Schemaᐸ_ᐳ> {
    static fromSchemaClass = BaseBuilder.buildfromSchemaClass(BuilderNumber)

    private _int(config: Field_number_config): Schemaᐸ_ᐳ['Number'] {
        return this.buildSchema(Field_number, config)
    }

    int_(config: Omit<Field_number_config, 'mode'> = {}): Schemaᐸ_ᐳ['Number'] {
        return this._int({ mode: 'int', ...config })
    }

    int(config: Omit<Field_number_config, 'mode'> = {}): Schemaᐸ_ᐳ['Number'] {
        return this.int_({ default: config.default ?? 0, ...config })
    }

    /** [number variant] precent = mode=int, default=100, step=10, min=1, max=100, suffix='%', */
    percent(config: Omit<Field_number_config, 'mode'> = {}): Schemaᐸ_ᐳ['Number'] {
        return this._int({
            mode: 'int',
            default: 100,
            step: 10,
            min: 1,
            max: 100,
            suffix: '%',
            ...config,
        })
    }

    float(config: Omit<Field_number_config, 'mode'> = {}): Schemaᐸ_ᐳ['Number'] {
        return this._int({ mode: 'float', default: config.default ?? 0, ...config })
    }

    number(config: Omit<Field_number_config, 'mode'> = {}): Schemaᐸ_ᐳ['Number'] {
        return this._int({ mode: 'float', ...config })
    }
}
