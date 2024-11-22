import type { ComfyUnionValue } from '../comfyui/comfyui-types'

/** weird abstraction */
export type CleanedEnumResult<T> = {
   //
   candidateValue: Maybe<ComfyUnionValue>
   finalValue: Maybe<T>
   /** true if 'finalValue' !== 'candidateValue' */
   isSubstitute: boolean

   /** true unless finalValue is null but enum was not optional */
   ENUM_HAS_NO_VALUES?: boolean
}
