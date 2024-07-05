import { describe, expect as expect_, it } from 'bun:test'

import { simpleBuilder as b } from '../../index'

// ------------------------------------------------------------------------------
describe('assign to value object', () => {
    it('properly ensure value is properly set for every field', () => {
        const S1 = b.fields({
            int0: b.int(),
            int3: b.int({ default: 3 }),
            strEmpty: b.string(),
            strCoucou: b.string({ default: 'coucou' }),
            bool: b.bool(),
            boolTrue: b.bool({ default: true }),
            boolFalse: b.bool({ default: false }),
        })
        const E1 = S1.create()
        expect(E1.serial).toMatchObject({
            values_: {
                int0: { val: 0 },
                int3: { val: 3 },
                strEmpty: { val: '' },
                strCoucou: { val: 'coucou' },
                bool: { active: false },
                boolTrue: { active: true },
                boolFalse: { active: false },
            },
        })
    })
})

function expect(a: any) {
    return expect_(JSON.parse(JSON.stringify(a)))
}
