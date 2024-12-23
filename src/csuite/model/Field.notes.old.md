<!-- 👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆 -->

```ts
/**
when you instanciate a model using some unsafe API that
does not crash when the serial is wrong, this can be used to
go though the possibly missing values, without reading the
automatically fixed value.
concretely

⏸️ 🟢 int_().create().value
 ⏸️                 ^^ THROW HERE

🟢 int_().createFromValue().value => throw
                          ^^
                          type error; value expected

🟢 int ({default: 8}).createFromValue().value => 8
 🟢 int_({default: 8}).createFromValue().value => 8
                                      ^^ no error

🟢 int().createFromSerial(DB.find(...).serial).value => 8
          ^^^^^^^^^^^^^^^^^^^^^^^^
          attempt to run migrations part of the instanciation
          either success or throw it it fails

*
INTERNAL API
 🟢 int().createAuto().value       => 0
          ^^^^^^^^^^^^ set a flag     ^ AUTO value because of the flag

🟢 int().createAuto().errors      => [{value not set}]

🟢 int().createAuto().valueOrAuto => 0

------------------------------------------------------

*
 *
 *
 *
 *
 *
------------------------------------------------------

🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
 let draft: Draft<Field_int> = int().createDraft() // creates a new Draft(new Field_int(...)) internally
 let field: Field_int = draft.validate() // throw
 let field: Field_int | null = draft.validateOrNull() // returns null
 let field: Field_int = draft.validateOrAuto() // return the wrapped Field_int with <int>::default (0) set

❌ let field = int().createAuto() (=== int().createDraft().validateOrAuto())

------------------------------------------------------

------------------------------------------------------

*
 ❌ int().createWithDefault().value          => 0
          ^~~~~~~~~~~~~~~~~
           special variant that does not crash
           despite having no default, nor value

*
 *
 *
 *
 */

// type NoValueRequired<T> = T extends { value: any } ? Omit<T, 'value'> : T
type DataError = 'Missing' | 'wrong schema' | '...'
type Errorable<T> =
    | Error
    // T['$PossiblyWrong'] extends ....
    | T extends (infer Item)[]
    ? Errorable<Item>[] | null
    : T extends Record<any, any> //
    ? { [key in keyof T]: Errorable<T[key]> } | Error
    : T | Error

type WithHoles<T> =
    // T['$WithHoles'] extends ....
    T extends (infer Item)[]
        ? WithHoles<Item>[] | null
        : T extends Record<any, any> //
        ? { [key in keyof T]: WithHoles<T[key]> | null } | null
        : Maybe<T>

type T1 = WithHoles<string>
type T2 = WithHoles<{ a: number }>
```
