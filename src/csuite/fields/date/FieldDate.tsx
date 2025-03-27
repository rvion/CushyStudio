import type { IconName } from '../../icons/IconName'
import type { CSchema } from '../../model/CSchema'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { ISOString } from './ISOString'

import { produce } from 'immer'
import { computed, observable } from 'mobx'

import { csuiteConfig } from '../../config/configureCsuite'
import { Field } from '../../model/Field'
import { type Problem_Ext, Severity } from '../../model/Validation'
import { isProbablySerialString } from '../WidgetUI.DI'

// #region Config
type Field_date_ownConfig<VALUE> = {
   default?: VALUE | undefined | null | (() => VALUE | undefined | null)
   placeHolder?: string
   innerIcon?: IconName
   serialize(d: VALUE): ISOString | null
   /* This should throw if the string is invalid */
   deserialize(s: ISOString): VALUE | null
   codeForTypescriptValue: string
   valueToDate(v: VALUE): Date
   dateToValue(d: Date): VALUE
   time: boolean
}

// #region Value
export type Field_date_value<VALUE> = VALUE
export type Field_date_unchecked<VALUE> = Maybe<Field_date_value<VALUE>>

// #region Serial
type Field_date_serial = Field_date<unknown>['Ҩserial']
type Field_date_ownSerial = {
   $: 'date'
   value?: ISOString | null
}

// #region Types
export interface Field_date<VALUE> {
   ['Ҩtype']: 'date'
   ['ҨownConfig']: Field_date_ownConfig<VALUE>
   ['ҨownSerial']: Field_date_ownSerial
   ['Ҩvalue']: Field_date_value<VALUE>
   ['Ҩsetvalue']: Field_date_value<VALUE>
   ['Ҩunchecked']: Field_date_unchecked<VALUE>
   ['Ҩchild']: never
   ['Ҩopts']: unknown
   ['ҨownPatch']: Patch<'date'>
}

// #region State
export class Field_date<out VALUE> extends Field {
   // #region static
   static readonly type: 'date' = 'date'
   private static readonly unsetSerial: Field_date_serial = { $: 'date' }
   static readonly codeForTypescriptValue = (config: Field_date<unknown>['Ҩconfig']): string =>
      config.codeForTypescriptValue ?? 'Date'
   // #region migration
   static override migrateSerial(serial: object): Field_date_serial | null {
      const anySerial = serial as any
      if (
         typeof anySerial === 'object' &&
         ['datetimezoned', 'plaindate'].includes(anySerial?.$) &&
         (typeof anySerial.value === 'string' || anySerial.value === null)
      ) {
         return { $: 'date', value: anySerial.value }
      }

      if (isProbablySerialString(serial)) {
         const stringSerial = serial
         if (!stringSerial.value) return { $: this.type }
         const parsed = new Date(stringSerial.value)
         if (!isNaN(parsed.getTime())) {
            return { $: this.type, value: parsed.toISOString() }
         }
      }

      return null
   }

   static generateSerial(
      value: Maybe<Field_date<any>['Ҩvalue']>,
      config: Field_date<any>['Ҩconfig'],
   ): Field_date<any>['Ҩserial'] {
      const defaultValue = typeof config.default === 'function' ? config.default() : config.default
      if (value == null && defaultValue == null) return this.unsetSerial

      return {
         $: 'date',
         value: config.serialize(value ?? defaultValue),
      }
   }

   // #region Ctor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_date<VALUE>>,
      initialMountKey: string,
      serial?: Field_date_serial,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region serial
   protected ϟsetOwnSerial(next: Field_date_serial): void {
      if (next.value === undefined) {
         const def = this.defaultValue
         if (def !== undefined)
            next = produce(next, (draft) => {
               draft.value = def == null ? def : this.ϟconfig.serialize(def)
            })
      }

      this.ϟassignNewSerial(next)

      const raw = this.ϟserial.value
      let deserialized: Field_date_value<VALUE> | null | undefined = null
      try {
         deserialized = raw === null || raw === undefined ? raw : this.ϟconfig.deserialize(raw)
         this.selectedValue_ = deserialized
      } catch (e) {
         this.selectedValue_ = null
      }

      this.stringValue_ = this.selectedValue_ != null ? null : raw
   }

   // #region Set/Unset
   get ϟisOwnSet(): boolean {
      return this.ϟserial.value !== undefined
   }

   unset(): void {
      this.ϟpatchSerial((draft) => {
         delete draft.value
      })
   }

   // #region value
   get ϟvalue(): Field_date_value<VALUE> {
      return this.ϟvalue_or_fail
   }

   set ϟvalue(next: Field_date_unchecked<VALUE> | Date) {
      const nextValue = next instanceof Date ? this.ϟconfig.dateToValue(next) : next

      this.selectedValue_ = nextValue
      this.stringValue_ = null
      this.ϟrunInTransaction(() => {
         this.ϟpatchSerial((draft) => {
            draft.value = nextValue != null ? this.ϟconfig.serialize(nextValue) : null
         })
      })
   }

   get ϟvalue_or_fail(): Field_date_value<VALUE> {
      if (this.isValidSelectedValue) {
         return this.selectedValue as Field_date_value<VALUE>
      }

      throw new Error('Field_date: value_or_fail called on invalid value')
   }

   get ϟvalue_or_zero(): Field_date_value<VALUE> {
      if (this.isValidSelectedValue && this.ϟvalue_unchecked != null) return this.ϟvalue_unchecked
      return this.ϟconfig.dateToValue(new Date()) // ⚠️ zero value set to now ? Maybe new Date(0) would be saner
   }

   get ϟvalue_unchecked(): Field_date_unchecked<VALUE> {
      return this.selectedValue
   }

   override ϟisValueEqual(other: Field): boolean {
      if (!(other instanceof Field_date)) return false

      return this.ϟserial.value === other.ϟserial.value
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['value'])

   // #region value ext
   @observable private accessor stringValue_: Maybe<string> = undefined
   @computed get stringValueUnchecked(): Maybe<string> {
      if (this.stringValue_ == null && this.selectedValue != null) return this.format(this.selectedValue)
      return this.stringValue_
   }
   private selectedValue_: Field_date_unchecked<VALUE> = undefined

   get selectedValue(): Field_date_unchecked<VALUE> {
      return this.selectedValue_
   }
   get isValidSelectedValue(): boolean {
      return this.selectedValue_ != null
   }

   @computed get defaultValue(): Field_date_unchecked<VALUE> {
      if (typeof this.ϟconfig.default === 'function') {
         return (this.ϟconfig.default as () => VALUE | null | undefined)()
      }

      return this.ϟconfig.default
   }

   // #region format/parse
   public format(value: VALUE): string {
      return csuiteConfig.i18n.ui.date.format(
         this.ϟconfig.valueToDate(value),
         this.ϟconfig.time ? 'datetime' : 'date',
      )
   }

   public parse(value: string): Field_date_value<VALUE> {
      return this.ϟconfig.dateToValue(csuiteConfig.i18n.ui.date.parse(value))
   }

   // #region validation
   get ϟownConfigSpecificProblems(): Problem_Ext {
      const out: string[] = []

      if ('default' in this.ϟconfig) {
         const def = this.ϟconfig.default
         if (def == null) out.push(csuiteConfig.i18n.err.field.defaultExplicitelySetToNullButFieldNotNullable)
      }

      return out
   }

   get ϟownTypeSpecificProblems(): Problem_Ext {
      if (
         (this.stringValue_ != null && this.selectedValue == null) ||
         (this.selectedValue != null && !this.isValidSelectedValue)
      ) {
         return {
            path: this.ϟpath,
            severity: Severity.Error,
            message: csuiteConfig.i18n.err.date.invalid,
         }
      }
      if (this.selectedValue == null) {
         return {
            path: this.ϟpath,
            severity: Severity.Error,
            message: csuiteConfig.i18n.err.field.not_set,
         }
      }

      return null
   }
   // #region changes
   @computed get ϟhasChanges(): boolean {
      const def = this.defaultValue == null ? null : this.ϟconfig.serialize(this.defaultValue)
      return this.ϟserial.value != def
   }

   // #region misc
   setValueFromString(value: string): void {
      this.stringValue_ = value?.trim() || null
      let nextValue: Field_date_value<VALUE> | null = null
      try {
         nextValue = !this.stringValue_ ? null : this.parse(this.stringValue_)
      } catch (e) {
         this.selectedValue_ = null
         this.ϟrunInTransaction(() => {
            this.ϟpatchSerial((draft) => {
               draft.value = this.stringValue_ || null
            })
         })
         return
      }

      this.ϟvalue = nextValue as Field_date_value<VALUE>
   }

   // #region SETTERS
   override ϟrandomize(): void {
      // pick a random date between +30 days and -30 days
      const max = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      const min = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      this.ϟvalue = new Date(min.getTime() + Math.random() * (max.getTime() - min.getTime()))
   }
}
