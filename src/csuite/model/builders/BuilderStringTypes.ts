import type { Field } from '../Field'

import { Field_string, type Field_string_config } from '../../fields/string/FieldString'
import { BaseBuilder } from './BaseBuilder'

interface SchemaAndAliasesᐸ_ᐳ extends HKT<Field> {
    String: Apply<this, Field_string>
}

export class BuilderString<Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ> extends BaseBuilder<Schemaᐸ_ᐳ> {
    static fromSchemaClass = BaseBuilder.buildfromSchemaClass(BuilderString)

    string_(config: Field_string_config = {}): Schemaᐸ_ᐳ['String'] {
        return this.buildSchema(Field_string, config)
    }

    /**
     * primitive string type
     */
    string(config: Field_string_config = {}): Schemaᐸ_ᐳ['String'] {
        return this.string_({ default: config.default ?? '', ...config, placeHolder: 'Vide' })
    }

    /**
     * string-based `password` (based on `Field_string`)
     *
     * - value is string
     * - serial is plain string
     * - no specific validation
     */
    password(config: Field_string_config = {}): Schemaᐸ_ᐳ['String'] {
        return this.string({ inputType: 'password', ...config })
    }

    /**
     * string-based `email` (based on `Field_string`)
     *
     * - value is string
     * - serial is plain string
     * - no specific validation
     */
    email(config: Field_string_config = {}): Schemaᐸ_ᐳ['String'] {
        return this.string({ inputType: 'email', ...config })
    }

    /**
     * string-based `url` (based on `Field_string`)
     *
     * - value is string
     * - serial is plain string
     * - no specific validation
     */
    url(config: Field_string_config = {}): Schemaᐸ_ᐳ['String'] {
        return this.string({ inputType: 'url', ...config })
    }

    /**
     * alias to `string`
     */
    text(config: Field_string_config = {}): Schemaᐸ_ᐳ['String'] {
        return this.string(config)
    }

    /**
     * alias to `string`, with `textarea` appearance added by default
     */
    textarea(config: Field_string_config = {}): Schemaᐸ_ᐳ['String'] {
        return this.string({ textarea: true, ...config })
    }

    /**
     * legacy string-based time
     * based on `Field_string`
     * - value is just a string
     * - no specific validation
     * - no specific practical method on the field to add or remove time, etc.
     *
     * @deprecated
     * @see {@link date} for js Date object fields
     * @see {@link datePlain} for Temporal.PlainDate fields
     * @see {@link dateTimeZoned} for Temporal.PlainDate fields
     */
    stringTime(config: Field_string_config = {}): Schemaᐸ_ᐳ['String'] {
        return this.string({ inputType: 'time', ...config })
    }

    /**
     * legacy string-based date
     * based on `Field_string`
     * - value is just a string
     * - no specific validation
     * - no specific practical method on the field to add or remove time, etc.
     *
     * @deprecated
     * @see {@link date} for js Date object fields
     * @see {@link datePlain} for Temporal.PlainDate fields
     * @see {@link dateTimeZoned} for Temporal.PlainDate fields
     */
    stringDate(config: Field_string_config = {}): Schemaᐸ_ᐳ['String'] {
        return this.string({ inputType: 'date', ...config })
    }

    /**
     * legacy string-based datetime
     * based on `Field_string`
     * - value is string
     * - serial is plain string
     * - no specific validation
     *
     * @deprecated
     * @see {@link date} for js Date object fields
     * @see {@link datePlain} for Temporal.PlainDate fields
     * @see {@link dateTimeZoned} for Temporal.PlainDate fields
     */
    stringDatetime(config: Field_string_config = {}): Schemaᐸ_ᐳ['String'] {
        return this.string({ inputType: 'datetime-local', ...config })
    }

    /**
     * legacy string-based color
     * based on `Field_string`
     * - value is string
     * - serial is plain string
     * - no specific validation
     * - no specific API to handle color manipulation
     *
     * @deprecated
     * @see {@link date} for js Date object fields
     * @see {@link datePlain} for Temporal.PlainDate fields
     * @see {@link dateTimeZoned} for Temporal.PlainDate fields
     */
    stringColor(config: Field_string_config = {}): Schemaᐸ_ᐳ['String'] {
        return this.string({ inputType: 'datetime-local', ...config })
    }
}
