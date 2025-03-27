import type { CSchema } from '../../model/CSchema'
import type { FieldConstructor } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { produce } from 'immer'

import { Field } from '../../model/Field'
import { isProbablySerialBool, registerFieldClass } from '../WidgetUI.DI'

// #region CONFIG
type Field_bool_ownConfig = {
   /**
    * default value; true or false
    * @default: false
    */
   default?: boolean

   /** (legacy ?) Label to display to the right of the widget. */
   label2?: string

   /** Text to display, drawn by the widget itself. */
   text?: string

   /**
    * The display style of the widget.
    * - `check `: Shows a simple checkbox.
    * - `button`: Shows a toggle-able button.
    *
    *  Defaults to 'check'
    */
   display?: 'check' | 'button'

   /** Whether or not to expand the widget to take up as much space as possible
    *
    *      If `display` is 'check'
    *          undefined and true will expand
    *          false will disable expansion
    *
    *      If `display` is 'button'
    *          undefined and false will not expand
    *          true will enable expansion
    */
   expand?: boolean
}

// #region SERIAL
type Field_bool_ownSerial = { $: 'bool'; value?: boolean }

// #region VALUE
type Field_bool_value = boolean
type Field_bool_unchecked = Field_bool_value | undefined

// #region TYPES
export interface Field_bool extends Field {
   ['ҨType']: 'bool'
   ['ҨOwnConfig']: Field_bool_ownConfig
   ['ҨOwnSerial']: Field_bool_ownSerial
   ['ҨValue']: Field_bool_value
   ['ҨSetvalue']: Field_bool_value
   ['ҨUnchecked']: Field_bool_unchecked
   ['ҨChild']: never
   ['ҨOpts']: unknown
   ['ҨOwnPatch']: Patch<'bool'>
}

export class Field_bool extends Field {
   // #region TYPE
   static readonly type: 'bool' = 'bool'
   private static readonly unsetSerial: Field_bool['ҨSerial'] = { $: 'bool' }
   static readonly codeForTypescriptValue = (config: Field_bool_ownConfig): string => 'boolean'
   static override migrateSerial(serial: object): Maybe<Field_bool['ҨSerial']> {
      if (isProbablySerialBool(serial)) {
         if ('val' in serial) {
            const recoveredVal = serial.val
            if (typeof recoveredVal !== 'boolean')
               throw new Error(`Field_button: invalid legacy 'val' serial`)
            return produce(serial, (draft) => void (draft.value = recoveredVal))
         }
      }
   }

   static generateSerial(
      value: Maybe<Field_bool['ҨValue']>,
      config: Field_bool['ҨConfig'],
   ): Field_bool['ҨSerial'] {
      if (value == null && config.default == null) return this.unsetSerial

      return {
         $: 'bool',
         value: value ?? config.default,
      }
   }

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<any /* Field_bool */>,
      initialMountKey: string,
      serial?: Field_bool['ҨSerial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region SERIAL
   protected zSetOwnSerial(next: Field_bool['ҨSerial']): void {
      if (next.value == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.value = def))
      }

      this.zAssignNewSerial(next)
   }

   // #region CHILDREN
   // #region VALUE
   get zValue(): Field_bool_value {
      return this.zValue_or_fail
   }

   set zValue(next: Field_bool_value) {
      if (this.zSerial.value === next) return
      this.zRunInTransaction(() => this.zPatchSerial((serial) => void (serial.value = next)))
   }

   get zValue_or_fail(): Field_bool_value {
      const val = this.zValue_unchecked
      if (val == null) throw new Error('Field_bool.zValue_or_fail: not set')
      return val
   }

   get zValue_or_zero(): Field_bool_value {
      return this.zSerial.value ?? false
   }

   get zValue_unchecked(): Field_bool_unchecked {
      return this.zSerial.value
   }

   get pathToValueInRootSerial(): string {
      return `${this.zGetOwnSerialPathFromRoot()}.value`
   }

   override zIsValueEqual(other: Field): boolean {
      if (!(other instanceof Field_bool)) return false
      return this.zValue_unchecked === other.zValue_unchecked
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

   get defaultValue(): boolean | undefined {
      return this.zConfig.default
   }

   // #region PROBLEMS
   get zOwnConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get zOwnTypeSpecificProblems(): Problem_Ext {
      return null
   }

   // #region NULLABILITY
   get canBeSetOnOrOff(): true {
      return true
   }

   /** set the value to true */
   setOn(): void {
      this.zValue = true
   }

   /** set the value to false */
   setOff(): void {
      this.zValue = false
   }

   // #region SETTERS
   /** set value to true if false, and to false if true */
   toggle(): void {
      this.zValue = !this.zValue_or_zero
   }

   // #region MOCK
   override zRandomize(): void {
      const r = Math.random()
      this.zValue = r > 0.5
   }

   // #region PATCH
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['value'])
}

// DI
registerFieldClass('bool', Field_bool)
Field_bool satisfies FieldConstructor<Field_bool>
