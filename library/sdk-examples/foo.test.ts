import { describe, expect, it } from 'bun:test'

import { Field_bool } from '../../src/csuite/fields/bool/FieldBool'
import { SimpleSchema } from '../../src/csuite/simple/SimpleSchema'

describe('can create models without going through builder', () => {
    it('work', () => {
        //
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const fn = (f: typeof Field_bool) =>
            class Bar extends f {
                coucou(): string {
                    return 'monde'
                }
            }

        const x = new SimpleSchema(fn(Field_bool), {}).create()

        expect(x.coucou()).toBe('monde')
    })
})
