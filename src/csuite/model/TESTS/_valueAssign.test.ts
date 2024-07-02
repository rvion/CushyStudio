import { describe, expect as expect_, it } from 'bun:test'

import { simpleBuilder as b } from '../../index'

// ------------------------------------------------------------------------------
describe('assign to value object', () => {
    it('assign to Group.value separate fields', () => {
        const S1 = b.fields({ num: b.string({ default: '🔵' }) })
        const E1 = S1.create()
        expect(E1.value.num).toBe('🔵')
        expect(E1.fields.num.value).toBe('🔵')

        E1.value.num = '🟡'
        expect(E1.value.num).toBe('🟡')
        expect(E1.fields.num.value).toBe('🟡')
    })
})

function expect(a: any) {
    return expect_(JSON.parse(JSON.stringify(a)))
}

export const x = 0
