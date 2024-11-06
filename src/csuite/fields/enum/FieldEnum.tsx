import type { ComfyUnionValue } from '../../../comfyui/comfyui-types'
import type { CleanedEnumResult } from '../../../types/EnumUtils'
import type { BaseSchema } from '../../model/BaseSchema'
import type { FieldConfig } from '../../model/FieldConfig'
import type { FieldSerial } from '../../model/FieldSerial'
import type { Repository } from '../../model/Repository'
import type { Problem_Ext } from '../../model/Validation'

import { produce } from 'immer'

import { Field } from '../../model/Field'
import { registerFieldClass } from '../WidgetUI.DI'
import { _extractDefaultValue } from './_extractDefaultValue'
import { WidgetEnumUI } from './WidgetEnumUI'

// #region Config
export type Field_enum_config<ENUM_NAME extends keyof Comfy.Slots> = FieldConfig<
   {
      enumName: string
      default?: Comfy.Slots[ENUM_NAME]
      extraDefaults?: string[]
      filter?: (v: ComfyUnionValue) => boolean
      appearance?: 'select' | 'tab'
      /**
       * @since 2024-07-22
       * allow to wrap the list of values if they take more than 1 SLH (standard line height)
       */
      wrap?: boolean
   },
   Field_enum_types<ENUM_NAME>
>

// #region Serial
export type Field_enum_serial<ENUM_NAME extends keyof Comfy.Slots> = FieldSerial<{
   $: 'enum'
   val?: Comfy.Slots[ENUM_NAME]
}>

// #region Value
export type Field_enum_value<ENUM_NAME extends keyof Comfy.Slots> = Comfy.Slots[ENUM_NAME] // Requirable[T]

// #region Types
export type Field_enum_types<ENUM_NAME extends keyof Comfy.Slots> = {
   $Type: 'enum'
   $Config: Field_enum_config<ENUM_NAME>
   $Serial: Field_enum_serial<ENUM_NAME>
   $Value: Field_enum_value<ENUM_NAME>
   $Unchecked: Field_enum_value<ENUM_NAME> | undefined
   $Field: Field_enum<ENUM_NAME>
   $Child: never
   $Reflect: Field_enum_types<ENUM_NAME>
}

// #region State
export class Field_enum<ENUM_NAME extends keyof Comfy.Slots> extends Field<Field_enum_types<ENUM_NAME>> {
   // #region Static
   static readonly type: 'enum' = 'enum'
   static readonly emptySerial: Field_enum_serial<any> = { $: 'enum' }
   static codegenValueType(config: Field_enum_config<any>): string {
      const knownValues = cushy.schema.knownEnumsByName.get(config.enumName)?.values ?? []
      return knownValues.map((v) => JSON.stringify(v)).join(' | ')
   }
   static migrateSerial(): undefined {}

   // #region UI
   DefaultHeaderUI = WidgetEnumUI
   DefaultBodyUI: undefined = undefined

   get defaultValue(): Field_enum_value<ENUM_NAME> {
      return this.config.default ?? (this.possibleValues[0] as any)
   }

   get hasChanges(): boolean {
      return this.serial.val !== this.defaultValue
   }

   // #region Validation
   get ownTypeSpecificProblems(): Problem_Ext {
      return null
   }
   get ownConfigSpecificProblems(): Problem_Ext {
      return null
   }

   // #region Ctor
   constructor(
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: BaseSchema<Field_enum<ENUM_NAME>>,
      initialMountKey: string,
      serial?: Field_enum_serial<ENUM_NAME>,
   ) {
      super(repo, root, parent, schema, initialMountKey, serial)
      this.init(serial, {
         DefaultHeaderUI: false,
         DefaultBodyUI: false,
      })
   }

   // #region serial
   get isOwnSet(): boolean {
      return this.serial.val !== undefined
   }

   reset(): void {
      this.value = this.defaultValue
   }

   unset(): void {
      this.serial.val = undefined
   }

   get possibleValues(): ComfyUnionValue[] {
      return cushy.schema.knownEnumsByName.get(this.config.enumName as any)?.values ?? []
   }

   private _isValidValue(v: any): v is Comfy.Slots[ENUM_NAME] {
      const isValidDef = this.possibleValues.includes(v)
      return isValidDef
   }

   protected setOwnSerial(next: Field_enum_serial<ENUM_NAME>): void {
      // handle default
      if (next?.val === undefined) {
         const def = _extractDefaultValue(this.config)
         if (def != null) {
            const isValidDef = this.possibleValues.includes(def)
            // ⏸️ if (!this._isValidValue(def)) {
            // ⏸️     throw new Error(`Invalid default value ${def} for enum ${this.config.enumName}`)
            // ⏸️ }
            const nextXX = def as any as Comfy.Slots[ENUM_NAME]
            // 🔴 ping @globi
            // @ts-ignore
            next = produce(next, (draft) => void (draft.val = nextXX))
         }
      }
      // this.serial.val =
      //     next?.val ?? //
      //     _extractDefaultValue(this.config) ??
      //     (this.possibleValues[0] as any)
      this.assignNewSerial(next)
   }

   get status(): CleanedEnumResult<any> {
      return cushy.fixEnumValue(this.serial.val as any, this.config.enumName)
   }

   // #region value
   get value(): Field_enum_value<ENUM_NAME> {
      return this.status.finalValue
   }

   set value(next: Field_enum_value<ENUM_NAME>) {
      if (this.serial.val === next) return
      this.runInValuePatch((draft) => (draft.val = next))
   }

   get value_or_fail(): Field_enum_value<ENUM_NAME> {
      return this.status.finalValue /* 🔴 */
   }

   get value_or_zero(): Field_enum_value<ENUM_NAME> {
      return this.status.finalValue /* 🔴 */
   }

   get value_unchecked(): Field_enum_value<ENUM_NAME> {
      return this.status.finalValue /* 🔴 */
   }
}

// DI
registerFieldClass('enum', Field_enum)
