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
   ['Ҩtype']: 'number'
   ['ҨownConfig']: Field_number_ownConfig
   ['ҨownSerial']: Field_number_ownSerial
   ['Ҩvalue']: Field_number_value
   ['Ҩsetvalue']: Field_number_value
   ['Ҩunchecked']: Field_number_unchecked
   ['Ҩchild']: never
   ['Ҩopts']: unknown
   ['ҨownPatch']: Patch<'number'>
}

// #region STATE
export class Field_number extends Field {
   // #region TYPE
   static readonly type: 'number' = 'number'
   static readonly unsetSerial: Field_number['Ҩserial'] = { $: 'number' }
   static readonly codeForTypescriptValue = (config: Field_number['Ҩconfig']): string => 'number'
   static override migrateSerial(serial: object): Maybe<Field_number['Ҩserial']> {
      // migrate from string with number typed as string
      if (isProbablySerialString(serial)) {
         const prop = serial.value
         if (prop != null && parseInt(prop, 10) === +prop) {
            return { $: 'number', value: +prop }
         }
      }
   }

   static generateSerial(
      value: Maybe<Field_number['Ҩvalue']>,
      config: Field_number['Ҩconfig'],
   ): Field_number['Ҩserial'] {
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
      serial?: Field_number['Ҩserial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      // /* 😂 */ console.log(`[🤠] ${getUIDForMemoryStructure(serial)} (FieldNumber#constructor ❌)`)
      // /* 😂 */ console.log(`[🤠] ${getUIDForMemoryStructure(this.serial)} (FieldNumber#constructor ❌)`)
      this.init(serial)
   }

   // #region SERIAL
   protected ϟsetOwnSerial(next: Field_number['Ҩserial']): void {
      if (next.value == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.value = def))
      } else if (typeof next.value === 'string') {
         const parsed = csuiteConfig.i18n.ui.number.parse(next.value, this.ϟconfig.mode)
         if (!isNaN(parsed)) next = produce(next, (draft) => void (draft.value = parsed))
      }
      // assign given serial (or default one)
      this.ϟassignNewSerial(next)
   }

   readonly forceSnap: boolean = false

   get defaultValue(): number | undefined {
      return this.ϟconfig.default
   }

   get ϟisOwnSet(): boolean {
      return this.ϟserial.value != null
   }

   get ϟhasChanges(): boolean {
      return this.ϟserial.value !== this.defaultValue
   }

   get ϟownConfigSpecificProblems(): Problem_Ext {
      const i18n = csuiteConfig.i18n
      const out: string[] = []
      const min = this.ϟconfig.min
      const max = this.ϟconfig.max
      if (min != null && max != null) {
         if (min > max) {
            // 💬 2024-09-17 rvion: lol, no need to check the opposite 🤦‍♂️
            out.push(i18n.err.int.minGreaterThanMax({ min, max }))
         }
         if (min === max) {
            out.push(i18n.err.int.minSameThanMax({ minmax: min }))
         }
      }
      const def = this.ϟconfig.default
      if (def != null) {
         if (min != null && def < min) out.push(i18n.err.int.defaultTooSmall({ min, def }))
         if (max != null && def > max) out.push(i18n.err.int.defaultTooBig({ def, max }))
      }
      return out
   }
   get ϟownTypeSpecificProblems(): Problem_Ext {
      if (!this.ϟisSet) return null

      if (typeof this.ϟvalue_unchecked !== 'number') {
         return csuiteConfig.i18n.err.number.notANumber
      }

      const value = this.ϟvalue_or_zero
      // < MIN
      if (this.ϟconfig.min != null && value < this.ϟconfig.min) {
         return csuiteConfig.i18n.err.number.lessThanMin({ min: this.ϟconfig.min })
      }
      // > MAX
      if (this.ϟconfig.max != null && value > this.ϟconfig.max) {
         return csuiteConfig.i18n.err.number.greaterThanMax({ max: this.ϟconfig.max })
      }
      return null
   }

   // #region VALUE
   get ϟvalue(): Field_number_value {
      return this.ϟvalue_or_fail
   }

   set ϟvalue(next: Field_number_value | string | null) {
      if (this.ϟserial.value === next) return

      if (typeof next === 'string') {
         if (next.trim() === '') {
            next = null
         } else {
            const parsed = csuiteConfig.i18n.ui.number.parse(next, this.ϟconfig.mode)
            if (!isNaN(parsed)) next = parsed
         }
      }

      this.ϟpatchInTransaction((draft, tct) => {
         draft.value = next
      })
   }

   get ϟvalue_or_fail(): Field_number_value {
      const val = this.ϟvalue_unchecked
      if (val == null) throw new Error('Field_number.value_or_fail: not set')
      if (typeof val === 'string') throw new Error('Field_number.value_or_fail: invalid number')

      return val
   }

   get ϟvalue_or_zero(): number {
      if (typeof this.ϟserial.value === 'string') return 0
      return this.ϟserial.value ?? 0
   }

   get ϟvalue_unchecked(): Field_number_unchecked {
      if (typeof this.ϟserial.value === 'string') return null
      return this.ϟserial.value
   }

   set ϟvalue_unchecked(next: number | string | null | undefined) {
      this.ϟpatchSerial((serial) => void (serial.value = next))
   }

   override ϟisValueEqual(other: Field): boolean {
      if (!(other instanceof Field_number)) return false

      return this.ϟvalue_unchecked === other.ϟvalue_unchecked
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['value'])

   get pathToValueInRootSerial(): string {
      return `${this.ϟgetOwnSerialPathFromRoot()}.value`
   }

   setValueFromString(stringValue: string): void {
      const parsed = csuiteConfig.i18n.ui.number.parse(stringValue, this.ϟconfig.mode)
      if (isNaN(parsed)) return
      this.ϟvalue = parsed
   }

   // #region SETTERS
   /** randomize respect (soft)Min and (soft)max */
   override ϟrandomize(): void {
      const min = this.ϟconfig.softMin ?? this.ϟconfig.min ?? 0
      const max = this.ϟconfig.softMax ?? this.ϟconfig.max ?? 100
      this.ϟvalue = Math.floor(Math.random() * (max - min + 1))
   }
}

// DI
registerFieldClass('number', Field_number)
Field_number satisfies FieldConstructor<Field_number>
