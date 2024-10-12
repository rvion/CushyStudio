import type { FieldTypes } from '../$FieldTypes'

import { Field_number, type Field_number_config } from '../../fields/number/FieldNumber'
import { BaseBuilder } from './BaseBuilder'

interface SchemaAndAliasesᐸ_ᐳ extends HKT<FieldTypes> {
    Number: Apply<this, Field_number>
}

export class BuilderNumber<Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ> extends BaseBuilder<Schemaᐸ_ᐳ> {
    static fromSchemaClass = BaseBuilder.buildfromSchemaClass(BuilderNumber)

    // #region ints
    int_(config: Omit<Field_number_config, 'mode'> = {}): Schemaᐸ_ᐳ['Number'] {
        return this._number({ mode: 'int', ...config })
    }
    int(config: Omit<Field_number_config, 'mode'> = {}): Schemaᐸ_ᐳ['Number'] {
        return this.int_({ default: this._autotDefault(config), ...config })
    }

    // #region float
    float(config: Omit<Field_number_config, 'mode'> = {}): Schemaᐸ_ᐳ['Number'] {
        return this._number({ mode: 'float', default: this._autotDefault(config), ...config })
    }
    float_(config: Omit<Field_number_config, 'mode'> = {}): Schemaᐸ_ᐳ['Number'] {
        return this._number({ mode: 'float', ...config })
    }

    // #region ratios
    /** [number variant] precent = mode=int, default=100, step=10, min=1, max=100, suffix='%', */
    percent(config: Omit<Field_number_config, 'mode'> = {}): Schemaᐸ_ᐳ['Number'] {
        return this._number({
            mode: 'int',
            default: 100,
            step: 10,
            min: 1,
            max: 100,
            suffix: '%',
            ...config,
        })
    }

    // #region numbers
    number(config: Omit<Field_number_config, 'mode'> = {}): Schemaᐸ_ᐳ['Number'] {
        return this._number({ mode: 'float', default: this._autotDefault(config), ...config })
    }
    number_(config: Omit<Field_number_config, 'mode'> = {}): Schemaᐸ_ᐳ['Number'] {
        return this._number({ mode: 'float', ...config })
    }

    // #region _utils
    private _autotDefault(config: { min?: number; default?: number }): number {
        return config.default ?? config.min ?? 0
    }
    private _number(config: Field_number_config): Schemaᐸ_ᐳ['Number'] {
        return this.buildSchema(Field_number, config)
    }
}
