import type { Field } from './Field'
import type { Result } from './Result'
import type { ValidationError } from './ValidationError'

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
export interface DraftLike<FIELD extends Field> {
   // 🔶 TEMPORARY HACK UNTIL RENDER BRANCH
   ϟgetFieldUnchecked(): FIELD

   ϟvalidate(): Result<FIELD, ValidationError>
   ϟvalidateOrNull(): Maybe<FIELD>
   ϟvalidateOrThrow(): FIELD
}
