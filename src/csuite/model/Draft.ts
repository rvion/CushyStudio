import type { FieldTypes } from './$FieldTypes'
import type { Result } from './Result'
import type { ValidationError } from './ValidationError'

/**
 * this class is just a tiny wrapper around
 * a field that is not yet validated, so we are forced to run validation
 * before accessing a field
 */
export class Draft<T extends FieldTypes> implements DraftLike<T> {
    constructor(private field: T['$Field']) {}

    // 🔶 TEMPORARY HACK UNTIL RENDER BRANCH
    getFieldUnchecked(): T['$Field'] {
        return this.field
    }

    // FIELDS ------------------------------------------------------------
    // 🧪
    validate(): Result<T['$Field'], ValidationError> {
        return this.field.validate()
    }

    validateOrNull(): Maybe<T['$Field']> {
        return this.field.validateOrNull()
    }

    validateOrThrow(): T['$Field'] {
        return this.field.validateOrThrow()
    }
}

// injecting field types into draft, because why not
export interface Draft<T extends FieldTypes> {
    $Type: T['$Type']
    $Config: T['$Config']
    $Serial: T['$Serial']
    $Value: T['$Value']
    $Field: T['$Field']
    $Unchecked: T['$Unchecked']
}

/** 🧪 might be useful:
 *    - In function parameters -> enforce early validation by the callee
 *      - Callers can pass a `Draft` to be validated
 *      - Callers can pass an existing `Field` since it's `DraftLike`
 *    - In function return types -> enforce validation by the caller
 *      - Avoid exposing `Field`s in an "invalid" state
 * e.g.
 * ```ts
 * function doSomeImportantStuff(draft: DraftLike<Model>) {
 *   const field = draft.validateOrNull()
 *   if (field == null) handleErrors()
 *   else importantStuff(field)
 * }
 *
 * function callerWithValidField() {
 *   let field: Model
 *   doSomeImportantStuff(field) // typechecks -> a field can be validated
 * }
 *
 * function callerWithDraft() {
 *   let draft: Draft<Model>
 *   doSomeImportantStuff(draft) // typechecks also -> draft will be validated
 * }
 * ```
 * 🤔 Might also make `Draft` completely useless if all the methods are defined on fields
 * But maybe we will want draft specific functionally at some point ? Hard to tell
 */
export interface DraftLike<T extends FieldTypes> {
    $Type: T['$Type']
    $Config: T['$Config']
    $Serial: T['$Serial']
    $Value: T['$Value']
    $Field: T['$Field']
    $Unchecked: T['$Unchecked']

    // 🔶 TEMPORARY HACK UNTIL RENDER BRANCH
    getFieldUnchecked(): T['$Field']

    validate(): Result<T['$Field'], ValidationError>
    validateOrNull(): Maybe<T['$Field']>
    validateOrThrow(): T['$Field']
}

// 💬 2024-09-04 rvion:
// | we finally decided to go with some explicit type
// | template ($Unchecked) availalbe in $FieldTypes
// | instead of:
// |
// | ```ts
// | prettier-ignore
// | export type PossiblyWrong<T>
// |     = T extends (infer Item)[] ? PossiblyWrong<Item>[] | null
// |     : T extends Record<any, any> ? { [key in keyof T]: PossiblyWrong<T[key]> | null } | null
// |     : Maybe<T>
// | ```
