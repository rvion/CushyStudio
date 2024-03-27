import type { EnumValue } from '../models/ComfySchema'

/** weird abstraction */
export type CleanedEnumResult<T> = {
    //
    candidateValue: Maybe<EnumValue>
    finalValue: Maybe<T>
    /** true if 'finalValue' !== 'candidateValue' */
    isSubstitute: boolean

    /** true unless finalValue is null but enum was not optional */
    ENUM_HAS_NO_VALUES?: boolean
}
