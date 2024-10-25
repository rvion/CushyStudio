interface HKT<
   Assume1 = unknown,
   Assume2 = unknown,
   Assume3 = unknown,
   // ... can add more if needed
> {
   readonly _1?: unknown
   readonly _2?: unknown
   readonly _3?: unknown

   type: unknown

   readonly __1: Assume<this['_1'], Assume1>
   readonly __2: Assume<this['_2'], Assume2>
   readonly __3: Assume<this['_3'], Assume3>
}

type Apply<
   //
   F extends HKT<any, any, any>,
   _1,
   _2 = unknown,
   _3 = unknown,
> = (F & {
   readonly _1: _1
   readonly _2: _2
   readonly _3: _3
   // ... can add more if needed
})['type']

type Tᐸ_ᐳ = HKT
type Assume<T, U> = T extends U ? T : U
