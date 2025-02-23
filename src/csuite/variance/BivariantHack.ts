export type BivariantHack<Arg> = { bivarianceHack(_: Arg): void }['bivarianceHack']

// 💬 2024-06-19 rvion TODO replace variance stuff
export type CovariantFn<out In extends unknown[], out Out> = {
   covarianceHack(...arg0: In): Out
}['covarianceHack']
