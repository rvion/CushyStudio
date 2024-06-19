export type BivariantHack<Arg> = { bivarianceHack(_: Arg): void }['bivarianceHack']
export type CovariantHack<out Arg> = { covarianceHack(_: Arg): void }['covarianceHack']
export type CovariantFn<out In, out Out> = { covarianceHack(_: In): Out }['covarianceHack']
export type CovariantFn2<out In, out In2, out Out> = { covarianceHack(_: In, _2: In2): Out }['covarianceHack']
