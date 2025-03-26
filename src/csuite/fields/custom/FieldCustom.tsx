import type { CSchema } from '../../model/CSchema'
import type { FieldConstructor } from '../../model/FieldConstructor'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'
import type { UIKit } from './WidgetCustomUI'
import type { FC } from 'react'

import { produce } from 'immer'
import { computed } from 'mobx'

import { stableStringify } from '../../hashUtils/hash'
import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { WidgetCustom_HeaderUI } from './WidgetCustomUI'

export type CustomWidgetProps<T> = {
   field: Field_custom<T>
   extra: UIKit
}

// #region $config
export type Field_custom_ownConfig<T> = {
   defaultValue: () => T
   subTree?: () => CSchema
   Component: FC<CustomWidgetProps<T>>
}

// #region $serial
export type Field_custom_ownSerial<T> = {
   $: 'custom'
   /** field is considered unset until value is set */
   value?: T
}

// #region $value
export type Field_custom_value<T> = T

// #region $Types
export interface Field_custom<T> {
   $type: 'custom'
   $ownConfig: Field_custom_ownConfig<T>
   $ownSerial: Field_custom_ownSerial<T>
   $value: Field_custom_value<T>
   $unchecked: Field_custom_value<T> | undefined
   $field: Field_custom<T>
   $child: never
}

export class Field_custom<T> extends Field {
   static readonly type: 'custom' = 'custom'
   static readonly unsetSerial: Field_custom<any>['$serial'] = { $: 'custom' }
   static generateSerial(
      value: Maybe<Field_custom<any>['$value']>,
      config: Field_custom<any>['$config'],
   ): Field_custom<any>['$serial'] {
      if (value == null && config.defaultValue == null) return this.unsetSerial
      const finalValue = value != null ? value : config.defaultValue()
      return { $: 'custom', value: finalValue }
   }
   static migrateSerial(): undefined {}
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['val'])
   static codeForTypescriptValue(config: Field_custom<any>['$config']): string {
      return `unknown /* ${config.Component.name} */`
   }

   // #region Ctor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_custom<T>>,
      initialMountKey: string,
      serial?: Field_custom<T>['$serial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }
   // #region serial
   get isOwnSet(): boolean {
      return this.serial.value !== undefined
   }

   protected setOwnSerial(next: Field_custom<T>['$serial']): void {
      if (!(this.serial.value === undefined)) {
         const def = this.defaultValue
         if (def !== undefined) {
            next = produce(next, (draft) => void ((draft.value = def as any) /* 🔴 */))
         }
      }

      this.assignNewSerial(next)
   }

   // #region UI
   DefaultHeaderUI = WidgetCustom_HeaderUI
   DefaultBodyUI: undefined = undefined

   get Component(): Field_custom<T>['$config']['Component'] {
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
   @computed get defaultValue(): T {
      return this.config.defaultValue()
   }

   get hasChanges(): boolean {
      return this.value !== this.defaultValue
   }

   public isValueEqual(other: Field): boolean {
      if (other === this) return true
      if (!(other instanceof Field_custom)) return false
      // 🔴 naive
      return stableStringify(other.serial) === stableStringify(this.serial)
   }

   // #region Value
   /** never mutate this field manually, only access to .state */
   get value(): Field_custom_value<T> {
      return this.serial.value ?? this.defaultValue
   }

   set value(next: Field_custom_value<T>) {
      if (this.serial.value === next) return
      this.runInTransaction(() => (this.serial.value = next))
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
Field_custom satisfies FieldConstructor<Field_custom<any>>
