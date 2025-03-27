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

// #region ['Ҩconfig']
export type Field_custom_ownConfig<T> = {
   defaultValue: () => T
   subTree?: () => CSchema
   Component: FC<CustomWidgetProps<T>>
}

export type Field_custom_ownSerial<T> = {
   $: 'custom'
   /** field is considered unset until value is set */
   value?: T
}

// #region ['Ҩvalue']
export type Field_custom_value<T> = T

// #region $Types
export interface Field_custom<T> {
   ['Ҩtype']: 'custom'
   ['ҨownConfig']: Field_custom_ownConfig<T>
   ['ҨownSerial']: Field_custom_ownSerial<T>
   ['Ҩvalue']: Field_custom_value<T>
   ['Ҩunchecked']: Field_custom_value<T> | undefined
   Ҩfield: Field_custom<T>
   ['Ҩchild']: never
}

export class Field_custom<T> extends Field {
   static readonly type: 'custom' = 'custom'
   static readonly unsetSerial: Field_custom<any>['Ҩserial'] = { $: 'custom' }
   static generateSerial(
      value: Maybe<Field_custom<any>['Ҩvalue']>,
      config: Field_custom<any>['Ҩconfig'],
   ): Field_custom<any>['Ҩserial'] {
      if (value == null && config.defaultValue == null) return this.unsetSerial
      const finalValue = value != null ? value : config.defaultValue()
      return { $: 'custom', value: finalValue }
   }
   static migrateSerial(): undefined {}
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['val'])
   static codeForTypescriptValue(config: Field_custom<any>['Ҩconfig']): string {
      return `unknown /* ${config.Component.name} */`
   }

   // #region Ctor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_custom<T>>,
      initialMountKey: string,
      serial?: Field_custom<T>['Ҩserial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }
   // #region serial
   get ϟisOwnSet(): boolean {
      return this.ϟserial.value !== undefined
   }

   protected ϟsetOwnSerial(next: Field_custom<T>['Ҩserial']): void {
      if (!(this.ϟserial.value === undefined)) {
         const def = this.defaultValue
         if (def !== undefined) {
            next = produce(next, (draft) => void ((draft.value = def as any) /* 🔴 */))
         }
      }

      this.ϟassignNewSerial(next)
   }

   // #region UI
   DefaultHeaderUI = WidgetCustom_HeaderUI
   DefaultBodyUI: undefined = undefined

   get Component(): Field_custom<T>['Ҩconfig']['Component'] {
      return this.ϟconfig.Component
   }

   // #region Validation
   get ϟownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   get ϟownTypeSpecificProblems(): Problem_Ext {
      return null
   }

   // #region Changes
   @computed get defaultValue(): T {
      return this.ϟconfig.defaultValue()
   }

   get ϟhasChanges(): boolean {
      return this.ϟvalue !== this.defaultValue
   }

   public ϟisValueEqual(other: Field): boolean {
      if (other === this) return true
      if (!(other instanceof Field_custom)) return false
      // 🔴 naive
      return stableStringify(other.ϟserial) === stableStringify(this.ϟserial)
   }

   // #region Value
   /** never mutate this field manually, only access to .state */
   get ϟvalue(): Field_custom_value<T> {
      return this.ϟserial.value ?? this.defaultValue
   }

   set ϟvalue(next: Field_custom_value<T>) {
      if (this.ϟserial.value === next) return
      this.ϟrunInTransaction(() => (this.ϟserial.value = next))
   }

   get ϟvalue_or_fail(): Field_custom_value<T> {
      if (this.ϟserial.value === undefined) throw new Error('Field_custom.value_or_fail: ❌ not set')
      return this.ϟserial.value
   }

   /* there is no zero value */
   get ϟvalue_or_zero(): Field_custom_value<T> {
      const valOrZero = this.ϟserial.value ?? this.defaultValue
      if (valOrZero) throw new Error('Field_custom.value_or_zero: ❌ both not set, and without default')
      return valOrZero
   }

   get ϟvalue_unchecked(): Field_custom_value<T> | undefined {
      return this.ϟserial.value
   }
}

registerFieldClass('custom', Field_custom)
Field_custom satisfies FieldConstructor<Field_custom<any>>
