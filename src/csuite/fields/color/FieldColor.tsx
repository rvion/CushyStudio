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
   '{type}': 'color'
   '{ownConfig}': Field_color_ownConfig
   '{ownSerial}': Field_color_ownSerial
   '{value}': Field_color_value
   '{setValue}': Field_color_value
   '{unchecked}': Field_color_unchecked
   '{child}': never
   '{opts}': unknown
   '{ownPatch}': Patch<'color'>
}
export class Field_color extends Field {
   static readonly type: 'color' = 'color'
   static override migrateSerial(): undefined {}
   static readonly codeForTypescriptValue = (config: Field_color['{config}']): string => 'Z.Color'
   static readonly unsetSerial: Field_color['{serial}'] = { $: 'color' }
   static generateSerial(
      setValue: Maybe<Field_color['{setValue}']>,
      config: Field_color['{config}'],
   ): Field_color['{serial}'] {
      if (setValue == null && config.default == null) return this.unsetSerial
      const value = setValue ?? config.default
      return { $: 'color', value }
   }

   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_color>,
      initialMountKey: string,
      serial?: Field_color['{serial}'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   protected zSetOwnSerial(next: this['{serial}']): void {
      if (next.value == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.value = def))
      }

      this.zAssignNewSerial(next)
   }

   get zIsOwnSet(): boolean {
      return this.zSerial.value !== undefined
   }

   set zValue(next: Field_color_value) {
      if (this.zSerial.value === next) return
      this.zRunInTransaction(() => this.zPatchSerial((draft) => void (draft.value = next)))
   }

   get zValue(): Field_color_value {
      const val = this.zValueUnchecked
      if (val == null) throw new Error('Field_color.zValue: not set')
      return val
   }

   get zValueOrZero(): Field_color_value {
      return this.zSerial.value ?? '#000000' /* <- zero */
   }

   get zValueUnchecked(): Field_color_unchecked {
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
