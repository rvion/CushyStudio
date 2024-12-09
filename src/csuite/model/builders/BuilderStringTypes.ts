import type { FieldTypes } from '../$FieldTypes'

import { nanoid } from 'nanoid'
import { createElement } from 'react'
import { v4 } from 'uuid'

import { csuiteConfig } from '../../config/configureCsuite'
import { Field_string, type Field_string_config } from '../../fields/string/FieldString'
import { BaseBuilder } from './BaseBuilder'

interface SchemaAndAliasesᐸ_ᐳ extends HKT<FieldTypes> {
   String: Apply<this, Field_string>
}

export class BuilderString<Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ> extends BaseBuilder<Schemaᐸ_ᐳ> {
   static fromSchemaClass = BaseBuilder.buildfromSchemaClass(BuilderString)

   /**
    * readonly string, defaulting to some new nanoid()
    * (new default for each schema instanciation)
    *
    * @since 2024-10-25
    */
   nanoid(config: Field_string_config = {}): Schemaᐸ_ᐳ['String'] {
      const uid: string = nanoid()
      return this.string_({
         ...config,
         header: (p) => createElement('div', {}, p.field.value),
         default: uid,
      })
   }

   /**
    * readonly string, defaulting to some new UUID-V4
    * (new default for each schema instanciation)
    *
    * @since 2024-10-25
    */
   uuidV4(config: Field_string_config = {}): Schemaᐸ_ᐳ['String'] {
      const uuid: string = v4()
      return this.string_({
         ...config,
         header: (p) => createElement('div', {}, p.field.value),
         default: uuid,
      })
   }

   string_(config: Field_string_config = {}): Schemaᐸ_ᐳ['String'] {
      return this.buildSchema(Field_string, config)
   }

   /** primitive string type */
   string(config: Field_string_config = {}): Schemaᐸ_ᐳ['String'] {
      return this.string_({
         default: config.default ?? '',
         placeHolder: config.placeHolder ?? csuiteConfig.i18n.ui.field.empty,
         ...config,
      })
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
      const { inputType, check, ...rest } = config

      const emailConfig: Field_string_config = {
         innerIcon: 'mdiEmailOutline',
         normalize: (v) => v?.toLowerCase()?.trim(),
         inputType: inputType ?? 'email',
         check: (v) => {
            const configuredError = config.check?.(v)
            if (configuredError) return configuredError

            if (!v.value) return
            if (!/^.+@.+\..+$/.test(v.value.trim())) {
               return csuiteConfig.i18n.err.email.invalid
            }
         },
         ...rest,
      }

      return this.string(emailConfig)
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
      return this.string({ inputType: 'color', ...config })
   }
}
