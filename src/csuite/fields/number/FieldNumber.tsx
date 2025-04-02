import type { NumberFormat } from '../../i18n/i18n'
import type { CSchema } from '../../model/CSchema'
import type { FieldConstructor } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { produce } from 'immer'

import { csuiteConfig } from '../../config/configureCsuite'
import { Field } from '../../model/Field'
import { isProbablySerialString, registerFieldClass } from '../WidgetUI.DI'

// #region CONFIG
type Field_number_ownConfig = {
   mode: NumberFormat
   default?: number
   min?: number
   max?: number
   softMin?: number
   softMax?: number
   step?: number
   suffix?: string
   text?: string
   hideSlider?: boolean
   forceSnap?: boolean
   /** used as suffix */
   unit?: string
}

// #region SERIAL
type Field_number_ownSerial = {
   $: 'number'
   value?: number | string | null
}

// #region VALUE
export type Field_number_value = number
export type Field_number_unchecked = Field_number_value | null | undefined

// #region TYPES
export interface Field_number {
   '::Type': 'number'
   '::OwnConfig': Field_number_ownConfig
   '::OwnSerial': Field_number_ownSerial
   '::Value': Field_number_value
   '::Setvalue': Field_number_value
   '::Unchecked': Field_number_unchecked
   '::Child': never
   '::Opts': unknown
   '::OwnPatch': Patch<'number'>
}

// #region STATE
export class Field_number extends Field {
   // #region TYPE
   static readonly type: 'number' = 'number'
   static readonly unsetSerial: Field_number['::Serial'] = { $: 'number' }
   static readonly codeForTypescriptValue = (config: Field_number['::Config']): string => 'number'
   static override migrateSerial(serial: object): Maybe<Field_number['::Serial']> {
      // migrate from string with number typed as string
      if (isProbablySerialString(serial)) {
         const prop = serial.value
         if (prop != null && parseInt(prop, 10) === +prop) {
            return { $: 'number', value: +prop }
         }
      }
   }

   static generateSerial(
      value: Maybe<Field_number['::Value']>,
      config: Field_number['::Config'],
   ): Field_number['::Serial'] {
      if (value == null && config.default == null) return this.unsetSerial

      return {
         $: 'number',
         value: value ?? config.default,
      }
   }

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_number>,
      initialMountKey: string,
      serial?: Field_number['::Serial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region SERIAL
   protected zSetOwnSerial(next: Field_number['::Serial']): void {
      if (next.value == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.value = def))
      } else if (typeof next.value === 'string') {
         const parsed = csuiteConfig.i18n.ui.number.parse(next.value, this.zConfig.mode)
         if (!isNaN(parsed)) next = produce(next, (draft) => void (draft.value = parsed))
      }
      // assign given serial (or default one)
      this.zAssignNewSerial(next)
   }

   readonly forceSnap: boolean = false

   get defaultValue(): number | undefined {
      return this.zConfig.default
   }

   get zIsOwnSet(): boolean {
      return this.zSerial.value != null
   }

   get zHasChanges(): boolean {
      return this.zSerial.value !== this.defaultValue
   }

   get zOwnConfigSpecificProblems(): Problem_Ext {
      const i18n = csuiteConfig.i18n
      const out: string[] = []
      const min = this.zConfig.min
      const max = this.zConfig.max
      if (min != null && max != null) {
         if (min > max) {
            // 💬 2024-09-17 rvion: lol, no need to check the opposite 🤦‍♂️
            out.push(i18n.err.int.minGreaterThanMax({ min, max }))
         }
         if (min === max) {
            out.push(i18n.err.int.minSameThanMax({ minmax: min }))
         }
      }
      const def = this.zConfig.default
      if (def != null) {
         if (min != null && def < min) out.push(i18n.err.int.defaultTooSmall({ min, def }))
         if (max != null && def > max) out.push(i18n.err.int.defaultTooBig({ def, max }))
      }
      return out
   }
   get zOwnTypeSpecificProblems(): Problem_Ext {
      if (!this.zIsSet) return null

      if (typeof this.zValue_unchecked !== 'number') {
         return csuiteConfig.i18n.err.number.notANumber
      }

      const value = this.zValue_or_zero
      // < MIN
      if (this.zConfig.min != null && value < this.zConfig.min) {
         return csuiteConfig.i18n.err.number.lessThanMin({ min: this.zConfig.min })
      }
      // > MAX
      if (this.zConfig.max != null && value > this.zConfig.max) {
         return csuiteConfig.i18n.err.number.greaterThanMax({ max: this.zConfig.max })
      }
      return null
   }

   // #region VALUE
   get zValue(): Field_number_value {
      return this.zValue_or_fail
   }

   set zValue(next: Field_number_value | string | null) {
      if (this.zSerial.value === next) return

      if (typeof next === 'string') {
         if (next.trim() === '') {
            next = null
         } else {
            const parsed = csuiteConfig.i18n.ui.number.parse(next, this.zConfig.mode)
            if (!isNaN(parsed)) next = parsed
         }
      }

      this.zPatchInTransaction((draft, tct) => {
         draft.value = next
      })
   }

   get zValue_or_fail(): Field_number_value {
      const val = this.zValue_unchecked
      if (val == null) throw new Error('Field_number.zValue_or_fail: not set')
      if (typeof val === 'string') throw new Error('Field_number.zValue_or_fail: invalid number')

      return val
   }

   get zValue_or_zero(): number {
      if (typeof this.zSerial.value === 'string') return 0
      return this.zSerial.value ?? 0
   }

   get zValue_unchecked(): Field_number_unchecked {
      if (typeof this.zSerial.value === 'string') return null
      return this.zSerial.value
   }

   set zValue_unchecked(next: number | string | null | undefined) {
      this.zPatchSerial((serial) => void (serial.value = next))
   }

   override zIsValueEqual(other: Field): boolean {
      if (!(other instanceof Field_number)) return false

      return this.zValue_unchecked === other.zValue_unchecked
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['value'])

   get pathToValueInRootSerial(): string {
      return `${this.zGetOwnSerialPathFromRoot()}.value`
   }

   toString() {
      return this.zValue
   }

   setValueFromString(stringValue: string): void {
      const parsed = csuiteConfig.i18n.ui.number.parse(stringValue, this.zConfig.mode)
      if (isNaN(parsed)) return
      this.zValue = parsed
   }

   // #region SETTERS
   /** randomize respect (soft)Min and (soft)max */
   override zRandomize(): void {
      const min = this.zConfig.softMin ?? this.zConfig.min ?? 0
      const max = this.zConfig.softMax ?? this.zConfig.max ?? 100
      this.zValue = Math.floor(Math.random() * (max - min + 1))
   }
}

// DI
registerFieldClass('number', Field_number)
Field_number satisfies FieldConstructor<Field_number>
