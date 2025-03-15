import type { CSchema } from '../../model/CSchema'
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
export class Field_color extends Field {
   declare $type: 'color'
   declare $ownConfig: Field_color_ownConfig
   declare $ownSerial: Field_color_ownSerial
   declare $value: Field_color_value
   declare $setValue: Field_color_value
   declare $unchecked: Field_color_unchecked
   declare $child: never
   declare $opts: unknown
   declare $ownPatch: Patch<'color'>

   static readonly type: 'color' = 'color'
   static readonly unsetSerial: Field_color['$serial'] = { $: 'color' }
   static override migrateSerial(): undefined {}
   static readonly codeForTypescriptValue = (config: Field_color['$config']): string => 'Z.Color'
   static generateSerial(
      value: Maybe<Field_color['$value']>,
      config: Field_color['$config'],
   ): Field_color['$serial'] {
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
      serial?: Field_color['$serial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   protected setOwnSerial(next: this['$serial']): void {
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
      this.runInTransaction(() => this.patchSerial((draft) => void (draft.value = next)))
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

   override isValueEqual(other: Field): boolean {
      if (!(other instanceof Field_color)) return false

      return this.serial.value === other.serial.value
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['value'])

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
