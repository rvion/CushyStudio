import type { ComfySchemaL } from '../models/ComfySchema'
/**
 * this module is here to allow performant type-level apis for enums.
 * TODO: document the unique challenges this appraoch is solving
 */
import type { CushySchemaBuilder } from './Builder'

import { asComfyNodeSlotName } from '../comfyui/comfyui-types'
import { Field_enum, type Field_enum_config } from '../csuite/fields/enum/FieldEnum'
import { CushySchema } from './Schema'

// 🔴 showcase how nullability work without optional

export type IEnumBuilderOptFn<ENUM_NAME extends keyof Comfy.Slots> = (
   config?: Omit<Field_enum_config<Comfy.Slots[ENUM_NAME]>, 'slotName'> & { startActive?: boolean },
) => X.XOptional<X.XEnum<ENUM_NAME>>

export type IEnumBuilderOpt = {
   [K in keyof Comfy.Slots]: IEnumBuilderOptFn<K>
}

export interface EnumBuilderOpt extends IEnumBuilderOpt {}
export class EnumBuilderOpt {
   constructor(public domain: CushySchemaBuilder) {
      return new Proxy(this, {
         get(target, prop): IEnumBuilderOptFn<any> {
            // skip symbols
            if (typeof prop === 'symbol') return (target as any)[prop]

            // skip self methods
            if (prop in target) return (target as any)[prop]

            // skip mobx stuff
            if (prop === 'isMobXAtom') return (target as any)[prop]
            if (prop === 'isMobXReaction') return (target as any)[prop]
            if (prop === 'isMobXComputedValue') return (target as any)[prop]

            // retrieve the schema
            const slotName: keyof Comfy.Slots = asComfyNodeSlotName(prop)
            const schema: ComfySchemaL = cushy.schema
            const enumSchema = schema.knownUnionBySlotName.get(slotName)
            if (enumSchema == null) {
               console.error(`❌ unknown enum: ${slotName}`)
               return (config: any = {}) =>
                  domain.optional({
                     label: config.label,
                     startActive: config.startActive,
                     schema: new CushySchema(Field_enum<any /* 🔴 */>, {
                        ...config,
                        slotName: 'INVALID_null',
                     }),
                  })
               // 🔴 can't throw here, will break for everyone !!
               // throw new Error(`unknown enum: ${enumName}`)
            }

            // return the builder
            const def = enumSchema.values[0]
            return (config: any = {}) =>
               domain.optional({
                  label: config.label,
                  startActive: config.startActive,
                  schema: new CushySchema(Field_enum<any /* 🔴 */>, {
                     default: def,
                     ...config,
                     slotName: slotName,
                  }),
               })
         },
      })
   }
}
