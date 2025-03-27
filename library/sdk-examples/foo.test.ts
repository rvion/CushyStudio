import { describe, expect, it } from 'vitest'

import { Field_bool } from '../../src/csuite/fields/bool/FieldBool'
import { CSchema } from '../../src/csuite/model/CSchema'

describe('can create models without going through builder', () => {
   it('work', () => {
      //
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      class Bar extends Field_bool {
         ҨField!: Bar
         coucou(): string {
            return 'monde'
         }
      }
      // const fn = (f: typeof Field_bool) =>
      // required if we template on FieldTypes... sad
      //                                VVVV
      const x = CSchema.new<Bar>(Bar, {}).create()
      expect(x.coucou()).toBe('monde')
   })
})
