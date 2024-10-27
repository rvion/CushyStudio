import type { Field } from './Field'
import type { Problem } from './Validation'

/**
 * @category Validation
 * @since 2024-09-04
 */
export class ValidationError extends Error {
   constructor(
      message: string,
      field: Field,
      public problems: Problem[],
   ) {
      super(message)
      this.name = 'ValidationError'
   }
}
