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
   ['ҨType']: 'enum'
   ['ҨOwnConfig']: Field_enum_ownConfig<O>
   ['ҨOwnSerial']: Field_enum_ownSerial<O>
   ['ҨValue']: Field_enum_value<O>
   ['ҨUnchecked']: Field_enum_value<O> | undefined
   ҨField: Field_enum<O>
   ['ҨChild']: never
}
export class Field_enum<O extends ComfyUnionValue> extends Field {
   // #region Static
   static readonly type: 'enum' = 'enum'
   public static readonly patchedSerialPaths: readonly string[] = Object.freeze(['val'])
   static readonly unsetSerial: Field_enum<any>['ҨSerial'] = { $: 'enum' }
   static generateSerial(
      value: Maybe<Field_enum<any>['ҨValue']>,
      config: Field_enum<any>['ҨConfig'],
   ): Field_enum<any>['ҨSerial'] {
      if (value == null && config.default == null) return this.unsetSerial
      return { $: 'enum', val: value ?? config.default }
   }

   static codeForTypescriptValue(config: Field_enum<any>['ҨConfig']): string {
      const knownValues = cushy.schema.knownUnionBySlotName.get(config.slotName)?.values ?? []
      return knownValues.map((v) => JSON.stringify(v)).join(' | ')
   }
   static migrateSerial(): undefined {}

   get defaultValue(): Field_enum_value<O> {
      return this.zConfig.default ?? (this.possibleValues[0] as any)
   }

   get zHasChanges(): boolean {
      return this.zSerial.val !== this.defaultValue
   }

   // #region Validation
   get zOwnTypeSpecificProblems(): Problem_Ext {
      return null
   }
   get zOwnConfigSpecificProblems(): Problem_Ext {
      return null
   }

   // #region Ctor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<Field_enum<O>>,
      initialMountKey: string,
      serial?: Field_enum<O>['ҨSerial'],
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial)
   }

   // #region serial
   get zIsOwnSet(): boolean {
      return this.zSerial.val !== undefined
   }

   zReset(): void {
      this.zValue = this.defaultValue
   }

   unset(): void {
      this.zSerial.val = undefined
   }

   get possibleValues(): ComfyUnionValue[] {
      return cushy.schema.knownUnionBySlotName.get(this.zConfig.slotName as any)?.values ?? []
   }

   private _isValidValue(v: any): v is O {
      const isValidDef = this.possibleValues.includes(v)
      return isValidDef
   }

   protected zSetOwnSerial(next: Field_enum<O>['ҨSerial']): void {
      // handle default
      if (next?.val === undefined) {
         const def = _extractDefaultValue(this.zConfig)
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
      this.zAssignNewSerial(next)
   }

   get status(): CleanedEnumResult<any> {
      return cushy.fixEnumValue(this.zSerial.val as any, this.zConfig.slotName)
   }

   // #region value
   get zValue(): Field_enum_value<O> {
      return this.status.finalValue
   }

   set zValue(next: Field_enum_value<O>) {
      if (this.zSerial.val === next) return
      this.zPatchInTransaction((draft) => void (draft.val = next))
   }

   get zValue_or_fail(): Field_enum_value<O> {
      return this.status.finalValue /* 🔴 */
   }

   get zValue_or_zero(): Field_enum_value<O> {
      return this.status.finalValue /* 🔴 */
   }

   get zValue_unchecked(): Field_enum_value<O> {
      return this.status.finalValue /* 🔴 */
   }

   override zIsValueEqual(other: Field): boolean {
      if (!(other instanceof Field_selectOne)) return false
      return this.zValue_unchecked === other.zValue_unchecked
   }
}

// DI
registerFieldClass('enum', Field_enum)
Field_enum satisfies FieldConstructor<Field_enum<any>>
