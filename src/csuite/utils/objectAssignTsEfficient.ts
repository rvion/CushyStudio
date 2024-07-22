// A simple alias for `any` that hints to the reader that it is to avoid some
// extra work for `tsc` and not because we are typeless or lazy

export type any_TsEfficient = any

export const objectAssignTsEfficient_t_t = <T>(target: T, source: NoInfer<T>): NoInfer<T> =>
    Object.assign(target as any_TsEfficient, source as any_TsEfficient)

export const objectAssignTsEfficient_pt_t = <T>(target: Partial<NoInfer<T>>, source: T): NoInfer<T> =>
    Object.assign(target as any_TsEfficient, source as any_TsEfficient)

export const objectAssignTsEfficient_t_pt = <T>(target: T, source: Partial<NoInfer<T>>): NoInfer<T> =>
    Object.assign(target as any_TsEfficient, source as any_TsEfficient)
