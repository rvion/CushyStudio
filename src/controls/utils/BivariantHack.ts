export type BivariantHack<Arg> = { bivarianceHack(_: Arg): void }['bivarianceHack']
export type CovariantHack<out Arg> = { covarianceHack(_: Arg): void }['covarianceHack']
export type CovariantFn<out In, out Out> = { covarianceHack(_: In): Out }['covarianceHack']
