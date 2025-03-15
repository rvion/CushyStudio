/**
 * this module is here to allow performant type-level apis for enums.
 * TODO: document the unique challenges this appraoch is solving
 */
import type { CushySchemaBuilder } from './CushyBuilder'

import { asComfyNodeSlotName, type ComfyUnionValue } from '../comfyui/comfyui-types'
import { Field_enum, type Field_enum_config } from '../csuite/fields/enum/FieldEnum'
import { CSchema } from './CSchema'

export type IEnumBuilderFN<ENUM_NAME extends keyof Comfy.Slots> = (
   config?: Omit<Field_enum_config<Comfy.Slots[ENUM_NAME]>, 'slotName'>,
) => Z.Enum<ENUM_NAME>

export type IEnumBuilder = { [K in keyof Comfy.Slots]: IEnumBuilderFN<K> }

export interface EnumBuilder extends IEnumBuilder {}
export class EnumBuilder {
   constructor(public domain: CushySchemaBuilder) {
      return new Proxy(this, {
         get(target, prop): IEnumBuilderFN<any> {
            // skip symbols
            if (typeof prop === 'symbol') return (target as any)[prop]

            // skip self methods
            if (prop in target) return (target as any)[prop]

            // skip mobx stuff
            if (prop === 'isMobXAtom') return (target as any)[prop]
            if (prop === 'isMobXReaction') return (target as any)[prop]
            if (prop === 'isMobXComputedValue') return (target as any)[prop]

            // retrieve the schema
            const slotName = asComfyNodeSlotName(prop)
            const schema = cushy.schema
            const enumSchema = schema.knownUnionBySlotName.get(slotName)
            if (enumSchema == null) {
               console.error(`❌ unknown enum: ${slotName}`)
               return (config: any = {}) =>
                  CSchema.new(Field_enum<any /* 🔴 */>, /* form, */ { ...config, slotName: 'INVALID_null' })
               // 🔴 can't throw here, will break for everyone !!
               // 🔴 throw new Error(`unknown enum: ${enumName}`)
            }

            // return the builder
            const def = enumSchema.values[0]
            return (config: any = {}) => CSchema.new(Field_enum<any>, { default: def, ...config, slotName })
         },
      })
   }
}
