// UTILS

export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

/** a clamp function that attempt to return a number no matter what info is missing */
export const clampOpt = (v?: number, min?: number, max?: number): number => {
    if (v == null) return min ?? 0
    if (min == null && max == null) return v
    if (min == null) return Math.min(v, max!)
    if (max == null) return Math.max(v, min)
    return Math.min(Math.max(v, min), max)
}
