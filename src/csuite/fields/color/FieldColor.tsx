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
   ['Ҩtype']: 'color'
   ['ҨownConfig']: Field_color_ownConfig
   ['ҨownSerial']: Field_color_ownSerial
   ['Ҩvalue']: Field_color_value
   ['Ҩsetvalue']: Field_color_value
   ['Ҩunchecked']: Field_color_unchecked
   ['Ҩchild']: never
   ['Ҩopts']: unknown
   ['ҨownPatch']: Patch<'color'>
}
export class Field_color extends Field {
   static readonly type: 'color' = 'color'
   static readonly unsetSerial: Field_color['Ҩserial'] = { $: 'color' }
   static override migrateSerial(): undefined {}
   static readonly codeForTypescriptValue = (config: Field_color['Ҩconfig']): string => 'Z.Color'
   static generateSerial(
      value: Maybe<Field_color['Ҩvalue']>,
      config: Field_color['Ҩconfig'],
   ): Field_color['Ҩserial'] {
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
      serial?: Field_color['Ҩserial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   protected ϟsetOwnSerial(next: this['Ҩserial']): void {
      if (next.value == null) {
         const def = this.defaultValue
         if (def != null) next = produce(next, (draft) => void (draft.value = def))
      }

      this.ϟassignNewSerial(next)
   }

   get ϟisOwnSet(): boolean {
      return this.ϟserial.value !== undefined
   }

   get ϟvalue(): Field_color_value {
      return this.ϟvalue_or_fail
   }

   set ϟvalue(next: Field_color_value) {
      if (this.ϟserial.value === next) return
      this.ϟrunInTransaction(() => this.ϟpatchSerial((draft) => void (draft.value = next)))
   }

   get ϟvalue_or_fail(): Field_color_value {
      const val = this.ϟvalue_unchecked
      if (val == null) throw new Error('Field_color.value_or_fail: not set')
      return val
   }

   get ϟvalue_or_zero(): Field_color_value {
      return this.ϟserial.value ?? '#000000' /* <- zero */
   }

   get ϟvalue_unchecked(): Field_color_unchecked {
      return this.ϟserial.value
   }

   override ϟisValueEqual(other: Field): boolean {
      if (!(other instanceof Field_color)) return false

      return this.ϟserial.value === other.ϟserial.value
   }

   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['value'])

   get ϟownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   get ϟownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get defaultValue(): string | undefined {
      return this.ϟconfig.default
   }

   get ϟhasChanges(): boolean {
      if (!this.ϟisSet) return false
      if (this.ϟserial.value === this.defaultValue) return false
      return true
   }
}

// DI
registerFieldClass('color', Field_color)
Field_color satisfies FieldConstructor<Field_color>
