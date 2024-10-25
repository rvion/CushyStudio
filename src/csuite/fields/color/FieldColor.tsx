import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { produce } from 'immer'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { WidgetColorUI } from './WidgetColorUI'

// CONFIG
export type Field_color_config = FieldConfig<{ default?: string }, Field_color_types>

// SERIAL
export type Field_color_serial = FieldSerial<{
   $: 'color'
   /** color, stored as string */
   value?: string
}>

// VALUE
export type Field_color_value = string
export type Field_color_unchecked = Field_color_value | undefined

// TYPES
export type Field_color_types = {
   $Type: 'color'
   $Config: Field_color_config
   $Serial: Field_color_serial
   $Value: Field_color_value
   $Unchecked: Field_color_unchecked
   $Field: Field_color
   $Child: never
   $Reflect: Field_color_types
}

// STATE
export class Field_color extends Field<Field_color_types> {
   // #region types
   static readonly type: 'color' = 'color'
   static readonly emptySerial: Field_color_serial = { $: 'color' }
   static codegenValueType(config: Field_color_config): string {
      return `string`
   }
   static migrateSerial(): undefined {}

   // #region UI
   readonly DefaultHeaderUI = WidgetColorUI
   readonly DefaultBodyUI = undefined

   // #region Ctor
   constructor(
      //
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: BaseSchema<Field_color>,
      initialMountKey: string,
      serial?: Field_color_serial,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial, {
         DefaultHeaderUI: false,
         DefaultBodyUI: false,
      })
   }

   protected setOwnSerial(next: Field_color_serial): void {
      if (next.value == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.value = def))
      }

      this.assignNewSerial(next)
   }

   get isOwnSet(): boolean {
      return this.serial.value !== undefined
   }

   get value(): Field_color_value {
      return this.value_or_fail
   }

   set value(next: Field_color_value) {
      if (this.serial.value === next) return
      this.runInValueTransaction(() => this.patchSerial((draft) => void (draft.value = next)))
   }

   get value_or_fail(): Field_color_value {
      const val = this.value_unchecked
      if (val == null) throw new Error('Field_color.value_or_fail: not set')
      return val
   }

   get value_or_zero(): Field_color_value {
      return this.serial.value ?? '#000000' /* <- zero */
   }

   get value_unchecked(): Field_color_unchecked {
      return this.serial.value
   }

   get ownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get defaultValue(): string | undefined {
      return this.config.default
   }

   get hasChanges(): boolean {
      if (!this.isSet) return false
      if (this.serial.value === this.defaultValue) return false
      return true
   }
}

// DI
registerFieldClass('color', Field_color)
