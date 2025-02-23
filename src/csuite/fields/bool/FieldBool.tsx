import type { CSchema } from '../../model/CSchema'
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
   $type: 'bool'
   $ownConfig: Field_bool_ownConfig
   $ownSerial: Field_bool_ownSerial
   $value: Field_bool_value
   $setValue: Field_bool_value
   $unchecked: Field_bool_unchecked
   $child: never
   $opts: unknown
   $ownPatch: Patch<'bool'>
}

export class Field_bool extends Field {
   // #region TYPE
   static readonly type: 'bool' = 'bool'
   static readonly emptySerial: Field_bool['$serial'] = { $: 'bool' }
   static readonly codeForTypescriptValue = (config: Field_bool_ownConfig): string => 'boolean'
   static override migrateSerial(serial: object): Maybe<Field_bool['$serial']> {
      if (isProbablySerialBool(serial)) {
         if ('val' in serial) {
            const recoveredVal = serial.val
            if (typeof recoveredVal !== 'boolean')
               throw new Error(`Field_button: invalid legacy 'val' serial`)
            return produce(serial, (draft) => void (draft.value = recoveredVal))
         }
      }
   }

   // #region CTOR
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<any /* Field_bool */>,
      initialMountKey: string,
      serial?: Field_bool['$serial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region SERIAL
   protected setOwnSerial(next: Field_bool['$serial']): void {
      if (next.value == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.value = def))
      }

      this.assignNewSerial(next)
   }

   // #region CHILDREN
   // #region VALUE
   get value(): Field_bool_value {
      return this.value_or_fail
   }

   set value(next: Field_bool_value) {
      if (this.serial.value === next) return
      this.runInTransaction(() => this.patchSerial((serial) => void (serial.value = next)))
   }

   get value_or_fail(): Field_bool_value {
      const val = this.value_unchecked
      if (val == null) throw new Error('Field_bool.value_or_fail: not set')
      return val
   }

   get value_or_zero(): Field_bool_value {
      return this.serial.value ?? false
   }

   get value_unchecked(): Field_bool_unchecked {
      return this.serial.value
   }

   get pathToValueInRootSerial(): string {
      return `${this.getOwnSerialPathFromRoot()}.value`
   }

   override isValueEqual(other: Field): boolean {
      if (!(other instanceof Field_bool)) return false
      return this.value_unchecked === other.value_unchecked
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

   get defaultValue(): boolean | undefined {
      return this.config.default
   }

   // #region PROBLEMS
   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   // #region NULLABILITY
   get canBeSetOnOrOff(): true {
      return true
   }

   /** set the value to true */
   setOn(): void {
      this.value = true
   }

   /** set the value to false */
   setOff(): void {
      this.value = false
   }

   // #region SETTERS
   /** set value to true if false, and to false if true */
   toggle(): void {
      this.value = !this.value_or_zero
   }

   // #region MOCK
   override randomize(): void {
      const r = Math.random()
      this.value = r > 0.5
   }

   override get isRequired(): boolean {
      return false
   }

   // #region PATCH
   public override readonly patchedSerialPaths: string[] = ['value']
}

// DI
registerFieldClass('bool', Field_bool)
