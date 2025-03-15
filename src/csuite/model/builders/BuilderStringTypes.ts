import { nanoid } from 'nanoid'
import { createElement } from 'react'
import { v4 } from 'uuid'

import { csuiteConfig } from '../../config/configureCsuite'
import { Field_string } from '../../fields/string/FieldString'
import { memoizedFN } from '../../hashUtils/hash'
import { CSchema } from '../CSchema'
import { defineSchemaBuilderMixin } from './defineSchemaBuilderMixin'

export type BuilderStringMixin = {
   nanoid(config?: Field_string['$config']): Z.String
   uuidV4(config?: Field_string['$config']): Z.String
   string_(config?: Field_string['$config']): Z.String
   string(config?: Field_string['$config']): Z.String
   password(config?: Field_string['$config']): Z.String
   email(config?: Field_string['$config']): Z.String
   url(config?: Field_string['$config']): Z.String
   text(config?: Field_string['$config']): Z.String
   textarea(config?: Field_string['$config']): Z.String
   stringTime(config?: Field_string['$config']): Z.String
   stringDate(config?: Field_string['$config']): Z.String
   stringDatetime(config?: Field_string['$config']): Z.String
}

const BuilderStringImpl = (): BuilderStringMixin =>
   defineSchemaBuilderMixin({
      /**
       * readonly string, defaulting to some new nanoid()
       * (new default for each schema instanciation)
       *
       * @since 2024-10-25
       */
      nanoid(config: Field_string['$config'] = {}): Z.String {
         const uid: string = nanoid()
         return this.string_({
            ...(config as any) /* ping @domi; uiui type error here */,
            header: memoizedFN(this, 'nanoid', (p) => createElement('div', {}, p.field.value), []),
            default: uid,
         })
      },

      /**
       * readonly string, defaulting to some new UUID-V4
       * (new default for each schema instanciation)
       *
       * @since 2024-10-25
       */
      uuidV4(config: Field_string['$config'] = {}): Z.String {
         const uuid: string = v4()
         return this.string_({
            ...(config as any) /* ping @domi; uiui type error here */,
            header: memoizedFN(this, 'uuidV4', (p) => createElement('div', {}, p.field.value), []),
            default: uuid,
         })
      },

      string_(config: Field_string['$config'] = {}): Z.String {
         return CSchema.new(Field_string, config)
      },

      /**
       * primitive string type
       */
      string(config: Field_string['$config'] = {}): Z.String {
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
      password(config: Field_string['$config'] = {}): Z.String {
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
      email(config: Field_string['$config'] = {}): Z.String {
         const { inputType, ...rest } = config

         const emailConfig: Field_string['$config'] = {
            innerIcon: IKONS.mdiEmailOutline,
            normalize: (v) => v?.toLowerCase()?.trim(),
            inputType: inputType ?? 'email',
            minLength: 1,
            ...(rest as any) /* ping @domi; uiui type error here */,
            check: (v) => {
               const configuredError = config.check?.(v)
               if (configuredError != null) return configuredError

               if (!v.value) return
               if (!/^.+@.+\..+$/.test(v.value.trim())) {
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
      url(config: Field_string['$config'] = {}): Z.String {
         config.inputType ??= 'url'
         return this.string(config)
      },

      /**
       * alias to `string`
       */
      text(config: Field_string['$config'] = {}): Z.String {
         return this.string(config)
      },

      /**
       * alias to `string`, with `textarea` appearance added by default
       */
      textarea(config: Field_string['$config'] = {}): Z.String {
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
      stringTime(config: Field_string['$config'] = {}): Z.String {
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
      stringDate(config: Field_string['$config'] = {}): Z.String {
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
      stringDatetime(config: Field_string['$config'] = {}): Z.String {
         config.inputType ??= 'datetime-local'
         return this.string(config)
      },
   })

export const BuilderStringDescriptors = Object.getOwnPropertyDescriptors(BuilderStringImpl())
