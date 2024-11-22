import type { ComfyUnionValue } from '../../../comfyui/comfyui-types'
import type { Field_enum_config } from './FieldEnum'

// ⁉️
export const _extractDefaultValue = (input: Field_enum_config<any>): Maybe<ComfyUnionValue> => {
   const def = input.default

   if (def != null) {
      // case value (backwards compat)
      if (typeof def === 'string') return def
      if (typeof def === 'boolean') return def
      if (typeof def === 'number') return def
   }

   // default
   return null
}
