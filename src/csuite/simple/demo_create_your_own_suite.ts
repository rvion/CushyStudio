// import type { Field } from '../model/Field'
// import type { FieldConstructor } from '../model/FieldConstructor'
// import type { Instanciable } from '../model/Instanciable'
// import type * as c from 'src/cushy-forms/main'

// import { BaseSchema } from '../model/BaseSchema'
// import { SimpleBuilder } from './SimpleBuilder'

// // 1️⃣
// // pros:
// //  - typechecks without lying
// //  - enforce exhaustiveness for HKSchema implementors
// // cons:
// //  - verbose
// //  - generic aliases are even more verbose
// interface HKMySchema extends HKT {
//     apply: (field: Assume<this['_1'], Field>) => MySchema<typeof field>

//     $String: My.String
//     $Number: My.Number
//     $Bool: My.Bool

//     $Field: HKMyFieldAlias
//     $Link: HKMyLinkAlias
// }
// interface HKMyFieldAlias extends HKT {
//     apply: (field: Assume<this['_1'], c.SchemaDict>) => My.Group<typeof field>
// }
// interface HKMyLinkAlias extends HKT {
//     apply: (a: Assume<this['_1'], BaseSchema>, b: Assume<this['_2'], BaseSchema>) => My.Link<typeof a, typeof b>
// }
// // =============================================================================

// // 2️⃣
// // pros:
// //  - way less verbose
// //  - no extra work for generic aliases
// // cons:
// //  - does not typecheck at construction
// //  - does not enforce exhaustiveness

// // interface HKMySchema extends HKT {
// //     apply: (field: Assume<this['_1'], Field>) => AliasHelper<typeof field>
// // }

// // // prettier-ignore
// // type AliasHelper<F extends Field> =
// //       F extends c.Field_string ? My.String
// //     : F extends c.Field_number ? My.Number
// //     : F extends c.Field_group<infer T> ? My.Group<T>
// //     : MySchema<F>
// // =============================================================================

// // 3️⃣
// // pros:
// //   - straightforward
// //   - does not require type soup
// // cons:
// //   - still verbose -> need to duplicate function signatures
// //   - error prone when mimicking the base class methods or following its evolutions
// // interface HKMySchema extends HKT {
// //     apply: (field: Assume<this['_1'], Field>) => MySchema<typeof field>
// // }
// // interface MyBuilder {
// //     string(config?: c.Field_string_config): My.String
// // }
// // =============================================================================

// // 🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈🙈

// class MySchema<out FIELD extends Field = Field> extends BaseSchema<FIELD> implements Instanciable<FIELD> {
//     constructor(
//         //
//         public fieldConstructor: FieldConstructor<FIELD>,
//         public readonly config: FIELD['$Config'],
//     ) {
//         super()
//     }
//     withConfig(config: Partial<FIELD['$Config']>): this {
//         throw new Error('Method not implemented.')
//     }
// }

// class MyBuilder extends SimpleBuilder<HKMySchema> {
//     constructor() {
//         super((...args) => new MySchema(...args) as any)
//     }
// }

// /* eslint-disable @typescript-eslint/no-namespace */
// declare global {
//     namespace My {
//         type String = MySchema<c.Field_string>
//         type Number = MySchema<c.Field_number>
//         type Bool = MySchema<c.Field_bool>

//         type Group<T extends c.SchemaDict> = MySchema<c.Field_group<T>>
//         type Link<A extends BaseSchema, B extends BaseSchema> = MySchema<c.Field_link<A, B>>
//     }
// }
// // =============================================================================

// function simple_ui(ui: SimpleBuilder) {
//     const sstr = ui.string()
//     const sint = ui.int()
//     const sbool = ui.bool()
//     const sfield = ui.fields({ sstr, sint, sbool })
// }

// function my_ui(ui: MyBuilder) {
//     const sstr = ui.string()
//     const sint = ui.int()
//     const sbool = ui.bool()
//     const sfield = ui.fields({ sstr, sint, sbool })
// }
