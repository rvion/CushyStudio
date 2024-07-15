export type BivariantHack<Arg> = { bivarianceHack(_: Arg): void }['bivarianceHack']
export type CovariantHack<out Arg> = { covarianceHack(_: Arg): void }['covarianceHack']
export type CovariantFn1<out In, out Out> = { covarianceHack(_: In): Out }['covarianceHack']
export type CovariantFn2<out In, out In2, out Out> = { covarianceHack(_: In, _2: In2): Out }['covarianceHack']

// 2024-06-19 rvion TODO replace variance stuff
export type CovariantFn<out In extends unknown[], out Out> = { covarianceHack(...arg0: In): Out }['covarianceHack']
