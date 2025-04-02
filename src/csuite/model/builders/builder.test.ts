import { describe, expect, it } from 'vitest'

import { Field_bool } from '../../fields/bool/FieldBool'
import { CSchema } from '../CSchema'

describe('can create models without going through builder', () => {
   it('work', () => {
      class Bar extends Field_bool {
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
