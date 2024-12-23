import { describe, expect, it } from 'bun:test'

import { Field_bool } from '../../src/csuite/fields/bool/FieldBool'
import { SimpleSchema } from '../../src/csuite/simple/SimpleSchema'

describe('can create models without going through builder', () => {
   it('work', () => {
      //
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      class Bar extends Field_bool {
         $Field!: Bar
         coucou(): string {
            return 'monde'
         }
      }
      // const fn = (f: typeof Field_bool) =>
      // required if we template on FieldTypes... sad
      //                                VVVV
      const x = new SimpleSchema<Bar>(Bar, {}).create()
      expect(x.coucou()).toBe('monde')
   })
})
