import type { IconName } from '../../icons/IconName'
import type { CSchema } from '../../model/CSchema'
import type { FieldConstructor } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { computed, observable } from 'mobx'

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
export type Field_string_config = Field_string['{config}']
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
export type Field_string_serial = Field_string['{serial}']
type Field_string_ownSerial = {
   $: 'str'
   value?: string | undefined
}

// 💬 2024-09-03 rvion:
// | so many ways we could golf the serial some more
// | 💡 {type:"str",val:"coucou",id:"dsafasdfsdafas"}
// | 💡 {T:"str",val:"coucou",id:"dsafasdfsdafas"}
// | 💡 ["str","dsafasdfsdafas","coucou"],

// #region Field
export interface Field_string {
   '{type}': 'str'
   '{ownConfig}': Field_string_ownConfig
   '{ownSerial}': Field_string_ownSerial
   '{value}': string
   '{setValue}': string
   '{unchecked}': string | undefined
   '{child}': never
   '{opts}': unknown
   '{ownPatch}': Patch<'str'>
}

// #region STATE
export class Field_string extends Field {
   set _(next: this['{value}']) { this.zValue = next } // prettier-ignore
   get _() { return this.zValue } // prettier-ignore

   // #region Type
   static readonly type: 'str' = 'str'
   static readonly codeForTypescriptValue = (config: Field_string_ownConfig): string => {
      if (config.inputType == null) return 'string'
      if (config.inputType === 'text') return 'string'
      return `Z.FL_string_${config.inputType}`
   }
   static override migrateSerial(serial: object): Maybe<Field_string['{serial}']> | void {
      if (isProbablySerialString(serial)) {
         // recover from previous version of string serial
         if ('val' in serial) {
            const recoveredVal = serial.val
            if (typeof recoveredVal !== 'string') throw new Error(`Field_string: invalid legacy 'val' serial`)
            return { ...serial, value: recoveredVal }
         }
      }
   }

   private static readonly unsetSerial: Field_string['{serial}'] = { $: 'str' }
   static generateSerial(
      setValue: Maybe<Field_string['{setValue}']>,
      config: Field_string['{config}'],
   ): Field_string['{serial}'] {
      if (setValue == null && config.default == null) return this.unsetSerial
      const selectedVal =
         setValue ?? (typeof config.default === 'function' ? config.default() : config.default)
      return { $: 'str', value: selectedVal }
   }

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_string>,
      initialMountKey: string,
      serial?: Field_string['{serial}'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region SERIAL
   // 🟢
   protected zSetOwnSerial(next: Field_string['{serial}']): void {
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
         if (def != null) next = { ...next, value: def }
      }

      // 2. ASSIGN
      // assign given serial (or default one)
      this.zAssignNewSerial(next)

      // 3. RECONCILIATION
      // N.A.
   }

   private toString(): string {
      return this.zValue
   }

   // #region VALUE
   set zValue(next: string | undefined) {
      // Do we want to add that to implicitly convert non strings to string ?
      // convenient, but can be a source of bugs / unexpected behaviours.
      const nextStrVal = typeof next === 'string' ? next : JSON.stringify(next)

      // abort if same value
      const normalized = this.zConfig.normalize ? this.zConfig.normalize(nextStrVal) : nextStrVal
      if (this.zSerial.value === normalized) return

      // patch value in serial
      this.zRunInTransaction(() => {
         this.zPatchSerial((serial) => void (serial.value = normalized))
      })
   }

   get zValue(): string {
      const val = this.zValueUnchecked
      if (val == null) throw new Error('Field_string.zValue: not set')
      return val
   }

   get zValueOrZero(): string {
      return this.zValueUnchecked ?? ''
   }

   get zValueUnchecked(): string | undefined {
      return this.zSerial.value
   }

   public zIsValueEqual(other: Field): boolean {
      if (other === this) return true
      if (!(other instanceof Field_string)) return false
      return this.zValueUnchecked === other.zValueUnchecked
   }

   public static patchedSerialPaths: readonly string[] = Object.freeze(['value'])

   // #region BUFFERED
   @observable accessor temporaryValue: string | null = null
   setTemporaryValue(next: string | null): void {
      this.temporaryValue = next
   }

   // #region CHANGES
   get zIsOwnSet(): boolean {
      return this.zSerial.value !== undefined
   }

   get zHasChanges(): boolean {
      if (this.zSerial.value == null) return false
      if (this.zSerial.value === this.defaultValue) return false
      return true
   }

   @computed get defaultValue(): string | undefined {
      return this.evalDefaultValue()
   }

   get pathToValueInRootSerial(): string {
      return `${this.zGetOwnSerialPathFromRoot()}.value`
   }

   private evalDefaultValue(): string | undefined {
      const d = this.zConfig.default
      if (d == null) return undefined
      if (typeof d === 'function') return d()
      if (typeof d === 'string') return d
      return JSON.stringify(d) // failsafe
   }

   // #region PROBLEMS
   @computed get zOwnConfigSpecificProblems(): Problem_Ext {
      const i18n = csuiteConfig.i18n
      const out: string[] = []
      const minlen = extractConfigValue(this.zConfig.minLength)
      const maxlen = extractConfigValue(this.zConfig.maxLength)
      if (minlen != null && maxlen != null) {
         if (minlen > maxlen) {
            // 💬 2024-09-17 rvion: lol, no need to check the opposite 🤦‍♂️
            out.push(i18n.err.str.minLengthGreaterThanMaxLength({ min: minlen, max: maxlen }))
         }
         if (minlen === maxlen) {
            out.push(i18n.err.str.minLengthSameThanMaxLength({ minmax: minlen }))
         }
      }
      const def = this.zConfig.default
      if (def != null) {
         const defLen = def?.length
         if (minlen != null && defLen < minlen)
            out.push(i18n.err.str.defaultTooSmall({ min: minlen, def: defLen }))
         if (maxlen != null && defLen > maxlen)
            out.push(i18n.err.str.defaultTooBig({ def: defLen, max: maxlen }))
      }
      return out
   }

   @computed get zOwnTypeSpecificProblems(): Problem_Ext {
      const i18n = csuiteConfig.i18n
      const out: Problem_Ext = []

      if (!this.zIsSet) return null
      const value = this.zValueOrZero

      // check min
      const min = extractConfigValue(this.zConfig.minLength)
      if (min === 1 && value.length === 0)
         out.push(
            extractConfigMessage(
               this.zConfig.minLength,

               i18n.err.str.required({
                  prefix:
                     this.zConfig.label != null && this.zConfig.label !== false
                        ? this.zConfig.label
                        : makeLabelFromPrimitiveValue(this.zMountKey),
               }),
            ),
         )
      else if (min != null && value.length < min)
         out.push(extractConfigMessage(this.zConfig.minLength, i18n.err.str.tooShort({ min })))

      // check max
      const max = extractConfigValue(this.zConfig.maxLength)
      if (max != null && value.length > max)
         out.push(extractConfigMessage(this.zConfig.maxLength, i18n.err.str.tooLong({ max })))

      // check pattern
      const pattern = extractConfigValue(this.zConfig.pattern)
      if (pattern != null) {
         const reg = new RegExp(pattern).test(value)
         if (!reg)
            out.push(
               extractConfigMessage(
                  this.zConfig.pattern,
                  i18n.err.str.pattern({ pattern: pattern.toString() }),
               ),
            )
      }
      return out.length > 0 ? out : null
   }
   // #region randomization

   override zRandomize(): void {
      if (this.zConfig.randomizationPool) {
         this.zValue = choose(this.zConfig.randomizationPool)
      } else {
         this.zValue = random3LetterWord()
      }

      function choose(arr: string[]): string {
         return arr[Math.floor(Math.random() * arr.length)]!
      }

      function random3LetterWord(): string {
         return Math.random().toString(36).substring(2, 5)
      }
   }

   // #region UI
   override get zIsCollapsible(): boolean {
      if (this.zConfig.textarea) return true
      return false
   }

   clear(): void {
      this.zValue = ''
   }
}

// DI
registerFieldClass('str', Field_string)
Field_string satisfies FieldConstructor<Field_string>
