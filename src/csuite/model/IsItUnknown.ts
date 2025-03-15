/** somehow, it only works with objects */

// export type IsUnknownV1<T> = IsEqual<T & UnknownSym, UnknownSym>
// type A1 = IsUnknownV1<unknown> /*  = true    */
// type B1 = IsUnknownV1<any> /*      = boolean */
// type C1 = IsUnknownV1<{ a: 1 }> /* = false   */
// type D1 = IsUnknownV1<never> /*    = never   */

export type IsUnknown<T> = unknown extends T ? true : false
// type A2 = IsUnknown<unknown> /*  = true    */
// type B2 = IsUnknown<any> /*      = true */
// type C2 = IsUnknown<{ a: 1 }> /* = false   */
// type D2 = IsUnknown<never> /*    = false   */

/**
 * this type is a great companion to the `unknown & {...}` trick
 * it allows to keep `unknown` across the class hierarchy,
 * but still offer a quick way to check if the type have been provided,
 * or even ofer a default
 */
export type CastUnknown<T, U> = IsUnknown<T> extends false ? T : U

/** same as CastUnknown, but treat any differently */
export type CastUnknownAlt<T, U> = IsUnknown<T> extends true ? U : T

/**
 * same as `CastUnknown`, but specialized for never, very useful
 * to express a bunch of conditions
 */
// export type NeverIfUnknown<T> =
//    IsUnknown<T> extends false //
//       ? T
//       : never

// Utils ------------------------------------
// type IsEqual<A, B> = A extends B ? (B extends A ? true : false) : false

// const unknownSym = Symbol.for('unknown')
// type UnknownSym = typeof unknownSym
// export type MyUnknown = { [unknownSym]: UnknownSym }
