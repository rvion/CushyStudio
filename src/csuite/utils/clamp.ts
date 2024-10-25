// UTILS

export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

/** a clamp function that attempt to return a number no matter what info is missing */
export const clamp_or_min_or_zero = (
   //
   v?: Maybe<number>,
   min?: Maybe<number>,
   max?: Maybe<number>,
): number => {
   v = v ?? min ?? 0
   if (min == null && max == null) return v
   if (min == null) return Math.min(v, max!)
   if (max == null) return Math.max(v, min)
   return Math.min(Math.max(v, min), max)
}

export const clamp_or_min_or_null = (
   //
   v?: Maybe<number>,
   min?: Maybe<number>,
   max?: Maybe<number>,
): number | null => {
   v = v ?? min
   if (v == null) return null
   if (min == null && max == null) return v
   if (min == null) return Math.min(v, max!)
   if (max == null) return Math.max(v, min)
   return Math.min(Math.max(v, min), max)
}

export const clamp_or_null = (
   //
   v?: Maybe<number>,
   min?: Maybe<number>,
   max?: Maybe<number>,
): number | null => {
   if (v == null) return null
   if (min == null && max == null) return v
   if (min == null) return Math.min(v, max!)
   if (max == null) return Math.max(v, min)
   return Math.min(Math.max(v, min), max)
}
