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
   ['Ҩtype']: 'bool'
   ['ҨownConfig']: Field_bool_ownConfig
   ['ҨownSerial']: Field_bool_ownSerial
   ['Ҩvalue']: Field_bool_value
   ['Ҩsetvalue']: Field_bool_value
   ['Ҩunchecked']: Field_bool_unchecked
   ['Ҩchild']: never
   ['Ҩopts']: unknown
   ['ҨownPatch']: Patch<'bool'>
}

export class Field_bool extends Field {
   // #region TYPE
   static readonly type: 'bool' = 'bool'
   private static readonly unsetSerial: Field_bool['Ҩserial'] = { $: 'bool' }
   static readonly codeForTypescriptValue = (config: Field_bool_ownConfig): string => 'boolean'
   static override migrateSerial(serial: object): Maybe<Field_bool['Ҩserial']> {
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
      value: Maybe<Field_bool['Ҩvalue']>,
      config: Field_bool['Ҩconfig'],
   ): Field_bool['Ҩserial'] {
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
      serial?: Field_bool['Ҩserial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region SERIAL
   protected ϟsetOwnSerial(next: Field_bool['Ҩserial']): void {
      if (next.value == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.value = def))
      }

      this.ϟassignNewSerial(next)
   }

   // #region CHILDREN
   // #region VALUE
   get ϟvalue(): Field_bool_value {
      return this.ϟvalue_or_fail
   }

   set ϟvalue(next: Field_bool_value) {
      if (this.ϟserial.value === next) return
      this.ϟrunInTransaction(() => this.ϟpatchSerial((serial) => void (serial.value = next)))
   }

   get ϟvalue_or_fail(): Field_bool_value {
      const val = this.ϟvalue_unchecked
      if (val == null) throw new Error('Field_bool.value_or_fail: not set')
      return val
   }

   get ϟvalue_or_zero(): Field_bool_value {
      return this.ϟserial.value ?? false
   }

   get ϟvalue_unchecked(): Field_bool_unchecked {
      return this.ϟserial.value
   }

   get pathToValueInRootSerial(): string {
      return `${this.ϟgetOwnSerialPathFromRoot()}.value`
   }

   override ϟisValueEqual(other: Field): boolean {
      if (!(other instanceof Field_bool)) return false
      return this.ϟvalue_unchecked === other.ϟvalue_unchecked
   }

   // #region CHANGES
   get ϟisOwnSet(): boolean {
      return this.ϟserial.value !== undefined
   }

   get ϟhasChanges(): boolean {
      if (this.ϟserial.value == null) return false
      if (this.ϟserial.value === this.defaultValue) return false
      return true
   }

   get defaultValue(): boolean | undefined {
      return this.ϟconfig.default
   }

   // #region PROBLEMS
   get ϟownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ϟownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   // #region NULLABILITY
   get canBeSetOnOrOff(): true {
      return true
   }

   /** set the value to true */
   setOn(): void {
      this.ϟvalue = true
   }

   /** set the value to false */
   setOff(): void {
      this.ϟvalue = false
   }

   // #region SETTERS
   /** set value to true if false, and to false if true */
   toggle(): void {
      this.ϟvalue = !this.ϟvalue_or_zero
   }

   // #region MOCK
   override ϟrandomize(): void {
      const r = Math.random()
      this.ϟvalue = r > 0.5
   }

   // #region PATCH
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['value'])
}

// DI
registerFieldClass('bool', Field_bool)
Field_bool satisfies FieldConstructor<Field_bool>
