import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'
import type { UIKit } from './WidgetCustomUI'
import type { FC } from 'react'

import { produce } from 'immer'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { WidgetCustom_HeaderUI } from './WidgetCustomUI'

export type CustomWidgetProps<T> = {
   field: Field_custom<T>
   extra: UIKit
}

// #region $Config
export type Field_custom_config<T> = FieldConfig<
   {
      defaultValue: () => T
      subTree?: () => BaseSchema
      Component: FC<CustomWidgetProps<T>>
   },
   Field_custom_types<T>
>

// #region $Serial
export type Field_custom_serial<T> = FieldSerial<{
   $: 'custom'

   /** field is considered unset until value is set */
   value?: T
}>

// #region $Value
export type Field_custom_value<T> = T

// #region $Types
export type Field_custom_types<T> = {
   $Type: 'custom'
   $Config: Field_custom_config<T>
   $Serial: Field_custom_serial<T>
   $Value: Field_custom_value<T>
   $Unchecked: Field_custom_value<T> | undefined
   $Field: Field_custom<T>
   $Child: never
   $Reflect: Field_custom_types<T>
}

// #region State
export class Field_custom<T> extends Field<Field_custom_types<T>> {
   // #region Static
   static readonly type: 'custom' = 'custom'
   static readonly emptySerial: Field_custom_serial<any> = { $: 'custom' }
   static migrateSerial(): undefined {}
   static codegenValueType(config: Field_custom_config<any>): string {
      return `unknown /* ${config.Component.name} */`
   }

   // #region Ctor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: BaseSchema<Field_custom<T>>,
      initialMountKey: string,
      serial?: Field_custom_serial<T>,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial, {
         Component: false,
         DefaultHeaderUI: false,
         DefaultBodyUI: false,
      })
   }
   // #region serial
   get isOwnSet(): boolean {
      return this.serial.value !== undefined
   }

   protected setOwnSerial(next: Field_custom_serial<T>): void {
      if (!this.serial.value === undefined) {
         const def = this.defaultValue
         if (def !== undefined) {
            next = produce(next, (draft) => void ((draft.value = def as any) /* 🔴 */))
         }
      }

      this.assignNewSerial(next)
   }

   // #region UI
   DefaultHeaderUI = WidgetCustom_HeaderUI
   DefaultBodyUI = undefined

   get Component(): Field_custom_config<T>['Component'] {
      return this.config.Component
   }

   // #region Validation
   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   // #region Changes
   get defaultValue(): T {
      return this.config.defaultValue()
   }

   get hasChanges(): boolean {
      return this.value !== this.defaultValue
   }

   // #region Value
   /** never mutate this field manually, only access to .state */
   get value(): Field_custom_value<T> {
      return this.serial.value ?? this.defaultValue
   }

   set value(next: Field_custom_value<T>) {
      if (this.serial.value === next) return
      this.runInValueTransaction(() => (this.serial.value = next))
   }

   get value_or_fail(): Field_custom_value<T> {
      if (this.serial.value === undefined) throw new Error('Field_custom.value_or_fail: ❌ not set')
      return this.serial.value
   }

   /* there is no zero value */
   get value_or_zero(): Field_custom_value<T> {
      const valOrZero = this.serial.value ?? this.defaultValue
      if (valOrZero) throw new Error('Field_custom.value_or_zero: ❌ both not set, and without default')
      return valOrZero
   }

   get value_unchecked(): Field_custom_value<T> | undefined {
      return this.serial.value
   }
}

registerFieldClass('custom', Field_custom)
