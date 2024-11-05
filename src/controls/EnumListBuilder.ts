/**
 * this module is here to allow performant type-level apis for enums.
 * TODO: document the unique challenges this appraoch is solving
 */

import type { Field_selectMany_config_simplified_ } from '../csuite/fields/selectMany/FieldSelectMany'
import type { Builder } from '../CUSHY'

export type IEnumListBuilderFn<T extends string> = (
   config?: Omit<Field_selectMany_config_simplified_<T>, 'choices'>,
) => X.XSelectMany_<T>

export type IEnumListBuilder = {
   // 💬 2024-08-26 rvion:
   // | Extract seems to be a better default, since it preserve type alias name
   // | provided in the the type template.
   // | with Extract:
   // |    ✅: X.Many_<Enum_UpscaleModelLoader_model_name>
   // | without Extract<...>
   // |    ❌: X.Many_<"4x-AnimeSharp.pth" | "4x-UltraSharp.pth" | "4x_NMKD-Siax_200k.pth" | ...>
   [K in keyof Comfy.Enums]: IEnumListBuilderFn<Extract<Comfy.Enums[K], string>>
   // [K in keyof Requirable]: IEnumListBuilderFn<Requirable[K]['$Value'] & string>
}

export interface EnumListBuilder extends IEnumListBuilder {}
export class EnumListBuilder {
   constructor(public domain: Builder) {
      return new Proxy(this, {
         get(target, prop): IEnumListBuilderFn<any> {
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
            if (enumSchema == null) { throw new Error(`unknown enum: ${enumName}`); } // prettier-ignore

            // return (config: any = {}) => form.builder.bool()
            // return the builder
            return (config: any = {}) =>
               domain.selectManyStrings({
                  choices: enumSchema.values.map((v) => ({ id: v.toString(), label: v })),
                  appearance: 'tab',
                  ...config,
               })
         },
      })
   }
}
