import type { IconName } from '../../icons/icons'
import type { CSchema } from '../../model/CSchema'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { produce } from 'immer'
import { computed } from 'mobx'

import { csuiteConfig } from '../../config/configureCsuite'
import { type ErrorConfigValue, extractConfigMessage, extractConfigValue } from '../../errors/extractConfig'
import { Field } from '../../model/Field'
import { makeLabelFromPrimitiveValue } from '../../utils/makeLabelFromFieldName'
import { isProbablySerialString, registerFieldClass } from '../WidgetUI.DI'

type CssProprtyGlobals = '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset'

type CssProprtyResize = CssProprtyGlobals | 'block' | 'both' | 'horizontal' | 'inline' | 'none' | 'vertical'

// prettier-ignore
export type FieldStringInputType =
    | 'text'
    | 'password'
    | 'email'
    | 'tel'
    | 'url'
    | 'time'
    | 'date'
    | 'datetime-local'
    | 'color'

// #region CONFIG TYPE
export type Field_string_config = Field_string['$config']
type Field_string_ownConfig = {
   /**
    * used:
    *  - when checking if field has changes
    *  - when resetting (.reset())
    *  - when value is undefined
    *
    * note:
    *  | if you enable field diff / change tracking,
    *  | default will ALWAYS be evaluated, so you need to be
    *  | careful with functions that have side effects
    */
   default?: string | (() => string)
   textarea?: boolean
   placeHolder?: string
   inputType?: FieldStringInputType
   autoResize?: boolean
   resize?: CssProprtyResize
   /**
    * if set to true, widget will commit values on enter; not before.
    * hitting esc will revert to the last committed value
    * */
   buffered?: boolean
   innerIcon?: IconName

   // validation
   pattern?: string | RegExp | { value: string | RegExp; error: string }
   minLength?: ErrorConfigValue<number>
   maxLength?: ErrorConfigValue<number>

   normalize?: (value: Maybe<string>) => string | undefined

   // randomization
   randomizationPool?: string[]
}

// #region SERIAL TYPE
export type Field_string_serial = Field_string['$serial']
type Field_string_ownSerial = {
   $: 'str'
   value?: string | undefined
}

// 💬 2024-09-03 rvion:
// | so many ways we could golf the serial some more
// | 💡 {type:"str",val:"coucou",id:"dsafasdfsdafas"}
// | 💡 {T:"str",val:"coucou",id:"dsafasdfsdafas"}
// | 💡 ["str","dsafasdfsdafas","coucou"],

// #region VALUE TYPE
type Field_string_value = string
type Field_string_unchecked = Field_string_value | undefined

// #region Field
export interface Field_string {
   $type: 'str'
   $ownConfig: Field_string_ownConfig
   $ownSerial: Field_string_ownSerial
   $value: Field_string_value
   $setValue: Field_string_value
   $unchecked: Field_string_unchecked
   $child: never
   $opts: unknown
   $ownPatch: Patch<'str'>
}

// #region STATE
export class Field_string extends Field {
   // #region Type
   static readonly type: 'str' = 'str'
   private static readonly unsetSerial: Field_string['$serial'] = { $: 'str' }
   static readonly codeForTypescriptValue = (config: Field_string_ownConfig): string => {
      if (config.inputType == null) return 'string'
      if (config.inputType === 'text') return 'string'
      return `Z.FL_string_${config.inputType}`
   }
   static override migrateSerial(serial: object): Maybe<Field_string['$serial']> | void {
      if (isProbablySerialString(serial)) {
         // recover from previous version of string serial
         if ('val' in serial) {
            const recoveredVal = serial.val
            if (typeof recoveredVal !== 'string') throw new Error(`Field_string: invalid legacy 'val' serial`)
            return produce(serial, (serial) => void (serial.value = recoveredVal))
         }
      }
   }

   static generateSerial(
      value: Maybe<Field_string['$value']>,
      config: Field_string['$config'],
   ): Field_string['$serial'] {
      if (value == null && config.default == null) return this.unsetSerial

      const selectedVal = value ?? (typeof config.default === 'function' ? config.default() : config.default)

      return {
         $: 'str',
         value: selectedVal,
      }
   }

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_string>,
      initialMountKey: string,
      serial?: Field_string['$serial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region SERIAL
   // 🟢
   protected setOwnSerial(next: Field_string['$serial']): void {
      // 💬 2024-09-10 rvion:
      // | we CAN'T do this:
      // | ```
      // | this.patchSerial((draft) => {
      // |     draft.value = next.value ?? this.defaultValue
      // | })
      // | ```
      // | otherwise, structural equality will not be preserved
      // | when assigning new serial once field is already created.

      // 0. SERIAL STRUCTURAL FIX (probably to move to migrateSerial)
      // N.A.

      // 1. APPLY DEFAULT
      // assign default value if not value set but has default value
      if (next.value == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.value = def))
      }

      // 2. ASSIGN
      // assign given serial (or default one)
      // this.serial = next
      this.assignNewSerial(next)

      // 3. RECONCILIATION
      // N.A.
   }

   // #region VALUE
   get value(): this['$value'] {
      return this.value_or_fail
   }

   set value(next: this['$value'] | undefined) {
      // Do we want to add that to implicitly convert non strings to string ?
      // convenient, but can be a source of bugs / unexpected behaviours.
      const nextStrVal = typeof next === 'string' ? next : JSON.stringify(next)

      // abort if same value
      const normalized = this.config.normalize ? this.config.normalize(nextStrVal) : nextStrVal
      if (this.serial.value === normalized) return

      // patch value in serial
      this.runInTransaction(() => {
         this.patchSerial((serial) => void (serial.value = normalized))
      })
   }

   get value_or_fail(): Field_string_value {
      const val = this.value_unchecked
      if (val == null) throw new Error('Field_string.value_or_fail: not set')
      return val
   }

   get value_or_zero(): Field_string_value {
      return this.value_unchecked ?? ''
   }

   get value_unchecked(): Field_string_unchecked {
      return this.serial.value
   }

   public isValueEqual(other: Field): boolean {
      if (other === this) return true
      if (!(other instanceof Field_string)) return false
      return this.value_unchecked === other.value_unchecked
   }

   public static patchedSerialPaths: readonly string[] = Object.freeze(['value'])

   // #region BUFFERED
   temporaryValue: string | null = null
   setTemporaryValue(next: string | null): void {
      this.temporaryValue = next
   }

   // #region CHANGES
   get isOwnSet(): boolean {
      return this.serial.value !== undefined
   }

   get hasChanges(): boolean {
      if (this.serial.value == null) return false
      if (this.serial.value === this.defaultValue) return false
      return true
   }

   get defaultValue(): string | undefined {
      return this.evalDefaultValue()
   }

   get pathToValueInRootSerial(): string {
      return `${this.getOwnSerialPathFromRoot()}.value`
   }

   private evalDefaultValue(): string | undefined {
      const d = this.config.default
      if (d == null) return undefined
      if (typeof d === 'function') return d()
      if (typeof d === 'string') return d
      return JSON.stringify(d) // failsafe
   }

   // #region PROBLEMS
   @computed get ownConfigSpecificProblems(): Problem_Ext {
      const i18n = csuiteConfig.i18n
      const out: string[] = []
      const minlen = extractConfigValue(this.config.minLength)
      const maxlen = extractConfigValue(this.config.maxLength)
      if (minlen != null && maxlen != null) {
         if (minlen > maxlen) {
            // 💬 2024-09-17 rvion: lol, no need to check the opposite 🤦‍♂️
            out.push(i18n.err.str.minLengthGreaterThanMaxLength({ min: minlen, max: maxlen }))
         }
         if (minlen === maxlen) {
            out.push(i18n.err.str.minLengthSameThanMaxLength({ minmax: minlen }))
         }
      }
      const def = this.config.default
      if (def != null) {
         const defLen = def?.length
         if (minlen != null && defLen < minlen)
            out.push(i18n.err.str.defaultTooSmall({ min: minlen, def: defLen }))
         if (maxlen != null && defLen > maxlen)
            out.push(i18n.err.str.defaultTooBig({ def: defLen, max: maxlen }))
      }
      return out
   }

   @computed get ownTypeSpecificProblems(): Problem_Ext {
      const i18n = csuiteConfig.i18n
      const out: Problem_Ext = []

      if (!this.isSet) return null
      const value = this.value_or_zero

      // check min
      const min = extractConfigValue(this.config.minLength)
      if (min === 1 && value.length === 0)
         out.push(
            extractConfigMessage(
               this.config.minLength,

               i18n.err.str.required({
                  prefix:
                     this.config.label != null && this.config.label !== false
                        ? this.config.label
                        : makeLabelFromPrimitiveValue(this.mountKey),
               }),
            ),
         )
      else if (min != null && value.length < min)
         out.push(extractConfigMessage(this.config.minLength, i18n.err.str.tooShort({ min })))

      // check max
      const max = extractConfigValue(this.config.maxLength)
      if (max != null && value.length > max)
         out.push(extractConfigMessage(this.config.maxLength, i18n.err.str.tooLong({ max })))

      // check pattern
      const pattern = extractConfigValue(this.config.pattern)
      if (pattern != null) {
         const reg = new RegExp(pattern).test(value)
         if (!reg)
            out.push(
               extractConfigMessage(
                  this.config.pattern,
                  i18n.err.str.pattern({ pattern: pattern.toString() }),
               ),
            )
      }
      return out.length > 0 ? out : null
   }
   // #region randomization

   override randomize(): void {
      if (this.config.randomizationPool) {
         this.value = choose(this.config.randomizationPool)
      } else {
         this.value = random3LetterWord()
      }

      function choose(arr: string[]): string {
         return arr[Math.floor(Math.random() * arr.length)]!
      }

      function random3LetterWord(): string {
         return Math.random().toString(36).substring(2, 5)
      }
   }

   // #region UI
   override get isCollapsible(): boolean {
      if (this.config.textarea) return true
      return false
   }

   override get isEmpty(): boolean {
      if (this.value_unchecked == null) return true
      if (this.value_unchecked.trim().length === 0) return true
      return false
   }
}

// DI
registerFieldClass('str', Field_string)
