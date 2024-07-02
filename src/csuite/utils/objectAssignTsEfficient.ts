// A simple alias for `any` that hints to the reader that it is to avoid some
// extra work for `tsc` and not because we are typeless or lazy

export type any_TsEfficient = any

export const objectAssignTsEfficient_t_t = <T>(target: T, source: T): T =>
    Object.assign(target as any_TsEfficient, source as any_TsEfficient)

export const objectAssignTsEfficient_pt_t = <T>(target: Partial<T>, source: T): T =>
    Object.assign(target as any_TsEfficient, source as any_TsEfficient)

export const objectAssignTsEfficient_t_pt = <T>(target: T, source: Partial<T>): T =>
    Object.assign(target as any_TsEfficient, source as any_TsEfficient)
