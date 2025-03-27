import type { ComfyNodeSlotName, ComfyUnionValue } from '../../../comfyui/comfyui-types'
import type { CleanedEnumResult } from '../../../types/EnumUtils'
import type { CSchema } from '../../model/CSchema'
import type { FieldConstructor } from '../../model/FieldConstructor'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { produce } from 'immer'

import { Field } from '../../model/Field'
import { Field_selectOne } from '../selectOne/FieldSelectOne'
import { registerFieldClass } from '../WidgetUI.DI'
import { _extractDefaultValue } from './_extractDefaultValue'

// #region Config
export type Field_enum_ownConfig<O extends ComfyUnionValue> = {
   slotName: ComfyNodeSlotName
   default?: O
   extraDefaults?: string[]
   filter?: (v: ComfyUnionValue) => boolean
   appearance?: 'select' | 'tab'
   /**
    * @since 2024-07-22
    * allow to wrap the list of values if they take more than 1 SLH (standard line height)
    */
   wrap?: boolean
}

// #region Serial
export type Field_enum_ownSerial<O extends ComfyUnionValue> = {
   $: 'enum'
   val?: O
}

// #region Value
export type Field_enum_value<O extends ComfyUnionValue> = O // Requirable[T]

// #region State
export interface Field_enum<O extends ComfyUnionValue> {
   ['Ҩtype']: 'enum'
   ['ҨownConfig']: Field_enum_ownConfig<O>
   ['ҨownSerial']: Field_enum_ownSerial<O>
   ['Ҩvalue']: Field_enum_value<O>
   ['Ҩunchecked']: Field_enum_value<O> | undefined
   Ҩfield: Field_enum<O>
   ['Ҩchild']: never
}
export class Field_enum<O extends ComfyUnionValue> extends Field {
   // #region Static
   static readonly type: 'enum' = 'enum'
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['val'])
   static readonly unsetSerial: Field_enum<any>['Ҩserial'] = { $: 'enum' }
   static generateSerial(
      value: Maybe<Field_enum<any>['Ҩvalue']>,
      config: Field_enum<any>['Ҩconfig'],
   ): Field_enum<any>['Ҩserial'] {
      if (value == null && config.default == null) return this.unsetSerial
      return { $: 'enum', val: value ?? config.default }
   }

   static codeForTypescriptValue(config: Field_enum<any>['Ҩconfig']): string {
      const knownValues = cushy.schema.knownUnionBySlotName.get(config.slotName)?.values ?? []
      return knownValues.map((v) => JSON.stringify(v)).join(' | ')
   }
   static migrateSerial(): undefined {}

   get defaultValue(): Field_enum_value<O> {
      return this.ϟconfig.default ?? (this.possibleValues[0] as any)
   }

   get ϟhasChanges(): boolean {
      return this.ϟserial.val !== this.defaultValue
   }

   // #region Validation
   get ϟownTypeSpecificProblems(): Problem_Ext {
      return null
   }
   get ϟownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   // #region Ctor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_enum<O>>,
      initialMountKey: string,
      serial?: Field_enum<O>['Ҩserial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region serial
   get ϟisOwnSet(): boolean {
      return this.ϟserial.val !== undefined
   }

   ϟreset(): void {
      this.ϟvalue = this.defaultValue
   }

   unset(): void {
      this.ϟserial.val = undefined
   }

   get possibleValues(): ComfyUnionValue[] {
      return cushy.schema.knownUnionBySlotName.get(this.ϟconfig.slotName as any)?.values ?? []
   }

   private _isValidValue(v: any): v is O {
      const isValidDef = this.possibleValues.includes(v)
      return isValidDef
   }

   protected ϟsetOwnSerial(next: Field_enum<O>['Ҩserial']): void {
      // handle default
      if (next?.val === undefined) {
         const def = _extractDefaultValue(this.ϟconfig)
         if (def != null) {
            const isValidDef = this.possibleValues.includes(def)
            // ⏸️ if (!this._isValidValue(def)) {
            // ⏸️     throw new Error(`Invalid default value ${def} for enum ${this.config.enumName}`)
            // ⏸️ }
            const nextXX = def as any as O
            // 🔴 ping @globi
            // @ts-ignore
            next = produce(next, (draft) => void (draft.val = nextXX))
         }
      }
      // this.serial.val =
      //     next?.val ?? //
      //     _extractDefaultValue(this.config) ??
      //     (this.possibleValues[0] as any)
      this.ϟassignNewSerial(next)
   }

   get status(): CleanedEnumResult<any> {
      return cushy.fixEnumValue(this.ϟserial.val as any, this.ϟconfig.slotName)
   }

   // #region value
   get ϟvalue(): Field_enum_value<O> {
      return this.status.finalValue
   }

   set ϟvalue(next: Field_enum_value<O>) {
      if (this.ϟserial.val === next) return
      this.ϟpatchInTransaction((draft) => void (draft.val = next))
   }

   get ϟvalue_or_fail(): Field_enum_value<O> {
      return this.status.finalValue /* 🔴 */
   }

   get ϟvalue_or_zero(): Field_enum_value<O> {
      return this.status.finalValue /* 🔴 */
   }

   get ϟvalue_unchecked(): Field_enum_value<O> {
      return this.status.finalValue /* 🔴 */
   }

   override ϟisValueEqual(other: Field): boolean {
      if (!(other instanceof Field_selectOne)) return false
      return this.ϟvalue_unchecked === other.ϟvalue_unchecked
   }
}

// DI
registerFieldClass('enum', Field_enum)
Field_enum satisfies FieldConstructor<Field_enum<any>>
