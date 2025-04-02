import { nanoid } from 'nanoid'
import { v1, v3, v4, v5, v6, v7, validate } from 'uuid'

import { csuiteConfig } from '../../config/configureCsuite'
import { Field_string } from '../../fields/string/FieldString'
import { CSchema } from '../CSchema'
import { defineSchemaBuilderMixin } from './defineSchemaBuilderMixin'

export type BuilderStringMixin = {
   nanoid(config?: Field_string['z$Config']): Z.String
   uuidV1(config?: Field_string['z$Config']): Z.String
   uuidV3(config?: Field_string['z$Config']): Z.String
   uuidV4(config?: Field_string['z$Config']): Z.String
   uuidV5(config?: Field_string['z$Config']): Z.String
   uuidV6(config?: Field_string['z$Config']): Z.String
   uuidV7(config?: Field_string['z$Config']): Z.String
   string_(config?: Field_string['z$Config']): Z.String
   string(config?: Field_string['z$Config']): Z.String
   password(config?: Field_string['z$Config']): Z.String
   email(config?: Field_string['z$Config']): Z.String
   url(config?: Field_string['z$Config']): Z.String
   text(config?: Field_string['z$Config']): Z.String
   textarea(config?: Field_string['z$Config']): Z.String
   stringTime(config?: Field_string['z$Config']): Z.String
   stringDate(config?: Field_string['z$Config']): Z.String
   stringDatetime(config?: Field_string['z$Config']): Z.String
}

const validateUUID = (v: string): boolean => {
   return !validate(v)
}
const BuilderStringImpl = (): BuilderStringMixin =>
   defineSchemaBuilderMixin<BuilderStringMixin>({
      /**
       * readonly string, defaulting to some new nanoid()
       * (new default for each schema instanciation)
       *
       * @since 2024-10-25
       */
      nanoid(config: Field_string['z$Config'] = {}): Z.String {
         return this.string_({ ...(config as any), default: nanoid, readonly: true })
      },

      /**
       * readonly string, defaulting to some new UUID-V4
       * (new default for each field instanciation)
       * @since 2025-03-25
       */
      uuidV1(config: Field_string['z$Config'] = {}): Z.String {
         return this.string_({ ...(config as any), default: v1, readonly: true, check: validateUUID })
      },
      /**
       * readonly string, defaulting to some new UUID-V4
       * (new default for each field instanciation)
       * @since 2025-03-25
       */
      uuidV3(config: Field_string['z$Config'] = {}): Z.String {
         return this.string_({ ...(config as any), default: v3, readonly: true, check: validateUUID })
      },
      /**
       * readonly string, defaulting to some new UUID-V4
       * (new default for each field instanciation)
       * @since 2024-10-25
       */
      uuidV4(config: Field_string['z$Config'] = {}): Z.String {
         return this.string_({ ...(config as any), default: v4, readonly: true, check: validateUUID })
      },
      /**
       * readonly string, defaulting to some new UUID-V4
       * (new default for each field instanciation)
       * @since 2025-03-25
       */
      uuidV5(config: Field_string['z$Config'] = {}): Z.String {
         return this.string_({ ...(config as any), default: v5, readonly: true, check: validateUUID })
      },
      /**
       * readonly string, defaulting to some new UUID-V4
       * (new default for each field instanciation)
       * @since 2025-03-25
       */
      uuidV6(config: Field_string['z$Config'] = {}): Z.String {
         return this.string_({ ...(config as any), default: v6, readonly: true, check: validateUUID })
      },
      /**
       * readonly string, defaulting to some new UUID-V4
       * (new default for each field instanciation)
       * @since 2025-03-25
       */
      uuidV7(config: Field_string['z$Config'] = {}): Z.String {
         return this.string_({ ...(config as any), default: v7, readonly: true, check: validateUUID })
      },

      string_(config: Field_string['z$Config'] = {}): Z.String {
         return CSchema.new(Field_string, config)
      },

      /**
       * primitive string type
       */
      string(config: Field_string['z$Config'] = {}): Z.String {
         config.default ??= ''
         config.placeHolder ??= csuiteConfig.i18n.ui.field.empty
         return this.string_(config)
      },

      /**
       * string-based `password` (based on `Field_string`)
       *
       * - value is string
       * - serial is plain string
       * - no specific validation
       */
      password(config: Field_string['z$Config'] = {}): Z.String {
         config.inputType ??= 'password'
         return this.string(config)
      },

      /**
       * string-based `email` (based on `Field_string`)
       *
       * - value is string
       * - serial is plain string
       * - no specific validation
       */
      email(config: Field_string['z$Config'] = {}): Z.String {
         const { inputType, ...rest } = config

         const emailConfig: Field_string['z$Config'] = {
            innerIcon: IKONS.mdiEmailOutline,
            normalize: (v) => v?.toLowerCase()?.trim(),
            inputType: inputType ?? 'email',
            minLength: 1,
            ...(rest as any),
            check: (v) => {
               const configuredError = config.check?.(v)
               if (configuredError != null) return configuredError

               if (!v.zValue) return
               if (!/^.+@.+\..+$/.test(v.zValue.trim())) {
                  return csuiteConfig.i18n.err.email.invalid
               }
            },
         }

         return this.string(emailConfig)
      },

      /**
       * string-based `url` (based on `Field_string`)
       *
       * - value is string
       * - serial is plain string
       * - no specific validation
       */
      url(config: Field_string['z$Config'] = {}): Z.String {
         config.inputType ??= 'url'
         return this.string(config)
      },

      /**
       * alias to `string`
       */
      text(config: Field_string['z$Config'] = {}): Z.String {
         return this.string(config)
      },

      /**
       * alias to `string`, with `textarea` appearance added by default
       */
      textarea(config: Field_string['z$Config'] = {}): Z.String {
         config.textarea = true
         return this.string(config)
      },

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
      stringTime(config: Field_string['z$Config'] = {}): Z.String {
         config.inputType ??= 'time'
         return this.string(config)
      },

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
      stringDate(config: Field_string['z$Config'] = {}): Z.String {
         config.inputType ??= 'date'
         return this.string(config)
      },

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
      stringDatetime(config: Field_string['z$Config'] = {}): Z.String {
         config.inputType ??= 'datetime-local'
         return this.string(config)
      },
   })

export const BuilderStringDescriptors = Object.getOwnPropertyDescriptors(BuilderStringImpl())
