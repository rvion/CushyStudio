// import { TSchema, Type } from '@sinclair/typebox'
// import { Value } from '@sinclair/typebox/value'

// export const Nullable = <T extends TSchema>(schema: T) =>
//     Type.Union([
//         //
//         schema,
//         Type.Null(),
//         Type.Undefined(),
//     ])

// export const Schema = Type.Object(
//     {
//         id: Type.String(),
//         currentApp: Type.Optional(Nullable(Type.String())),
//     },
//     { additionalProperties: false },
// )

// for (const x of [
//     //
//     { id: 'test', currentApp: null },
//     { id: 'test', currentApp: undefined },
//     { id: 'test' },
// ]) {
//     const res = Value.Check(Schema, x)
//     console.log(res)
// }
