import type { ComfyUnionValue } from '../comfyui/comfyui-types'
/**
 * this module is here to allow performant type-level apis for enums.
 * TODO: document the unique challenges this appraoch is solving
 */
import type { CushySchemaBuilder } from './Builder'

import { Field_enum, type Field_enum_config } from '../csuite/fields/enum/FieldEnum'
import { CushySchema } from './Schema'

export type IEnumBuilderFN<T extends ComfyUnionValue> = (
   config?: Omit<Field_enum_config<T>, 'enumName'>,
) => X.XEnum<T>
export type IEnumBuilder = { [K in keyof Comfy.Enums]: IEnumBuilderFN<Comfy.Enums[K]> }

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
            const enumName = prop
            const schema = cushy.schema
            const enumSchema = schema.knownEnumsByName.get(enumName)
            if (enumSchema == null) {
               console.error(`❌ unknown enum: ${enumName}`)
               return (config: any = {}) =>
                  new CushySchema(
                     Field_enum<any /* 🔴 */>,
                     /* form, */ { ...config, enumName: 'INVALID_null' },
                  )
               // 🔴 can't throw here, will break for everyone !!
               // 🔴 throw new Error(`unknown enum: ${enumName}`)
            }

            // return the builder
            const def = enumSchema.values[0]
            return (config: any = {}) =>
               new CushySchema(Field_enum<any>, { default: def, ...config, enumName })
         },
      })
   }
}
