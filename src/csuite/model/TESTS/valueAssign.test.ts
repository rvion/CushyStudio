import { describe, it } from 'bun:test'

import { simpleBuilder as b } from '../../index'
import { expectJSON } from './utils/expectJSON'

// ------------------------------------------------------------------------------
describe('assign to value object', () => {
    it('assign to Group.value separate fields', () => {
        const S1 = b.fields({
            str1: b.string({ default: '🔵' }),
        })
        const E1 = S1.create()
        expectJSON(E1.value.str1).toBe('🔵')
        expectJSON(E1.fields.str1.value).toBe('🔵')

        E1.value.str1 = '🟡'
        expectJSON(E1.value.str1).toBe('🟡')
        expectJSON(E1.fields.str1.value).toBe('🟡')
    })

    it('assign to List.value separate items (string)', () => {
        const S1 = b.string({ default: '🔵' }).list({ min: 3 })
        const E1 = S1.create()
        expectJSON(E1.value).toEqual(['🔵', '🔵', '🔵'])

        E1.value[1] = '🟡'
        expectJSON(E1.value).toEqual(['🔵', '🟡', '🔵'])
        expectJSON(E1.serial).toMatchObject({
            $: 'list',
            items_: [
                { $: 'str', value: '🔵' },
                { $: 'str', value: '🟡' },
                { $: 'str', value: '🔵' },
            ],
        })
    })
})
