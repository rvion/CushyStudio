import type { CSchema } from '../../model/CSchema'
import type { FieldConstructor } from '../../model/FieldConstructor'
import type { Patch } from '../../model/Patch'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { produce } from 'immer'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'

// CONFIG
type Field_color_ownConfig = { default?: string }

// SERIAL
type Field_color_ownSerial = {
   $: 'color'
   /** color, stored as string */
   value?: string
}

// VALUE
export type Field_color_value = string
export type Field_color_unchecked = Field_color_value | undefined

// STATE
export interface Field_color {
   '::Type': 'color'
   '::OwnConfig': Field_color_ownConfig
   '::OwnSerial': Field_color_ownSerial
   '::Value': Field_color_value
   '::Setvalue': Field_color_value
   '::Unchecked': Field_color_unchecked
   '::Child': never
   '::Opts': unknown
   '::OwnPatch': Patch<'color'>
}
export class Field_color extends Field {
   static readonly type: 'color' = 'color'
   static readonly unsetSerial: Field_color['::Serial'] = { $: 'color' }
   static override migrateSerial(): undefined {}
   static readonly codeForTypescriptValue = (config: Field_color['::Config']): string => 'Z.Color'
   static generateSerial(
      value: Maybe<Field_color['::Value']>,
      config: Field_color['::Config'],
   ): Field_color['::Serial'] {
      if (value == null && config.default == null) return this.unsetSerial

      return {
         $: 'color',
         value: value ?? config.default,
      }
   }

   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_color>,
      initialMountKey: string,
      serial?: Field_color['::Serial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   protected zSetOwnSerial(next: this['::Serial']): void {
      if (next.value == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.value = def))
      }

      this.zAssignNewSerial(next)
   }

   get zIsOwnSet(): boolean {
      return this.zSerial.value !== undefined
   }

   get zValue(): Field_color_value {
      return this.zValue_or_fail
   }

   set zValue(next: Field_color_value) {
      if (this.zSerial.value === next) return
      this.zRunInTransaction(() => this.zPatchSerial((draft) => void (draft.value = next)))
   }

   get zValue_or_fail(): Field_color_value {
      const val = this.zValue_unchecked
      if (val == null) throw new Error('Field_color.zValue_or_fail: not set')
      return val
   }

   get zValue_or_zero(): Field_color_value {
      return this.zSerial.value ?? '#000000' /* <- zero */
   }

   get zValue_unchecked(): Field_color_unchecked {
      return this.zSerial.value
   }

   override zIsValueEqual(other: Field): boolean {
      if (!(other instanceof Field_color)) return false

      return this.zSerial.value === other.zSerial.value
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['value'])

   get zOwnTypeSpecificProblems(): Problem_Ext {
      return null
   }

   get zOwnConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get defaultValue(): string | undefined {
      return this.zConfig.default
   }

   get zHasChanges(): boolean {
      if (!this.zIsSet) return false
      if (this.zSerial.value === this.defaultValue) return false
      return true
   }
}

// DI
registerFieldClass('color', Field_color)
Field_color satisfies FieldConstructor<Field_color>
